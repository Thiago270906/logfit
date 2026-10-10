import { getDb } from "@/lib/db";
import { matricula } from "@/lib/db/matricula-schema";
import { matriculaHistorico } from "@/lib/db/matricula-historico-schema";
import {
  createMatriculaSchema,
  type CreateMatriculaInput,
} from "@/lib/validations/matricula";
import {
  MatriculaComumAtivaError,
  temMatriculaComumAtiva,
} from "@/services/matriculas/tem-matricula-comum-ativa";

export async function createMatricula(input: CreateMatriculaInput) {
  const data = createMatriculaSchema.parse(input);

  if (await temMatriculaComumAtiva(data.alunoId)) {
    throw new MatriculaComumAtivaError();
  }

  const [created] = await getDb()
    .insert(matricula)
    .values({
      alunoId: data.alunoId,
      planoId: data.planoId,
      tipo: "comum",
      periodicidade: data.periodicidade,
      parcelarMensal: data.periodicidade === "anual" ? data.parcelarMensal : true,
      dataInicio: new Date(data.dataInicio),
      dataExpiracao: new Date(data.dataExpiracao),
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
