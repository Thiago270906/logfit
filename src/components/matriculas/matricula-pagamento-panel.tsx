import { CheckCircle2, Lock, Wallet } from "lucide-react";

import { ConcluirPagamentoDialog } from "@/components/pagamentos/concluir-pagamento-dialog";
import { FORMAS_PAGAMENTO_OPCOES } from "@/constants/forma-pagamento";
import type { PeriodicidadeKey } from "@/constants/periodicidade";
import type { MATRICULA_STATUSES } from "@/lib/db/matricula-schema";
import type { getPagamentosByMatricula } from "@/services/pagamentos/get-pagamentos-by-matricula";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
});

const vencimentoFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
});

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

type Pagamentos = Awaited<ReturnType<typeof getPagamentosByMatricula>>;

export function MatriculaPagamentoPanel({
  pagamentos,
  alunoNome,
  status,
  periodicidade,
}: {
  pagamentos: Pagamentos;
  alunoNome: string;
  status: (typeof MATRICULA_STATUSES)[number];
  periodicidade: PeriodicidadeKey;
}) {
  if (status !== "assinada" || pagamentos.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-muted/40 p-4 text-center">
        <Lock className="h-10 w-10 text-muted-foreground" />
        <p className="text-base font-semibold text-foreground">
          Pagamento bloqueado
        </p>
        <p className="text-sm text-muted-foreground">
          Disponível após{" "}
          {periodicidade === "diaria"
            ? "o preenchimento do formulário"
            : "a assinatura do documento"}
          .
        </p>
      </div>
    );
  }

  const agora = new Date();
  const pendentesOrdenados = pagamentos
    .filter((item) => item.status === "pendente")
    .sort((a, b) => a.numeroParcela - b.numeroParcela);

  // A próxima parcela/competência já existe como pendente assim que a
  // anterior é paga (mensal) ou desde a assinatura (anual), mas a matrícula
  // só deve aparecer como "pendente" de fato depois que ela vencer — até lá,
  // continua valendo o último pagamento feito. Vale igual para mensal e anual.
  const proximoPendente = pendentesOrdenados.find(
    (item) => new Date(item.vencimento).getTime() <= agora.getTime(),
  );

  const ultimoPago = pagamentos
    .filter((item) => item.status === "pago")
    .sort((a, b) => b.numeroParcela - a.numeroParcela)[0];

  const pagamento = proximoPendente ?? ultimoPago ?? pendentesOrdenados[0];
  const pago = pagamento.status === "pago";
  const numeroParcela = pagamento.numeroParcela;
  const parcelasPagas = pagamentos.filter((item) => item.status === "pago").length;
  const parcelado = periodicidade === "anual" && pagamentos.length > 1;

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
      <p className={`text-xs ${pago ? "text-emerald-700" : "text-amber-700"}`}>
        Vencimento: {vencimentoFormatter.format(new Date(pagamento.vencimento))}
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
