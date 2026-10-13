// 3º ARQUIVO — a CLASSE: estado e comportamento. Quem valida é o pessoa.validacao.ts.

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  BRASIL,
  CadastroPessoa,
  Campo,
  Erros,
  PAISES,
  PessoaSalva,
  Tocados,
  UFS,
  cadastroVazio,
} from './pessoa.model';
import { formatarCpf, somenteDigitos, validarCadastro } from './pessoa.validacao';

@Component({
  selector: 'app-pessoa',
  imports: [FormsModule],
  templateUrl: './pessoa.html',
  styleUrl: './pessoa.css',
})
export class Pessoa {
  readonly paises = PAISES;
  readonly ufs = UFS;
  readonly hoje = new Date().toISOString().slice(0, 10); // limite do <input type="date">

  form: CadastroPessoa = cadastroVazio();
  tocados: Tocados = {};
  pessoas: PessoaSalva[] = [];
  mensagemSucesso = '';
  private proximoId = 1;

  // ---- derivados -----------------------------------------------------------

  /** Getter: recalculado a cada tecla, a partir do form atual. */
  get erros(): Erros {
    return validarCadastro(this.form, this.pessoas.map((p) => somenteDigitos(p.cpf)));
  }

  get valido(): boolean {
    return Object.keys(this.erros).length === 0;
  }

  get nascidoNoBrasil(): boolean {
    return this.form.paisOrigem === BRASIL;
  }

  // ---- ciclo da mensagem ---------------------------------------------------

  tocar(campo: Campo): void {
    this.tocados[campo] = true;
  }

  /** Só mostra depois do blur; some sozinho quando o valor fica válido. */
  erro(campo: Campo): string | null {
    return this.tocados[campo] ? (this.erros[campo] ?? null) : null;
  }

  // ---- eventos -------------------------------------------------------------

  /**
   * O CPF não usa [(ngModel)]: a cada tecla o texto é reformatado e devolvido
   * ao próprio input. Assim letras não entram e a máscara aparece enquanto digita.
   */
  digitarCpf(evento: Event): void {
    const input = evento.target as HTMLInputElement;
    this.form.cpf = formatarCpf(input.value);
    input.value = this.form.cpf;
  }

  /** Trocar o país apaga a UF, que só faz sentido para o Brasil. */
  mudarPais(): void {
    if (!this.nascidoNoBrasil) {
      this.form.ufOrigem = '';
      delete this.tocados.ufOrigem;
    }
  }

  salvar(): void {
    this.mensagemSucesso = '';
    for (const campo of Object.keys(this.form) as Campo[]) this.tocados[campo] = true;
    if (!this.valido) return;

    const nova: PessoaSalva = {
      ...this.form,
      id: this.proximoId++,
      nomeCompleto: this.form.nomeCompleto.trim(),
      nomeMae: this.form.nomeMae.trim(),
      nomePai: this.form.nomePai.trim(),
      cidadeOrigem: this.form.cidadeOrigem.trim(),
    };
    this.pessoas = [...this.pessoas, nova];
    this.mensagemSucesso = `${nova.nomeCompleto} foi cadastrado(a).`;
    this.limpar(false);
  }

  limpar(apagarMensagem = true): void {
    this.form = cadastroVazio();
    this.tocados = {};
    if (apagarMensagem) this.mensagemSucesso = '';
  }

  remover(id: number): void {
    this.pessoas = this.pessoas.filter((p) => p.id !== id);
  }

  /** '2000-05-10' → '10/05/2000' para a tabela. */
  dataBr(data: string): string {
    const [a, m, d] = data.split('-');
    return `${d}/${m}/${a}`;
  }

  origem(p: PessoaSalva): string {
    return p.paisOrigem === BRASIL
      ? `${p.cidadeOrigem} – ${p.ufOrigem}`
      : `${p.cidadeOrigem}, ${p.paisOrigem}`;
  }
}
