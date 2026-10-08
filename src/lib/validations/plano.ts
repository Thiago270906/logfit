import { z } from "zod";

function parseValor(value: unknown) {
  if (value === undefined || value === null || value === "") return undefined;
  const asNumber = Number(String(value).trim().replace(",", "."));
  return Number.isNaN(asNumber) ? undefined : asNumber;
}

const valorPeriodicidade = z.preprocess(
  parseValor,
  z.number().positive("Informe um valor válido").optional(),
);

export const createPlanoSchema = z
  .object({
    nome: z.string().trim().min(2, "Informe o nome do plano"),
    diariaHabilitada: z.boolean().default(false),
    diariaValor: valorPeriodicidade,
    mensalHabilitada: z.boolean().default(false),
    mensalValor: valorPeriodicidade,
    anualHabilitada: z.boolean().default(false),
    anualValor: valorPeriodicidade,
  })
  .superRefine((data, ctx) => {
    if (
      !data.diariaHabilitada &&
      !data.mensalHabilitada &&
      !data.anualHabilitada
    ) {
      ctx.addIssue({
        code: "custom",
        message: "Ative ao menos uma periodicidade: diária, mensal ou anual",
        path: ["diariaHabilitada"],
      });
    }

    if (data.diariaHabilitada && data.diariaValor === undefined) {
      ctx.addIssue({
        code: "custom",
        message: "Informe o valor da diária",
        path: ["diariaValor"],
      });
    }

    if (data.mensalHabilitada && data.mensalValor === undefined) {
      ctx.addIssue({
        code: "custom",
        message: "Informe o valor da mensalidade",
        path: ["mensalValor"],
      });
    }

    if (data.anualHabilitada && data.anualValor === undefined) {
      ctx.addIssue({
        code: "custom",
        message: "Informe o valor da anuidade",
        path: ["anualValor"],
      });
    }
  });

// Formato bruto digitado no formulário (antes do coerce/transform do Zod).
export type CreatePlanoFormInput = z.input<typeof createPlanoSchema>;

// Formato validado/normalizado, usado pelo service e pela Server Action.
export type CreatePlanoInput = z.infer<typeof createPlanoSchema>;
