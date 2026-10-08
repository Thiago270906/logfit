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
import { Switch } from "@/components/ui/switch";
import {
  createPlanoAction,
  updatePlanoAction,
} from "@/app/dashboard/planos/actions";
import { PERIODICIDADES } from "@/constants/periodicidade";
import type { Plano } from "@/lib/db/plano-schema";
import {
  createPlanoSchema,
  type CreatePlanoFormInput,
} from "@/lib/validations/plano";

const emptyDefaultValues: DefaultValues<CreatePlanoFormInput> = {
  nome: "",
  diariaHabilitada: false,
  mensalHabilitada: false,
  anualHabilitada: false,
};

function planoToDefaultValues(
  plano: Plano,
): DefaultValues<CreatePlanoFormInput> {
  return {
    nome: plano.nome,
    diariaHabilitada: plano.diariaHabilitada,
    diariaValor: plano.diariaValor ? Number(plano.diariaValor) : undefined,
    mensalHabilitada: plano.mensalHabilitada,
    mensalValor: plano.mensalValor ? Number(plano.mensalValor) : undefined,
    anualHabilitada: plano.anualHabilitada,
    anualValor: plano.anualValor ? Number(plano.anualValor) : undefined,
  };
}

const PLACEHOLDERS: Record<(typeof PERIODICIDADES)[number]["key"], string> = {
  diaria: "Valor da diária",
  mensal: "Valor da mensalidade",
  anual: "Valor da anuidade",
};

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
    watch,
    setValue,
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

      <DialogContent className="flex max-h-[85vh] flex-col sm:max-w-lg">
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

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="-mx-4 flex-1 space-y-6 overflow-y-auto px-4 py-1">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome do plano</Label>
              <Input
                id="nome"
                placeholder="Ex: Plano Ouro"
                {...register("nome")}
              />
              {errors.nome && (
                <p className="text-sm text-destructive">
                  {errors.nome.message}
                </p>
              )}
            </div>

            <section className="space-y-3 border-t border-border pt-4">
              <h3 className="text-sm font-medium text-foreground">
                Periodicidade
              </h3>
              <p className="text-xs text-muted-foreground">
                Ative ao menos uma opção e informe o valor correspondente.
              </p>

              <div className="space-y-4">
                {PERIODICIDADES.map(({ key, label, habilitadaField, valorField }) => {
                  const habilitada = watch(habilitadaField);
                  const placeholder = PLACEHOLDERS[key];

                  return (
                    <div key={key} className="flex items-start gap-3">
                      <Controller
                        name={habilitadaField}
                        control={control}
                        render={({ field }) => (
                          <Switch
                            id={habilitadaField}
                            checked={field.value}
                            onCheckedChange={(checked) => {
                              field.onChange(checked);
                              if (!checked) {
                                setValue(valorField, undefined, {
                                  shouldValidate: true,
                                });
                              }
                            }}
                          />
                        )}
                      />
                      <div className="flex-1 space-y-1.5">
                        <Label htmlFor={habilitadaField}>{label}</Label>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder={placeholder}
                          disabled={!habilitada}
                          {...register(valorField)}
                        />
                        {errors[valorField] && (
                          <p className="text-sm text-destructive">
                            {errors[valorField]?.message as string}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {errors.diariaHabilitada && (
                <p className="text-sm text-destructive">
                  {errors.diariaHabilitada.message}
                </p>
              )}
            </section>

            {formError && (
              <p className="text-sm text-destructive">{formError}</p>
            )}
          </div>

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
