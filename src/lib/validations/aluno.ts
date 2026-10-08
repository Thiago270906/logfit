import { z } from "zod";

import { ALUNO_GENEROS, ALUNO_SITUACOES } from "@/lib/db/aluno-schema";

const optionalText = z
  .string()
  .trim()
  .optional()
  .transform((value) => (value ? value : undefined));

export const createAlunoSchema = z.object({
  nome: z.string().trim().min(3, "Informe o nome completo"),
  email: z
    .string()
    .trim()
    .email("E-mail inválido")
    .optional()
    .or(z.literal(""))
    .transform((value) => (value ? value : undefined)),
  dataNascimento: optionalText,
  genero: z.enum(ALUNO_GENEROS).optional(),
  endereco: optionalText,
  numero: optionalText,
  bairro: optionalText,
  cidade: optionalText,
  uf: optionalText,
  cep: optionalText,
  telefone: z.string().trim().min(8, "Informe um telefone válido"),
  cpf: z
    .string()
    .trim()
    .min(11, "CPF inválido")
    .max(14, "CPF inválido"),
  rg: optionalText,
  situacao: z.enum(ALUNO_SITUACOES).default("ativo"),
  debito: z.coerce.number().min(0, "Débito inválido").default(0),
  observacoes: optionalText,
});

// Formato bruto digitado no formulário (antes do coerce/transform do Zod).
export type CreateAlunoFormInput = z.input<typeof createAlunoSchema>;

// Formato validado/normalizado, usado pelo service e pela Server Action.
export type CreateAlunoInput = z.infer<typeof createAlunoSchema>;
