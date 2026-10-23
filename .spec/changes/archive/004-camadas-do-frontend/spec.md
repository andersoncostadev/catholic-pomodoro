# 004-camadas-do-frontend

## Objetivo

Reorganizar o Pomodoro Católico nas mesmas camadas do frontend do Passe Livre, com uma responsabilidade por pasta, e alinhar `.spec/`, `.cursor/rules/`, `.cursor/skills/` e `.cursor/docs/` a essa estrutura. Quem usa o timer continua no mesmo ciclo, nos mesmos fundos e com o mesmo estado gravado.

## Contexto Técnico

A referência é `Operations.Crew.FreePass.Web` (`docs/architecture.md` e o README desse repositório). Lá a tela não instancia HTTP, não lê storage e não conhece o Axios. Ela chama uma factory. A factory monta o caso de uso. O caso de uso depende de um protocolo. A infra implementa o protocolo.

Este app não tem BFF, conta, cookie nem servidor. A persistência continua no `localStorage` do navegador. A stack continua React 19, Vite 8, TypeScript e o CSS de `index.css`. Esta spec não troca o framework.

O `tsconfig.app.json` liga `erasableSyntaxOnly`. Classe pode existir. Propriedade declarada no parâmetro do construtor, `enum` e `namespace` não. O Passe Livre usa `constructor(private readonly ...)`. Aqui o construtor atribui o campo no corpo.

Hoje `.cursor/rules/`, `.cursor/AGENTS.md`, `.cursor/docs/index.md` e as skills `add-api-endpoint`, `add-bff-endpoint`, `add-ui-flow`, `data-repository`, `domain-business-rules` e `unit-testing` descrevem inscrições de eventos (API, BFF, EF, cookie). Isso contradiz `.spec/`. Esta spec substitui esses textos. Não cria API, BFF, conta nem servidor.

## Referências de Projeto

- [Produto](../../../memory/produto.md)
- [Contexto técnico global](../../../memory/contexto-tecnico.md)
- [Estrutura do projeto](../../../memory/estrutura.md)

## Referências Compartilhadas

- [Como executar](../../../shared/como-executar.md)
- [Regras de nomenclatura](../../../shared/regras-de-nomenclatura.md)
- Modelo de origem: [modelo-base](../../../templates/modelo-base.md) e [modelo-documentacao-servico](../../../templates/modelo-documentacao-servico.md)

## O que o Passe Livre faz

| Pasta | Responsabilidade lá | Quem pode importar |
|-------|---------------------|--------------------|
| `src/domain` | Modelos, constantes e interfaces de caso de uso. Sem React, sem HTTP, sem storage. | data, main, presentation (só tipos e regras puras) |
| `src/data/protocols` | Contratos de acesso externo (`IHttpClient`, `ISetStorage`). | data, infra |
| `src/data/usecases` | Classes que implementam o caso de uso e falam com o protocolo. | main |
| `src/infra` | Adaptadores concretos (Axios, `LocalStorageAdapter`, erros de HTTP). | main |
| `src/main/factories` | Único lugar que dá `new` no adaptador e no caso de uso (`makeDeleteBooking`). | presentation, app |
| `src/presentation` | Componentes, fluxos, hooks de tela, estilos, contextos. A página chama factory, não classe de data. | app |
| `src/app` | Rotas do Next. A rota renderiza a página do fluxo. | — |
| `src/utils` | Função pura compartilhada (data, máscara). Sem regra de ciclo. | qualquer camada, sem puxar UI |
| `src/middlewares` | Intercepta rota privada. Existe por causa do login. | — |

O fluxo de uma ação no Passe Livre:

```text
app/(private)/flights-list/page
  -> presentation/flows/.../layout
       -> main/factories/flows/.../usePostFarol
            -> main/factories/usecases (makeX)
                 -> data/usecases (classe que implementa IUseCase)
                      -> data/protocols (IHttpClient)
                           -> infra/http (AxiosHttpClient)
```

Aliases em `tsconfig.json`: `@domain`, `@data`, `@infra`, `@main`, `@components`, `@hooks`, `@flows`, `@styles`, `@constants`, `@utils`.

