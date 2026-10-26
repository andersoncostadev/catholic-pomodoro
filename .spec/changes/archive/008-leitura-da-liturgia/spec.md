# 008-leitura-da-liturgia

## Objetivo

Deixar a liturgia do dia mais fácil de ler: o versículo separado da palavra, o refrão antes do salmo, um atalho para coleta, salmo e evangelho, e a linha do hero reconhecível como botão.

## Contexto Técnico

A mudança fica em `presentation`. O modelo, o `GET` e a leitura do JSON permanecem os da spec 007. O texto guardado em memória continua o da resposta. A formatação é só na tela.

A linha segue acima do kicker na oração, na pausa e na pausa longa. Continua oculta no foco e quando a altura da janela esconde o kicker. O painel continua “Liturgia de hoje”, no mesmo drawer, com Escape e clique fora. Cor litúrgica, accent, tema e fundo não mudam. Sem chave nova. O texto não é gravado.

Amostra de 26/10/2026, “Santos Simão e Judas, Apóstolos, Festa”. O corpo da primeira leitura vinha “Irmãos, 19já não sois…”, com `20Vós`, `21É` e `22E` no mesmo bloco. O evangelho abria “12Naqueles dias”. O refrão do salmo, “Seu som ressoa e se espalha em toda a terra.”, aparecia depois dos versos. As referências eram `Ef 2, 19-22` e `Lc 6, 12-19`.

## Referências de Projeto

- [Produto](../../../memory/produto.md)
- [Contexto técnico global](../../../memory/contexto-tecnico.md)
- [Estrutura do projeto](../../../memory/estrutura.md)

## Referências Compartilhadas

- [Como executar](../../../shared/como-executar.md)
- [Regras de nomenclatura](../../../shared/regras-de-nomenclatura.md)
- Modelo de origem: [modelo-interface](../../../templates/modelo-interface.md)

## Observações Locais

No corpo de cada leitura, versículo é uma sequência de dígitos colada na letra seguinte, sem espaço entre o número e a palavra. A tela mostra esses dígitos em sobrescrito e põe um espaço fino antes da palavra. A palavra não muda de caixa nem de letras. Vários versículos no mesmo bloco recebem o mesmo tratamento. A quebra de linha da resposta continua.

Rótulo, referência, título da leitura, refrão, antífonas e coleta não passam por essa regra. `Ef 2, 19-22` e `Lc 6, 12-19` permanecem como a resposta enviou.

Quando a leitura traz refrão, a linha itálica fica antes do corpo e não se repete depois. Leitura sem refrão não ganha essa linha. Sem título novo de “Refrão”: o rótulo da leitura já nomeia a seção.

O índice fica numa fileira, debaixo do título da celebração e antes da antífona de entrada, alinhado ao texto do painel. A ordem é fixa: Coleta, Salmo, Evangelho. “Coleta” só existe se houver coleta. “Salmo” aponta para a primeira leitura cujo rótulo, em minúsculas de `pt-BR`, contém `salmo`. “Evangelho” faz o mesmo com `evangelho`. Seção ausente não gera atalho. Se as três faltarem, a fileira não aparece.

O clique leva o título da seção ao alto da área rolável do painel. A página atrás do drawer não se move e a fase do ciclo não muda. O atalho não fecha o painel.

Na linha do hero, tamanho, conta da cor e sublinhado de repouso ficam como estão. Em `:hover` e em `:focus-visible`, o sublinhado passa a usar a tinta inteira, `var(--ink)`. O anel de `:focus-visible` que a página já desenha continua. O texto da linha não muda de posição.

## Tasks

### Tasks - Interface

- [x] No corpo da leitura, mostrar o versículo colado à palavra em sobrescrito, com espaço fino antes da palavra, sem alterar referência, refrão, antífonas nem coleta
- [x] Mostrar o refrão em itálico antes do corpo da leitura que o tiver, sem repeti-lo depois
- [x] Fileira Coleta, Salmo e Evangelho debaixo do título, só com as seções presentes, rolando o painel até a seção e deixando a página atrás parada
- [x] Na linha do hero, sublinhado em tinta inteira no hover e no foco visível, sem mudar tamanho, conta da cor nem a posição do texto
- [x] Manter a linha oculta no foco e na altura em que o kicker some
- [x] Texto e botão legíveis na Capela e na Alvorada, sem mudar accent, tema nem fundo

