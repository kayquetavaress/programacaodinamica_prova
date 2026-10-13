export interface Evento {
  id: number;
  titulo: string;
  data: string;
  local: string;
  emailResponsavel: string;
  vagas: number | null;
}

export function eventoVazio(): Evento {
  return {
    id: 0,
    titulo: '',
    data: '',
    local: '',
    emailResponsavel: '',
    vagas: null
  };
}

export type CampoEvento =
  | 'titulo'
  | 'data'
  | 'local'
  | 'emailResponsavel'
  | 'vagas';

export type ErrosEvento =
  Partial<Record<CampoEvento, string>>;

export type TocadosEvento =
  Partial<Record<CampoEvento, boolean>>;