---
name: domain-business-rules
description: Altera regra de ciclo, sequência, sanitização ou catálogo em domain/. Use ao mudar duração, avanço de fase, texto de oração, id de fundo ou canto.
---

# Regras de domínio

A regra mora em `src/domain`. Sem React e sem `localStorage`.

## Onde mexer

- Duração, sequência, rótulo, relógio, sanitização e avanço de fase: `src/domain/cycle/`.
- Tipos e `defaultSettings`: `src/domain/models/cycle/`.
- Fundo, cena, tom e crédito: `src/domain/models/backdrop/` e `src/domain/catalogs/saints.ts`.
- Canto: `src/domain/models/chant/` e `src/domain/catalogs/chants.ts`.
- Jaculatória, oração, mistério, citação e pergunta: `src/domain/catalogs/content.ts`.
- Contrato novo de leitura ou gravação: `src/domain/usecases/`, arquivo kebab-case, interface `I...`, método `handle`.
- Leitura do JSON da liturgia: função pura em `src/domain/liturgy/`. Sem `fetch`.

## Inviolável

- Não importar `data`, `infra`, `main`, `presentation` nem `react`.
- Não mover `todayKey` nem `yesterdayKey` para `src/utils`. A sequência depende dessas datas.
- Não alterar id, crédito, licença, tom, cor sugerida nem texto de oração sem a spec pedir.
- Acento desconhecido continua caindo em dourado dentro de `sanitizeBundle`.
- O componente não passa a recalcular o que esta pasta já decide.
