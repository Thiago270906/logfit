import { CheckCircle2, FilePlus2, Wallet } from "lucide-react";

import type {
  HistoricoEvento,
  HistoricoEventoTipo,
} from "@/services/matriculas/get-matricula-historico";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
});

const TIPO_ICON: Record<HistoricoEventoTipo, typeof FilePlus2> = {
  criada: FilePlus2,
  assinada: CheckCircle2,
  pagamento_confirmado: Wallet,
};

export function MatriculaHistoricoTimeline({
  eventos,
}: {
  eventos: HistoricoEvento[];
}) {
  if (eventos.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Nenhum evento registrado ainda.
      </p>
    );
  }

  return (
    <ol className="space-y-4">
      {eventos.map((evento) => {
        const Icon = TIPO_ICON[evento.tipo] ?? FilePlus2;

        return (
          <li key={evento.id} className="flex gap-3">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <Icon className="h-3.5 w-3.5" />
            </div>
            <div className="space-y-0.5">
              <p className="text-sm text-foreground">{evento.descricao}</p>
              <p className="text-xs text-muted-foreground">
                {dateFormatter.format(new Date(evento.createdAt))}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
