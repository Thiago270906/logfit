import { boolean, numeric, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const plano = pgTable("plano", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  nome: text("nome").notNull(),
  diariaHabilitada: boolean("diaria_habilitada").default(false).notNull(),
  diariaValor: numeric("diaria_valor", { precision: 10, scale: 2 }),
  mensalHabilitada: boolean("mensal_habilitada").default(false).notNull(),
  mensalValor: numeric("mensal_valor", { precision: 10, scale: 2 }),
  anualHabilitada: boolean("anual_habilitada").default(false).notNull(),
  anualValor: numeric("anual_valor", { precision: 10, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export type Plano = typeof plano.$inferSelect;
