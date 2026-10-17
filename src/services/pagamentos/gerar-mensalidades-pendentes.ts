import { and, desc, eq } from "drizzle-orm";

import { getDb } from "@/lib/db";
import { matricula } from "@/lib/db/matricula-schema";
import { pagamento } from "@/lib/db/pagamento-schema";
import { renovarMatriculasAutomaticas } from "@/services/matriculas/renovar-matricula";

function addMeses(data: Date, meses: number) {
  const resultado = new Date(data);
  resultado.setMonth(resultado.getMonth() + meses);
  return resultado;
}

// Gera as competências mensais que faltam para esta matrícula: a próxima
// parcela só nasce quando a última for paga (gera antes do vencimento) ou
// quando o vencimento da última já tiver passado (gera mesmo sem pagamento).
// Sem essas condições, não avança — e nada impede o acúmulo de pendentes.
async function gerarProximasCompetencias(matriculaRow: {
  id: string;
  dataInicio: Date;
  dataExpiracao: Date | null;
}) {
  const db = getDb();
  const agora = new Date();

  for (;;) {
    const [ultima] = await db
      .select({
        valor: pagamento.valor,
        status: pagamento.status,
        vencimento: pagamento.vencimento,
        numeroParcela: pagamento.numeroParcela,
      })
      .from(pagamento)
      .where(eq(pagamento.matriculaId, matriculaRow.id))
      .orderBy(desc(pagamento.numeroParcela))
      .limit(1);

    if (!ultima) return;

    const vencida = new Date(ultima.vencimento).getTime() < agora.getTime();
    const paga = ultima.status === "pago";
    if (!paga && !vencida) return;

    const proximoNumero = ultima.numeroParcela + 1;
    const proximoVencimento = addMeses(
      matriculaRow.dataInicio,
      proximoNumero - 1,
    );

    if (
      matriculaRow.dataExpiracao &&
      proximoVencimento > matriculaRow.dataExpiracao
    ) {
      return;
    }

    await db
      .insert(pagamento)
      .values({
        matriculaId: matriculaRow.id,
        valor: ultima.valor,
        vencimento: proximoVencimento,
        numeroParcela: proximoNumero,
      })
      .onConflictDoNothing();
  }
}

export async function gerarMensalidadesPendentes(matriculaId?: string) {
  // Estende dataExpiracao e gera o pagamento do próximo ciclo para
  // matrículas (mensais e anuais) com renovação automática que já venceram.
  // Precisa rodar antes do select abaixo: só assim o teto de dataExpiracao
  // já vem atualizado para o loop de competências mensais que segue.
  await renovarMatriculasAutomaticas(matriculaId);

  const db = getDb();
  const agora = new Date();

  const condicoes = [
    eq(matricula.periodicidade, "mensal"),
    eq(matricula.status, "assinada"),
  ];
  if (matriculaId) condicoes.push(eq(matricula.id, matriculaId));

  const matriculas = await db
    .select({
      id: matricula.id,
      dataInicio: matricula.dataInicio,
      dataExpiracao: matricula.dataExpiracao,
    })
    .from(matricula)
    .where(and(...condicoes));

  for (const item of matriculas) {
    if (item.dataExpiracao && item.dataExpiracao.getTime() < agora.getTime()) {
      continue;
    }
    await gerarProximasCompetencias(item);
  }
}
