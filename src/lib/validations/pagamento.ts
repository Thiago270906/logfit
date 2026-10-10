import { z } from "zod";

import { FORMAS_PAGAMENTO } from "@/lib/db/pagamento-schema";

export const concluirPagamentoSchema = z.object({
  formaPagamento: z
    .string()
    .min(1, "Selecione a forma de pagamento")
    .pipe(z.enum(FORMAS_PAGAMENTO)),
});

export type ConcluirPagamentoFormInput = z.input<typeof concluirPagamentoSchema>;
export type ConcluirPagamentoInput = z.infer<typeof concluirPagamentoSchema>;
