import { asc, eq } from "drizzle-orm";

import { getDb } from "@/lib/db";
import { pagamento } from "@/lib/db/pagamento-schema";
import { gerarMensalidadesPendentes } from "@/services/pagamentos/gerar-mensalidades-pendentes";

export async function getPagamentosByMatricula(matriculaId: string) {
  await gerarMensalidadesPendentes(matriculaId);

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
    })
    .from(pagamento)
    .where(eq(pagamento.matriculaId, matriculaId))
    .orderBy(asc(pagamento.numeroParcela));
}
