import { z } from "zod";

function parseLotacao(value: unknown) {
  if (value === undefined || value === null || value === "") return undefined;
  const asNumber = Number(value);
  return Number.isNaN(asNumber) ? undefined : asNumber;
}

export const academiaSchema = z.object({
  nome: z.string().trim().optional().or(z.literal("")),
  telefone: z.string().trim().optional().or(z.literal("")),
  cnpj: z.string().trim().optional().or(z.literal("")),
  endereco: z.string().trim().optional().or(z.literal("")),
  lotacaoMaxima: z.preprocess(
    parseLotacao,
    z
      .number()
      .int("Informe um número inteiro")
      .positive("Informe um valor maior que zero")
      .optional(),
  ),
});

// Formato bruto digitado no formulário (antes do coerce/transform do Zod).
export type AcademiaFormInput = z.input<typeof academiaSchema>;

// Formato validado/normalizado, usado pelo service e pela Server Action.
export type AcademiaInput = z.infer<typeof academiaSchema>;
