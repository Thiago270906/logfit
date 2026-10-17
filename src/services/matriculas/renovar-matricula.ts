import { and, desc, eq, inArray, lt } from "drizzle-orm";

import { getDb } from "@/lib/db";
import { matricula } from "@/lib/db/matricula-schema";
import { matriculaHistorico } from "@/lib/db/matricula-historico-schema";
import { pagamento } from "@/lib/db/pagamento-schema";
import { plano } from "@/lib/db/plano-schema";
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
    super("Matrículas diárias não participam do fluxo de rematrícula.");
    this.name = "PeriodicidadeNaoRenovavelError";
  }
}

function addMeses(data: Date, meses: number) {
  const resultado = new Date(data);
  resultado.setMonth(resultado.getMonth() + meses);
  return resultado;
}

function addAnos(data: Date, anos: number) {
  const resultado = new Date(data);
  resultado.setFullYear(resultado.getFullYear() + anos);
  return resultado;
}

// Valor cobrado nesta renovação: preço ATUAL do plano (mesma lógica de
// assinar-matricula.ts) — ao contrário da continuação mensal dentro do
// mesmo ciclo, a renovação busca o preço vigente, não um valor congelado.
function valorDaPeriodicidade(
  periodicidade: string,
  planoRow: { diariaValor: string | null; mensalValor: string | null; anualValor: string | null },
) {
  if (periodicidade === "diaria") return planoRow.diariaValor;
  if (periodicidade === "mensal") return planoRow.mensalValor;
  if (periodicidade === "anual") return planoRow.anualValor;
  return null;
}

function dividirEm12Parcelas(valorTotal: string) {
  const totalCentavos = Math.round(Number(valorTotal) * 100);
  const parcelaCentavos = Math.floor(totalCentavos / 12);
  const resto = totalCentavos - parcelaCentavos * 12;

  return Array.from({ length: 12 }, (_, index) => {
    const centavos = parcelaCentavos + (index < resto ? 1 : 0);
    return (centavos / 100).toFixed(2);
  });
}

type MatriculaParaRenovacao = {
  id: string;
  status: string;
  periodicidade: string;
  parcelarMensal: boolean;
  dataInicio: Date;
  dataExpiracao: Date | null;
  renovacaoAutomatica: boolean;
  diariaValor: string | null;
  mensalValor: string | null;
  anualValor: string | null;
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
      diariaValor: plano.diariaValor,
      mensalValor: plano.mensalValor,
      anualValor: plano.anualValor,
    })
    .from(matricula)
    .innerJoin(plano, eq(matricula.planoId, plano.id))
    .where(eq(matricula.id, id))
    .limit(1);

  return row;
}

// Executa um único ciclo de renovação: estende dataExpiracao em +1 mês
// (mensal) ou +1 ano (anual) e gera o(s) pagamento(s) correspondentes. O
// vencimento de qualquer parcela — inclusive a primeira do novo ciclo — é
// sempre calculado a partir de dataInicio + numeroParcela, nunca a partir de
// dataExpiracao: isso evita colidir com a parcela que o mecanismo de
// competências mensais (gerar-mensalidades-pendentes.ts) já pode ter gerado
// com vencimento igual à antiga dataExpiracao.
async function executarUmCiclo(row: MatriculaParaRenovacao) {
  const db = getDb();
  if (!row.dataExpiracao) throw new MatriculaNaoElegivelParaRenovacaoError();

  const novaDataExpiracao =
    row.periodicidade === "anual"
      ? addAnos(row.dataExpiracao, 1)
      : addMeses(row.dataExpiracao, 1);

  const [ultima] = await db
    .select({ numeroParcela: pagamento.numeroParcela })
    .from(pagamento)
    .where(eq(pagamento.matriculaId, row.id))
    .orderBy(desc(pagamento.numeroParcela))
    .limit(1);
  const proximoNumeroBase = (ultima?.numeroParcela ?? 0) + 1;

  const valor = valorDaPeriodicidade(row.periodicidade, row);
  if (valor) {
    if (row.periodicidade === "anual" && row.parcelarMensal) {
      const parcelas = dividirEm12Parcelas(valor);
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
        valor,
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
// gerar-mensalidades-pendentes.ts. Cobre mensal e anual; diária nunca entra.
export async function renovarMatriculasAutomaticas(matriculaId?: string) {
  const db = getDb();
  const agora = new Date();

  const condicoes = [
    eq(matricula.status, "assinada"),
    eq(matricula.renovacaoAutomatica, true),
    inArray(matricula.periodicidade, ["mensal", "anual"]),
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

// Toggle usado pelo switch da UI. Só existe para periodicidade != "diaria".
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
  if (atual.periodicidade === "diaria") {
    throw new PeriodicidadeNaoRenovavelError();
  }

  const [atualizada] = await db
    .update(matricula)
    .set({ renovacaoAutomatica })
    .where(eq(matricula.id, id))
    .returning();

  return atualizada;
}
