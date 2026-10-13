// 1º ARQUIVO — os TIPOS: o formato dos dados.
// Tudo o que vem depois (regras, classe, tela) é escrito em cima destes tipos.

export type Perfil = 'aluno' | 'professor';

export type Curso =
  | ''
  | 'Engenharia de Computação'
  | 'Sistemas de Informação'
  | 'Ciência da Computação'
  | 'Análise e Desenvolvimento de Sistemas';

/** Um contato da agenda, como fica guardado depois de salvo. */
export interface Contato {
  id: number;
  nome: string;
  nascimento: string; // 'aaaa-mm-dd', que é o formato do <input type="date">
  curso: Curso;
  email: string;
  telefone: string;
  perfil: Perfil;
  matricula: string;
  semestre: number | null; // null = campo numérico vazio
  senha: string;
  confirmacao: string;
  aceite: boolean;
  observacoes: string;
}

// ---------------------------------------------------------------------------
// TIPOS DERIVADOS — ninguém escreve nome de campo à mão daqui para baixo.
// ---------------------------------------------------------------------------

/** O formulário é o contato SEM o id (quem gera o id é o sistema, não a pessoa). */
export type FormContato = Omit<Contato, 'id'>;

/** A união de todos os nomes de campo: 'nome' | 'nascimento' | ... | 'observacoes'. */
export type Campo = keyof FormContato;

/**
 * O mapa de erros: para cada campo, uma mensagem.
 * Record<Campo, string> exigiria TODOS os campos; o Partial torna cada um opcional,
 * porque um campo válido simplesmente não aparece no mapa.
 */
export type Erros = Partial<Record<Campo, string>>;

/** Quais campos a pessoa já visitou (saiu com blur). Mesmo desenho do mapa de erros. */
export type Tocados = Partial<Record<Campo, boolean>>;

/** Opções do select, em um só lugar. */
export const CURSOS: Exclude<Curso, ''>[] = [
  'Engenharia de Computação',
  'Sistemas de Informação',
  'Ciência da Computação',
  'Análise e Desenvolvimento de Sistemas',
];

export const LIMITE_OBSERVACOES = 200;

/** O formulário vazio. Função (e não constante) para cada chamada gerar um objeto NOVO. */
export function formVazio(): FormContato {
  return {
    nome: '',
    nascimento: '',
    curso: '',
    email: '',
    telefone: '',
    perfil: 'aluno',
    matricula: '',
    semestre: null,
    senha: '',
    confirmacao: '',
    aceite: false,
    observacoes: '',
  };
}
