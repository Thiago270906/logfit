import { z } from "zod";

import { MATRICULA_PERIODICIDADES } from "@/lib/db/matricula-schema";

const anamneseItemSchema = z
  .object({
    pergunta: z.string(),
    resposta: z.boolean().nullable().default(null),
    justificativa: z
      .string()
      .trim()
      .optional()
      .transform((value) => (value ? value : undefined)),
  })
  .superRefine((data, ctx) => {
    if (data.resposta === null) {
      ctx.addIssue({
        code: "custom",
        message: "Responda Sim ou Não",
        path: ["resposta"],
      });
    } else if (data.resposta && !data.justificativa) {
      ctx.addIssue({
        code: "custom",
        message: "Justifique a resposta",
        path: ["justificativa"],
      });
    }
  });

export const createMatriculaSchema = z
  .object({
    alunoId: z.string().trim().min(1, "Selecione o aluno"),
    planoId: z.string().trim().min(1, "Selecione o plano"),
    periodicidade: z
      .string()
      .min(1, "Selecione a periodicidade")
      .pipe(z.enum(MATRICULA_PERIODICIDADES)),
    dataInicio: z.string().min(1, "Informe a data de início"),
    dataExpiracao: z.string().min(1, "Informe a data de vencimento"),
    parcelarMensal: z.boolean().default(true),
    anamnese: z.array(anamneseItemSchema),
  })
  .refine((data) => new Date(data.dataExpiracao) >= new Date(data.dataInicio), {
    error: "A data de vencimento não pode ser anterior à data de início",
    path: ["dataExpiracao"],
  });

// Formato bruto digitado no formulário (antes do coerce/transform do Zod).
export type CreateMatriculaFormInput = z.input<typeof createMatriculaSchema>;

// Formato validado/normalizado, usado pelo service e pela Server Action.
export type CreateMatriculaInput = z.infer<typeof createMatriculaSchema>;

export const assinarMatriculaSchema = z.object({
  nome: z.string().trim().min(3, "Informe o nome completo"),
  concordo: z.boolean().refine((value) => value === true, {
    error: "É necessário confirmar a declaração para assinar",
  }),
});

export type AssinarMatriculaFormInput = z.input<typeof assinarMatriculaSchema>;
export type AssinarMatriculaInput = z.infer<typeof assinarMatriculaSchema>;
