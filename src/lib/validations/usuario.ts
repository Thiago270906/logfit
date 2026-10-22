import { z } from "zod";

import { FUNCIONARIO_ROLES } from "@/constants/roles";

export const createUsuarioSchema = z.object({
  name: z.string().trim().min(3, "Informe o nome completo"),
  email: z.string().trim().email("E-mail inválido"),
  password: z
    .string()
    .min(8, "A senha deve ter pelo menos 8 caracteres"),
  role: z.enum(FUNCIONARIO_ROLES),
});

export const updateUsuarioSchema = z.object({
  name: z.string().trim().min(3, "Informe o nome completo"),
  role: z.enum(FUNCIONARIO_ROLES),
});

export type CreateUsuarioFormInput = z.input<typeof createUsuarioSchema>;
export type CreateUsuarioInput = z.infer<typeof createUsuarioSchema>;

export type UpdateUsuarioFormInput = z.input<typeof updateUsuarioSchema>;
export type UpdateUsuarioInput = z.infer<typeof updateUsuarioSchema>;
