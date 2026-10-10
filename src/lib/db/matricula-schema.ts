import { boolean, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";

import { aluno } from "@/lib/db/aluno-schema";
import { plano } from "@/lib/db/plano-schema";

export const MATRICULA_STATUSES = [
  "aguardando_assinatura",
  "assinada",
  "cancelada",
] as const;

export const MATRICULA_PERIODICIDADES = ["diaria", "mensal", "anual"] as const;

// "totalpass" só diferencia a origem da matrícula; nenhuma regra específica
// para esse tipo está implementada ainda.
export const MATRICULA_TIPOS = ["comum", "totalpass"] as const;

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
  tipo: text("tipo", { enum: MATRICULA_TIPOS }).default("comum").notNull(),
  periodicidade: text("periodicidade", {
    enum: MATRICULA_PERIODICIDADES,
  }).notNull(),
  // Só se aplica à periodicidade anual: divide o valor anual em 12 parcelas
  // mensais ao invés de gerar um único pagamento integral na assinatura.
  parcelarMensal: boolean("parcelar_mensal").default(true).notNull(),
  token: text("token")
    .notNull()
    .unique()
    .$defaultFn(() => crypto.randomUUID()),
  status: text("status", { enum: MATRICULA_STATUSES })
    .default("aguardando_assinatura")
    .notNull(),
  anamnese: jsonb("anamnese").$type<AnamneseResposta[]>().notNull(),
  assinaturaNome: text("assinatura_nome"),
  // PNG em base64 (data URL) capturado no painel de assinatura digital.
  assinaturaImagem: text("assinatura_imagem"),
  assinadoEm: timestamp("assinado_em"),
  canceladaEm: timestamp("cancelada_em"),
  dataInicio: timestamp("data_inicio").defaultNow().notNull(),
  dataExpiracao: timestamp("data_expiracao"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export type Matricula = typeof matricula.$inferSelect;
