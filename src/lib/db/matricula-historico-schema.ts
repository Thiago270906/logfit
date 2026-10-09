import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

import { matricula } from "@/lib/db/matricula-schema";

// Eventos de fato ocorridos na matrícula (trilha de auditoria).
// A expiração por tempo é um estado calculado (ver get-situacao-matricula.ts),
// não um evento registrado aqui — ela não é uma ação, é a ausência de renovação.
export const MATRICULA_HISTORICO_TIPOS = ["criada", "assinada"] as const;

export const matriculaHistorico = pgTable("matricula_historico", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  matriculaId: text("matricula_id")
    .notNull()
    .references(() => matricula.id, { onDelete: "cascade" }),
  tipo: text("tipo", { enum: MATRICULA_HISTORICO_TIPOS }).notNull(),
  descricao: text("descricao").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type MatriculaHistorico = typeof matriculaHistorico.$inferSelect;