Nomes: interface de caso de uso em kebab-case (`delete-booking.ts`, `IDeleteBooking`, método `handle`). Implementação em PascalCase (`DeleteBooking.ts`). Factory em kebab-case (`makeDeleteBooking`).

## O que entra neste app

Mesmos nomes de camada e a mesma direção de dependência. O protocolo de fora é o storage do navegador, no lugar do HTTP.

```text
presentation/flows/timer
  -> main/factories/flows (usePomodoro, useBackdrop, useChant)
       -> main/factories/usecases (makeLoadBundle, makeSaveBundle, ...)
            -> data/usecases
                 -> data/protocols/cache (IStorage)
                      -> infra/cache/local-storage-adapter
       -> domain (regras puras do ciclo, catálogos)
       -> infra/browser (sino e notificação), só dentro da factory
```

`domain` não importa `data`, `infra`, `main`, `presentation` nem `react`.

`data` importa `domain` e `data/protocols`. Não importa `infra` nem React.

`infra` importa só o protocolo que implementa.

`presentation` importa `domain` (tipos e regras puras) e `main/factories`. Não importa `data/usecases` nem `infra`.

`src/utils` fica para função sem regra de produto. Data de calendário do ciclo (`todayKey`, `yesterdayKey`) permanece no domínio, porque a sequência depende dela.

## O que não entra

Copiar o Passe Livre inteiro mudaria o produto. Estas peças ficam de fora:

- Next.js, App Router, `layout.tsx`, server action, `mockApi`.
- Axios, `IHttpClient`, BFF, variáveis `NEXT_PUBLIC_*`, Docker, Kubernetes.
- MSAL, cookie, JWT, `middlewares/withAuth`, rota pública e privada.
- styled-components e a biblioteca `@azul/react-web-components`.
- Classes de erro HTTP (`bad-gateway`, `unauthorized`, e as outras de `infra/error`).
- Suíte Jest ou xUnit. A verificação continua `npm run build` e o navegador em `http://localhost:5174/`.

## Camadas deste app

### domain

Contrato e regra pura.

- `domain/models/cycle/` — `Phase`, `PauseKind`, `Accent`, `ThemeName`, `Settings`, `Task`, `Stats`, `Session`, `Bundle`, `FocusRecord`, `defaultSettings`.
- `domain/cycle/` — `durationSec`, `createSession`, `phaseLabel`, `formatClock`, `formatSpent`, `remainingOf`, `normalizeStats`, `sanitizeBundle`, `recordFocus`, `nextPhaseAfter`, `noticeFor`, `todayKey`, `yesterdayKey`, `createDefaultStats`.
- `domain/models/backdrop/` — `Tone`, `Saint`, `Scene`.
- `domain/models/chant/` — `Chant` e o recorte gravado (`trackId`, `volume`).
- `domain/models/content/` — `MysterySet`.
- `domain/catalogs/saints.ts` — `saints`, `scenes`, `youthScenes`. Crédito e licença continuam no item.
- `domain/catalogs/chants.ts` — lista de cantos.
- `domain/catalogs/content.ts` — jaculatórias, orações, mistérios, citações, perguntas, `mysterySetFor`.
- `domain/constants/storage-keys.ts` — `pomodoro-catolico-v1`, `pomodoro-catolico-fundo`, `pomodoro-catolico-music`. Nenhuma chave nova.
- `domain/usecases/cycle/load-bundle.ts` — `ILoadBundle`, `handle(): Bundle`.
- `domain/usecases/cycle/save-bundle.ts` — `ISaveBundle`, `handle(bundle: Bundle): void`.
- `domain/usecases/backdrop/load-backdrop.ts` — `ILoadBackdrop`.
- `domain/usecases/backdrop/save-backdrop.ts` — `ISaveBackdrop`.
- `domain/usecases/chant/load-chant.ts` — `ILoadChant`.
- `domain/usecases/chant/save-chant.ts` — `ISaveChant`.

A leitura de um id antigo (`pieta` → `assis`, `caminho` → `vocacao`, `jornada` → `votos`, `peregrinos` → `adoracao`) fica no caso de uso de backdrop, usando o catálogo. Um acento desconhecido continua caindo em dourado dentro de `sanitizeBundle`.

