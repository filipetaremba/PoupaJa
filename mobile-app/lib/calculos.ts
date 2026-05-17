import type { Caixinha, ProgressoCaixinha, SimulacaoLevantamento } from "../types";

const TAXA_PENALIZACAO = 0.10; // 10%

/**
 * Calcula o progresso atual de uma caixinha.
 */
export function calcularProgresso(caixinha: Caixinha): ProgressoCaixinha {
  const { valorObjetivo, valorAcumulado, valorDiario } = caixinha;

  const percentagem = Math.min(
    Math.round((valorAcumulado / valorObjetivo) * 100),
    100
  );

  const valorEmFalta = Math.max(valorObjetivo - valorAcumulado, 0);

  // Dias restantes estimados com base no valor diário definido
  const diasRestantesEstimados =
    valorDiario > 0 ? Math.ceil(valorEmFalta / valorDiario) : 0;

  const previsaoConclucao =
    diasRestantesEstimados > 0
      ? new Date(Date.now() + diasRestantesEstimados * 24 * 60 * 60 * 1000)
      : null;

  return {
    percentagem,
    valorEmFalta,
    diasRestantesEstimados,
    previsaoConclucao,
  };
}

/**
 * Dado o valor objetivo e o valor diário, calcula quantos dias
 * serão necessários para atingir o objetivo (estimativa inicial).
 */
export function calcularDiasParaObjetivo(
  valorObjetivo: number,
  valorDiario: number
): number {
  if (valorDiario <= 0) return 0;
  return Math.ceil(valorObjetivo / valorDiario);
}

/**
 * Verifica se hoje já foi feito o débito diário para esta caixinha.
 * Se não foi (mesmo que ontem também não tenha sido), debita apenas
 * o valor diário definido — nunca acumula dias em atraso.
 */
export function podeDebitarHoje(ultimoDebitoEm: string | null): boolean {
  if (!ultimoDebitoEm) return true;

  const ultimoDebito = new Date(ultimoDebitoEm);
  const hoje = new Date();

  return (
    ultimoDebito.getFullYear() !== hoje.getFullYear() ||
    ultimoDebito.getMonth() !== hoje.getMonth() ||
    ultimoDebito.getDate() !== hoje.getDate()
  );
}

/**
 * Simula um levantamento antecipado, calculando a penalização e o
 * valor líquido que o utilizador vai receber.
 */
export function simularLevantamento(
  valorALevantar: number
): SimulacaoLevantamento {
  const valorPenalizacao = Math.round(valorALevantar * TAXA_PENALIZACAO);
  const valorLiquido = valorALevantar - valorPenalizacao;

  return {
    valorBruto: valorALevantar,
    taxaPenalizacao: TAXA_PENALIZACAO,
    valorPenalizacao,
    valorLiquido,
  };
}

/**
 * Verifica se a caixinha está concluída.
 */
export function isCaixinhaConcluida(caixinha: Caixinha): boolean {
  return caixinha.valorAcumulado >= caixinha.valorObjetivo;
}