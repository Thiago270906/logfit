import { desc } from "drizzle-orm";

import { getDb } from "@/lib/db";
import { aluno } from "@/lib/db/aluno-schema";

export async function getAlunos() {
  return getDb().select().from(aluno).orderBy(desc(aluno.createdAt));
}
