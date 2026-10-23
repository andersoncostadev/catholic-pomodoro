# NNN-descricao-da-mudanca

> Copie este arquivo para `changes/NNN-descricao-da-mudanca/spec.md`, substitua o placeholder do título e remova este bloco de instruções.

## Objetivo

Uma frase. O que esta mudança resolve e para quem usa o timer.

## Contexto Técnico

Descreva a restrição desta mudança e a decisão já tomada que muda o trabalho.
Não repita [memory/contexto-tecnico.md](../memory/contexto-tecnico.md); só aponte o que esta spec precisa.

## Referências de Projeto

- [Produto](../memory/produto.md)
- [Contexto técnico global](../memory/contexto-tecnico.md)
- [Estrutura do projeto](../memory/estrutura.md)

## Referências Compartilhadas

- [Como executar](../shared/como-executar.md)
- [Regras de nomenclatura](../shared/regras-de-nomenclatura.md)

## Observações Locais

Somente regras desta mudança que não cabem como padrão global.
Se uma regra se repetir entre specs, promova-a para `shared/` ou `memory/`.

## Tasks

Agrupe as tasks pelas áreas que fizerem sentido. Remova grupos que não se aplicam.

### Tasks - Domain

- [ ] Descrever a task em `domain/cycle` ou no catálogo correspondente

### Tasks - Data e infra

- [ ] Descrever a task no caso de uso ou no adaptador, quando a gravação mudar

### Tasks - Interface

- [ ] Descrever a task de tela em `presentation/components`, `presentation/flows` ou `presentation/styles/index.css`

### Tasks - Verificação

- [ ] `npm run build`
- [ ] Conferir o fluxo no navegador, inclusive um fundo e um ambiente que a mudança alcança

## Resultado Esperado

O que a página deve permitir ou garantir ao final, em tópicos objetivos.

## Encerramento

Esta spec termina apenas quando todos os itens estiverem marcados e com evidência registrada, no formato definido em [Como executar](../shared/como-executar.md).
