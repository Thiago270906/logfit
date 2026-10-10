import { and, eq } from "drizzle-orm";

import { getDb } from "@/lib/db";
import { matricula } from "@/lib/db/matricula-schema";
import { matriculaHistorico } from "@/lib/db/matricula-historico-schema";
import { pagamento } from "@/lib/db/pagamento-schema";
import { plano } from "@/lib/db/plano-schema";
import {
  assinarMatriculaSchema,
  type AssinarMatriculaInput,
} from "@/lib/validations/matricula";

// Valor cobrado nessa matrícula: snapshot do valor do plano vigente no
// momento da assinatura, já que o plano pode ter seu preço alterado depois.
function valorDaPeriodicidade(
  periodicidade: string,
  planoRow: { diariaValor: string | null; mensalValor: string | null; anualValor: string | null },
) {
  if (periodicidade === "diaria") return planoRow.diariaValor;
  if (periodicidade === "mensal") return planoRow.mensalValor;
  if (periodicidade === "anual") return planoRow.anualValor;
  return null;
}

export async function assinarMatricula(
  token: string,
  input: AssinarMatriculaInput,
) {
  const data = assinarMatriculaSchema.parse(input);

  const [pendente] = await getDb()
    .select({
      id: matricula.id,
      periodicidade: matricula.periodicidade,
      diariaValor: plano.diariaValor,
      mensalValor: plano.mensalValor,
      anualValor: plano.anualValor,
    })
    .from(matricula)
    .innerJoin(plano, eq(matricula.planoId, plano.id))
    .where(
      and(
        eq(matricula.token, token),
        eq(matricula.status, "aguardando_assinatura"),
      ),
    )
    .limit(1);

  if (!pendente) return undefined;

  const assinadoEm = new Date();

  const [updated] = await getDb()
    .update(matricula)
    .set({
      status: "assinada",
      assinaturaNome: data.nome,
      assinadoEm,
    })
    .where(eq(matricula.id, pendente.id))
    .returning();

  await getDb().insert(matriculaHistorico).values({
    matriculaId: pendente.id,
    tipo: "assinada",
    descricao: `Contrato assinado digitalmente por ${data.nome}.`,
  });

  const valor = valorDaPeriodicidade(pendente.periodicidade, pendente);
  if (valor) {
    await getDb().insert(pagamento).values({
      matriculaId: pendente.id,
      valor,
    });
  }

  return updated;
}
