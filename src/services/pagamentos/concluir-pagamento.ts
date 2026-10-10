import { and, eq } from "drizzle-orm";

import { getDb } from "@/lib/db";
import { pagamento } from "@/lib/db/pagamento-schema";
import {
  concluirPagamentoSchema,
  type ConcluirPagamentoInput,
} from "@/lib/validations/pagamento";

export async function concluirPagamento(
  id: string,
  input: ConcluirPagamentoInput,
) {
  const data = concluirPagamentoSchema.parse(input);

  const [updated] = await getDb()
    .update(pagamento)
    .set({
      status: "pago",
      formaPagamento: data.formaPagamento,
      pagoEm: new Date(),
    })
    .where(and(eq(pagamento.id, id), eq(pagamento.status, "pendente")))
    .returning();

  return updated;
}
