import { useMemo } from "react";
import { useCaixinhasStore } from "@/store/useCaixinhasStore";
import {
  calcularProgresso,
  simularLevantamento,
  isCaixinhaConcluida,
} from "@/lib/calculos";
import type { ProgressoCaixinha, SimulacaoLevantamento } from "@/types";

export function useCaixinha(id: string) {
  const getCaixinhaById = useCaixinhasStore((s) => s.getCaixinhaById);
  const getContribuicoesByCaixinha = useCaixinhasStore(
    (s) => s.getContribuicoesByCaixinha
  );

  const caixinha = getCaixinhaById(id);
  const contribuicoes = getContribuicoesByCaixinha(id);

  const progresso: ProgressoCaixinha | null = useMemo(() => {
    if (!caixinha) return null;
    return calcularProgresso(caixinha);
  }, [caixinha]);

  const concluida: boolean = useMemo(() => {
    if (!caixinha) return false;
    return isCaixinhaConcluida(caixinha);
  }, [caixinha]);

  const simularLevantamentoAtual = (
    valor: number
  ): SimulacaoLevantamento => {
    return simularLevantamento(valor);
  };

  return {
    caixinha,
    contribuicoes,
    progresso,
    concluida,
    simularLevantamentoAtual,
  };
}