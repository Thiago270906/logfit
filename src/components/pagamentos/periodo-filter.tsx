"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { deslocarMes, formatarMesAno, rangeDoMes } from "@/lib/pagamentos/periodo";

function paraDataInput(data: Date) {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
}

type PeriodoFilterProps = {
  modo: "mes" | "periodo";
  mes: string;
  de: string;
  ate: string;
};

export function PeriodoFilter({ modo, mes, de, ate }: PeriodoFilterProps) {
  const router = useRouter();
  const pathname = usePathname();

  function navegar(params: Record<string, string>) {
    const query = new URLSearchParams(params).toString();
    router.replace(`${pathname}?${query}`);
  }

  function selecionarModo(novoModo: "mes" | "periodo") {
    if (novoModo === modo) return;
    if (novoModo === "periodo") {
      const { inicio, fim } = rangeDoMes(mes);
      navegar({
        modo: "periodo",
        de: de || paraDataInput(inicio),
        ate: ate || paraDataInput(fim),
      });
      return;
    }
    navegar({ modo: "mes", mes });
  }

  return (
    <div className="flex items-center gap-4">
      <div className="relative inline-flex rounded-lg border border-border bg-muted p-0.5 text-sm font-medium">
        <span
          aria-hidden
          className={cn(
            "absolute inset-y-0.5 left-0.5 w-20 rounded-md bg-background shadow-sm transition-transform duration-200 ease-out",
            modo === "periodo" && "translate-x-20",
          )}
        />
        <button
          type="button"
          onClick={() => selecionarModo("mes")}
          className={cn(
            "relative z-10 w-20 rounded-md px-3 py-1 text-center transition-colors",
            modo === "mes" ? "text-foreground" : "text-muted-foreground",
          )}
        >
          Mês
        </button>
        <button
          type="button"
          onClick={() => selecionarModo("periodo")}
          className={cn(
            "relative z-10 w-20 rounded-md px-3 py-1 text-center transition-colors",
            modo === "periodo" ? "text-foreground" : "text-muted-foreground",
          )}
        >
          Período
        </button>
      </div>

      {modo === "mes" ? (
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            onClick={() => navegar({ modo: "mes", mes: deslocarMes(mes, -1) })}
          >
            <ChevronLeft />
          </Button>
          <span className="min-w-36 text-center text-sm font-medium capitalize">
            {formatarMesAno(mes)}
          </span>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            onClick={() => navegar({ modo: "mes", mes: deslocarMes(mes, 1) })}
          >
            <ChevronRight />
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Input
            type="date"
            value={de}
            onChange={(e) => navegar({ modo: "periodo", de: e.target.value, ate })}
            className="w-auto"
          />
          <span className="text-sm text-muted-foreground">até</span>
          <Input
            type="date"
            value={ate}
            onChange={(e) => navegar({ modo: "periodo", de, ate: e.target.value })}
            className="w-auto"
          />
        </div>
      )}
    </div>
  );
}
