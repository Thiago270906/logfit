import { and, desc, eq, inArray, lt } from "drizzle-orm";

import { getDb } from "@/lib/db";
import { matricula } from "@/lib/db/matricula-schema";
import { matriculaHistorico } from "@/lib/db/matricula-historico-schema";
import { pagamento } from "@/lib/db/pagamento-schema";
import { plano } from "@/lib/db/plano-schema";
import {
  mesesDaPeriodicidade,
  PERIODICIDADES_COM_RENOVACAO_AUTOMATICA,
  type PeriodicidadeKey,
} from "@/constants/periodicidade";
import { getSituacaoMatricula } from "@/services/matriculas/get-situacao-matricula";

export class MatriculaNaoElegivelParaRenovacaoError extends Error {
  constructor() {
    super(
      "Esta matrícula não pode ser renovada (periodicidade diária, não assinada ou sem data de expiração).",
    );
    this.name = "MatriculaNaoElegivelParaRenovacaoError";
  }
}

export class MatriculaAindaNaoVencidaError extends Error {
  constructor() {
    super("Esta matrícula ainda não venceu, não há rematrícula a confirmar.");
    this.name = "MatriculaAindaNaoVencidaError";
  }
}

export class RenovacaoJaAutomaticaError extends Error {
  constructor() {
    super(
      "Esta matrícula já está em rematrícula automática; não é necessário confirmar manualmente.",
    );
    this.name = "RenovacaoJaAutomaticaError";
  }
}

export class PeriodicidadeNaoRenovavelError extends Error {
  constructor() {
    super(
      "Esta periodicidade não participa da rematrícula automática; confirme manualmente quando vencer.",
    );
    this.name = "PeriodicidadeNaoRenovavelError";
  }
}

function addMeses(data: Date, meses: number) {
  const resultado = new Date(data);
  resultado.setMonth(resultado.getMonth() + meses);
  return resultado;
}

// Divide o valor total em N parcelas de centavos iguais, ajustando a
// última para absorver o resto da divisão e manter a soma exata.
function dividirEmParcelas(valorTotal: string, quantidade: number) {
  const totalCentavos = Math.round(Number(valorTotal) * 100);
  const parcelaCentavos = Math.floor(totalCentavos / quantidade);
  const resto = totalCentavos - parcelaCentavos * quantidade;

  return Array.from({ length: quantidade }, (_, index) => {
    const centavos = parcelaCentavos + (index < resto ? 1 : 0);
    return (centavos / 100).toFixed(2);
  });
}

type MatriculaParaRenovacao = {
  id: string;
  status: string;
  periodicidade: PeriodicidadeKey;
  parcelarMensal: boolean;
  dataInicio: Date;
  dataExpiracao: Date | null;
  renovacaoAutomatica: boolean;
  // Preço ATUAL do plano (mesma lógica de assinar-matricula.ts) — ao
  // contrário da continuação mensal dentro do mesmo ciclo, a renovação
  // busca o preço vigente, não um valor congelado.
  valor: string;
};

async function buscarParaRenovacao(
  id: string,
): Promise<MatriculaParaRenovacao | undefined> {
  const [row] = await getDb()
    .select({
      id: matricula.id,
      status: matricula.status,
      periodicidade: matricula.periodicidade,
      parcelarMensal: matricula.parcelarMensal,
      dataInicio: matricula.dataInicio,
      dataExpiracao: matricula.dataExpiracao,
      renovacaoAutomatica: matricula.renovacaoAutomatica,
      valor: plano.valor,
    })
    .from(matricula)
    .innerJoin(plano, eq(matricula.planoId, plano.id))
    .where(eq(matricula.id, id))
    .limit(1);

  return row;
}

