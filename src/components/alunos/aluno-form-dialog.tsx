"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AlunoForm } from "@/components/alunos/aluno-form";
import type { Aluno } from "@/lib/db/aluno-schema";

type AlunoFormDialogProps = {
  aluno?: Aluno;
  trigger?: React.ReactElement;
};

export function AlunoFormDialog({ aluno, trigger }: AlunoFormDialogProps) {
  const isEditMode = Boolean(aluno);
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          trigger ?? (
            <Button>
              <Plus />
              Novo Aluno
            </Button>
          )
        }
      />

      <DialogContent className="flex max-h-[85vh] flex-col sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Editar Aluno" : "Cadastro de Aluno"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Atualize os dados do aluno abaixo."
              : "Preencha os dados abaixo para cadastrar um novo aluno."}
          </DialogDescription>
        </DialogHeader>

        <div className="-mx-4 min-h-0 flex-1 overflow-y-auto px-4 py-1">
          {open && (
            <AlunoForm
              aluno={aluno}
              onCancel={() => setOpen(false)}
              onSaved={() => setOpen(false)}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
