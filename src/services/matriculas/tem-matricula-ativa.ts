import { and, eq, gte, isNull, or } from "drizzle-orm";

import { getDb } from "@/lib/db";
import { matricula } from "@/lib/db/matricula-schema";

export class MatriculaAtivaError extends Error {
  constructor() {
    super("Este aluno já possui uma matrícula ativa.");
    this.name = "MatriculaAtivaError";
  }
}

// Regra de negócio: um aluno só pode ter uma matrícula por vez (de
// qualquer tipo). É preciso cancelá-la antes de criar outra.
export async function temMatriculaAtiva(alunoId: string) {
  const [row] = await getDb()
    .select({ id: matricula.id })
    .from(matricula)
    .where(
      and(
        eq(matricula.alunoId, alunoId),
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
    )
    .limit(1);

  return Boolean(row);
}
