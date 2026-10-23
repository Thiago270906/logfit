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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { createMatriculaAction } from "@/app/(dashboard)/matriculas/actions";
import { PERGUNTAS_ANAMNESE } from "@/constants/anamnese";
import {
  mesesDaPeriodicidade,
  PERIODICIDADES,
  sugerirDataVencimento,
} from "@/constants/periodicidade";
import type { Aluno } from "@/lib/db/aluno-schema";
import type { Plano } from "@/lib/db/plano-schema";
import {
  createMatriculaSchema,
  type CreateMatriculaFormInput,
} from "@/lib/validations/matricula";

function hoje() {
  return new Date().toISOString().slice(0, 10);
}

const defaultValues: DefaultValues<CreateMatriculaFormInput> = {
  alunoId: "",
  planoId: "",
  dataInicio: hoje(),
  dataExpiracao: "",
  parcelarMensal: true,
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
  const [vencimentoEditadoManualmente, setVencimentoEditadoManualmente] =
    useState(false);

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
  const dataInicioSelecionada = useWatch({ control, name: "dataInicio" });

  const planoSelecionado = planos.find(
    (plano) => plano.id === planoIdSelecionado,
  );
  const periodicidadeLabel = planoSelecionado
    ? PERIODICIDADES.find(({ key }) => key === planoSelecionado.periodicidade)
        ?.label
    : undefined;
  const mesesDoPlano = planoSelecionado
    ? mesesDaPeriodicidade(planoSelecionado.periodicidade)
    : null;

  function atualizarDataVencimentoSugerida(
    plano: Plano | undefined,
    dataInicio: string,
  ) {
    if (vencimentoEditadoManualmente) return;
    if (!plano || !dataInicio) return;

    const sugerida = sugerirDataVencimento(
      plano.periodicidade,
      new Date(dataInicio),
    );
    setValue("dataExpiracao", sugerida.toISOString().slice(0, 10), {
      shouldValidate: false,
    });
  }

  async function onSubmit(data: CreateMatriculaFormInput) {
    setIsSubmitting(true);
    setFormError(null);

    const result = await createMatriculaAction(data);

    if (result?.error) {
      setFormError(result.error);
      setIsSubmitting(false);
      return;
    }

    router.push(`/matriculas/${result.id}`);
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
                    {alunos.length === 0 ? (
                      <p className="px-2 py-1.5 text-sm text-muted-foreground">
                        Não há alunos sem matrícula
                      </p>
                    ) : (
                      alunos.map((aluno) => (
                        <SelectItem key={aluno.id} value={aluno.id}>
                          {aluno.nome} — {aluno.cpf}
                        </SelectItem>
                      ))
                    )}
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
                    atualizarDataVencimentoSugerida(
                      planos.find((plano) => plano.id === value),
                      dataInicioSelecionada ?? "",
                    );
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
            <Label>Periodicidade</Label>
            <p className="flex h-9 items-center text-sm text-muted-foreground">
              {periodicidadeLabel ?? "Selecione um plano"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="dataInicio">Data de início</Label>
            <Input
              id="dataInicio"
              type="date"
              {...register("dataInicio", {
                onChange: (event) =>
                  atualizarDataVencimentoSugerida(
                    planoSelecionado,
                    event.target.value,
                  ),
              })}
            />
            {errors.dataInicio && (
              <p className="text-sm text-destructive">
                {errors.dataInicio.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="dataExpiracao">Data de vencimento</Label>
            <Input
              id="dataExpiracao"
              type="date"
              {...register("dataExpiracao", {
                onChange: () => setVencimentoEditadoManualmente(true),
              })}
            />
            <p className="text-xs text-muted-foreground">
              Sugerida automaticamente com base no plano e na data de início;
              pode ser ajustada.
            </p>
            {errors.dataExpiracao && (
              <p className="text-sm text-destructive">
                {errors.dataExpiracao.message}
              </p>
            )}
          </div>
        </div>

        {mesesDoPlano !== null && mesesDoPlano > 1 && (
          <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/40 p-3">
            <Controller
              name="parcelarMensal"
              control={control}
              render={({ field }) => (
                <Switch
                  id="parcelarMensal"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <div className="space-y-0.5">
              <Label htmlFor="parcelarMensal">Parcelar mensal</Label>
              <p className="text-xs text-muted-foreground">
                Divide o valor em {mesesDoPlano} parcelas mensais. Se
                desativado, é gerado um único pagamento com o valor integral.
              </p>
            </div>
          </div>
        )}
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
