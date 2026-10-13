import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Pessoa } from './pessoa/pessoa';
import { Padrao } from './padrao/padrao';
import { NaoEncontrada } from './nao-encontrada/nao-encontrada';
import { CadastroEvento } from './pages/cadastro-evento/cadastro-evento';


export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: Home, title: 'Início' },
  { path: 'pessoa', component: Pessoa, title: 'Pessoa' },
  { path: 'padrao', component: Padrao, title: 'Formulário padrão' },

  {
    path: 'eventos/novo',
    component: CadastroEvento,
    title: 'Novo Evento'
  },

  {
    path: '**',
    component: NaoEncontrada,
    title: 'Página não encontrada'
  }
];