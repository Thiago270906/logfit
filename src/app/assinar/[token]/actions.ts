"use server";

import { revalidatePath } from "next/cache";

import { assinarMatricula } from "@/services/matriculas/assinar-matricula";
import {
  assinarMatriculaSchema,
  type AssinarMatriculaFormInput,
} from "@/lib/validations/matricula";

export async function assinarMatriculaAction(
  token: string,
  input: AssinarMatriculaFormInput,
) {
  const parsed = assinarMatriculaSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  let updated;
  try {
    updated = await assinarMatricula(token, parsed.data);
  } catch {
    return { error: "Erro ao assinar o documento." };
  }

  if (!updated) {
    return { error: "Este documento já foi assinado ou não existe mais." };
  }

  revalidatePath(`/assinar/${token}`);
  return { success: true };
}
