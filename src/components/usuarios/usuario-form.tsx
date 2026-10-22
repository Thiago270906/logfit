"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm, type DefaultValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
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
  createUsuarioAction,
  updateUsuarioAction,
} from "@/app/dashboard/usuarios/actions";
import { FUNCIONARIO_ROLE_LABELS, FUNCIONARIO_ROLES } from "@/constants/roles";
import type { Usuario } from "@/lib/db/auth-schema";
import {
  createUsuarioSchema,
  updateUsuarioSchema,
  type CreateUsuarioFormInput,
  type UpdateUsuarioFormInput,
} from "@/lib/validations/usuario";

const emptyDefaultValues: DefaultValues<CreateUsuarioFormInput> = {
  role: "instrutor",
};

type UsuarioFormProps = {
  usuario?: Usuario;
  onCancel?: () => void;
  onSaved?: () => void;
};

export function UsuarioForm({ usuario, onCancel, onSaved }: UsuarioFormProps) {
  if (usuario) {
    return (
      <EditUsuarioForm usuario={usuario} onCancel={onCancel} onSaved={onSaved} />
    );
  }

  return <CreateUsuarioForm onCancel={onCancel} onSaved={onSaved} />;
}

function CreateUsuarioForm({
  onCancel,
  onSaved,
}: {
  onCancel?: () => void;
  onSaved?: () => void;
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<CreateUsuarioFormInput>({
    resolver: zodResolver(createUsuarioSchema),
    defaultValues: emptyDefaultValues,
  });

  async function onSubmit(data: CreateUsuarioFormInput) {
    setIsSubmitting(true);
    setFormError(null);

    const result = await createUsuarioAction(data);

    if (result?.error) {
      setFormError(result.error);
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
    reset(emptyDefaultValues);
    router.refresh();
    onSaved?.();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome completo</Label>
        <Input id="name" placeholder="Nome completo" {...register("name")} />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          type="email"
          placeholder="funcionario@email.com"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <Input
          id="password"
          type="password"
          placeholder="Mínimo de 8 caracteres"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-sm text-destructive">
            {errors.password.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">Papel</Label>
        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger id="role" className="w-full">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {FUNCIONARIO_ROLES.map((role) => (
                  <SelectItem key={role} value={role}>
                    {FUNCIONARIO_ROLE_LABELS[role]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      {formError && <p className="text-sm text-destructive">{formError}</p>}

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Cadastrando..." : "Cadastrar"}
        </Button>
      </div>
    </form>
  );
}

function EditUsuarioForm({
  usuario,
  onCancel,
  onSaved,
}: {
  usuario: Usuario;
  onCancel?: () => void;
  onSaved?: () => void;
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<UpdateUsuarioFormInput>({
    resolver: zodResolver(updateUsuarioSchema),
    defaultValues: {
      name: usuario.name,
      role: (usuario.role as UpdateUsuarioFormInput["role"]) ?? "instrutor",
    },
  });

  async function onSubmit(data: UpdateUsuarioFormInput) {
    setIsSubmitting(true);
    setFormError(null);

    const result = await updateUsuarioAction(usuario.id, data);

    if (result?.error) {
      setFormError(result.error);
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
    router.refresh();
    onSaved?.();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input id="email" value={usuario.email} disabled />
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Nome completo</Label>
        <Input id="name" placeholder="Nome completo" {...register("name")} />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">Papel</Label>
        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger id="role" className="w-full">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {FUNCIONARIO_ROLES.map((role) => (
                  <SelectItem key={role} value={role}>
                    {FUNCIONARIO_ROLE_LABELS[role]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      {formError && <p className="text-sm text-destructive">{formError}</p>}

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : "Salvar"}
        </Button>
      </div>
    </form>
  );
}
