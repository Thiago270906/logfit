import { getDb } from "@/lib/db";
import { aluno } from "@/lib/db/aluno-schema";
import { createAlunoSchema, type CreateAlunoInput } from "@/lib/validations/aluno";
import { mapAlunoInput } from "@/services/alunos/map-aluno-input";

export async function createAluno(input: CreateAlunoInput) {
  const data = createAlunoSchema.parse(input);

  const [created] = await getDb()
    .insert(aluno)
    .values(mapAlunoInput(data))
    .returning();

  return created;
}