// Executa um único ciclo de renovação: estende dataExpiracao pelo número de
// meses da periodicidade e gera o(s) pagamento(s) correspondentes. O
// vencimento de qualquer parcela — inclusive a primeira do novo ciclo — é
// sempre calculado a partir de dataInicio + numeroParcela, nunca a partir de
// dataExpiracao: isso evita colidir com a parcela que o mecanismo de
// competências mensais (gerar-mensalidades-pendentes.ts) já pode ter gerado
// com vencimento igual à antiga dataExpiracao.
async function executarUmCiclo(row: MatriculaParaRenovacao) {
  const db = getDb();
  if (!row.dataExpiracao) throw new MatriculaNaoElegivelParaRenovacaoError();

  const meses = mesesDaPeriodicidade(row.periodicidade) ?? 1;
  const novaDataExpiracao = addMeses(row.dataExpiracao, meses);

  const [ultima] = await db
    .select({ numeroParcela: pagamento.numeroParcela })
    .from(pagamento)
    .where(eq(pagamento.matriculaId, row.id))
    .orderBy(desc(pagamento.numeroParcela))
    .limit(1);
  const proximoNumeroBase = (ultima?.numeroParcela ?? 0) + 1;

  if (row.valor) {
    if (meses > 1 && row.parcelarMensal) {
      const parcelas = dividirEmParcelas(row.valor, meses);
      await db.insert(pagamento).values(
        parcelas.map((parcela, index) => ({
          matriculaId: row.id,
          valor: parcela,
          vencimento: addMeses(row.dataInicio, proximoNumeroBase - 1 + index),
          numeroParcela: proximoNumeroBase + index,
        })),
      );
    } else {
      await db.insert(pagamento).values({
        matriculaId: row.id,
        valor: row.valor,
        vencimento: addMeses(row.dataInicio, proximoNumeroBase - 1),
        numeroParcela: proximoNumeroBase,
      });
    }
  }

  await db
    .update(matricula)
    .set({ dataExpiracao: novaDataExpiracao })
    .where(eq(matricula.id, row.id));

  await db.insert(matriculaHistorico).values({
    matriculaId: row.id,
    tipo: "renovada",
    descricao: row.renovacaoAutomatica
      ? "Rematrícula automática gerada ao final do ciclo."
      : "Rematrícula confirmada manualmente pelo administrador.",
  });
}

// Catch-up: aplica quantos ciclos forem necessários até a vigência alcançar
// "agora" (útil se o sistema ficou um tempo sem disparar o lazy trigger).
async function aplicarCiclosAteAgora(id: string) {
  const agora = new Date();
  for (;;) {
    const row = await buscarParaRenovacao(id);
    if (!row || !row.dataExpiracao) return;
    if (row.dataExpiracao.getTime() >= agora.getTime()) return;
    await executarUmCiclo(row);
  }
}

// Predicado puro usado pela UI para decidir se mostra o botão "Confirmar
// rematrícula" — mesma ideia de podeReabrirMatricula em reabrir-matricula.ts.
export function precisaConfirmarRematricula(m: {
  status: string;
  periodicidade: string;
  dataExpiracao: Date | string | null;
  renovacaoAutomatica: boolean;
}) {
  if (m.periodicidade === "diaria") return false;
  if (m.renovacaoAutomatica) return false;
  return getSituacaoMatricula(m.status, m.dataExpiracao) === "expirada";
}

// Chamada pelo botão "Confirmar rematrícula" (modo manual).
export async function confirmarRematricula(id: string) {
  const row = await buscarParaRenovacao(id);
  if (!row) return null;

  if (row.status !== "assinada" || row.periodicidade === "diaria") {
    throw new MatriculaNaoElegivelParaRenovacaoError();
  }
  if (row.renovacaoAutomatica) {
    throw new RenovacaoJaAutomaticaError();
  }
  if (getSituacaoMatricula(row.status, row.dataExpiracao) !== "expirada") {
    throw new MatriculaAindaNaoVencidaError();
  }

  await aplicarCiclosAteAgora(id);
  return { id };
}

// Chamada pelo lazy trigger (modo automático) a partir de
// gerar-mensalidades-pendentes.ts. Cobre mensal e anual; as demais
// periodicidades (diária e as novas bimestral/trimestral/quadrimestral/
// semestral) sempre passam pela confirmação manual do admin.
export async function renovarMatriculasAutomaticas(matriculaId?: string) {
  const db = getDb();
  const agora = new Date();

  const condicoes = [
    eq(matricula.status, "assinada"),
    eq(matricula.renovacaoAutomatica, true),
    inArray(matricula.periodicidade, PERIODICIDADES_COM_RENOVACAO_AUTOMATICA),
    lt(matricula.dataExpiracao, agora),
  ];
  if (matriculaId) condicoes.push(eq(matricula.id, matriculaId));

  const candidatas = await db
    .select({ id: matricula.id })
    .from(matricula)
    .where(and(...condicoes));

  for (const item of candidatas) {
    await aplicarCiclosAteAgora(item.id);
  }
}

// Toggle usado pelo switch da UI. Só existe para periodicidades elegíveis à
// renovação automática (mensal/anual) — as demais ficam sempre em modo
// manual (ver PERIODICIDADES_COM_RENOVACAO_AUTOMATICA).
export async function atualizarRenovacaoAutomatica(
  id: string,
  renovacaoAutomatica: boolean,
) {
  const db = getDb();
  const [atual] = await db
    .select({ periodicidade: matricula.periodicidade })
    .from(matricula)
    .where(eq(matricula.id, id))
    .limit(1);

  if (!atual) return null;
  if (!PERIODICIDADES_COM_RENOVACAO_AUTOMATICA.includes(atual.periodicidade)) {
    throw new PeriodicidadeNaoRenovavelError();
  }

  const [atualizada] = await db
    .update(matricula)
    .set({ renovacaoAutomatica })
    .where(eq(matricula.id, id))
    .returning();

  return atualizada;
}
