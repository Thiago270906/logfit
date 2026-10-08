import { Wallet } from "lucide-react";

import { PlanoCard } from "@/components/planos/plano-card";
import { PlanoFormDialog } from "@/components/planos/plano-form-dialog";
import { getPlanos } from "@/services/planos/get-planos";
import type { Plano } from "@/lib/db/plano-schema";

type Coluna = {
  key: "diaria" | "mensal" | "anual";
  titulo: string;
  habilitadaField: "diariaHabilitada" | "mensalHabilitada" | "anualHabilitada";
  valorField: "diariaValor" | "mensalValor" | "anualValor";
};

const COLUNAS: Coluna[] = [
  {
    key: "diaria",
    titulo: "Diária",
    habilitadaField: "diariaHabilitada",
    valorField: "diariaValor",
  },
  {
    key: "mensal",
    titulo: "Mensal",
    habilitadaField: "mensalHabilitada",
    valorField: "mensalValor",
  },
  {
    key: "anual",
    titulo: "Anual",
    habilitadaField: "anualHabilitada",
    valorField: "anualValor",
  },
];

function planosDaColuna(planos: Plano[], coluna: Coluna) {
  return planos.filter((plano) => plano[coluna.habilitadaField]);
}

export default async function PlanosPage() {
  const planos = await getPlanos();

  return (
    <div className="px-8 py-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Planos</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Cadastro dos planos oferecidos pela academia
          </p>
        </div>

        <PlanoFormDialog />
      </div>

      {planos.length === 0 ? (
        <div className="mt-8 flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16 text-center">
          <Wallet className="h-8 w-8 text-muted-foreground" />
          <p className="mt-3 text-sm font-medium text-foreground">
            Nenhum plano cadastrado ainda
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Clique em &quot;Novo Plano&quot; para cadastrar o primeiro plano.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {COLUNAS.map((coluna) => {
            const planosColuna = planosDaColuna(planos, coluna);

            return (
              <div
                key={coluna.key}
                className="flex flex-col gap-3 rounded-lg bg-muted/30 p-3"
              >
                <div className="flex items-center justify-between px-1">
                  <h2 className="text-sm font-medium text-foreground">
                    {coluna.titulo}
                  </h2>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                    {planosColuna.length}
                  </span>
                </div>

                <div className="flex flex-col gap-3">
                  {planosColuna.length === 0 ? (
                    <p className="px-1 text-xs text-muted-foreground">
                      Nenhum plano com essa periodicidade.
                    </p>
                  ) : (
                    planosColuna.map((plano) => (
                      <PlanoCard
                        key={plano.id}
                        plano={plano}
                        valor={plano[coluna.valorField]!}
                      />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
