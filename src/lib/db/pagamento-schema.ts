import { numeric, pgTable, text, timestamp } from "drizzle-orm/pg-core";

import { matricula } from "@/lib/db/matricula-schema";

export const PAGAMENTO_STATUSES = ["pendente", "pago"] as const;

export const FORMAS_PAGAMENTO = [
  "dinheiro",
  "pix",
  "cartao_debito",
  "cartao_credito",
] as const;

export const pagamento = pgTable("pagamento", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  matriculaId: text("matricula_id")
    .notNull()
    .references(() => matricula.id, { onDelete: "cascade" }),
  valor: numeric("valor", { precision: 10, scale: 2 }).notNull(),
  status: text("status", { enum: PAGAMENTO_STATUSES })
    .default("pendente")
    .notNull(),
  formaPagamento: text("forma_pagamento", { enum: FORMAS_PAGAMENTO }),
  pagoEm: timestamp("pago_em"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export type Pagamento = typeof pagamento.$inferSelect;
