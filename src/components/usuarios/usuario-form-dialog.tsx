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
import { UsuarioForm } from "@/components/usuarios/usuario-form";
import type { Usuario } from "@/lib/db/auth-schema";

type UsuarioFormDialogProps = {
  usuario?: Usuario;
  trigger?: React.ReactElement;
};

export function UsuarioFormDialog({
  usuario,
  trigger,
}: UsuarioFormDialogProps) {
  const isEditMode = Boolean(usuario);
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          trigger ?? (
            <Button>
              <Plus />
              Novo Usuário
            </Button>
          )
        }
      />

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Editar Usuário" : "Novo Usuário"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Atualize o nome e o papel deste usuário."
              : "Cadastre um funcionário com acesso ao sistema."}
          </DialogDescription>
        </DialogHeader>

        {open && (
          <UsuarioForm
            usuario={usuario}
            onCancel={() => setOpen(false)}
            onSaved={() => setOpen(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
