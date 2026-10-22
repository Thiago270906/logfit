"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth/auth";
import { hasRole } from "@/lib/permissions";
import { createUsuario } from "@/services/usuarios/create-usuario";
import { updateUsuario } from "@/services/usuarios/update-usuario";
import { deleteUsuario } from "@/services/usuarios/delete-usuario";
import {
  createUsuarioSchema,
  updateUsuarioSchema,
  type CreateUsuarioFormInput,
  type UpdateUsuarioFormInput,
} from "@/lib/validations/usuario";

function isUserAlreadyExistsError(error: unknown) {
  const code =
    error && typeof error === "object" && "body" in error
      ? (error as { body?: { code?: string } }).body?.code
      : undefined;

  return (
    code === "USER_ALREADY_EXISTS" ||
    code === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL"
  );
}

async function requireAdminSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!hasRole(session?.user, ["admin"])) return null;
  return session;
}

export async function createUsuarioAction(input: CreateUsuarioFormInput) {
  const session = await requireAdminSession();
  if (!session) {
    return { error: "Você não tem permissão para cadastrar usuários." };
  }

  const parsed = createUsuarioSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  try {
    await createUsuario(parsed.data);
  } catch (error) {
    if (isUserAlreadyExistsError(error)) {
      return { error: "Já existe um usuário cadastrado com esse e-mail." };
    }
    return { error: "Erro ao cadastrar usuário." };
  }

  revalidatePath("/dashboard/usuarios");
  return { success: true };
}

export async function updateUsuarioAction(
  id: string,
  input: UpdateUsuarioFormInput,
) {
  const session = await requireAdminSession();
  if (!session) {
    return { error: "Você não tem permissão para editar usuários." };
  }

  const parsed = updateUsuarioSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  try {
    await updateUsuario(id, parsed.data);
  } catch {
    return { error: "Erro ao atualizar usuário." };
  }

  revalidatePath("/dashboard/usuarios");
  return { success: true };
}

export async function deleteUsuarioAction(id: string) {
  const session = await requireAdminSession();
  if (!session) {
    return { error: "Você não tem permissão para excluir usuários." };
  }

  if (session.user.id === id) {
    return { error: "Você não pode remover o seu próprio acesso." };
  }

  try {
    await deleteUsuario(id);
  } catch {
    return { error: "Erro ao excluir usuário." };
  }

  revalidatePath("/dashboard/usuarios");
  return { success: true };
}
