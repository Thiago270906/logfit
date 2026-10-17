import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

// Tabela "singleton": sempre terá exatamente 1 linha, id fixo "default".
// Permite upsert via onConflictDoUpdate sem round-trip de leitura prévia.
export const ACADEMIA_SINGLETON_ID = "default";

export const academia = pgTable("academia", {
  id: text("id").primaryKey().default(ACADEMIA_SINGLETON_ID),
  nome: text("nome"),
  telefone: text("telefone"),
  cnpj: text("cnpj"),
  endereco: text("endereco"),
  lotacaoMaxima: integer("lotacao_maxima"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export type Academia = typeof academia.$inferSelect;