### data

Implementa o caso de uso. Não chama `localStorage` direto: usa `IStorage`.

- `data/protocols/cache/storage.ts` — `get(key)`, `set(key, value)`. Os dois engolem falha de storage e devolvem vazio ou seguem em memória, como `loadBundle` e `saveBundle` fazem hoje.
- `data/usecases/cycle/LoadBundle.ts` — lê a chave do ciclo, faz parse e chama `sanitizeBundle`. JSON inválido ou ausente abre o padrão.
- `data/usecases/cycle/SaveBundle.ts` — grava o bundle serializado.
- `data/usecases/backdrop/LoadBackdrop.ts` e `SaveBackdrop.ts` — chave do fundo, id padrão `ceia`, id nulo como “sem imagem”, remapeamento dos ids antigos.
- `data/usecases/chant/LoadChant.ts` e `SaveChant.ts` — faixa existente no catálogo ou `null`, volume entre 0 e 1, padrão `0.6`.

### infra

Adaptador concreto.

- `infra/cache/local-storage-adapter.ts` — `LocalStorageAdapter` implementa `IStorage` com `localStorage`.
- `infra/browser/audio-bell.ts` — `unlockAudio` e `playBell`, hoje no fim de `pomodoro.ts`.
- `infra/browser/notifications.ts` — `askNotification` e `notifyIfHidden`.

O conjunto em memória de prazos já tratados (`alreadyHandled`, `markHandled`) não é persistência. Permanece ao lado do hook do ciclo.

### main

Composição. É o único lugar que instancia adaptador e caso de uso.

- `main/factories/cache/storage-factory.ts` — `makeStorage()`.
- `main/factories/usecases/cycle/load-bundle.ts` — `makeLoadBundle()`.
- `main/factories/usecases/cycle/save-bundle.ts` — `makeSaveBundle()`.
- `main/factories/usecases/backdrop/` — `makeLoadBackdrop`, `makeSaveBackdrop`.
- `main/factories/usecases/chant/` — `makeLoadChant`, `makeSaveChant`.
- `main/factories/browser/audio-bell.ts` e `notifications.ts` — entregam as funções de `infra/browser`.
- `main/factories/flows/usePomodoro.ts` — o hook atual. Estado de React, intervalo, avançar fase, gravar. Duração, sequência e avanço continuam nas funções de `domain/cycle`. O hook não recalcula isso.
- `main/factories/flows/useBackdrop.ts` — escolha de fundo. Grava pela factory de backdrop.
- `main/factories/flows/useChant.ts` — reprodução com `HTMLAudioElement`. Grava faixa e volume pela factory de canto. O elemento de áudio fica no hook, porque é detalhe de reprodução da página.

### presentation

O que a pessoa vê. Sem `localStorage`, sem `new` de caso de uso.

- `presentation/flows/timer/index.tsx` — a página, no papel do `App.tsx` atual: painel aberto, barra, palco, `data-theme`, `data-accent`, `data-tone`, `data-phase`.
- `presentation/components/TimerHero/`
- `presentation/components/Story/`
- `presentation/components/Panels/`
- `presentation/components/MusicMenu/`
- `presentation/styles/index.css` — o CSS atual, inteiro. Tema, acento, tom, véu e layout continuam acionados pelos `data-*` do `.app`. Não introduzir styled-components.

### app e entrada

O Vite não tem App Router. `src/main.tsx` continua sendo o bootstrap: monta `app/App.tsx`. `app/App.tsx` só renderiza o fluxo do timer. Não há segunda rota.

### utils

Pasta `src/utils/` criada vazia de regra, com um `README` de uma frase: função pura compartilhada que não seja regra do ciclo, do catálogo nem de aparência. Não mover `todayKey` para cá.

## Mapa do código atual

