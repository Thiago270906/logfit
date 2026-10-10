import { CheckCircle2, Wallet } from "lucide-react";

import { ConcluirPagamentoDialog } from "@/components/pagamentos/concluir-pagamento-dialog";
import { FORMAS_PAGAMENTO_OPCOES } from "@/constants/forma-pagamento";
import type { getPagamentosByMatricula } from "@/services/pagamentos/get-pagamentos-by-matricula";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
});

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

type Pagamentos = Awaited<ReturnType<typeof getPagamentosByMatricula>>;

export function MatriculaPagamentoPanel({
  pagamentos,
  alunoNome,
}: {
  pagamentos: Pagamentos;
  alunoNome: string;
}) {
  if (pagamentos.length === 0) return null;

  const parcelado = pagamentos.length > 1;
  const proximoPendente = pagamentos.find((item) => item.status === "pendente");
  const pagamento = proximoPendente ?? pagamentos[pagamentos.length - 1];
  const pago = pagamento.status === "pago";
  const numeroParcela = pagamentos.indexOf(pagamento) + 1;
  const parcelasPagas = pagamentos.filter((item) => item.status === "pago").length;

  return (
    <div
      className={`flex flex-col items-center gap-3 rounded-xl border p-4 text-center ${
        pago ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"
      }`}
    >
      {pago ? (
        <CheckCircle2 className="h-10 w-10 text-emerald-600" />
      ) : (
        <Wallet className="h-10 w-10 text-amber-600" />
      )}
      <p
        className={`text-base font-semibold ${
          pago ? "text-emerald-900" : "text-amber-900"
        }`}
      >
        {pago ? "Pagamento confirmado" : "Pagamento pendente"}
      </p>
      {parcelado && (
        <p className={`text-xs ${pago ? "text-emerald-700" : "text-amber-700"}`}>
          Parcela {numeroParcela} de {pagamentos.length} · {parcelasPagas} paga
          {parcelasPagas === 1 ? "" : "s"}
        </p>
      )}
      <p className={`text-sm ${pago ? "text-emerald-800" : "text-amber-800"}`}>
        {currencyFormatter.format(Number(pagamento.valor))}
      </p>

      {pago ? (
        <p className="text-xs text-emerald-700">
          {pagamento.formaPagamento &&
            `via ${
              FORMAS_PAGAMENTO_OPCOES.find(
                ({ key }) => key === pagamento.formaPagamento,
              )?.label
            } `}
          {pagamento.pagoEm &&
            `em ${dateFormatter.format(new Date(pagamento.pagoEm))}`}
        </p>
      ) : (
        <ConcluirPagamentoDialog
          pagamentoId={pagamento.id}
          alunoNome={alunoNome}
          valor={pagamento.valor}
        />
      )}
    </div>
  );
}
