# Estrutura do Projeto

## Visão geral

```text
src/
  main.tsx
  app/
    App.tsx
  domain/
    models/          cycle, backdrop, chant, content
    cycle/           duração, sequência, sanitização, avanço de fase
    catalogs/        saints.ts, chants.ts, content.ts
    constants/       storage-keys.ts
    usecases/        contratos ILoad* e ISave*
  data/
    protocols/cache/ IStorage
    usecases/        LoadBundle, SaveBundle, fundo e canto
  infra/
    cache/           LocalStorageAdapter
    browser/         sino e notificação
  main/factories/
    cache/           makeStorage
    usecases/        makeLoad* e makeSave*
    browser/         sino e notificação para o fluxo
    flows/           usePomodoro, useBackdrop, useChant
  presentation/
    flows/timer/     página
    components/      TimerHero, Story, Panels, MusicMenu
    styles/index.css
  utils/             função pura que não é regra do produto

public/
  favicon.svg
  saints/            imagens do catálogo de fundos
  chant/             áudios do catálogo de cantos

.spec/
  README.md
  memory/
  templates/
  shared/
  changes/
```

## Responsabilidade de cada camada

- `domain`: modelos, catálogos e regra pura. Sem React, sem `localStorage`, sem importar `data`, `infra`, `main` nem `presentation`.
- `data`: caso de uso. Fala com `IStorage`. Não chama `localStorage` e não importa `infra`.
- `infra`: `LocalStorageAdapter`, sino e notificação. Implementa o protocolo; não decide o ciclo.
- `main`: único lugar que instancia adaptador e caso de uso. Os hooks de fluxo leem e gravam pelas factories. Duração, sequência e avanço continuam em `domain/cycle`.
- `presentation`: o que a pessoa vê. Chama factory. Não instancia caso de uso, não lê `localStorage` e não importa `infra` nem `data/usecases`.
- `app`: casca. Renderiza o fluxo do timer. Não há segunda rota.
- `utils`: função pura compartilhada que não seja regra do ciclo, do catálogo nem de aparência.

## Peças da página

- `presentation/flows/timer`: página, barra, palco e painel aberto. O `.app` marca `data-theme`, `data-accent`, `data-tone` e `data-phase`.
- `TimerHero`: relógio, fase, guia de oração e citação.
- `Story`: método, sentido, perguntas e convite final.
- `Panels`: tarefas, sequência e Temas (cenas, fundo, cor, tempos, pausa).
- `MusicMenu`: lista de cantos. A reprodução fica em `useChant`.
- `presentation/styles/index.css`: temas, acentos, véu da imagem e layout.

## Regras de organização

- A regra do ciclo fica em `domain/cycle`. O componente não recalcula duração, sequência nem avanço de fase.
- Texto de oração, mistério e citação fica em `domain/catalogs/content.ts`.
- Fundo e canto são catálogos, com crédito e licença junto de cada item.
- Aparência fica no CSS, acionada pelos `data-*` do `.app`.
- Não criar API, banco, conta nem servidor.
