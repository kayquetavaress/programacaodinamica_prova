// 1º ARQUIVO — os TIPOS: o formato dos dados.

/** O formulário de cadastro, exatamente como foi pedido. */
export interface CadastroPessoa {
  nomeCompleto: string;
  dataNascimento: string; // 'aaaa-mm-dd', formato do <input type="date">
  cpf: string;            // guardado já formatado: 000.000.000-00
  rg: string;
  nomeMae: string;
  nomePai: string;        // opcional: pode ficar em branco
  paisOrigem: string;
  ufOrigem: string;       // só existe quando o país é Brasil
  cidadeOrigem: string;
}

// ---------------------------------------------------------------------------
// TIPOS DERIVADOS
// ---------------------------------------------------------------------------

/** A pessoa depois de salva: o cadastro MAIS um id gerado pelo sistema. */
export type PessoaSalva = CadastroPessoa & { id: number };

/** 'nomeCompleto' | 'dataNascimento' | ... | 'cidadeOrigem' */
export type Campo = keyof CadastroPessoa;

/** Um erro por campo; o campo válido simplesmente não aparece no mapa. */
export type Erros = Partial<Record<Campo, string>>;

/** Quais campos a pessoa já visitou (saiu com blur). */
export type Tocados = Partial<Record<Campo, boolean>>;

// ---------------------------------------------------------------------------
// Opções dos selects
// ---------------------------------------------------------------------------

export const BRASIL = 'Brasil';

export const PAISES: string[] = [
  BRASIL,
  'Angola',
  'Argentina',
  'Bolívia',
  'Cabo Verde',
  'Chile',
  'Colômbia',
  'Espanha',
  'Estados Unidos',
  'França',
  'Itália',
  'Moçambique',
  'Paraguai',
  'Peru',
  'Portugal',
  'Uruguai',
  'Venezuela',
  'Outro',
];

export const UFS: string[] = [
  'AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO',
  'MA', 'MG', 'MS', 'MT', 'PA', 'PB', 'PE', 'PI', 'PR',
  'RJ', 'RN', 'RO', 'RR', 'RS', 'SC', 'SE', 'SP', 'TO',
];

/** O formulário vazio. Função para cada chamada devolver um objeto NOVO. */
export function cadastroVazio(): CadastroPessoa {
  return {
    nomeCompleto: '',
    dataNascimento: '',
    cpf: '',
    rg: '',
    nomeMae: '',
    nomePai: '',
    paisOrigem: BRASIL,
    ufOrigem: '',
    cidadeOrigem: '',
  };
}
