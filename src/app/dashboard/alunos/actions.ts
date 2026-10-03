"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth/auth";
import { hasRole } from "@/lib/permissions";
import { createAluno } from "@/services/alunos/create-aluno";
import { updateAluno } from "@/services/alunos/update-aluno";
import { deleteAluno } from "@/services/alunos/delete-aluno";
import {
  createAlunoSchema,
  type CreateAlunoFormInput,
} from "@/lib/validations/aluno";

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  return hasRole(session?.user, ["admin"]);
}

export async function createAlunoAction(input: CreateAlunoFormInput) {
  if (!(await requireAdmin())) {
    return { error: "Você não tem permissão para cadastrar alunos." };
  }

  const parsed = createAlunoSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  try {
    await createAluno(parsed.data);
  } catch (error) {
    if (error instanceof Error && error.message.includes("unique")) {
      return { error: "Já existe um aluno cadastrado com esse CPF." };
    }
    return { error: "Erro ao cadastrar aluno." };
  }

  revalidatePath("/dashboard/alunos");
  return { success: true };
}

export async function updateAlunoAction(
  id: string,
  input: CreateAlunoFormInput,
) {
  if (!(await requireAdmin())) {
    return { error: "Você não tem permissão para editar alunos." };
  }

  const parsed = createAlunoSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  try {
    await updateAluno(id, parsed.data);
  } catch (error) {
    if (error instanceof Error && error.message.includes("unique")) {
      return { error: "Já existe um aluno cadastrado com esse CPF." };
    }
    return { error: "Erro ao atualizar aluno." };
  }

  revalidatePath("/dashboard/alunos");
  return { success: true };
}

export async function deleteAlunoAction(id: string) {
  if (!(await requireAdmin())) {
    return { error: "Você não tem permissão para excluir alunos." };
  }

  try {
    await deleteAluno(id);
  } catch {
    return { error: "Erro ao excluir aluno." };
  }

  revalidatePath("/dashboard/alunos");
  return { success: true };
}
