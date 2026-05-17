// --- Utilizador ---
export interface User {
  id: string;
  nome: string;
  telefone: string;
  mpesaConectado: boolean;
  criadoEm: string; // ISO date
}

// --- Caixinha ---
export type EstadoCaixinha = "ativa" | "concluida" | "cancelada";

export interface Caixinha {
  id: string;
  userId: string;
  nome: string;
  emoji: string;             // ex: "📱", "✈️", "🏠"
  valorObjetivo: number;     // valor total a poupar (MT)
  valorDiario: number;       // valor definido pelo utilizador por dia (MT)
  valorAcumulado: number;    // total já poupado (MT)
  estado: EstadoCaixinha;
  criadaEm: string;          // ISO date
  ultimoDebitoEm: string | null; // ISO date do último débito bem-sucedido
}

// --- Contribuição ---
export type TipoContribuicao = "debito_automatico" | "manual" | "levantamento";

export interface Contribuicao {
  id: string;
  caixinhaId: string;
  tipo: TipoContribuicao;
  valor: number;             // positivo = entrada, negativo = saída
  penalizacao: number;       // valor retido em caso de levantamento antecipado
  data: string;              // ISO date
  descricao: string;
}

// --- Resultado de cálculo ---
export interface ProgressoCaixinha {
  percentagem: number;       // 0–100
  valorEmFalta: number;
  diasRestantesEstimados: number;
  previsaoConclucao: Date | null;
}

// --- Levantamento antecipado ---
export interface SimulacaoLevantamento {
  valorBruto: number;
  taxaPenalizacao: number;   // percentagem (ex: 0.10 = 10%)
  valorPenalizacao: number;
  valorLiquido: number;      // o que o utilizador recebe
}

// --- Navegação (Expo Router) ---
export type RootStackParams = {
  index: undefined;
  "(auth)/login": undefined;
  "(auth)/register": undefined;
  "(auth)/otp": { telefone: string };
  "(app)/home": undefined;
  "(app)/nova-caixinha": undefined;
  "(app)/perfil": undefined;
  "(app)/caixinha/[id]": { id: string };
};