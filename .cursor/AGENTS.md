# Cursor Agent Guide — Pomodoro Católico

Uma página. As camadas ficam em `src/`. A spec fica em `.spec/`.

| Camada | Pasta | Responsabilidade |
|---|---|---|
| domain | `src/domain` | Modelos, catálogos, regra pura do ciclo, contratos |
| data | `src/data` | Caso de uso via `IStorage` |
| infra | `src/infra` | `localStorage`, sino, notificação e o GET da liturgia |
| main | `src/main/factories` | Único lugar que instancia adaptador e caso de uso |
| presentation | `src/presentation` | Fluxos, componentes e CSS |
| app | `src/app` | Casca que renderiza o timer |

Dev server: `http://localhost:5174/`. Sem porta de API ou BFF.

## Skills

| Skill | Quando |
|---|---|
| `dev-orchestrator` | spec que cruza camadas |
| `domain-business-rules` | ciclo, sequência, sanitização, catálogo |
| `data-repository` | `IStorage`, caso de uso, adaptador |
| `add-ui-flow` | página, componente, hook de fluxo |
| `unit-testing` | `npm run build` e o fluxo no navegador |
| `cloudflare-access` | acesso, visita e abertura do site na Cloudflare |

A tela chama factory. Não criar API, BFF, conta nem servidor. A única saída de rede é o GET da liturgia, e esse texto não é gravado.