| Hoje | Destino |
|------|---------|
| Tipos e `defaultSettings` de `src/pomodoro.ts` | `domain/models/cycle/` |
| Funções puras de `src/pomodoro.ts` | `domain/cycle/` |
| `loadBundle` / `saveBundle` | `data/usecases/cycle/` + factory |
| Sino e notificação de `src/pomodoro.ts` | `infra/browser/` |
| `src/saints.ts` | modelos em `domain/models/backdrop/`, catálogo em `domain/catalogs/saints.ts` |
| `src/chants.ts` | `domain/models/chant/` + `domain/catalogs/chants.ts` |
| `src/content.ts` | `domain/models/content/` + `domain/catalogs/content.ts` |
| `src/usePomodoro.ts` | `main/factories/flows/usePomodoro.ts` |
| `src/useBackdrop.ts` | factory do fluxo + casos de uso de backdrop |
| `src/useChant.ts` | `main/factories/flows/useChant.ts` |
| `src/App.tsx` | `presentation/flows/timer/` e casca em `app/App.tsx` |
| `src/components/*` | `presentation/components/*` |
| `src/index.css` | `presentation/styles/index.css` |
| `src/main.tsx` | permanece, importa o CSS novo e `app/App.tsx` |

`public/saints/` e `public/chant/` permanecem. Porta `5174` e `strictPort` permanecem.

## Aliases

Em `tsconfig.app.json` e em `vite.config.ts`:

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

Import novo usa o alias, sem sufixo `.ts`. Não deixar arquivo solto em `src/` além de `main.tsx` e `vite-env.d.ts`.

## Observações Locais

A mudança é estrutural. O comportamento observável permanece:

- Ciclo inicial 1 · 25 · 5, pausa longa de 15 a cada quatro focos.
- Pausa dezena, oração breve ou presença.
- Ambientes `capela`, `alvorada`, `noite`.
- Cores `gold`, `rose`, `blue`, `coral`, `menta`, `lima`, `brisa`, `manto`, com o escurecimento na Alvorada e a recuperação do tom claro sobre fundo `clara`.
- Fundo padrão `ceia`. Cenas e o pacote Juventude (Vocação, Votos, Adoração) gravam o que já gravam hoje.
- Véu por tom. Crédito de imagem e de canto visível.
- Chaves `pomodoro-catolico-v1`, `pomodoro-catolico-fundo` e `pomodoro-catolico-music`. JSON antigo sem campo novo abre no padrão. Não apagar ciclo, tarefas, sequência, ajustes, fundo nem canto.

## Tasks

### Tasks - Domain

- [x] Criar `domain/models`, `domain/cycle`, `domain/catalogs`, `domain/constants` e `domain/usecases` com o contrato desta spec.
- [x] Mover as funções puras de `pomodoro.ts` sem alterar duração, sequência, `sanitizeBundle` nem o texto de `noticeFor`.
- [x] Mover catálogos de `saints.ts`, `chants.ts` e `content.ts` sem alterar id, crédito, licença, tom, cor sugerida nem texto de oração.

### Tasks - Data e infra

- [x] Criar `IStorage` e `LocalStorageAdapter`.
- [x] Implementar carga e gravação do ciclo, do fundo e do canto, inclusive o remapeamento `pieta`, `caminho`, `jornada` e `peregrinos`.
- [x] Mover sino e notificação para `infra/browser` sem mudar frequência, duração do sino nem o título `Pomodoro Católico`.

### Tasks - Composicao

- [x] Criar factories de storage, dos seis casos de uso e do browser.
- [x] Mover `usePomodoro`, `useBackdrop` e `useChant` para `main/factories/flows`, passando a gravar e ler só pelas factories.
- [x] O hook do ciclo continua sem recalcular duração, sequência ou avanço de fase.

### Tasks - Interface

- [x] Mover componentes para `presentation/components` e a página para `presentation/flows/timer`.
- [x] Mover `index.css` para `presentation/styles/index.css`. O `.app` continua com `data-theme`, `data-accent`, `data-tone` e `data-phase`.
- [x] Deixar `app/App.tsx` como casca do fluxo e `src/main.tsx` como entrada do Vite.
- [x] Registrar os aliases no `tsconfig.app.json` e no `vite.config.ts`.
- [x] Apagar os arquivos antigos da raiz de `src/` que esta spec mudou de lugar.

### Tasks - Documentacao

