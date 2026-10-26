# Regras de nomenclatura

## Convenção de pastas

- `changes/NNN-descricao/` para spec ativa ou pendente.
- `changes/archive/` para specs concluídas.
- `templates/` para modelos reutilizáveis.
- `memory/` para contexto técnico, produto e estrutura global.

## Convenção de arquivos

- Use nomes em minúsculas e com hífen para separar palavras.
- Prefira `spec.md` como arquivo principal da mudança.
- Use `README.md` apenas para documentação de contexto e guia rápido.

## Convenção de código

- Interface de caso de uso em kebab-case: `load-bundle.ts`, `ILoadBundle`, método `handle`.
- Implementação em PascalCase: `LoadBundle.ts`.
- Factory em kebab-case, com função `make`: `makeLoadBundle` em `load-bundle.ts`.
- Alias de camada no import novo, sem sufixo `.ts`.

## Convenção de tarefas

- Agrupe tasks por área: `Domain`, `Data e infra`, `Composicao`, `Interface`, `Documentacao`, `Verificacao`.
- A tarefa descreve um comportamento observável e verificável.
- Quando uma regra se repete em várias specs, mova para `memory/` ou para `shared/`.

## Convenção de nomes de mudança

- Evite nomes genéricos como `fix` ou `update`.
- O nome da spec diz o efeito para quem usa o app, em português: `cena-fundo-e-fase`, `pausa-dezena`, `sequencia-na-barra`.

## Convenção de branch

- O nome é `feature/` mais o efeito em inglês, em minúsculas e com hífen.
- Sem número da spec, sem português e sem prefixo `fix/`.
- A spec `007-liturgia-do-dia` usa a branch `feature/liturgy-of-the-day`.
- A spec `008-leitura-da-liturgia` usa a branch `feature/liturgy-reading`.
