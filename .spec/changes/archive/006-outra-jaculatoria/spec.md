# 006-outra-jaculatoria

## Objetivo

Na oração, deixar a pessoa trocar a jaculatória sugerida naquela entrada, sem alterar a contagem do dia.

## Contexto Técnico

As oito frases moram em `jaculatories`, em `src/domain/catalogs/content.ts`. O card da oração mostra `jaculatories[offeringsToday % jaculatories.length]`. `offeringsToday` sobe só quando a fase de oração termina e aparece na aba Oração. O catálogo não muda.

A pausa já troca texto por botão: “Outra frase” e “Outra oração”. O volume é o único `input type="range"` da página. A jaculatória segue o botão, um passo de cada vez.

O deslocamento do clique vive no componente e zera quando `entryId` muda. Não entra no pacote `pomodoro-catolico-v1`. Sem chave nova.

## Referências de Projeto

- [Produto](../../../memory/produto.md)
- [Contexto técnico global](../../../memory/contexto-tecnico.md)
- [Estrutura do projeto](../../../memory/estrutura.md)

## Referências Compartilhadas

- [Como executar](../../../shared/como-executar.md)
- [Regras de nomenclatura](../../../shared/regras-de-nomenclatura.md)
- Modelo de origem: [modelo-base](../../../templates/modelo-base.md)

## Observações Locais

A frase de abertura de cada entrada continua sendo a da contagem do dia. O botão soma um ao índice só enquanto essa entrada durar. Reiniciar a fase, sair da oração e voltar, ou concluir a oração e voltar depois, reabrem a frase de `offeringsToday`.

O botão fica debaixo da frase, antes da tarefa, da intenção ou de “O que você oferece hoje?”. Foco e pausa não ganham esse controle.

## Tasks

### Tasks - Interface

- [x] No card da oração, botão “Outra jaculatória” que mostra a frase seguinte e volta à primeira depois da oitava
- [x] Manter a frase de abertura em `jaculatories[offeringsToday % jaculatories.length]`
- [x] Zerar o deslocamento do botão quando `entryId` muda
- [x] Não gravar índice novo e não alterar `offeringsToday` no clique

### Tasks - Verificação

- [x] `npm run build`
- [x] Em `http://localhost:5174/`, na oração, ler a frase do dia, clicar o botão até voltar a ela, sair e voltar, e conferir a frase e o botão na Capela e na Alvorada

## Resultado Esperado

- A oração mostra a jaculatória do dia e o botão “Outra jaculatória”.
- Cada clique troca a frase daquela entrada. Depois da última, volta a primeira.
- Sair e voltar, ou reiniciar a fase, restaura a frase de `offeringsToday`.
- A aba Oração continua contando orações concluídas. O pacote não ganha campo novo.

## Evidência

`npm run build` (`tsc -b && vite build`) passou em 23/10/2026. Saída: 59 módulos, `dist/assets/index-DbMYTtrX.css` 23,82 kB, `dist/assets/index-BekCqkiN.js` 271,17 kB.

Em `http://localhost:5174/`, com a Última Ceia, a Capela e a oração em 0:

- A oração abriu em “Senhor, eu vos ofereço este trabalho.”, com o botão “Outra jaculatória” debaixo da frase e “O que você oferece hoje?” na linha seguinte. A aba Oração continuou em 0.
- O clique levou a “Jesus, eu confio em Vós.”, “Tudo por Jesus, nada sem Maria.”, “Vinde, Espírito Santo.”, “Sagrado Coração de Jesus, tende piedade de nós.”, “Meu Deus e meu tudo.”, “Faça-se em mim segundo a vossa palavra.”, “Maria, Mãe de Deus, rogai por nós.” e voltou a “Senhor, eu vos ofereço este trabalho.”
- Sair para o Foco tirou o botão. Voltar à Oração reabriu “Senhor, eu vos ofereço este trabalho.”. Trocar a frase e reiniciar a fase também voltou a essa frase.
- As chaves continuaram `pomodoro-catolico-v1`, `pomodoro-catolico-fundo` e `pomodoro-catolico-music`. O pacote não ganhou campo de jaculatória. `offeringsToday` permaneceu 0.
- Na Capela, a frase e o botão ficaram legíveis no véu, sobre a Ceia. Na Alvorada, o cartão de pergaminho mostrou a mesma frase em tinta escura e o botão em dourado, cada um na sua linha. O crédito da pintura continuou visível.
- Na pausa, “Começar a dezena” seguiu centrado debaixo das contas. O foco continuou só com “Uma coisa de cada vez.”

Depois da verificação, o navegador voltou à oração, 0 dias, Ceia e Capela.

## Encerramento

Esta spec termina apenas quando todos os itens estiverem marcados e com evidência registrada, no formato definido em [Como executar](../../../shared/como-executar.md).
