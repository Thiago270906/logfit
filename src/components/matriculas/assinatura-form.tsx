"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { assinarMatriculaAction } from "@/app/assinar/[token]/actions";
import {
  assinarMatriculaSchema,
  type AssinarMatriculaFormInput,
} from "@/lib/validations/matricula";

export function AssinaturaForm({
  token,
  nomeSugerido,
}: {
  token: string;
  nomeSugerido: string;
}) {
  const [concluido, setConcluido] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<AssinarMatriculaFormInput>({
    resolver: zodResolver(assinarMatriculaSchema),
    defaultValues: { nome: nomeSugerido, concordo: false },
  });

  async function onSubmit(data: AssinarMatriculaFormInput) {
    setIsSubmitting(true);
    setFormError(null);

    const result = await assinarMatriculaAction(token, data);

    if (result?.error) {
      setFormError(result.error);
      setIsSubmitting(false);
      return;
    }

    setConcluido(true);
  }

  if (concluido) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-8 text-center">
        <CheckCircle2 className="h-10 w-10 text-emerald-600" />
        <p className="text-base font-semibold text-emerald-900">
          Documento assinado com sucesso!
        </p>
        <p className="text-sm text-emerald-800">
          Você já pode fechar esta página.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nome">Nome completo</Label>
        <Input id="nome" {...register("nome")} />
        {errors.nome && (
          <p className="text-sm text-destructive">{errors.nome.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Controller
          name="concordo"
          control={control}
          render={({ field }) => (
            <label className="flex items-start gap-2 text-sm text-foreground">
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
                className="mt-0.5"
              />
              Declaro que as informações prestadas no questionário de saúde
              são verdadeiras e assino digitalmente este documento.
            </label>
          )}
        />
        {errors.concordo && (
          <p className="text-sm text-destructive">
            {errors.concordo.message}
          </p>
        )}
      </div>

      {formError && <p className="text-sm text-destructive">{formError}</p>}

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Assinando..." : "Assinar documento"}
      </Button>
    </form>
  );
}
