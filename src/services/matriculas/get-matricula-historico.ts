import { and, eq } from "drizzle-orm";

import { getDb } from "@/lib/db";
import {
  MATRICULA_HISTORICO_TIPOS,
  matriculaHistorico,
} from "@/lib/db/matricula-historico-schema";
import { pagamento } from "@/lib/db/pagamento-schema";
import { FORMAS_PAGAMENTO_OPCOES } from "@/constants/forma-pagamento";

export type HistoricoEventoTipo =
  | (typeof MATRICULA_HISTORICO_TIPOS)[number]
  | "pagamento_confirmado";

export type HistoricoEvento = {
  id: string;
  tipo: HistoricoEventoTipo;
  descricao: string;
  createdAt: Date;
};

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export async function getMatriculaHistorico(
  matriculaId: string,
): Promise<HistoricoEvento[]> {
  const eventos = await getDb()
    .select({
      id: matriculaHistorico.id,
      tipo: matriculaHistorico.tipo,
      descricao: matriculaHistorico.descricao,
      createdAt: matriculaHistorico.createdAt,
    })
    .from(matriculaHistorico)
    .where(eq(matriculaHistorico.matriculaId, matriculaId));

  const pagamentosConcluidos = await getDb()
    .select({
      id: pagamento.id,
      valor: pagamento.valor,
      formaPagamento: pagamento.formaPagamento,
      pagoEm: pagamento.pagoEm,
    })
    .from(pagamento)
    .where(
      and(eq(pagamento.matriculaId, matriculaId), eq(pagamento.status, "pago")),
    );

  const eventosPagamento: HistoricoEvento[] = pagamentosConcluidos.map(
    (item) => ({
      id: `pagamento-${item.id}`,
      tipo: "pagamento_confirmado",
      descricao: `Pagamento de ${currencyFormatter.format(Number(item.valor))} confirmado${
        item.formaPagamento
          ? ` via ${
              FORMAS_PAGAMENTO_OPCOES.find(
                ({ key }) => key === item.formaPagamento,
              )?.label
            }`
          : ""
      }.`,
      createdAt: item.pagoEm as Date,
    }),
  );

  return [...eventos, ...eventosPagamento].sort(
    (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
  );
}
