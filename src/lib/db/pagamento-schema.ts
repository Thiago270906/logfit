import {
  integer,
  numeric,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

import { matricula } from "@/lib/db/matricula-schema";

export const PAGAMENTO_STATUSES = ["pendente", "pago"] as const;

export const FORMAS_PAGAMENTO = [
  "dinheiro",
  "pix",
  "cartao_debito",
  "cartao_credito",
] as const;

export const pagamento = pgTable(
  "pagamento",
  {
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
    // Data de referência da cobrança (competência). Usada para o filtro de
    // mês/período e para decidir se a mensalidade mensal já venceu e deve
    // gerar a próxima competência.
    vencimento: timestamp("vencimento").notNull(),
    // Posição da cobrança dentro da matrícula (1, 2, 3...). Usada para
    // ordenar e para impedir pagar uma parcela antes das anteriores.
    numeroParcela: integer("numero_parcela").notNull(),
    pagoEm: timestamp("pago_em"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex("pagamento_matricula_parcela_idx").on(
      table.matriculaId,
      table.numeroParcela,
    ),
  ],
);

export type Pagamento = typeof pagamento.$inferSelect;
