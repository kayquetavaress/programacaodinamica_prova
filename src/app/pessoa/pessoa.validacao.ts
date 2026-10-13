// 2º ARQUIVO — as REGRAS. Contrato único: string (erro) | null (passou).
// Funções puras: nada aqui conhece Angular.

import { BRASIL, CadastroPessoa, Campo, Erros } from './pessoa.model';

type Validacao = string | null;

// ---------------------------------------------------------------------------
// Utilitários
// ---------------------------------------------------------------------------

export function somenteDigitos(texto: string): string {
  return texto.replace(/\D/g, '');
}

/** '12345678909' → '123.456.789-09'. Formata enquanto a pessoa digita. */
export function formatarCpf(texto: string): string {
  const d = somenteDigitos(texto).slice(0, 11);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
}

/** Letras (com acento), espaço, apóstrofo e hífen: "Maria D'Ávila", "Ana-Clara". */
const SO_LETRAS = /^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/;

// ---------------------------------------------------------------------------
// Regras de UM campo
// ---------------------------------------------------------------------------

/** Regra de nome reaproveitada por nomeCompleto, nomeMae e nomePai. */
export function validarNomePessoa(nome: string, rotulo: string): Validacao {
  const limpo = nome.trim();
  if (!limpo) return `Informe ${rotulo}.`;
  if (!SO_LETRAS.test(limpo)) return 'Use apenas letras.';
  const partes = limpo.split(/\s+/);
  if (partes.length < 2) return 'Informe nome e sobrenome.';
  if (partes.some((p) => p.length < 2 && !/^(e|y)$/i.test(p))) return 'Não abrevie o nome.';
  return null;
}

export function validarDataNascimento(data: string, hoje = new Date()): Validacao {
  if (!data) return 'Informe a data de nascimento.';
  const nasc = new Date(data + 'T00:00:00');
  if (isNaN(nasc.getTime())) return 'Data inválida.';
  if (nasc > hoje) return 'A data não pode estar no futuro.';
  const idade = (hoje.getTime() - nasc.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
  if (idade > 130) return 'Confira o ano de nascimento.';
  return null;
}

/**
 * CPF: 11 dígitos e os dois últimos são DÍGITOS VERIFICADORES,
 * calculados a partir dos nove primeiros. Formato certo não basta.
 */
export function validarCpf(cpf: string): Validacao {
  const d = somenteDigitos(cpf);
  if (!d) return 'Informe o CPF.';
  if (d.length !== 11) return 'O CPF tem 11 dígitos.';
  if (/^(\d)\1{10}$/.test(d)) return 'CPF inválido.'; // 111.111.111-11 passa na conta, mas não existe

  const digitoVerificador = (base: string): number => {
    // peso começa em (tamanho + 1) e desce até 2
    let soma = 0;
    for (let i = 0; i < base.length; i++) soma += Number(base[i]) * (base.length + 1 - i);
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };

  const dv1 = digitoVerificador(d.slice(0, 9));
  const dv2 = digitoVerificador(d.slice(0, 10));
  if (dv1 !== Number(d[9]) || dv2 !== Number(d[10])) return 'CPF inválido: confira os números.';
  return null;
}

/** O RG muda de formato em cada estado; exigimos só algo plausível. */
export function validarRg(rg: string): Validacao {
  const limpo = rg.replace(/[.\-\s]/g, '');
  if (!limpo) return 'Informe o RG.';
  if (!/^[0-9A-Za-z]+$/.test(limpo)) return 'Use apenas números, letras, ponto e hífen.';
  if (limpo.length < 5 || limpo.length > 14) return 'O RG tem entre 5 e 14 caracteres.';
  return null;
}

export function validarPais(pais: string): Validacao {
  return pais ? null : 'Escolha o país de origem.';
}

export function validarCidade(cidade: string): Validacao {
  const limpo = cidade.trim();
  if (!limpo) return 'Informe a cidade de origem.';
  if (!SO_LETRAS.test(limpo)) return 'Use apenas letras.';
  if (limpo.length < 2) return 'Nome de cidade muito curto.';
  return null;
}

// ---------------------------------------------------------------------------
// Regras CRUZADAS
// ---------------------------------------------------------------------------

/** UF só é exigida quando o país é Brasil. */
export function validarUf(form: CadastroPessoa): Validacao {
  if (form.paisOrigem !== BRASIL) return null;
  return form.ufOrigem ? null : 'Escolha a UF.';
}

/** Nome do pai é opcional; se vier, segue a regra de nome e não repete o da mãe. */
export function validarNomePai(form: CadastroPessoa): Validacao {
  if (!form.nomePai.trim()) return null;
  const regra = validarNomePessoa(form.nomePai, 'o nome do pai');
  if (regra) return regra;
  if (mesmoNome(form.nomePai, form.nomeMae)) return 'Igual ao nome da mãe: confira.';
  return null;
}

/** A pessoa não pode ter o mesmo nome da mãe. */
export function validarMaeDiferente(form: CadastroPessoa): Validacao {
  return mesmoNome(form.nomeMae, form.nomeCompleto) ? 'Igual ao nome da pessoa: confira.' : null;
}

export function validarCpfUnico(cpf: string, cadastrados: string[]): Validacao {
  return cadastrados.includes(somenteDigitos(cpf)) ? 'Este CPF já foi cadastrado.' : null;
}

function mesmoNome(a: string, b: string): boolean {
  const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, ' ');
  return norm(a) !== '' && norm(a) === norm(b);
}

// ---------------------------------------------------------------------------
// O formulário inteiro
// ---------------------------------------------------------------------------

export function validarCadastro(form: CadastroPessoa, cpfsCadastrados: string[]): Erros {
  const erros: Erros = {};
  const anotar = (campo: Campo, mensagem: Validacao) => {
    if (mensagem) erros[campo] = mensagem;
  };

  anotar('nomeCompleto', validarNomePessoa(form.nomeCompleto, 'o nome completo'));
  anotar('dataNascimento', validarDataNascimento(form.dataNascimento));
  anotar('cpf', validarCpf(form.cpf) ?? validarCpfUnico(form.cpf, cpfsCadastrados));
  anotar('rg', validarRg(form.rg));
  anotar('nomeMae', validarNomePessoa(form.nomeMae, 'o nome da mãe') ?? validarMaeDiferente(form));
  anotar('nomePai', validarNomePai(form));
  anotar('paisOrigem', validarPais(form.paisOrigem));
  anotar('ufOrigem', validarUf(form));
  anotar('cidadeOrigem', validarCidade(form.cidadeOrigem));

  return erros;
}
