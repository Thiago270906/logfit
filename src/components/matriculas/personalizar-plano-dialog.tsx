"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PERIODICIDADES, type PeriodicidadeKey } from "@/constants/periodicidade";

type PersonalizarPlanoDialogProps = {
  disabled?: boolean;
  personalizado: boolean;
  periodicidadeAtual: PeriodicidadeKey;
  valorAtual: number;
  onSalvar: (periodicidade: PeriodicidadeKey, valor: number) => void;
  onRemover: () => void;
};

export function PersonalizarPlanoDialog({
  disabled,
  personalizado,
  periodicidadeAtual,
  valorAtual,
  onSalvar,
  onRemover,
}: PersonalizarPlanoDialogProps) {
  const [open, setOpen] = useState(false);
  const [periodicidade, setPeriodicidade] =
    useState<PeriodicidadeKey>(periodicidadeAtual);
  const [valor, setValor] = useState(valorAtual.toFixed(2));
  const [erro, setErro] = useState<string | null>(null);

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (nextOpen) {
      setErro(null);
      setPeriodicidade(periodicidadeAtual);
      setValor(valorAtual.toFixed(2));
    }
  }

  function handleSalvar() {
    const valorNumero = Number(String(valor).trim().replace(",", "."));
    if (!Number.isFinite(valorNumero) || valorNumero <= 0) {
      setErro("Informe um valor válido");
      return;
    }
    onSalvar(periodicidade, valorNumero);
    setOpen(false);
  }

  function handleRemover() {
    onRemover();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button type="button" variant="outline" disabled={disabled}>
            <SlidersHorizontal />
            {personalizado ? "Plano personalizado" : "Personalizar plano"}
          </Button>
        }
      />

      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Personalizar plano</DialogTitle>
          <DialogDescription>
            Define uma periodicidade e um valor específicos para esta
            matrícula, sem alterar o plano cadastrado.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="periodicidade-personalizada">Periodicidade</Label>
            <Select
              value={periodicidade}
              onValueChange={(value) =>
                setPeriodicidade(value as PeriodicidadeKey)
              }
            >
              <SelectTrigger
                id="periodicidade-personalizada"
                className="w-full"
              >
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {PERIODICIDADES.map(({ key, label }) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="valor-personalizado">Valor</Label>
            <Input
              id="valor-personalizado"
              type="number"
              step="0.01"
              min="0"
              placeholder="0,00"
              value={valor}
              onChange={(event) => {
                setErro(null);
                setValor(event.target.value);
              }}
            />
            {erro && <p className="text-sm text-destructive">{erro}</p>}
          </div>
        </div>

        <DialogFooter className="sm:justify-between">
          {personalizado ? (
            <Button type="button" variant="ghost" onClick={handleRemover}>
              Remover personalização
            </Button>
          ) : (
            <span />
          )}
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="button" onClick={handleSalvar}>
              Salvar
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
