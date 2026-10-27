---
name: dev-orchestrator
description: Orquestra mudanças do Pomodoro Católico na ordem domain, data/infra, factories, presentation, documentação e verificação. Use ao implementar uma spec em .spec/changes ou quando a tarefa cruza catálogo, localStorage e a página.
---

# Orquestrador — Pomodoro Católico

A página está em `src/`. A fonte da mudança é `.spec/`. Não crie API, BFF, conta nem servidor.

## Antes de codar

1. Leia a spec em `.spec/changes/` e as fichas que ela cita em `memory/` e `shared/`.
2. Siga a ordem das tasks da spec. Se a spec não ordenar, use a ordem abaixo.
3. Para o detalhe de uma camada, use a skill correspondente: `domain-business-rules`, `data-repository`, `add-ui-flow`, `unit-testing`.

## Ordem

```
1. Domain          modelos, domain/cycle, catálogos, contratos
2. Data e infra    IStorage, casos de uso, adaptador, sino, notificação
3. Factories       make* e hooks em main/factories/flows
4. Presentation    flows, components, styles, casca em app/
5. Documentação    .spec/ e .cursor/rules
6. Verificação     npm run build e http://localhost:5174/
```

Não desenhe a interface de um catálogo ou de um campo que ainda não existe.

## Estado

- Chaves já existentes: `pomodoro-catolico-v1`, `pomodoro-catolico-fundo` e `pomodoro-catolico-music`.
- Não crie chave nova no `localStorage`, salvo a spec pedir.
- A liturgia e o santo do dia não têm chave. Os pedidos de rede são os dois `GET` em `infra/http`, e os textos não são gravados.
- JSON antigo sem um campo novo abre com o valor padrão. Não apague ciclo, tarefas, sequência, ajustes, fundo nem canto.
- Duração, sequência e avanço de fase ficam em `domain/cycle`. O componente não recalcula isso.
- A tela chama factory. Só a factory instancia adaptador e caso de uso.

## Interface

- Aparência em `presentation/styles/index.css`, acionada no `.app` por `data-theme`, `data-accent`, `data-tone` e `data-phase`.
- Texto e botão precisam continuar legíveis nos fundos, ambientes e cores que a spec alcança.
- Crédito de imagem ou canto permanece visível se o bloco continuar na página.

## Encerrar

`npm run build` precisa passar. Confira no navegador o fluxo da spec, inclusive estado antigo e leitura do timer quando a mudança mexer em fundo, ambiente ou cor.

Marque os checkboxes e registre a evidência na spec, no formato de `.spec/shared/como-executar.md`.
