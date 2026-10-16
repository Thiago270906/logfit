import { and, eq, lt } from "drizzle-orm";

import { getDb } from "@/lib/db";
import { pagamento } from "@/lib/db/pagamento-schema";
import {
  concluirPagamentoSchema,
  type ConcluirPagamentoInput,
} from "@/lib/validations/pagamento";
import { gerarMensalidadesPendentes } from "@/services/pagamentos/gerar-mensalidades-pendentes";

export class ParcelaAnteriorPendenteError extends Error {
  constructor() {
    super(
      "Existe uma parcela anterior pendente nesta matrícula. Confirme-a antes desta.",
    );
    this.name = "ParcelaAnteriorPendenteError";
  }
}

export async function concluirPagamento(
  id: string,
  input: ConcluirPagamentoInput,
) {
  const data = concluirPagamentoSchema.parse(input);
  const db = getDb();

  const [atual] = await db
    .select({
      matriculaId: pagamento.matriculaId,
      numeroParcela: pagamento.numeroParcela,
      status: pagamento.status,
    })
    .from(pagamento)
    .where(eq(pagamento.id, id))
    .limit(1);

  if (!atual || atual.status !== "pendente") return undefined;

  const [anteriorPendente] = await db
    .select({ id: pagamento.id })
    .from(pagamento)
    .where(
      and(
        eq(pagamento.matriculaId, atual.matriculaId),
        lt(pagamento.numeroParcela, atual.numeroParcela),
        eq(pagamento.status, "pendente"),
      ),
    )
    .limit(1);

  if (anteriorPendente) {
    throw new ParcelaAnteriorPendenteError();
  }

  const [updated] = await db
    .update(pagamento)
    .set({
      status: "pago",
      formaPagamento: data.formaPagamento,
      pagoEm: new Date(),
    })
    .where(and(eq(pagamento.id, id), eq(pagamento.status, "pendente")))
    .returning();

  if (updated) {
    await gerarMensalidadesPendentes(updated.matriculaId);
  }

  return updated;
}
