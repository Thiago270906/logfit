"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth/auth";
import { hasRole } from "@/lib/permissions";
import {
  atualizarRenovacaoAutomatica,
  cancelarMatricula,
  confirmarRematricula,
  createMatricula,
  getMatriculaStatus,
  reabrirMatricula,
  MatriculaAindaNaoVencidaError,
  MatriculaAtivaError,
  MatriculaNaoElegivelParaRenovacaoError,
  PeriodicidadeNaoRenovavelError,
  RenovacaoJaAutomaticaError,
} from "@/services/matriculas";
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
  } catch (error) {
    if (error instanceof MatriculaAtivaError) {
      return { error: error.message };
    }
    return { error: "Erro ao cadastrar matrícula." };
  }

  revalidatePath("/matriculas");
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

export async function cancelarMatriculaAction(id: string) {
  if (!(await requireAdmin())) {
    return { error: "Você não tem permissão para cancelar matrículas." };
  }

  let cancelada;
  try {
    cancelada = await cancelarMatricula(id);
  } catch {
    return { error: "Erro ao cancelar matrícula." };
  }

  if (!cancelada) {
    return { error: "Matrícula não encontrada." };
  }

  revalidatePath("/matriculas");
  revalidatePath(`/matriculas/${id}`);
  return { success: true };
}

export async function reabrirMatriculaAction(id: string) {
  if (!(await requireAdmin())) {
    return { error: "Você não tem permissão para reabrir matrículas." };
  }

  let reaberta;
  try {
    reaberta = await reabrirMatricula(id);
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Erro ao reabrir matrícula." };
  }

  if (!reaberta) {
    return { error: "Matrícula não encontrada." };
  }

  revalidatePath("/matriculas");
  revalidatePath(`/matriculas/${id}`);
  return { success: true };
}

export async function toggleRenovacaoAutomaticaAction(
  id: string,
  renovacaoAutomatica: boolean,
) {
  if (!(await requireAdmin())) {
    return { error: "Você não tem permissão para alterar esta matrícula." };
  }

  let atualizada;
  try {
    atualizada = await atualizarRenovacaoAutomatica(id, renovacaoAutomatica);
  } catch (error) {
    if (error instanceof PeriodicidadeNaoRenovavelError) {
      return { error: error.message };
    }
    return { error: "Erro ao atualizar rematrícula automática." };
  }

  if (!atualizada) {
    return { error: "Matrícula não encontrada." };
  }

  revalidatePath("/matriculas");
  revalidatePath(`/matriculas/${id}`);
  return { success: true, renovacaoAutomatica: atualizada.renovacaoAutomatica };
}

export async function confirmarRematriculaAction(id: string) {
  if (!(await requireAdmin())) {
    return { error: "Você não tem permissão para confirmar rematrículas." };
  }

  let resultado;
  try {
    resultado = await confirmarRematricula(id);
  } catch (error) {
    if (
      error instanceof MatriculaNaoElegivelParaRenovacaoError ||
      error instanceof MatriculaAindaNaoVencidaError ||
      error instanceof RenovacaoJaAutomaticaError
    ) {
      return { error: error.message };
    }
    return { error: "Erro ao confirmar rematrícula." };
  }

  if (!resultado) {
    return { error: "Matrícula não encontrada." };
  }

  revalidatePath("/matriculas");
  revalidatePath(`/matriculas/${id}`);
  return { success: true };
}
