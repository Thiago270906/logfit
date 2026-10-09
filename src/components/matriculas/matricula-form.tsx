"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Controller,
  useForm,
  useWatch,
  type DefaultValues,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createMatriculaAction } from "@/app/dashboard/matriculas/actions";
import { PERGUNTAS_ANAMNESE } from "@/constants/anamnese";
import { PERIODICIDADES } from "@/constants/periodicidade";
import type { Aluno } from "@/lib/db/aluno-schema";
import type { Plano } from "@/lib/db/plano-schema";
import {
  createMatriculaSchema,
  type CreateMatriculaFormInput,
} from "@/lib/validations/matricula";

const defaultValues: DefaultValues<CreateMatriculaFormInput> = {
  alunoId: "",
  planoId: "",
  periodicidade: "",
  anamnese: PERGUNTAS_ANAMNESE.map((pergunta) => ({
    pergunta,
    resposta: null,
    justificativa: "",
  })),
};

type MatriculaFormProps = {
  alunos: Aluno[];
  planos: Plano[];
};

export function MatriculaForm({ alunos, planos }: MatriculaFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<CreateMatriculaFormInput>({
    resolver: zodResolver(createMatriculaSchema),
    defaultValues,
  });

  const anamneseValues = useWatch({ control, name: "anamnese" });
  const planoIdSelecionado = useWatch({ control, name: "planoId" });

  const planoSelecionado = planos.find(
    (plano) => plano.id === planoIdSelecionado,
  );
  const periodicidadesDisponiveis = planoSelecionado
    ? PERIODICIDADES.filter(
        ({ habilitadaField }) => planoSelecionado[habilitadaField],
      )
    : [];

  async function onSubmit(data: CreateMatriculaFormInput) {
    setIsSubmitting(true);
    setFormError(null);

    const result = await createMatriculaAction(data);

    if (result?.error) {
      setFormError(result.error);
      setIsSubmitting(false);
      return;
    }

    router.push(`/dashboard/matriculas/${result.id}`);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <section className="space-y-4 rounded-xl border border-border p-4">
        <h2 className="text-sm font-medium text-foreground">
          Aluno e plano
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="alunoId">Aluno</Label>
            <Controller
              name="alunoId"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="alunoId" className="w-full">
                    <SelectValue placeholder="Selecione o aluno">
                      {(value: string | null) =>
                        alunos.find((aluno) => aluno.id === value)?.nome ??
                        "Selecione o aluno"
                      }
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {alunos.map((aluno) => (
                      <SelectItem key={aluno.id} value={aluno.id}>
                        {aluno.nome} — {aluno.cpf}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.alunoId && (
              <p className="text-sm text-destructive">
                {errors.alunoId.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="planoId">Plano</Label>
            <Controller
              name="planoId"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                    setValue("periodicidade", "", { shouldValidate: false });
                  }}
                >
                  <SelectTrigger id="planoId" className="w-full">
                    <SelectValue placeholder="Selecione o plano">
                      {(value: string | null) =>
                        planos.find((plano) => plano.id === value)?.nome ??
                        "Selecione o plano"
                      }
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {planos.map((plano) => (
                      <SelectItem key={plano.id} value={plano.id}>
                        {plano.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.planoId && (
              <p className="text-sm text-destructive">
                {errors.planoId.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="periodicidade">Periodicidade</Label>
            <Controller
              name="periodicidade"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={!planoSelecionado}
                >
                  <SelectTrigger id="periodicidade" className="w-full">
                    <SelectValue placeholder="Periodicidade">
                      {(value: string | null) =>
                        PERIODICIDADES.find(({ key }) => key === value)
                          ?.label ?? "Periodicidade"
                      }
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {periodicidadesDisponiveis.map(({ key, label }) => (
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
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-border p-4">
        <div>
          <h2 className="text-sm font-medium text-foreground">
            Questionário de saúde
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Responda com sinceridade. Em caso de resposta &quot;Sim&quot;,
            justifique abaixo.
          </p>
        </div>

        <div className="divide-y divide-border">
          {PERGUNTAS_ANAMNESE.map((pergunta, index) => {
            const resposta = Boolean(anamneseValues?.[index]?.resposta);

            return (
              <div key={pergunta} className="space-y-3 py-4 first:pt-0">
                <input
                  type="hidden"
                  {...register(`anamnese.${index}.pergunta`)}
                />
                <div className="flex items-start justify-between gap-4">
                  <p className="text-sm text-foreground">
                    {index + 1}. {pergunta}
                  </p>
                  <Controller
                    name={`anamnese.${index}.resposta`}
                    control={control}
                    render={({ field }) => (
                      <div className="flex shrink-0 items-center gap-4">
                        <label className="flex items-center gap-1.5 text-sm text-foreground">
                          <Checkbox
                            checked={field.value === true}
                            onCheckedChange={(checked) => {
                              if (checked) field.onChange(true);
                            }}
                          />
                          Sim
                        </label>
                        <label className="flex items-center gap-1.5 text-sm text-foreground">
                          <Checkbox
                            checked={field.value === false}
                            onCheckedChange={(checked) => {
                              if (checked) field.onChange(false);
                            }}
                          />
                          Não
                        </label>
                      </div>
                    )}
                  />
                </div>

                {errors.anamnese?.[index]?.resposta && (
                  <p className="text-right text-sm text-destructive">
                    {errors.anamnese[index]?.resposta?.message}
                  </p>
                )}

                {resposta && (
                  <div className="space-y-1.5">
                    <Textarea
                      rows={2}
                      placeholder="Justifique a resposta"
                      {...register(`anamnese.${index}.justificativa`)}
                    />
                    {errors.anamnese?.[index]?.justificativa && (
                      <p className="text-sm text-destructive">
                        {errors.anamnese[index]?.justificativa?.message}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {formError && <p className="text-sm text-destructive">{formError}</p>}

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Enviando..." : "Enviar"}
        </Button>
      </div>
    </form>
  );
}
