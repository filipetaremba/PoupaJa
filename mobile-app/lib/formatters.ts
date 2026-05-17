/**
 * Formata um valor monetário em Meticais moçambicanos.
 * Ex: 10000 → "10.000 MT"
 */
export function formatarMoeda(valor: number): string {
  return (
    valor.toLocaleString("pt-MZ", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }) + " MT"
  );
}

/**
 * Formata um valor monetário de forma compacta.
 * Ex: 10000 → "10K MT" | 1500 → "1.5K MT"
 */
export function formatarMoedaCompacta(valor: number): string {
  if (valor >= 1_000_000) {
    return (valor / 1_000_000).toFixed(1).replace(".0", "") + "M MT";
  }
  if (valor >= 1_000) {
    return (valor / 1_000).toFixed(1).replace(".0", "") + "K MT";
  }
  return formatarMoeda(valor);
}

/**
 * Formata uma percentagem.
 * Ex: 63 → "63%"
 */
export function formatarPercentagem(valor: number): string {
  return `${Math.round(valor)}%`;
}

/**
 * Formata dias restantes de forma amigável.
 * Ex: 1 → "1 dia" | 30 → "30 dias"
 */
export function formatarDias(dias: number): string {
  if (dias <= 0) return "Concluído";
  return dias === 1 ? "1 dia" : `${dias} dias`;
}

/**
 * Formata uma data ISO para exibição.
 * Ex: "2026-07-15T10:00:00Z" → "15 Jul 2026"
 */
export function formatarData(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("pt-MZ", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/**
 * Formata uma data de forma relativa e curta.
 * Ex: hoje → "Hoje" | ontem → "Ontem" | outro → "15 Jul"
 */
export function formatarDataRelativa(isoDate: string): string {
  const data = new Date(isoDate);
  const hoje = new Date();

  const mesmoDia =
    data.getDate() === hoje.getDate() &&
    data.getMonth() === hoje.getMonth() &&
    data.getFullYear() === hoje.getFullYear();

  if (mesmoDia) return "Hoje";

  const ontem = new Date(hoje);
  ontem.setDate(hoje.getDate() - 1);
  const mesmoOntem =
    data.getDate() === ontem.getDate() &&
    data.getMonth() === ontem.getMonth() &&
    data.getFullYear() === ontem.getFullYear();

  if (mesmoOntem) return "Ontem";

  return data.toLocaleDateString("pt-MZ", {
    day: "2-digit",
    month: "short",
  });
}

/**
 * Formata um número de telefone moçambicano.
 * Ex: "841234567" → "+258 84 123 4567"
 */
export function formatarTelefone(telefone: string): string {
  const limpo = telefone.replace(/\D/g, "");
  if (limpo.length === 9) {
    return `+258 ${limpo.slice(0, 2)} ${limpo.slice(2, 5)} ${limpo.slice(5)}`;
  }
  return telefone;
}