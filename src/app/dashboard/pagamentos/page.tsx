import { Receipt } from "lucide-react";

import { FORMAS_PAGAMENTO_OPCOES } from "@/constants/forma-pagamento";
import { PERIODICIDADES } from "@/constants/periodicidade";
import { getPagamentos } from "@/services/pagamentos/get-pagamentos";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
});

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const STATUS_LABEL: Record<string, string> = {
  pendente: "Pendente",
  pago: "Pago",
};

const STATUS_CLASS: Record<string, string> = {
  pendente: "bg-amber-100 text-amber-800",
  pago: "bg-emerald-100 text-emerald-800",
};

export default async function PagamentosPage() {
  const pagamentos = await getPagamentos();

  return (
    <div className="px-8 py-10">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Pagamentos</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Pagamentos gerados a partir das matrículas assinadas
        </p>
      </div>

      {pagamentos.length === 0 ? (
        <div className="mt-8 flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16 text-center">
          <Receipt className="h-8 w-8 text-muted-foreground" />
          <p className="mt-3 text-sm font-medium text-foreground">
            Nenhum pagamento registrado ainda
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Pagamentos aparecem aqui assim que uma matrícula é assinada.
          </p>
        </div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-lg border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Aluno</th>
                <th className="px-4 py-3 font-medium">Plano</th>
                <th className="px-4 py-3 font-medium">Periodicidade</th>
                <th className="px-4 py-3 font-medium">Valor</th>
                <th className="px-4 py-3 font-medium">Pagamento</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {pagamentos.map((item) => (
                <tr key={item.id} className="transition-colors hover:bg-muted/50">
                  <td className="px-4 py-3 font-medium text-foreground">
                    {item.alunoNome}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {item.planoNome}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {
                      PERIODICIDADES.find(
                        ({ key }) => key === item.periodicidade,
                      )?.label
                    }
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {currencyFormatter.format(Number(item.valor))}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {item.status === "pago" && item.formaPagamento ? (
                      <>
                        {
                          FORMAS_PAGAMENTO_OPCOES.find(
                            ({ key }) => key === item.formaPagamento,
                          )?.label
                        }{" "}
                        em{" "}
                        {item.pagoEm ? dateFormatter.format(item.pagoEm) : ""}
                      </>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_CLASS[item.status]}`}
                    >
                      {STATUS_LABEL[item.status]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
