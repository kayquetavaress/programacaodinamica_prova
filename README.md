# Projeto padrão — Agenda Unijorge

**Desenvolvimento Dinâmico · Engenharia de Computação · UNIJORGE**
Prof. João Guedes de Brito

Projeto de referência da disciplina. Ele traz o componente **`padrao`**, que
demonstra o desenho que vale para qualquer formulário: campos, validações,
regras cruzadas e o ciclo de exibição das mensagens.

Use-o para consultar quando travar na sua própria tela. Não copie sem entender —
a ordem de leitura dos arquivos está no fim deste documento.

---

## 1. Antes de começar

Confira o que já está instalado na sua máquina:

```bash
node -v
npm -v
```

| Ferramenta | Versão usada na disciplina | Onde conseguir |
|---|---|---|
| Node.js | 24.x (qualquer LTS recente serve) | [nodejs.org](https://nodejs.org) — baixe a versão **LTS** |
| npm | 11.x | vem junto com o Node, não se instala separado |
| Angular CLI | 20.3.x | veja abaixo |
| VS Code | — | com a extensão **Angular Language Service** |

O Angular CLI é instalado **uma vez na vida**, globalmente:

```bash
npm install -g @angular/cli
```

Confira com `ng version`.

> **`ng` não é reconhecido como comando?**
> Feche e reabra o terminal — resolve na maioria dos casos, porque a janela
> aberta ainda não enxerga o que acabou de ser instalado.

> **No Windows, o PowerShell bloqueia scripts** e derruba o `ng`.
> Use o terminal integrado do VS Code, ou libere uma vez com:
> ```powershell
> Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
> ```

---

## 2. Rodando o projeto pela primeira vez

São dois comandos. O primeiro só na primeira vez; o segundo, toda aula.

```bash
# 1. baixa as bibliotecas (demora alguns minutos)
npm install

# 2. compila e sobe o servidor local
npm start
```

Abra no navegador: **http://localhost:4200**

A tela recarrega sozinha a cada `Ctrl+S`. Deixe o comando rodando enquanto
trabalha — **aquele terminal fica ocupado**. Precisa de outro comando? Abra um
segundo terminal. Para parar o servidor: `Ctrl+C`.

### Por que `npm install` é necessário

A pasta `node_modules/` **não vem** junto com o projeto: são dezenas de milhares
de arquivos e centenas de megabytes, e por isso ela está no `.gitignore`.

O que vem é o `package.json`, com a lista do que o projeto precisa. O
`npm install` lê essa lista e reconstrói a pasta inteira. É por isso que esse
arquivo existe — e é por isso que ninguém manda projeto zipado com o
`node_modules` dentro.

---

## 3. `npm start` ou `ng serve`?

Os dois fazem **exatamente a mesma coisa** neste projeto:

```bash
npm start     # atalho definido no package.json
ng serve      # o comando do Angular CLI, direto
```

Olhe o `package.json`:

```json
"scripts": {
  "start": "ng serve",
  "build": "ng build",
  "test":  "ng test"
}
```

O `npm start` apenas executa o que está escrito ali. A diferença prática é uma
só: **`npm start` funciona mesmo sem o CLI instalado globalmente**, porque o npm
encontra a cópia local dentro do `node_modules`. Se o `ng` não estiver no seu
PATH, use `npm start` — ou chame a cópia local com `npx ng serve`.

---

## 4. Comandos do dia a dia

### Pelos atalhos do npm

São os quatro que estão escritos no `package.json`. **Funcionam mesmo sem o CLI
instalado globalmente.**

| Comando | Equivale a | O que faz |
|---|---|---|
| `npm install` | — | baixa as bibliotecas. Só na primeira vez, ou quando o `package.json` mudar |
| `npm start` | `ng serve` | compila e sobe em `localhost:4200`, recompilando a cada salvamento |
| `npm run build` | `ng build` | gera a versão final, otimizada, na pasta `dist/` |
| `npm test` | `ng test` | roda os testes automatizados |
| `npm run watch` | `ng build --watch --configuration development` | recompila para o `dist/` a cada salvamento, sem subir servidor |

> **Por que uns levam `run` e outros não?**
> O npm tem atalho embutido para um punhado de nomes — `start` e `test` estão
> entre eles, e por isso `npm start` e `npm test` funcionam direto.
> Qualquer outro script do `package.json` precisa do `run`: daí
> `npm run build` e `npm run watch`.
> Na dúvida, **`npm run <nome>` sempre funciona**, inclusive em `npm run start`.
>
> Para ver a lista do que existe no projeto, rode `npm run` sem argumento nenhum.

### Pelo Angular CLI

Aqui você tem as opções que os atalhos não passam.

| Comando | O que faz |
|---|---|
| `ng serve --port 4300` | sobe em outra porta, quando a 4200 estiver ocupada |
| `ng serve --open` | sobe **e** abre o navegador sozinho |
| `ng g c pasta/nome` | cria um componente (4 arquivos) |
| `ng g s pasta/nome` | cria um serviço |
| `ng g c pasta/nome --dry-run` | **mostra o que faria, sem criar nada** |
| `ng version` | mostra as versões instaladas |
| `ng generate --help` | lista tudo o que o CLI sabe gerar |

O `--dry-run` é o mais subestimado da lista: na dúvida sobre onde os arquivos vão
cair, rode com ele primeiro, leia a lista e só então repita sem.

Se o `ng` não estiver no seu PATH, chame a cópia local do projeto com `npx`:
`npx ng serve`, `npx ng g c pasta/nome`. O `npx` procura o executável dentro do
`node_modules` antes de procurar na máquina.

---

## 5. O que tem neste projeto

Com o servidor rodando, o menu leva a três telas:

| Rota | Componente | O que é |
|---|---|---|
| `/home` | `Home` | tela inicial |
| `/pessoa` | `Pessoa` | componente simples, da aula de componentes |
| `/padrao` | **`Padrao`** | **o formulário de referência** |

---

## 6. O componente de referência

Ele está em `src/app/padrao/` e são quatro arquivos. **Leia nesta ordem** — cada
um só faz sentido depois do anterior:

```
src/app/padrao/
├── 1º  padrao.model.ts       os TIPOS: o formato dos dados
├── 2º  padrao.validacao.ts   as REGRAS: o que é válido e o que não é
├── 3º  padrao.ts             a CLASSE: o estado e o comportamento
└── 4º  padrao.html           a TELA: rótulo, controle e mensagem
```

O que ele demonstra:

- **tipos derivados** — `Omit`, `keyof`, `Record` e `Partial` montam a lista de
  campos e o mapa de erros a partir do modelo, sem ninguém escrever nome à mão;
- **contrato único das validações** — toda função devolve `string | null`:
  texto é a mensagem de erro, `null` significa que passou;
- **regras cruzadas** — telefone obrigatório só para professor, matrícula e
  semestre só para aluno, confirmação igual à senha, e-mail não repetido;
- **mensagem na hora certa** — o erro só aparece depois que a pessoa sai do
  campo (`blur`), e some no instante em que o valor fica válido;
- **`erros` é getter, não campo** — por isso ele é recalculado a cada tecla;
- **todos os controles** — texto, data, select, e-mail, telefone, radio,
  número, senha, checkbox e textarea com contador.

A classe **não sabe validar**: ela chama quem sabe, que é o
`padrao.validacao.ts`. Essa separação é o ponto principal do exemplo.

---

## 7. Quando der errado

| O que você vê | O que houve | O que fazer |
|---|---|---|
| `'ng' não é reconhecido` | CLI ausente, ou terminal antigo | feche e reabra o terminal; senão `npm install -g @angular/cli` |
| `ng : O arquivo … não pode ser carregado` | PowerShell bloqueando scripts | use o terminal do VS Code, ou `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` |
| `Cannot find module '@angular/core'` | faltou o `npm install` | rode `npm install` |
| `Port 4200 is already in use` | já há um `ng serve` rodando | feche o outro terminal, ou `ng serve --port 4300` |
| Salvei e a tela não mudou | a compilação falhou | **olhe o terminal**: a mensagem vermelha está lá, não no navegador |
| Tela em branco e terminal limpo | erro de execução, não de compilação | abra o **Console** do navegador (F12) |
| `Cannot find module './algo'` | caminho de import errado, ou arquivo não salvo | confira a pasta e salve tudo (`Ctrl+K S`) |
| Erros estranhos, sem padrão | instalação pela metade | apague `node_modules/` e rode `npm install` de novo |

A divisão que resolve metade dos casos: **erro de compilação vai para o
terminal; erro de execução vai para o Console do navegador.** Olhe nos dois.

---

## 8. Estrutura do projeto

```
padrao/
├── node_modules/        bibliotecas baixadas — não abra, não versione
├── public/              imagens e favicon
├── src/
│   ├── index.html       a única página
│   ├── main.ts          a primeira linha que roda
│   ├── styles.css       CSS global: cores, fonte, a faixa centralizada
│   └── app/
│       ├── app.ts / app.html / app.css    o componente raiz e o menu
│       ├── app.config.ts                  o que a aplicação sabe fazer
│       ├── app.routes.ts                  o mapa de URLs
│       ├── home/
│       ├── pessoa/
│       ├── nao-encontrada/
│       └── padrao/      ← o componente de referência
├── angular.json         como o projeto é construído
├── package.json         a lista de dependências e os atalhos
└── tsconfig.json        as regras do compilador (o strict mora aqui)
```

> **Sobre o `strict` no `tsconfig.json`:** é ele que faz o TypeScript ser
> rigoroso com `null`, `undefined` e tipos implícitos, e é a origem de boa parte
> dos sublinhados vermelhos. **Não desligue.** Os erros não somem quando você o
> desliga — eles só deixam de ser avisados, e voltam em tempo de execução.
