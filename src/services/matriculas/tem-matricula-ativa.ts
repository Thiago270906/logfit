import { and, eq, gte, isNull, or } from "drizzle-orm";

import { getDb } from "@/lib/db";
import { matricula } from "@/lib/db/matricula-schema";

export class MatriculaComumAtivaError extends Error {
  constructor() {
    super("Este aluno já possui uma matrícula comum ativa.");
    this.name = "MatriculaComumAtivaError";
  }
}

// Regra de negócio: um aluno não pode ter duas matrículas do tipo "comum"
// ativas ao mesmo tempo (é preciso cancelar a atual antes de criar outra).
export async function temMatriculaComumAtiva(alunoId: string) {
  const [row] = await getDb()
    .select({ id: matricula.id })
    .from(matricula)
    .where(
      and(
        eq(matricula.alunoId, alunoId),
        eq(matricula.tipo, "comum"),
        eq(matricula.status, "assinada"),
        or(
          isNull(matricula.dataExpiracao),
          gte(matricula.dataExpiracao, new Date()),
        ),
      ),
    )
    .limit(1);

  return Boolean(row);
}
