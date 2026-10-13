import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-nao-encontrada',
  imports: [RouterLink],
  template: `
    <section class="nf">
      <h1>404</h1>
      <p>Essa página não existe.</p>
      <a routerLink="/home">Voltar para o início</a>
    </section>
  `,
  styles: `.nf { text-align: center; padding: 3rem 0; } h1 { font-size: 4rem; margin: 0; color: var(--primaria); }`,
})
export class NaoEncontrada {}
