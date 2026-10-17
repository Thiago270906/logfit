import type { AcademiaInput } from "@/lib/validations/academia";

export function mapAcademiaInput(data: AcademiaInput) {
  return {
    nome: data.nome || null,
    telefone: data.telefone || null,
    cnpj: data.cnpj || null,
    endereco: data.endereco || null,
    lotacaoMaxima: data.lotacaoMaxima ?? null,
  };
}
