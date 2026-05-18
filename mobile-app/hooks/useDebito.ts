import { useCallback } from "react";
import { useCaixinhasStore } from "@/store/useCaixinhasStore";
import { podeDebitarHoje } from "@/lib/calculos";
import type { Caixinha, Contribuicao } from "@/types";

function gerarId(): string {
  return Math.random().toString(36).substring(2, 10);
}

export function useDebito() {
  const { caixinhas, addContribuicao } = useCaixinhasStore();

  /**
   * Tenta debitar o valor diário de uma caixinha específica.
   * Só debita se ainda não foi debitado hoje.
   * Nunca acumula dias em atraso — debita apenas o valor diário definido.
   * Retorna true se o débito foi efectuado, false caso contrário.
   */
  const debitarCaixinha = useCallback(
    (caixinha: Caixinha): boolean => {
      if (caixinha.estado !== "ativa") return false;
      if (!podeDebitarHoje(caixinha.ultimoDebitoEm)) return false;

      // Garante que não debita mais do que o valor em falta
      const valorEmFalta = caixinha.valorObjetivo - caixinha.valorAcumulado;
      const valorADebitar = Math.min(caixinha.valorDiario, valorEmFalta);

      if (valorADebitar <= 0) return false;

      const contribuicao: Contribuicao = {
        id: gerarId(),
        caixinhaId: caixinha.id,
        tipo: "debito_automatico",
        valor: valorADebitar,
        penalizacao: 0,
        data: new Date().toISOString(),
        descricao: `Débito diário — ${caixinha.nome}`,
      };

      addContribuicao(contribuicao);
      return true;
    },
    [caixinhas, addContribuicao]
  );

  /**
   * Regista uma contribuição manual do utilizador.
   */
  const contribuirManual = useCallback(
    (caixinha: Caixinha, valor: number): boolean => {
      if (caixinha.estado !== "ativa") return false;
      if (valor <= 0) return false;

      const valorEmFalta = caixinha.valorObjetivo - caixinha.valorAcumulado;
      const valorReal = Math.min(valor, valorEmFalta);

      const contribuicao: Contribuicao = {
        id: gerarId(),
        caixinhaId: caixinha.id,
        tipo: "manual",
        valor: valorReal,
        penalizacao: 0,
        data: new Date().toISOString(),
        descricao: `Contribuição manual — ${caixinha.nome}`,
      };

      addContribuicao(contribuicao);
      return true;
    },
    [addContribuicao]
  );

  /**
   * Regista um levantamento antecipado com penalização.
   */
  const levantarAntecipado = useCallback(
    (caixinha: Caixinha, valor: number, penalizacao: number): boolean => {
      if (valor <= 0) return false;
      if (valor > caixinha.valorAcumulado) return false;

      const contribuicao: Contribuicao = {
        id: gerarId(),
        caixinhaId: caixinha.id,
        tipo: "levantamento",
        valor: -valor,          // negativo = saída
        penalizacao,
        data: new Date().toISOString(),
        descricao: `Levantamento antecipado — ${caixinha.nome}`,
      };

      addContribuicao(contribuicao);
      return true;
    },
    [addContribuicao]
  );

  /**
   * Percorre todas as caixinhas activas e debita as que ainda
   * não foram debitadas hoje. Ideal para chamar no arranque da app.
   */
  const processarDebitosDiarios = useCallback((): number => {
    let total = 0;
    for (const caixinha of caixinhas) {
      if (debitarCaixinha(caixinha)) total++;
    }
    return total;
  }, [caixinhas, debitarCaixinha]);

  return {
    debitarCaixinha,
    contribuirManual,
    levantarAntecipado,
    processarDebitosDiarios,
  };
}