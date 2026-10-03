import { eq } from "drizzle-orm";

import { getDb } from "@/lib/db";
import { aluno } from "@/lib/db/aluno-schema";

export async function deleteAluno(id: string) {
  await getDb().delete(aluno).where(eq(aluno.id, id));
}
