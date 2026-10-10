import { desc, eq } from "drizzle-orm";

import { getDb } from "@/lib/db";
import { aluno } from "@/lib/db/aluno-schema";
import { matricula } from "@/lib/db/matricula-schema";
import { pagamento } from "@/lib/db/pagamento-schema";
import { plano } from "@/lib/db/plano-schema";

export async function getPagamentos() {
  return getDb()
    .select({
      id: pagamento.id,
      valor: pagamento.valor,
      status: pagamento.status,
      formaPagamento: pagamento.formaPagamento,
      pagoEm: pagamento.pagoEm,
      createdAt: pagamento.createdAt,
      matriculaId: matricula.id,
      periodicidade: matricula.periodicidade,
      alunoNome: aluno.nome,
      planoNome: plano.nome,
    })
    .from(pagamento)
    .innerJoin(matricula, eq(pagamento.matriculaId, matricula.id))
    .innerJoin(aluno, eq(matricula.alunoId, aluno.id))
    .innerJoin(plano, eq(matricula.planoId, plano.id))
    .orderBy(desc(pagamento.createdAt));
}
