"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Ban } from "lucide-react";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { cancelarMatriculaAction } from "@/app/dashboard/matriculas/actions";

export function MatriculaCancelarDialog({
  matriculaId,
  alunoNome,
  trigger,
}: {
  matriculaId: string;
  alunoNome: string;
  trigger?: React.ReactElement;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isCancelando, setIsCancelando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCancelar() {
    setIsCancelando(true);
    setError(null);

    const result = await cancelarMatriculaAction(matriculaId);

    if (result?.error) {
      setError(result.error);
      setIsCancelando(false);
      return;
    }

    setIsCancelando(false);
    setOpen(false);
    router.refresh();
  }

  return (
    <AlertDialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) setError(null);
      }}
    >
      <AlertDialogTrigger
        render={
          trigger ?? (
            <Button variant="outline" size="sm">
              <Ban />
              Cancelar matrícula
            </Button>
          )
        }
      />

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cancelar matrícula</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja cancelar a matrícula de {alunoNome}? O
            aluno voltará a aparecer na lista de seleção para uma nova
            matrícula. Essa ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <AlertDialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Voltar
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleCancelar}
            disabled={isCancelando}
          >
            {isCancelando ? "Cancelando..." : "Cancelar matrícula"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
