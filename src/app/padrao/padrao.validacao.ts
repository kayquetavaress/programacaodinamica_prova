// 2º ARQUIVO — as REGRAS: o que é válido e o que não é.
//
// CONTRATO ÚNICO: toda função de validação devolve  string | null
//   - string → a mensagem de erro que vai para a tela
//   - null   → passou
//
// Nada aqui conhece Angular, tela ou evento. São funções puras: recebem valores,
// devolvem uma resposta. Por isso dá para testar cada uma isoladamente.

import { Campo, Erros, FormContato, LIMITE_OBSERVACOES } from './padrao.model';

type Validacao = string | null;

// ---------------------------------------------------------------------------
// Regras de UM campo
// ---------------------------------------------------------------------------

export function validarNome(nome: string): Validacao {
  const limpo = nome.trim();
  if (!limpo) return 'Informe o nome.';
  if (limpo.length < 3) return 'O nome precisa de pelo menos 3 letras.';
  if (!limpo.includes(' ')) return 'Informe nome e sobrenome.';
  return null;
}

export function validarNascimento(data: string, hoje = new Date()): Validacao {
  if (!data) return 'Informe a data de nascimento.';
  const nasc = new Date(data + 'T00:00:00'); // força horário local, sem fuso
  if (isNaN(nasc.getTime())) return 'Data inválida.';
  if (nasc > hoje) return 'A data não pode estar no futuro.';

  let idade = hoje.getFullYear() - nasc.getFullYear();
  const aindaNaoFezAniversario =
    hoje.getMonth() < nasc.getMonth() ||
    (hoje.getMonth() === nasc.getMonth() && hoje.getDate() < nasc.getDate());
  if (aindaNaoFezAniversario) idade--;

  if (idade < 16) return 'É preciso ter pelo menos 16 anos.';
  if (idade > 120) return 'Confira o ano de nascimento.';
  return null;
}

export function validarCurso(curso: string): Validacao {
  return curso ? null : 'Escolha um curso.';
}

export function validarEmail(email: string): Validacao {
  const limpo = email.trim();
  if (!limpo) return 'Informe o e-mail.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(limpo)) return 'E-mail em formato inválido.';
  return null;
}

/** Aceita (71) 99999-8888, 71999998888 etc.: o que conta são os dígitos. */
export function validarTelefone(telefone: string): Validacao {
  const digitos = telefone.replace(/\D/g, '');
  if (digitos.length < 10 || digitos.length > 11) return 'Telefone com DDD: 10 ou 11 dígitos.';
  return null;
}

export function validarMatricula(matricula: string): Validacao {
  if (!matricula.trim()) return 'Informe a matrícula.';
  if (!/^\d{8}$/.test(matricula.trim())) return 'A matrícula tem 8 dígitos.';
  return null;
}

export function validarSemestre(semestre: number | null): Validacao {
  if (semestre === null) return 'Informe o semestre.';
  if (!Number.isInteger(semestre)) return 'O semestre é um número inteiro.';
  if (semestre < 1 || semestre > 10) return 'O semestre vai de 1 a 10.';
  return null;
}

export function validarSenha(senha: string): Validacao {
  if (!senha) return 'Crie uma senha.';
  if (senha.length < 8) return 'A senha precisa de pelo menos 8 caracteres.';
  if (!/[A-Za-z]/.test(senha) || !/\d/.test(senha)) return 'Use letras e números na senha.';
  return null;
}

export function validarAceite(aceite: boolean): Validacao {
  return aceite ? null : 'É preciso aceitar os termos.';
}

export function validarObservacoes(texto: string): Validacao {
  if (texto.length > LIMITE_OBSERVACOES) {
    return `Máximo de ${LIMITE_OBSERVACOES} caracteres.`;
  }
  return null;
}

// ---------------------------------------------------------------------------
// Regras CRUZADAS — dependem de mais de um campo, ou de dados de fora
// ---------------------------------------------------------------------------

/** Telefone: obrigatório só para professor. Para aluno, só valida se preenchido. */
export function validarTelefoneConforme(form: FormContato): Validacao {
  const vazio = !form.telefone.trim();
  if (form.perfil === 'professor' && vazio) return 'Telefone é obrigatório para professor.';
  if (vazio) return null;
  return validarTelefone(form.telefone);
}

export function validarConfirmacao(senha: string, confirmacao: string): Validacao {
  if (!confirmacao) return 'Repita a senha.';
  if (senha !== confirmacao) return 'As senhas não conferem.';
  return null;
}

export function validarEmailUnico(email: string, jaCadastrados: string[]): Validacao {
  const normalizado = email.trim().toLowerCase();
  return jaCadastrados.includes(normalizado) ? 'Este e-mail já está na agenda.' : null;
}

// ---------------------------------------------------------------------------
// O formulário inteiro: junta tudo em um mapa de erros
// ---------------------------------------------------------------------------

export function validarFormulario(form: FormContato, emailsCadastrados: string[]): Erros {
  const erros: Erros = {};

  // Guarda a mensagem só quando existe (null não entra no mapa).
  const anotar = (campo: Campo, mensagem: Validacao) => {
    if (mensagem) erros[campo] = mensagem;
  };

  anotar('nome', validarNome(form.nome));
  anotar('nascimento', validarNascimento(form.nascimento));
  anotar('curso', validarCurso(form.curso));
  // ?? : se o formato já falhou, nem consulta a unicidade.
  anotar('email', validarEmail(form.email) ?? validarEmailUnico(form.email, emailsCadastrados));
  anotar('telefone', validarTelefoneConforme(form));

  // Matrícula e semestre só existem para aluno.
  if (form.perfil === 'aluno') {
    anotar('matricula', validarMatricula(form.matricula));
    anotar('semestre', validarSemestre(form.semestre));
  }

  anotar('senha', validarSenha(form.senha));
  anotar('confirmacao', validarConfirmacao(form.senha, form.confirmacao));
  anotar('aceite', validarAceite(form.aceite));
  anotar('observacoes', validarObservacoes(form.observacoes));

  return erros;
}
