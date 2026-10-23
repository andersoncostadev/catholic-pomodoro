---
name: add-ui-flow
description: Adiciona ou altera tela do Pomodoro Católico. Use ao criar página em presentation/flows, componente em presentation/components ou hook em main/factories/flows.
---

# Fluxo de tela

A pessoa vê `presentation`. O hook de fluxo mora em `main/factories/flows` e grava pelas factories.

## Onde mexer

- Página: `src/presentation/flows/`. Hoje só existe o timer. `src/app/App.tsx` só renderiza esse fluxo.
- Componente: `src/presentation/components/NomeDoBloco/`.
- Hook de ciclo, fundo ou canto: `src/main/factories/flows/`.
- Aparência: `src/presentation/styles/index.css`, acionada por `data-theme`, `data-accent`, `data-tone` e `data-phase` no `.app`.

## Inviolável

- A tela importa `domain` (tipos e regras puras) e `main/factories`. Não importa `data/usecases` nem `infra`.
- Sem `localStorage` e sem `new` de caso de uso no componente.
- O componente não recalcula duração, sequência nem avanço de fase.
- Texto e botão continuam legíveis nos fundos, ambientes e cores que a mudança alcança.
- Crédito de imagem ou canto permanece visível se o bloco continuar na página.
- Sem `api.ts`, cookie, JWT ou rota protegida. Não há segunda rota.
