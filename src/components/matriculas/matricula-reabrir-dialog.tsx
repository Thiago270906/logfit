"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RotateCcw } from "lucide-react";

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
import { reabrirMatriculaAction } from "@/app/dashboard/matriculas/actions";

export function MatriculaReabrirDialog({
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
  const [isReabrindo, setIsReabrindo] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleReabrir() {
    setIsReabrindo(true);
    setError(null);

    const result = await reabrirMatriculaAction(matriculaId);

    if (result?.error) {
      setError(result.error);
      setIsReabrindo(false);
      return;
    }

    setIsReabrindo(false);
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
              <RotateCcw />
              Reabrir matrícula
            </Button>
          )
        }
      />

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Reabrir matrícula</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja reabrir a matrícula de {alunoNome}? Ela
            voltará ao status anterior ao cancelamento, como se nada tivesse
            acontecido.
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
          <Button type="button" onClick={handleReabrir} disabled={isReabrindo}>
            {isReabrindo ? "Reabrindo..." : "Reabrir matrícula"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
