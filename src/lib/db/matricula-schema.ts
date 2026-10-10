import { jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";

import { aluno } from "@/lib/db/aluno-schema";
import { plano } from "@/lib/db/plano-schema";

export const MATRICULA_STATUSES = [
  "aguardando_assinatura",
  "assinada",
] as const;

export const MATRICULA_PERIODICIDADES = ["diaria", "mensal", "anual"] as const;

export type AnamneseResposta = {
  pergunta: string;
  resposta: boolean;
  justificativa?: string;
};

export const matricula = pgTable("matricula", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  alunoId: text("aluno_id")
    .notNull()
    .references(() => aluno.id),
  planoId: text("plano_id")
    .notNull()
    .references(() => plano.id),
  periodicidade: text("periodicidade", {
    enum: MATRICULA_PERIODICIDADES,
  }).notNull(),
  token: text("token")
    .notNull()
    .unique()
    .$defaultFn(() => crypto.randomUUID()),
  status: text("status", { enum: MATRICULA_STATUSES })
    .default("aguardando_assinatura")
    .notNull(),
  anamnese: jsonb("anamnese").$type<AnamneseResposta[]>().notNull(),
  assinaturaNome: text("assinatura_nome"),
  assinadoEm: timestamp("assinado_em"),
  dataInicio: timestamp("data_inicio").defaultNow().notNull(),
  dataExpiracao: timestamp("data_expiracao"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export type Matricula = typeof matricula.$inferSelect;
