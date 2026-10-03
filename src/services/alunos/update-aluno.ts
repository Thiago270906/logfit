import { eq } from "drizzle-orm";

import { getDb } from "@/lib/db";
import { aluno } from "@/lib/db/aluno-schema";
import { createAlunoSchema, type CreateAlunoInput } from "@/lib/validations/aluno";
import { mapAlunoInput } from "@/services/alunos/map-aluno-input";

export async function updateAluno(id: string, input: CreateAlunoInput) {
  const data = createAlunoSchema.parse(input);

  const [updated] = await getDb()
    .update(aluno)
    .set(mapAlunoInput(data))
    .where(eq(aluno.id, id))
    .returning();

  return updated;
}
