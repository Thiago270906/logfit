import type { CreatePlanoInput } from "@/lib/validations/plano";

export function mapPlanoInput(data: CreatePlanoInput) {
  return {
    nome: data.nome,
    diariaHabilitada: data.diariaHabilitada,
    diariaValor: data.diariaHabilitada ? data.diariaValor!.toString() : null,
    mensalHabilitada: data.mensalHabilitada,
    mensalValor: data.mensalHabilitada ? data.mensalValor!.toString() : null,
    anualHabilitada: data.anualHabilitada,
    anualValor: data.anualHabilitada ? data.anualValor!.toString() : null,
  };
}
