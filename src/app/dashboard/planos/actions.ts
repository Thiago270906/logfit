"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth/auth";
import { hasRole } from "@/lib/permissions";
import { createPlano } from "@/services/planos/create-plano";
import { updatePlano } from "@/services/planos/update-plano";
import { deletePlano } from "@/services/planos/delete-plano";
import {
  createPlanoSchema,
  type CreatePlanoFormInput,
} from "@/lib/validations/plano";

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  return hasRole(session?.user, ["admin"]);
}

export async function createPlanoAction(input: CreatePlanoFormInput) {
  if (!(await requireAdmin())) {
    return { error: "Você não tem permissão para cadastrar planos." };
  }

  const parsed = createPlanoSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  try {
    await createPlano(parsed.data);
  } catch {
    return { error: "Erro ao cadastrar plano." };
  }

  revalidatePath("/dashboard/planos");
  return { success: true };
}

export async function updatePlanoAction(
  id: string,
  input: CreatePlanoFormInput,
) {
  if (!(await requireAdmin())) {
    return { error: "Você não tem permissão para editar planos." };
  }

  const parsed = createPlanoSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  try {
    await updatePlano(id, parsed.data);
  } catch {
    return { error: "Erro ao atualizar plano." };
  }

  revalidatePath("/dashboard/planos");
  return { success: true };
}

export async function deletePlanoAction(id: string) {
  if (!(await requireAdmin())) {
    return { error: "Você não tem permissão para excluir planos." };
  }

  try {
    await deletePlano(id);
  } catch {
    return { error: "Erro ao excluir plano." };
  }

  revalidatePath("/dashboard/planos");
  return { success: true };
}
