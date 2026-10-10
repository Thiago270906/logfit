"use client";

import { Ban } from "lucide-react";

import { Button } from "@/components/ui/button";
import { MatriculaCancelarDialog } from "@/components/matriculas/matricula-cancelar-dialog";
import type { MATRICULA_STATUSES } from "@/lib/db/matricula-schema";

export function MatriculaRowActions({
  matriculaId,
  alunoNome,
  status,
}: {
  matriculaId: string;
  alunoNome: string;
  status: (typeof MATRICULA_STATUSES)[number];
}) {
  if (status === "cancelada") {
    return null;
  }

  return (
    <div
      className="flex items-center justify-end"
      onClick={(event) => event.stopPropagation()}
    >
      <MatriculaCancelarDialog
        matriculaId={matriculaId}
        alunoNome={alunoNome}
        trigger={
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Cancelar matrícula"
          >
            <Ban />
          </Button>
        }
      />
    </div>
  );
}