### Tasks - Verificação

- [x] `npm run build`
- [x] Em `http://localhost:5174/`, abrir “Liturgia de hoje” e conferir sobrescrito num versículo colado à palavra, o refrão antes do salmo e o salto de Coleta, Salmo e Evangelho dentro do painel
- [x] Passar o mouse e focar a linha do hero, e confirmar que tamanho e conta da cor não mudam
- [x] No foco, confirmar que a linha some; na pausa, que ela volta
- [x] Conferir linha e painel na Capela e na Alvorada, com o crédito da pintura visível
- [x] Confirmar que as chaves continuam `pomodoro-catolico-v1`, `pomodoro-catolico-fundo` e `pomodoro-catolico-music`

## Resultado Esperado

- O corpo da leitura separa o número do versículo da palavra, em sobrescrito. Referência, antífona e coleta ficam como a resposta enviou.
- O refrão do salmo aparece em itálico antes dos versos.
- O painel oferece Coleta, Salmo e Evangelho quando essas seções existem, e o clique mostra a seção sem mexer na página atrás.
- A linha do hero ganha sublinhado em tinta inteira ao passar o mouse ou ao receber foco, no mesmo tamanho e com a mesma conta.
- Accent, tema, fundo, ciclo e as três chaves não mudam. O texto da liturgia não fica gravado.

## Evidência

`npm run build` (`tsc -b && vite build`) passou em 26/10/2026. Saída: 65 módulos, `dist/assets/index-DBh8JkyY.css` 25,76 kB, `dist/assets/index-DeFT1lU3.js` 277,09 kB.

Em `http://localhost:5174/`, com a Última Ceia, a Capela, o dourado e a oração:

- A primeira leitura mostrou `19` em sobrescrito antes de “já”, e o mesmo para `20`, `21` e `22`. As palavras ficaram como a resposta enviou. A referência `Ef 2, 19-22` e a coleta não ganharam sobrescrito. O evangelho abriu com `12` em sobrescrito antes de “Naqueles dias”, e a referência `Lc 6, 12-19` permaneceu igual.
- O salmo trouxe o rótulo, a referência “Sl 18”, o refrão em itálico “Seu som ressoa e se espalha em toda a terra.” e só então o corpo, com a quebra de linha. O refrão não se repetiu depois.
- A fileira Coleta, Salmo e Evangelho ficou debaixo do título, antes da antífona de entrada. Cada clique levou o título da seção ao alto da área rolável do painel. A página atrás ficou em `scrollY` 0, a fase continuou oração e o painel “Liturgia de hoje” permaneceu aberto.
- Em repouso, o sublinhado da linha usava 35% da tinta. No hover e no foco visível, o sublinhado passou à tinta inteira. O tamanho ficou em 23,2 px, a conta vermelha no mesmo tamanho e a linha no mesmo lugar. O foco visível manteve o anel dourado de 2 px.
- No foco, a linha sumiu. Na pausa, voltou com a dezena. Com a janela a 480 px de altura, a linha e o kicker ficaram `display: none` e o relógio continuou em `01:00`.
- Na Capela, o painel mostrou o texto em tinta clara sobre o fundo escuro, com os versículos em sobrescrito. Na Alvorada, o cartão e o painel ficaram em pergaminho, com o título, os atalhos e o corpo em tinta escura e a conta vermelha. O accent continuou `gold`, o fundo continuou a Ceia e o tema só mudou quando o ambiente foi trocado. O crédito “Última Ceia, Leonardo da Vinci. Domínio público · fonte” continuou visível.
- As chaves continuaram `pomodoro-catolico-v1`, `pomodoro-catolico-fundo` e `pomodoro-catolico-music`. O estado gravado não tem campo de liturgia.

Depois da verificação, o navegador voltou à oração, 0 dias, Ceia, Capela e dourado, com a linha de novo visível.

## Encerramento

Esta spec termina apenas quando todos os itens estiverem marcados e com evidência registrada, no formato definido em [Como executar](../../../shared/como-executar.md).
