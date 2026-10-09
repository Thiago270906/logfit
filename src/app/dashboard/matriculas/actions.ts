"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth/auth";
import { hasRole } from "@/lib/permissions";
import { createMatricula } from "@/services/matriculas/create-matricula";
import { getMatriculaStatus } from "@/services/matriculas/get-matricula-status";
import {
  createMatriculaSchema,
  type CreateMatriculaFormInput,
} from "@/lib/validations/matricula";

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  return hasRole(session?.user, ["admin"]);
}

export async function createMatriculaAction(input: CreateMatriculaFormInput) {
  if (!(await requireAdmin())) {
    return { error: "Você não tem permissão para cadastrar matrículas." };
  }

  const parsed = createMatriculaSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  let created;
  try {
    created = await createMatricula(parsed.data);
  } catch {
    return { error: "Erro ao cadastrar matrícula." };
  }

  revalidatePath("/dashboard/matriculas");
  return { success: true, id: created.id };
}

export async function getMatriculaStatusAction(id: string) {
  if (!(await requireAdmin())) {
    return { error: "Você não tem permissão para ver essa matrícula." };
  }

  const status = await getMatriculaStatus(id);
  if (!status) {
    return { error: "Matrícula não encontrada." };
  }

  return { success: true, ...status };
}
