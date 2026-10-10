import { eq } from "drizzle-orm";

import { getDb } from "@/lib/db";
import { matricula } from "@/lib/db/matricula-schema";
import { matriculaHistorico } from "@/lib/db/matricula-historico-schema";

export class MatriculaJaCanceladaError extends Error {
  constructor() {
    super("Esta matrícula já está cancelada.");
    this.name = "MatriculaJaCanceladaError";
  }
}

export async function cancelarMatricula(id: string) {
  const db = getDb();

  const [atual] = await db
    .select({ status: matricula.status })
    .from(matricula)
    .where(eq(matricula.id, id))
    .limit(1);

  if (!atual) return null;
  if (atual.status === "cancelada") {
    throw new MatriculaJaCanceladaError();
  }

  const [atualizada] = await db
    .update(matricula)
    .set({ status: "cancelada", canceladaEm: new Date() })
    .where(eq(matricula.id, id))
    .returning();

  await db.insert(matriculaHistorico).values({
    matriculaId: id,
    tipo: "cancelada",
    descricao: "Matrícula cancelada.",
  });

  return atualizada;
}
