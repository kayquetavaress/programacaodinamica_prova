// 3º ARQUIVO — a CLASSE: o estado e o comportamento.
//
// Repare: esta classe NÃO SABE VALIDAR. Ela guarda o estado (o formulário, quem
// foi tocado, a lista salva) e pergunta ao padrao.validacao.ts o que está errado.

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  CURSOS,
  Campo,
  Contato,
  Erros,
  FormContato,
  LIMITE_OBSERVACOES,
  Tocados,
  formVazio,
} from './padrao.model';
import { validarFormulario } from './padrao.validacao';

@Component({
  selector: 'app-padrao',
  imports: [FormsModule],
  templateUrl: './padrao.html',
  styleUrl: './padrao.css',
})
export class Padrao {
  // ---- constantes que a tela usa --------------------------------------------
  readonly cursos = CURSOS;
  readonly limiteObservacoes = LIMITE_OBSERVACOES;

  // ---- estado ---------------------------------------------------------------
  form: FormContato = formVazio();
  tocados: Tocados = {};
  contatos: Contato[] = [];
  mensagemSucesso = '';
  private proximoId = 1;

  // ---- derivados (getters) --------------------------------------------------

  /**
   * `erros` é GETTER, não campo: não existe um valor guardado que alguém precise
   * lembrar de atualizar. A cada tecla o Angular relê o template, o template lê
   * `erros`, e o getter recalcula a partir do `form` atual.
   */
  get erros(): Erros {
    const emails = this.contatos.map((c) => c.email.toLowerCase());
    return validarFormulario(this.form, emails);
  }

  get valido(): boolean {
    return Object.keys(this.erros).length === 0;
  }

  get ehAluno(): boolean {
    return this.form.perfil === 'aluno';
  }

  // ---- ciclo da mensagem ----------------------------------------------------

  /** Chamado no (blur): a pessoa saiu do campo. */
  tocar(campo: Campo): void {
    this.tocados[campo] = true;
  }

  /**
   * A mensagem aparece se o campo JÁ FOI TOCADO e TEM ERRO.
   * Como `erros` é recalculado a cada tecla, a mensagem some no instante
   * em que o valor fica válido — sem ninguém "limpar" nada.
   */
  erro(campo: Campo): string | null {
    if (!this.tocados[campo]) return null;
    return this.erros[campo] ?? null;
  }

  // ---- ações ----------------------------------------------------------------

  /** Trocar o perfil apaga o que só fazia sentido no outro. */
  mudarPerfil(): void {
    if (!this.ehAluno) {
      this.form.matricula = '';
      this.form.semestre = null;
      delete this.tocados.matricula;
      delete this.tocados.semestre;
    }
  }

  salvar(): void {
    this.mensagemSucesso = '';

    // Ao tentar salvar, todos os campos contam como tocados:
    // assim aparecem as mensagens dos que a pessoa nem visitou.
    for (const campo of Object.keys(this.form) as Campo[]) {
      this.tocados[campo] = true;
    }
    if (!this.valido) return;

    const novo: Contato = {
      ...this.form,
      id: this.proximoId++,
      nome: this.form.nome.trim(),
      email: this.form.email.trim().toLowerCase(),
    };
    this.contatos = [...this.contatos, novo];
    this.mensagemSucesso = `${novo.nome} foi adicionado(a) à agenda.`;
    this.limpar(false);
  }

  limpar(apagarMensagem = true): void {
    this.form = formVazio();
    this.tocados = {};
    if (apagarMensagem) this.mensagemSucesso = '';
  }

  remover(id: number): void {
    this.contatos = this.contatos.filter((c) => c.id !== id);
  }
}
