import { create } from "zustand";
import type { Caixinha, Contribuicao } from "@/types";

interface CaixinhasState {
  caixinhas: Caixinha[];
  contribuicoes: Contribuicao[];
  isLoading: boolean;
  error: string | null;

  // Actions — Caixinhas
  addCaixinha: (caixinha: Caixinha) => void;
  updateCaixinha: (id: string, data: Partial<Caixinha>) => void;
  removeCaixinha: (id: string) => void;
  getCaixinhaById: (id: string) => Caixinha | undefined;

  // Actions — Contribuições
  addContribuicao: (contribuicao: Contribuicao) => void;
  getContribuicoesByCaixinha: (caixinhaId: string) => Contribuicao[];

  // Utilitários
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useCaixinhasStore = create<CaixinhasState>((set, get) => ({
  caixinhas: [],
  contribuicoes: [],
  isLoading: false,
  error: null,

  addCaixinha: (caixinha) =>
    set((state) => ({
      caixinhas: [caixinha, ...state.caixinhas],
    })),

  updateCaixinha: (id, data) =>
    set((state) => ({
      caixinhas: state.caixinhas.map((c) =>
        c.id === id ? { ...c, ...data } : c
      ),
    })),

  removeCaixinha: (id) =>
    set((state) => ({
      caixinhas: state.caixinhas.filter((c) => c.id !== id),
    })),

  getCaixinhaById: (id) =>
    get().caixinhas.find((c) => c.id === id),

  addContribuicao: (contribuicao) => {
    set((state) => ({
      contribuicoes: [contribuicao, ...state.contribuicoes],
    }));

    // Actualiza o valor acumulado da caixinha correspondente
    const { caixinhas } = get();
    const caixinha = caixinhas.find(
      (c) => c.id === contribuicao.caixinhaId
    );
    if (!caixinha) return;

    const novoValor = Math.max(
      0,
      caixinha.valorAcumulado + contribuicao.valor
    );

    const concluida = novoValor >= caixinha.valorObjetivo;

    set((state) => ({
      caixinhas: state.caixinhas.map((c) =>
        c.id === contribuicao.caixinhaId
          ? {
              ...c,
              valorAcumulado: novoValor,
              estado: concluida ? "concluida" : "ativa",
              ultimoDebitoEm: contribuicao.data,
            }
          : c
      ),
    }));
  },

  getContribuicoesByCaixinha: (caixinhaId) =>
    get().contribuicoes.filter((c) => c.caixinhaId === caixinhaId),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),
}));