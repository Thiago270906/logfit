import { eq } from "drizzle-orm";

import { getDb } from "@/lib/db";
import { matricula } from "@/lib/db/matricula-schema";
import { matriculaHistorico } from "@/lib/db/matricula-historico-schema";
import { plano } from "@/lib/db/plano-schema";
import {
  mesesDaPeriodicidade,
  PERIODICIDADES_COM_RENOVACAO_AUTOMATICA,
} from "@/constants/periodicidade";
import {
  createMatriculaSchema,
  type CreateMatriculaInput,
} from "@/lib/validations/matricula";
import {
  MatriculaAtivaError,
  temMatriculaAtiva,
} from "@/services/matriculas/tem-matricula-ativa";

export async function createMatricula(input: CreateMatriculaInput) {
  const data = createMatriculaSchema.parse(input);

  if (await temMatriculaAtiva(data.alunoId)) {
    throw new MatriculaAtivaError();
  }

  const [planoSelecionado] = await getDb()
    .select({ periodicidade: plano.periodicidade })
    .from(plano)
    .where(eq(plano.id, data.planoId))
    .limit(1);

  if (!planoSelecionado) {
    throw new Error("Plano não encontrado.");
  }

  const periodicidade = planoSelecionado.periodicidade;
  const renovacaoAutomatica =
    PERIODICIDADES_COM_RENOVACAO_AUTOMATICA.includes(periodicidade);
  const meses = mesesDaPeriodicidade(periodicidade) ?? 1;

  const [created] = await getDb()
    .insert(matricula)
    .values({
      alunoId: data.alunoId,
      planoId: data.planoId,
      tipo: "comum",
      periodicidade,
      parcelarMensal: meses > 1 ? data.parcelarMensal : true,
      renovacaoAutomatica,
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
