# Spec-Driven Development — Pomodoro Católico

Esta pasta define o que fazer (planejamento, rastreabilidade e evidência) para mudanças neste repositório. A execução acontece no código em `src/`. O agente lê esta pasta antes de alterar o app. A estrutura das camadas está em [memory/estrutura.md](memory/estrutura.md).

## Divisão de responsabilidades

| Camada | Pasta | Papel |
|--------|-------|-------|
| Planejamento | `.spec/` | Objetivo, tasks, evidência, histórico de mudanças |
| Produto e técnica | `.spec/memory/` | O que o app é, como as camadas se organizam, o que já foi decidido |
| Execução da spec | `.spec/shared/` | Como rodar uma mudança e como nomear pastas, tasks e código |
| Modelos | `.spec/templates/` | Ponto de partida de cada spec |
| Guardrails | `.cursor/rules/` e `.cursor/skills/` | Direção de dependência e o passo a passo de cada camada |

## Como usar

1. Copie um template de [templates/](templates/) para `changes/NNN-descricao/spec.md`.
2. Preencha objetivo, contexto e tasks.
3. Execute as tasks na ordem. Marque os checkboxes e registre evidência como em [shared/como-executar.md](shared/como-executar.md).
4. Ao concluir, mova a pasta para `changes/archive/`.

## Workflows disponíveis

| Template | Quando usar |
|----------|-------------|
| `modelo-base.md` | Mudança que atravessa domínio, estado e interface |
| `modelo-interface.md` | Timer, fundos, cores, fases, painéis ou texto da página |
| `modelo-documentacao-servico.md` | Documentar comportamento já existente no app |

## Observações do projeto

- O app é uma página só. Não há API, banco, conta nem servidor de domínio.
- Duração, sequência e avanço de fase vivem em `src/domain/cycle`. A tela chama factory em `src/main/factories` e só apresenta o que esse estado já decidiu.
- Fundo (`src/domain/catalogs/saints.ts`) e aparência (`theme`, `accent` em `Settings`) são escolhas independentes. Uma mudança visual precisa continuar legível nas combinações que o app já oferece.
- Tudo que o usuário produz (tarefas, tempos, sequência, fundo, canto, ajustes) fica no `localStorage` deste navegador.
