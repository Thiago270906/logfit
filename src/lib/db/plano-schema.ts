import { numeric, pgTable, text, timestamp } from "drizzle-orm/pg-core";

import { PERIODICIDADE_KEYS } from "@/constants/periodicidade";

export const plano = pgTable("plano", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  nome: text("nome").notNull(),
  periodicidade: text("periodicidade", { enum: PERIODICIDADE_KEYS }).notNull(),
  valor: numeric("valor", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export type Plano = typeof plano.$inferSelect;
