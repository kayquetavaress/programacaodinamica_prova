import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  Evento,
  CampoEvento,
  ErrosEvento,
  TocadosEvento,
  eventoVazio
} from '../../models/evento';

import {
  validarEvento
} from '../../models/evento.validacao';

@Component({
  selector: 'app-cadastro-evento',
  imports: [FormsModule],
  templateUrl: './cadastro-evento.html',
  styleUrl: './cadastro-evento.css',
})
export class CadastroEvento {

  form: Evento = eventoVazio();

  tocados: TocadosEvento = {};

  eventos: Evento[] = [];

  private proximoId = 1;

  get erros(): ErrosEvento {
    return validarEvento(this.form);
  }

  get valido(): boolean {
    return Object.keys(this.erros).length === 0;
  }

  tocar(campo: CampoEvento): void {
    this.tocados[campo] = true;
  }

  erro(campo: CampoEvento): string | null {
    return this.tocados[campo]
      ? this.erros[campo] ?? null
      : null;
  }

  salvar(): void {

    this.tocados.titulo = true;
    this.tocados.data = true;
    this.tocados.local = true;
    this.tocados.emailResponsavel = true;
    this.tocados.vagas = true;

    if (!this.valido) {
      return;
    }

    this.eventos.push({
      ...this.form,
      id: this.proximoId++
    });

    this.limpar();
  }

  limpar(): void {

    this.form = eventoVazio();

    this.tocados = {};
  }
}
