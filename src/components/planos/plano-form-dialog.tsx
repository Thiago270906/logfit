"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm, type DefaultValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";

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
import {
  createPlanoAction,
  updatePlanoAction,
} from "@/app/(dashboard)/planos/actions";
import { PERIODICIDADES } from "@/constants/periodicidade";
import type { Plano } from "@/lib/db/plano-schema";
import {
  createPlanoSchema,
  type CreatePlanoFormInput,
} from "@/lib/validations/plano";

const emptyDefaultValues: DefaultValues<CreatePlanoFormInput> = {
  nome: "",
};

function planoToDefaultValues(plano: Plano): DefaultValues<CreatePlanoFormInput> {
  return {
    nome: plano.nome,
    periodicidade: plano.periodicidade,
    valor: Number(plano.valor),
  };
}

type PlanoFormDialogProps = {
  plano?: Plano;
  trigger?: React.ReactElement;
};

export function PlanoFormDialog({ plano, trigger }: PlanoFormDialogProps) {
  const isEditMode = Boolean(plano);
  const defaultValues = plano
    ? planoToDefaultValues(plano)
    : emptyDefaultValues;

  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<CreatePlanoFormInput>({
    resolver: zodResolver(createPlanoSchema),
    defaultValues,
  });

  async function onSubmit(data: CreatePlanoFormInput) {
    setIsSubmitting(true);
    setFormError(null);

    const result = isEditMode
      ? await updatePlanoAction(plano!.id, data)
      : await createPlanoAction(data);

    if (result?.error) {
      setFormError(result.error);
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
    setOpen(false);
    if (!isEditMode) reset(emptyDefaultValues);
    router.refresh();
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) {
          setFormError(null);
          reset(defaultValues);
        }
      }}
    >
      <DialogTrigger
        render={
          trigger ?? (
            <Button>
              <Plus />
              Novo Plano
            </Button>
          )
        }
      />

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Editar Plano" : "Cadastro de Plano"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Atualize os dados do plano abaixo."
              : "Preencha os dados abaixo para cadastrar um novo plano."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Título</Label>
            <Input
              id="nome"
              placeholder="Ex: Plano Ouro"
              {...register("nome")}
            />
            {errors.nome && (
              <p className="text-sm text-destructive">{errors.nome.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="periodicidade">Periodicidade</Label>
            <Controller
              name="periodicidade"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="periodicidade" className="w-full">
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
              )}
            />
            {errors.periodicidade && (
              <p className="text-sm text-destructive">
                {errors.periodicidade.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="valor">Valor</Label>
            <Input
              id="valor"
              type="number"
              step="0.01"
              min="0"
              placeholder="0,00"
              {...register("valor")}
            />
            {errors.valor && (
              <p className="text-sm text-destructive">
                {errors.valor.message}
              </p>
            )}
          </div>

          {formError && <p className="text-sm text-destructive">{formError}</p>}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Salvando..."
                : isEditMode
                  ? "Salvar"
                  : "Cadastrar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
