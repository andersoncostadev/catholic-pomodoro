# Cursor index — Pomodoro Católico

Fluxo: **presentation → factory → caso de uso → protocolo → adaptador**. A página não hospeda API. As saídas de rede são o `GET` da liturgia e o `GET` do santo do dia.

| Camada | Pasta | Guardrail |
|---|---|---|
| domain | `src/domain` | `.cursor/rules/02-domain.mdc` |
| data e infra | `src/data`, `src/infra` | `.cursor/rules/03-data-infra.mdc` |
| presentation e app | `src/presentation`, `src/app` | `.cursor/rules/04-frontend.mdc` |

A visão das camadas está em `.cursor/rules/01-monorepo-overview.mdc`. A página sobe em `http://localhost:5174/`.

Tarefa que cruza camadas: skill `dev-orchestrator`. A página não hospeda API, BFF, conta nem servidor.
