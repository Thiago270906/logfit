"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth/auth";
import { hasRole } from "@/lib/permissions";
import { saveAcademia } from "@/services/academia/save-academia";
import {
  academiaSchema,
  type AcademiaFormInput,
} from "@/lib/validations/academia";

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  return hasRole(session?.user, ["admin"]);
}

export async function saveAcademiaAction(input: AcademiaFormInput) {
  if (!(await requireAdmin())) {
    return {
      error: "Você não tem permissão para editar as configurações da academia.",
    };
  }

  const parsed = academiaSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  try {
    await saveAcademia(parsed.data);
  } catch {
    return { error: "Erro ao salvar as configurações da academia." };
  }

  revalidatePath("/dashboard/configuracoes/academia");
  return { success: true };
}
