# Contexto Técnico Global

## Stack base

- UI: React 19
- Build e dev server: Vite 8
- Linguagem: TypeScript
- Estilo: CSS em `src/presentation/styles/index.css`, sem biblioteca de componentes
- Persistência: `localStorage`
- Testes automatizados: ainda não há suíte. O gate é `npm run build` e o navegador.

## Fluxo principal

```text
main.tsx
  -> app/App.tsx
       -> presentation/flows/timer
            -> main/factories/flows (usePomodoro, useBackdrop, useChant, useLiturgy, useSaintDay)
                 -> main/factories/usecases (makeLoad*, makeSave*)
                      -> data/usecases
                           -> data/protocols/cache (IStorage)
                                -> infra/cache/local-storage-adapter
                           -> data/protocols/http (corpo da liturgia ou do santo, ou null)
                                -> infra/http (GET da liturgia e GET do santo)
                 -> domain/cycle, domain/liturgy, domain/saint-day e domain/catalogs
                 -> infra/browser (sino e notificação), só dentro da factory
```

A tela não instancia storage nem caso de uso. A factory é o único lugar que faz isso.

## Aliases

| Alias | Pasta |
|-------|--------|
| `@domain` | `src/domain` |
| `@data` | `src/data` |
| `@infra` | `src/infra` |
| `@main` | `src/main` |
| `@app` | `src/app` |
| `@components` | `src/presentation/components` |
| `@flows` | `src/presentation/flows` |
| `@styles` | `src/presentation/styles` |

Import novo usa o alias, sem sufixo `.ts`.

## Decisões já tomadas

- Uma página. A barra abre painéis; não há rotas. Não há Next, App Router, Axios, MSAL, cookie nem login. A página não hospeda API. Há dois `GET`: `https://liturgia.cloudhub.ia.br/v1/liturgia`, com `dia`, `mes` e `ano`, e `{VITE_SAINT_API_URL}/santo-do-dia/{mm}-{dd}`, na API ASP.NET Core do calendário dos santos, que vive fora deste repositório. Sem `VITE_SAINT_API_URL`, o adaptador do santo não faz pedido. Nenhum dos textos entra no `localStorage`.
- O ciclo padrão é 1 · 25 · 5, com pausa longa de 15 minutos a cada quatro focos.
- A pausa pode ser dezena, oração breve ou presença.
- Ambientes: `capela` (escuro quente), `alvorada` (claro) e `noite` (azul escuro).
- Cores: `gold`, `rose`, `blue`, `coral`, `menta`, `lima`, `brisa`, `manto`. Na Alvorada, as oito escurecem no anel e no botão para continuar legíveis no pergaminho. Sobre uma faixa escura (tom `clara`), o hero recupera o tom claro da cor.
- O fundo padrão é a Última Ceia (`ceia`). Há treze imagens e a opção nenhum fundo. Cada imagem tem `tone` (`escura`, `clara`, `ceu`) e uma cor sugerida. Seis cenas em `scenes` gravam fundo, ambiente e cor juntos. O pacote `youthScenes` acrescenta Vocação, Votos e Adoração, com Lima, Manto e Brisa. Ids antigos `pieta`, `caminho`, `jornada` e `peregrinos` abrem como Assis, Vocação, Votos e Adoração. Sem chave nova.
- O véu segue o tom. A Noite troca o véu marrom por véu azul. A Alvorada não clareia a pintura: sobre tom `escura` ou `ceu`, o texto do timer vai para um cartão de pergaminho. A pintura cobre só o timer; o texto abaixo usa a cor sólida do ambiente.
- Toda imagem usa `object-fit: cover` no palco e na miniatura 16/9.
- O dev server sobe em `http://localhost:5174/` com porta fixa.
- `.cursor/rules/`, `.cursor/skills/`, `.cursor/AGENTS.md` e `.cursor/docs/index.md` descrevem estas camadas.

## Restrições

- Não introduzir backend, conta, login nem gravação fora do `localStorage`. A página não hospeda API. As saídas de rede são o `GET` da liturgia e o `GET` do santo do dia, e nenhum dos textos é gravado.
- Não quebrar a leitura das chaves `pomodoro-catolico-v1`, `pomodoro-catolico-fundo` e `pomodoro-catolico-music`. Campo novo entra com valor padrão quando o JSON antigo não o tem.
- Não mudar duração, sequência ou avanço de fase dentro de um componente.
- Não aplicar um véu ou uma cor que deixe texto ou botão ilegível num fundo ou ambiente que o app já oferece.
- Não remover crédito e licença de imagem ou canto.
- `domain` não importa React, storage, `data`, `infra`, `main` nem `presentation`.
- `presentation` não importa `infra` nem `data/usecases`.

## Configuração

| Uso | Onde |
|-----|------|
| Scripts | `package.json` (`dev`, `build`, `preview`) |
| Porta do dev server | `vite.config.ts` (`5174`, `strictPort`) |
| Aliases | `tsconfig.app.json` e `vite.config.ts` |
| URL da API do santo | `VITE_SAINT_API_URL`, no ambiente do build ou em `.env.development.local` |
| Tipos | `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json` |

## Comandos de gate

```bash
npm run build
npm run dev
```

`npm run build` gera o tipo e o bundle. `npm run dev` sobe a página em `http://localhost:5174/`. Mudança de tela pede conferência no navegador do fluxo alterado, nos ambientes e fundos que a mudança toca.

## Referência de execução

O modo de conduzir uma mudança está em [shared/como-executar.md](../shared/como-executar.md).
