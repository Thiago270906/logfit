"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const DURACAO_SEGUNDOS = 10;

type AlunoPosCadastroDialogProps = {
  aluno: { id: string; nome: string } | null;
  onClose: () => void;
};

export function AlunoPosCadastroDialog({
  aluno,
  onClose,
}: AlunoPosCadastroDialogProps) {
  const router = useRouter();

  return (
    <Dialog
      open={Boolean(aluno)}
      onOpenChange={(value) => {
        if (!value) onClose();
      }}
    >
      <DialogContent className="sm:max-w-sm">
        {aluno && (
          <PosCadastroConteudo
            key={aluno.id}
            nome={aluno.nome}
            onClose={onClose}
            onFazerMatricula={() => {
              onClose();
              router.push(`/matriculas/nova?alunoId=${aluno.id}`);
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

type PosCadastroConteudoProps = {
  nome: string;
  onClose: () => void;
  onFazerMatricula: () => void;
};

function PosCadastroConteudo({
  nome,
  onClose,
  onFazerMatricula,
}: PosCadastroConteudoProps) {
  const [barraCheia, setBarraCheia] = useState(true);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setBarraCheia(false));
    const timeout = setTimeout(onClose, DURACAO_SEGUNDOS * 1000);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timeout);
    };
  }, [onClose]);

  return (
    <div className="flex gap-4">
      <div className="flex h-40 w-2 shrink-0 flex-col justify-end overflow-hidden rounded-full bg-muted">
        <div
          className="w-full rounded-full bg-orange-500 ease-linear"
          style={{
            height: barraCheia ? "100%" : "0%",
            transitionProperty: "height",
            transitionDuration: `${DURACAO_SEGUNDOS}s`,
          }}
        />
      </div>

      <div className="flex-1 space-y-4 py-1">
        <DialogHeader>
          <DialogTitle>Aluno cadastrado!</DialogTitle>
          <DialogDescription>
            Deseja cadastrar uma matrícula para {nome} agora?
          </DialogDescription>
        </DialogHeader>

        <Button
          type="button"
          className="h-14 w-full bg-orange-500 text-base font-semibold text-white hover:bg-orange-600"
          onClick={onFazerMatricula}
        >
          Fazer matrícula
        </Button>
      </div>
    </div>
  );
}
