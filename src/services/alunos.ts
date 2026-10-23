import { and, desc, eq, gte, isNull, notExists, or } from "drizzle-orm";

import { getDb } from "@/lib/db";
import { aluno } from "@/lib/db/aluno-schema";
import { matricula } from "@/lib/db/matricula-schema";
import {
  createAlunoSchema,
  type CreateAlunoInput,
} from "@/lib/validations/aluno";

function mapAlunoInput(data: CreateAlunoInput) {
  return {
    nome: data.nome,
    email: data.email ?? null,
    dataNascimento: data.dataNascimento ?? null,
    genero: data.genero ?? null,
    endereco: data.endereco ?? null,
    numero: data.numero ?? null,
    bairro: data.bairro ?? null,
    cidade: data.cidade ?? null,
    uf: data.uf ?? null,
    cep: data.cep ?? null,
    telefone: data.telefone,
    cpf: data.cpf,
    rg: data.rg ?? null,
    situacao: data.situacao,
    debito: data.debito.toString(),
    observacoes: data.observacoes ?? null,
  };
}

export async function getAlunos() {
  return getDb().select().from(aluno).orderBy(desc(aluno.createdAt));
}

export async function getAlunoById(id: string) {
  const [row] = await getDb()
    .select()
    .from(aluno)
    .where(eq(aluno.id, id))
    .limit(1);

  return row;
}

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

export async function createAluno(input: CreateAlunoInput) {
  const data = createAlunoSchema.parse(input);

  const [created] = await getDb()
    .insert(aluno)
    .values(mapAlunoInput(data))
    .returning();

  return created;
}

export async function updateAluno(id: string, input: CreateAlunoInput) {
  const data = createAlunoSchema.parse(input);

  const [updated] = await getDb()
    .update(aluno)
    .set(mapAlunoInput(data))
    .where(eq(aluno.id, id))
    .returning();

  return updated;
}

export async function deleteAluno(id: string) {
  await getDb().delete(aluno).where(eq(aluno.id, id));
}