- [x] Reescrever `.spec/memory/estrutura.md` com a árvore nova e a responsabilidade de cada camada.
- [x] Atualizar `.spec/memory/contexto-tecnico.md`: fluxo pelas camadas, aliases, e a decisão de não trazer Next, HTTP nem login. Manter stack, chaves, ciclo, ambientes, cores, cenas e véu.
- [x] Atualizar `.spec/README.md` para apontar as camadas como fonte da estrutura, no lugar da frase que manda ignorar `.cursor/`.
- [x] Atualizar `.spec/templates/modelo-base.md`, `modelo-interface.md` e `modelo-documentacao-servico.md` com os caminhos novos (`domain/cycle`, factories, `presentation/`).
- [x] Atualizar `.spec/shared/regras-de-nomenclatura.md` com kebab-case na interface, PascalCase na implementação e `make` na factory.
- [x] Atualizar `.spec/shared/como-executar.md` com a ordem domain, data/infra, factories, presentation, documentação.
- [x] Criar `src/utils/README.md` com a frase de responsabilidade desta spec.

### Tasks - Rules

Substituir o texto de inscrições. Os globs passam a apontar para `src/` deste repositório.

- [x] Reescrever `.cursor/rules/01-monorepo-overview.mdc` como visão das camadas, da direção de dependência e da proibição de API, BFF, conta e servidor. `alwaysApply` permanece.
- [x] Substituir `.cursor/rules/02-api.mdc` por `.cursor/rules/02-domain.mdc`. Domínio puro: sem React, sem `localStorage`, sem import de `presentation`. Apagar `02-api.mdc`.
- [x] Substituir `.cursor/rules/03-bff.mdc` por `.cursor/rules/03-data-infra.mdc`. Caso de uso só via protocolo. `localStorage`, sino e notificação só em `infra`. Apagar `03-bff.mdc`.
- [x] Reescrever `.cursor/rules/04-frontend.mdc` como regra de `presentation`: a tela chama factory, o CSS segue `data-theme`, `data-accent`, `data-tone` e `data-phase`, o componente não recalcula o ciclo. Glob em `src/presentation/**/*.{ts,tsx}` e `src/app/**/*.{ts,tsx}`.
- [x] Reescrever `.cursor/AGENTS.md` e `.cursor/docs/index.md` com a tabela de camadas e as skills novas. Sem porta 5004, 5080 ou 5173.

### Tasks - Skills

- [x] Reescrever `.cursor/skills/dev-orchestrator/SKILL.md`. Ordem: domain, data/infra, factories, presentation, documentação e rules, verificação. Tirar a instrução de ignorar as outras skills e a menção a inscrições.
- [x] Reescrever `.cursor/skills/domain-business-rules/SKILL.md` para regra de ciclo, sequência, sanitização e catálogo em `domain/`. Sem `EventosDomainService`.
- [x] Reescrever `.cursor/skills/data-repository/SKILL.md` para `IStorage`, caso de uso em `data/usecases` e adaptador em `infra/cache`. Sem EF.
- [x] Reescrever `.cursor/skills/add-ui-flow/SKILL.md` para página em `presentation/flows`, componente em `presentation/components` e hook de fluxo em `main/factories/flows`. Sem `api.ts`, cookie ou `ProtectedRoute`.
- [x] Reescrever `.cursor/skills/unit-testing/SKILL.md` para o gate atual: `npm run build` e o fluxo no navegador. Sem xUnit, Moq ou `Tests.Unit`.
- [x] Apagar `.cursor/skills/add-api-endpoint/` e `.cursor/skills/add-bff-endpoint/`. Não deixar skill que peça endpoint HTTP.

### Tasks - Verificacao

- [x] `npm run build`.
- [x] Em `http://localhost:5174/`, começar pela oração, ler o relógio na oração e no foco, abrir tarefas, sequência e Temas, e ouvir um canto.
- [x] Abrir uma cena já existente e uma cena da Juventude. Confirmar ambiente, cor, véu e crédito.
- [x] Na Alvorada, ler anel e botão sobre o pergaminho e sobre um fundo de tom `clara`.
- [x] Recarregar com estado antigo: ciclo, tarefas, sequência, ajustes, fundo e canto permanecem. As três chaves continuam as mesmas.
- [x] Confirmar que `src/` não importa Axios, Next, MSAL nem `styled-components`, e que `presentation` não importa `infra` nem `data/usecases`.

