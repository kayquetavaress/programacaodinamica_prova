import { Evento, ErrosEvento } from './evento';

export function validarEvento(
  evento: Evento
): ErrosEvento {

  const erros: ErrosEvento = {};

  if (
    !evento.titulo ||
    evento.titulo.trim().length < 5 ||
    evento.titulo.trim().length > 80
  ) {
    erros.titulo =
      'O título deve ter entre 5 e 80 caracteres.';
  }

  if (!evento.data) {

    erros.data =
      'A data é obrigatória.';

  } else {

    const hoje = new Date();

    hoje.setHours(0, 0, 0, 0);

    const dataEvento = new Date(evento.data);

    if (dataEvento < hoje) {

      erros.data =
        'A data não pode estar no passado.';
    }
  }

  if (!evento.local.trim()) {

    erros.local =
      'O local não pode ficar em branco.';
  }

  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(evento.emailResponsavel)) {

    erros.emailResponsavel =
      'E-mail em formato inválido.';
  }

  if (
    evento.vagas === null ||
    !Number.isInteger(evento.vagas) ||
    evento.vagas < 1 ||
    evento.vagas > 200
  ) {

    erros.vagas =
      'As vagas devem ser um número inteiro de 1 a 200.';
  }

  // bônus

  if (
    (
      evento.local === 'Laboratório 1' ||
      evento.local === 'Laboratório 2'
    )
    &&
    evento.vagas !== null
    &&
    evento.vagas > 30
  ) {

    erros.vagas =
      'Laboratórios permitem no máximo 30 vagas.';
  }

  return erros;
}