import { asc, eq } from "drizzle-orm";

import { getDb } from "@/lib/db";
import { pagamento } from "@/lib/db/pagamento-schema";

export async function getPagamentosByMatricula(matriculaId: string) {
  return getDb()
    .select({
      id: pagamento.id,
      valor: pagamento.valor,
      status: pagamento.status,
      formaPagamento: pagamento.formaPagamento,
      pagoEm: pagamento.pagoEm,
      createdAt: pagamento.createdAt,
    })
    .from(pagamento)
    .where(eq(pagamento.matriculaId, matriculaId))
    .orderBy(asc(pagamento.createdAt));
}
