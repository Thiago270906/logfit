import { and, desc, eq, gte, isNull, notExists, or } from "drizzle-orm";

import { getDb } from "@/lib/db";
import { aluno } from "@/lib/db/aluno-schema";
import { matricula } from "@/lib/db/matricula-schema";

// Um aluno só pode ter uma matrícula por vez (de qualquer tipo); ele
// precisa cancelá-la antes de aparecer novamente como opção para uma nova.
export async function getAlunosDisponiveisParaMatricula() {
  const db = getDb();

  return db
    .select()
    .from(aluno)
    .where(
      notExists(
        db
          .select({ id: matricula.id })
          .from(matricula)
          .where(
            and(
              eq(matricula.alunoId, aluno.id),
              or(
                eq(matricula.status, "aguardando_assinatura"),
                and(
                  eq(matricula.status, "assinada"),
                  or(
                    isNull(matricula.dataExpiracao),
                    gte(matricula.dataExpiracao, new Date()),
                  ),
                ),
              ),
            ),
          ),
      ),
    )
    .orderBy(desc(aluno.createdAt));
}
