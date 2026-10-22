import { and, eq } from "drizzle-orm";

import { getDb } from "@/lib/db";
import { matricula } from "@/lib/db/matricula-schema";
import { matriculaHistorico } from "@/lib/db/matricula-historico-schema";
import { pagamento } from "@/lib/db/pagamento-schema";
import { plano } from "@/lib/db/plano-schema";
import { mesesDaPeriodicidade } from "@/constants/periodicidade";
import {
  assinarMatriculaSchema,
  type AssinarMatriculaInput,
} from "@/lib/validations/matricula";

function addMeses(data: Date, meses: number) {
  const resultado = new Date(data);
  resultado.setMonth(resultado.getMonth() + meses);
  return resultado;
}

// Divide o valor total em N parcelas de centavos iguais, ajustando a
// última para absorver o resto da divisão e manter a soma exata.
function dividirEmParcelas(valorTotal: string, quantidade: number) {
  const totalCentavos = Math.round(Number(valorTotal) * 100);
  const parcelaCentavos = Math.floor(totalCentavos / quantidade);
  const resto = totalCentavos - parcelaCentavos * quantidade;

  return Array.from({ length: quantidade }, (_, index) => {
    const centavos = parcelaCentavos + (index < resto ? 1 : 0);
    return (centavos / 100).toFixed(2);
  });
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
      parcelarMensal: matricula.parcelarMensal,
      dataInicio: matricula.dataInicio,
      // Valor cobrado nessa matrícula: snapshot do valor do plano vigente no
      // momento da assinatura, já que o plano pode ter seu preço alterado depois.
      valor: plano.valor,
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
      assinaturaImagem: data.assinaturaImagem,
      assinadoEm,
    })
    .where(eq(matricula.id, pendente.id))
    .returning();

  await getDb().insert(matriculaHistorico).values({
    matriculaId: pendente.id,
    tipo: "assinada",
    descricao: `Contrato assinado digitalmente por ${data.nome}.`,
  });

  const meses = mesesDaPeriodicidade(pendente.periodicidade) ?? 1;
  if (pendente.valor) {
    if (meses > 1 && pendente.parcelarMensal) {
      const parcelas = dividirEmParcelas(pendente.valor, meses);
      await getDb()
        .insert(pagamento)
        .values(
          parcelas.map((parcela, index) => ({
            matriculaId: pendente.id,
            valor: parcela,
            vencimento: addMeses(pendente.dataInicio, index),
            numeroParcela: index + 1,
          })),
        );
    } else {
      await getDb().insert(pagamento).values({
        matriculaId: pendente.id,
        valor: pendente.valor,
        vencimento: pendente.dataInicio,
        numeroParcela: 1,
      });
    }
  }

  return updated;
}