## Resultado Esperado

- O código fica dividido em `domain`, `data`, `infra`, `main`, `presentation` e `app`, com a direção de dependência desta spec.
- A tela chama factory. A factory é o único lugar que instancia storage e caso de uso.
- Duração, sequência e avanço de fase continuam fora do componente.
- O timer, os painéis, os fundos, as cores, os cantos e o estado gravado se comportam como antes.
- `.spec/`, `.cursor/rules/`, `.cursor/skills/`, `.cursor/AGENTS.md` e `.cursor/docs/index.md` descrevem este app e estas camadas.
- Nenhuma skill pede API, BFF, EF, cookie ou JWT.

## Evidência

`npm run build` passou: `tsc -b && vite build`, 59 módulos, `dist/assets/index-pzbxRb-E.css` 23,75 kB e `dist/assets/index-Drepv3j_.js` 268,65 kB.

Em `http://localhost:5174/`:

- A página abriu na oração, relógio `01:00`, fase `offering`, Capela, dourado, tom `escura`, crédito “Última Ceia, Leonardo da Vinci. Domínio público · fonte”. Começar a oração mudou o título para `01:00 · Oração`. No foco, o relógio leu `25:00` e o timer “25:00 restantes na fase Foco”.
- Tarefas: intenção “Estudar as camadas” e tarefa “Ler o ciclo”, marcada como oferta deste foco. Sequência: “0 dias seguidos”, orações 0, focos 0, pausas 0. Temas abriu cenas, Juventude, fundos e as oito cores.
- Canto: Kyrie eleison ficou “Tocando”. A chave `pomodoro-catolico-music` gravou `{"trackId":"kyrie","volume":0.6}`. O crédito da faixa continua na lista de licenças.
- Santuário: Capela, azul, tom `clara`, véu radial escuro, crédito “Fátima, Tomasz Przechlewski. CC BY 2.0 · fonte”. Relógio `rgb(247, 241, 231)` sobre o véu. Botão `rgb(185, 201, 238)` com tinta `rgb(23, 32, 51)`.
- Alvorada sem imagem: tema `alvorada`, dourado, sem crédito de pintura. Relógio `rgb(44, 36, 28)` no pergaminho. Anel `rgb(154, 112, 64)`. Botão `rgb(125, 90, 46)` com tinta `rgb(255, 250, 243)`.
- Vocação: Alvorada, Lima, tom `clara`, imagem `/saints/vocacao.jpg`, véu radial, crédito “Vocação, Guercino. CC0 · fonte”. Sobre o véu o relógio voltou a `rgb(247, 241, 231)` e o anel a `rgb(198, 232, 87)`. Botão `rgb(198, 232, 87)` com tinta `rgb(36, 48, 6)`.
- Recarga com o estado da sessão: foco `25:00`, tarefa “Ler o ciclo”, intenção, Lima, Alvorada, Vocação e Kyrie permaneceram. As chaves continuaram `pomodoro-catolico-v1`, `pomodoro-catolico-fundo` e `pomodoro-catolico-music`.
- JSON antigo sem `accent` nem `theme`, com `pauseKind: brief`, sequência 4, tarefa “Oferecer o estudo” e fundo `pieta`: abriu na oração `01:00`, Capela, dourado, pausa breve, 4 dias, tarefa e intenção “Estado antigo”. O fundo gravado passou a `assis`, com crédito “Assis, Peter K Burian. CC BY-SA 4.0 · fonte”. O canto `salve` em volume `0.4` permaneceu.

`src/presentation` não importa `infra` nem `data`. `localStorage` aparece só em `infra/cache/local-storage-adapter.ts`. Não há import de Axios, Next, MSAL nem styled-components. A raiz de `src/` ficou só com `main.tsx`.

Depois da verificação, o navegador voltou à oração, 0 dias, Ceia, Capela e dourado.

## Encerramento

Esta spec termina apenas quando todos os itens estiverem marcados e com evidência registrada, no formato definido em [Como executar](../../../shared/como-executar.md).
