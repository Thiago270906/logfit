import { between, desc, eq } from "drizzle-orm";

import { getDb } from "@/lib/db";
import { aluno } from "@/lib/db/aluno-schema";
import { matricula } from "@/lib/db/matricula-schema";
import { pagamento } from "@/lib/db/pagamento-schema";
import { plano } from "@/lib/db/plano-schema";
import { gerarMensalidadesPendentes } from "@/services/pagamentos/gerar-mensalidades-pendentes";

export async function getPagamentos(periodo?: { inicio: Date; fim: Date }) {
  await gerarMensalidadesPendentes();

  return getDb()
    .select({
      id: pagamento.id,
      valor: pagamento.valor,
      status: pagamento.status,
      formaPagamento: pagamento.formaPagamento,
      vencimento: pagamento.vencimento,
      numeroParcela: pagamento.numeroParcela,
      pagoEm: pagamento.pagoEm,
      createdAt: pagamento.createdAt,
      matriculaId: matricula.id,
      periodicidade: matricula.periodicidade,
      alunoNome: aluno.nome,
      planoNome: plano.nome,
    })
    .from(pagamento)
    .innerJoin(matricula, eq(pagamento.matriculaId, matricula.id))
    .innerJoin(aluno, eq(matricula.alunoId, aluno.id))
    .innerJoin(plano, eq(matricula.planoId, plano.id))
    .where(
      periodo
        ? between(pagamento.vencimento, periodo.inicio, periodo.fim)
        : undefined,
    )
    .orderBy(desc(pagamento.vencimento), desc(pagamento.numeroParcela));
}
