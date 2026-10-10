import { FORMAS_PAGAMENTO } from "@/lib/db/pagamento-schema";

export const FORMAS_PAGAMENTO_OPCOES = [
  { key: "dinheiro", label: "Dinheiro" },
  { key: "pix", label: "Pix" },
  { key: "cartao_debito", label: "Cartão de débito" },
  { key: "cartao_credito", label: "Cartão de crédito" },
] as const satisfies { key: (typeof FORMAS_PAGAMENTO)[number]; label: string }[];
