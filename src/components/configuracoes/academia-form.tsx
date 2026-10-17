"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, type DefaultValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveAcademiaAction } from "@/app/dashboard/configuracoes/academia/actions";
import type { Academia } from "@/lib/db/academia-schema";
import {
  academiaSchema,
  type AcademiaFormInput,
} from "@/lib/validations/academia";

function academiaToDefaultValues(
  academia: Academia | null,
): DefaultValues<AcademiaFormInput> {
  return {
    nome: academia?.nome ?? "",
    telefone: academia?.telefone ?? "",
    cnpj: academia?.cnpj ?? "",
    endereco: academia?.endereco ?? "",
    lotacaoMaxima: academia?.lotacaoMaxima ?? undefined,
  };
}

type AcademiaFormProps = {
  academia: Academia | null;
};

export function AcademiaForm({ academia }: AcademiaFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AcademiaFormInput>({
    resolver: zodResolver(academiaSchema),
    defaultValues: academiaToDefaultValues(academia),
  });

  async function onSubmit(data: AcademiaFormInput) {
    setIsSubmitting(true);
    setFormError(null);
    setSuccess(false);

    const result = await saveAcademiaAction(data);

    if (result?.error) {
      setFormError(result.error);
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
    setSuccess(true);
    router.refresh();
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome da academia</Label>
            <Input
              id="nome"
              placeholder="Ex: Estação Corpo"
              {...register("nome")}
            />
            {errors.nome && (
              <p className="text-sm text-destructive">{errors.nome.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="telefone">Telefone/contato</Label>
            <Input
              id="telefone"
              placeholder="(11) 91234-5678"
              {...register("telefone")}
            />
            {errors.telefone && (
              <p className="text-sm text-destructive">
                {errors.telefone.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="cnpj">CNPJ</Label>
            <Input
              id="cnpj"
              placeholder="00.000.000/0000-00"
              {...register("cnpj")}
            />
            {errors.cnpj && (
              <p className="text-sm text-destructive">{errors.cnpj.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="endereco">Endereço</Label>
            <Input
              id="endereco"
              placeholder="Rua, número, bairro, cidade"
              {...register("endereco")}
            />
            {errors.endereco && (
              <p className="text-sm text-destructive">
                {errors.endereco.message}
              </p>
            )}
          </div>

          <div className="space-y-2 border-t border-border pt-4">
            <Label htmlFor="lotacaoMaxima">Lotação máxima</Label>
            <Input
              id="lotacaoMaxima"
              type="number"
              min="1"
              step="1"
              placeholder="Ex: 80"
              {...register("lotacaoMaxima")}
            />
            <p className="text-xs text-muted-foreground">
              Número máximo de pessoas simultâneas na academia.
            </p>
            {errors.lotacaoMaxima && (
              <p className="text-sm text-destructive">
                {errors.lotacaoMaxima.message}
              </p>
            )}
          </div>

          {formError && (
            <p className="text-sm text-destructive">{formError}</p>
          )}
          {success && (
            <p className="text-sm text-emerald-600">
              Configurações salvas.
            </p>
          )}

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : "Salvar"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
