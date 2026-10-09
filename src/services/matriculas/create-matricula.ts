import { getDb } from "@/lib/db";
import { matricula } from "@/lib/db/matricula-schema";
import {
  createMatriculaSchema,
  type CreateMatriculaInput,
} from "@/lib/validations/matricula";

export async function createMatricula(input: CreateMatriculaInput) {
  const data = createMatriculaSchema.parse(input);

  const [created] = await getDb()
    .insert(matricula)
    .values({
      alunoId: data.alunoId,
      planoId: data.planoId,
      periodicidade: data.periodicidade,
      anamnese: data.anamnese.map((item) => ({
        pergunta: item.pergunta,
        resposta: Boolean(item.resposta),
        justificativa: item.justificativa,
      })),
    })
    .returning();

  return created;
}
