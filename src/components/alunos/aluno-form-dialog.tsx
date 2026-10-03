"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm, type DefaultValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImageIcon, Plus } from "lucide-react";

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
import { Textarea } from "@/components/ui/textarea";
import { createAlunoAction, updateAlunoAction } from "@/app/dashboard/alunos/actions";
import { ALUNO_SITUACOES, type Aluno } from "@/lib/db/aluno-schema";
import {
  createAlunoSchema,
  type CreateAlunoFormInput,
} from "@/lib/validations/aluno";

const situacaoLabels: Record<(typeof ALUNO_SITUACOES)[number], string> = {
  ativo: "Ativo",
  inativo: "Inativo",
  trancado: "Trancado",
};

const emptyDefaultValues: DefaultValues<CreateAlunoFormInput> = {
  situacao: "ativo",
  debito: 0,
};

function alunoToDefaultValues(
  aluno: Aluno,
): DefaultValues<CreateAlunoFormInput> {
  return {
    nome: aluno.nome,
    email: aluno.email ?? "",
    idade: aluno.idade ?? undefined,
    endereco: aluno.endereco ?? "",
    bairro: aluno.bairro ?? "",
    cidade: aluno.cidade ?? "",
    uf: aluno.uf ?? "",
    cep: aluno.cep ?? "",
    telefone: aluno.telefone,
    cpf: aluno.cpf,
    rg: aluno.rg ?? "",
    situacao: aluno.situacao,
    debito: Number(aluno.debito),
    observacoes: aluno.observacoes ?? "",
  };
}

type AlunoFormDialogProps = {
  aluno?: Aluno;
  trigger?: React.ReactElement;
};

export function AlunoFormDialog({ aluno, trigger }: AlunoFormDialogProps) {
  const isEditMode = Boolean(aluno);
  const defaultValues = aluno ? alunoToDefaultValues(aluno) : emptyDefaultValues;

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
  } = useForm<CreateAlunoFormInput>({
    resolver: zodResolver(createAlunoSchema),
    defaultValues,
  });

  async function onSubmit(data: CreateAlunoFormInput) {
    setIsSubmitting(true);
    setFormError(null);

    const result = isEditMode
      ? await updateAlunoAction(aluno!.id, data)
      : await createAlunoAction(data);

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
              Novo Aluno
            </Button>
          )
        }
      />

      <DialogContent className="sm:max-w-2xl">
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

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto]"
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="nome">Nome</Label>
              <Input id="nome" placeholder="Nome completo" {...register("nome")} />
              {errors.nome && (
                <p className="text-sm text-destructive">{errors.nome.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="aluno@email.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="idade">Idade</Label>
              <Input id="idade" type="number" min={0} {...register("idade")} />
              {errors.idade && (
                <p className="text-sm text-destructive">{errors.idade.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="endereco">Endereço</Label>
              <Input id="endereco" {...register("endereco")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bairro">Bairro</Label>
              <Input id="bairro" {...register("bairro")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cidade">Cidade</Label>
              <Input id="cidade" {...register("cidade")} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="uf">UF</Label>
                <Input id="uf" maxLength={2} {...register("uf")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cep">CEP</Label>
                <Input id="cep" {...register("cep")} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone / Celular</Label>
              <Input id="telefone" {...register("telefone")} />
              {errors.telefone && (
                <p className="text-sm text-destructive">
                  {errors.telefone.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="cpf">CPF</Label>
                <Input id="cpf" {...register("cpf")} />
                {errors.cpf && (
                  <p className="text-sm text-destructive">{errors.cpf.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="rg">RG</Label>
                <Input id="rg" {...register("rg")} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="situacao">Situação</Label>
              <Controller
                name="situacao"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="situacao" className="w-full">
                      <SelectValue placeholder="Situação" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(situacaoLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="debito">Débito (R$)</Label>
              <Input
                id="debito"
                type="number"
                min={0}
                step="0.01"
                {...register("debito")}
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea id="observacoes" rows={3} {...register("observacoes")} />
            </div>
          </div>

          <div className="flex flex-col items-center gap-2">
            <span className="text-sm font-medium text-foreground sm:hidden">
              Foto
            </span>
            <div className="flex h-36 w-36 flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border bg-muted/40 text-center">
              <ImageIcon className="h-6 w-6 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                Upload em breve
              </span>
            </div>
          </div>

          {formError && (
            <p className="text-sm text-destructive sm:col-span-2">{formError}</p>
          )}

          <DialogFooter className="sm:col-span-2">
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
