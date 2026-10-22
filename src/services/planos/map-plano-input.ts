import type { CreatePlanoInput } from "@/lib/validations/plano";

export function mapPlanoInput(data: CreatePlanoInput) {
  return {
    nome: data.nome,
    periodicidade: data.periodicidade,
    valor: data.valor.toString(),
  };
}
