import { z } from "zod";

import { PERIODICIDADE_KEYS } from "@/constants/periodicidade";

function parseValor(value: unknown) {
  if (value === undefined || value === null || value === "") return undefined;
  const asNumber = Number(String(value).trim().replace(",", "."));
  return Number.isNaN(asNumber) ? undefined : asNumber;
}

export const createPlanoSchema = z.object({
  nome: z.string().trim().min(2, "Informe o título do plano"),
  periodicidade: z
    .string()
    .min(1, "Selecione a periodicidade")
    .pipe(z.enum(PERIODICIDADE_KEYS)),
  valor: z.preprocess(
    parseValor,
    z.number().positive("Informe um valor válido"),
  ),
});

// Formato bruto digitado no formulário (antes do coerce/transform do Zod).
export type CreatePlanoFormInput = z.input<typeof createPlanoSchema>;

// Formato validado/normalizado, usado pelo service e pela Server Action.
export type CreatePlanoInput = z.infer<typeof createPlanoSchema>;
