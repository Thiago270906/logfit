import { getDb } from "@/lib/db";
import { matricula } from "@/lib/db/matricula-schema";
import { matriculaHistorico } from "@/lib/db/matricula-historico-schema";
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

  await getDb().insert(matriculaHistorico).values({
    matriculaId: created.id,
    tipo: "criada",
    descricao: "Matrícula criada, aguardando assinatura do contrato.",
  });

  return created;
}
