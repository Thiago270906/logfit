"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCcw } from "lucide-react";

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
import { confirmarRematriculaAction } from "@/app/(dashboard)/matriculas/actions";

export function MatriculaConfirmarRematriculaDialog({
  matriculaId,
  alunoNome,
}: {
  matriculaId: string;
  alunoNome: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isConfirmando, setIsConfirmando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConfirmar() {
    setIsConfirmando(true);
    setError(null);

    const result = await confirmarRematriculaAction(matriculaId);

    if (result?.error) {
      setError(result.error);
      setIsConfirmando(false);
      return;
    }

    setIsConfirmando(false);
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
          <Button variant="outline" size="sm">
            <RefreshCcw />
            Confirmar rematrícula
          </Button>
        }
      />

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar rematrícula</AlertDialogTitle>
          <AlertDialogDescription>
            A matrícula de {alunoNome} venceu. Confirmar vai gerar o próximo
            pagamento pelo valor atual do plano e estender a vigência por mais
            um ciclo.
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
            onClick={handleConfirmar}
            disabled={isConfirmando}
          >
            {isConfirmando ? "Confirmando..." : "Confirmar rematrícula"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
