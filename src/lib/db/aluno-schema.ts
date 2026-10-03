import { integer, numeric, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const ALUNO_SITUACOES = ["ativo", "inativo", "trancado"] as const;

export const aluno = pgTable("aluno", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  matricula: serial("matricula").notNull(),
  nome: text("nome").notNull(),
  email: text("email"),
  idade: integer("idade"),
  endereco: text("endereco"),
  bairro: text("bairro"),
  cidade: text("cidade"),
  uf: text("uf"),
  cep: text("cep"),
  telefone: text("telefone").notNull(),
  cpf: text("cpf").notNull().unique(),
  rg: text("rg"),
  situacao: text("situacao", { enum: ALUNO_SITUACOES })
    .default("ativo")
    .notNull(),
  debito: numeric("debito", { precision: 10, scale: 2 }).default("0").notNull(),
  observacoes: text("observacoes"),
  fotoUrl: text("foto_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export type Aluno = typeof aluno.$inferSelect;
