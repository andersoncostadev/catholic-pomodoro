---
name: unit-testing
description: Gate de verificação do Pomodoro Católico. Use ao fechar uma mudança com npm run build e o fluxo no navegador em http://localhost:5174/.
---

# Verificação

Não há suíte automatizada. O gate desta página é o build e o navegador.

## O que rodar

1. `npm run build` precisa passar.
2. Abra `http://localhost:5174/` e percorra o fluxo que a spec alterou: fase, painel, fundo, ambiente ou canto.
3. Se a mudança mexe em sessão, tarefas, ajustes, fundo ou canto, recarregue com estado já gravado e confira que as chaves `pomodoro-catolico-v1`, `pomodoro-catolico-fundo` e `pomodoro-catolico-music` continuam legíveis.
4. Confira texto e botão nos fundos, ambientes e cores que a mudança alcança.

Registre o comando e o que foi visto na tela, no formato de `.spec/shared/como-executar.md`.
