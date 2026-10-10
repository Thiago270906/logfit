import { eq } from "drizzle-orm";

import { getDb } from "@/lib/db";
import { aluno } from "@/lib/db/aluno-schema";

export async function getAlunoById(id: string) {
  const [row] = await getDb()
    .select()
    .from(aluno)
    .where(eq(aluno.id, id))
    .limit(1);

  return row;
}
