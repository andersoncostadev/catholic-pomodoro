---
name: data-repository
description: Cria ou altera persistência do Pomodoro Católico via IStorage. Use ao mudar carga ou gravação do ciclo, do fundo ou do canto em data/usecases e infra/cache.
---

# Persistência

O caso de uso não chama `localStorage`. Ele recebe `IStorage`.

## Onde mexer

- Protocolo: `src/data/protocols/cache/storage.ts` (`get`, `set`). Os dois engolem falha de storage.
- Caso de uso: `src/data/usecases/`, classe em PascalCase que implementa o contrato de `domain/usecases`.
- Adaptador: `src/infra/cache/local-storage-adapter.ts`.
- Chaves: `src/domain/constants/storage-keys.ts`. Não criar chave nova, salvo a spec pedir.
- Composição: `src/main/factories/cache/storage-factory.ts` e `src/main/factories/usecases/`.

## Inviolável

- `data` importa `domain` e o protocolo. Não importa `infra` nem React.
- `infra` importa só o protocolo que implementa.
- JSON inválido ou ausente do ciclo abre o padrão de `sanitizeBundle`.
- Fundo: id padrão `ceia`, `null` significa sem imagem. `pieta` → `assis`, `caminho` → `vocacao`, `jornada` → `votos`, `peregrinos` → `adoracao`.
- Canto: faixa existente no catálogo ou `null`. Volume entre 0 e 1. Padrão `0.6`.
- Não apagar ciclo, tarefas, sequência, ajustes, fundo nem canto já gravados.
- A liturgia do dia não usa `IStorage` nem chave nova. O caso de uso recebe o protocolo de origem.
