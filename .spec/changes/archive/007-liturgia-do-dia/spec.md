# 007-liturgia-do-dia

## Objetivo

Mostrar a celebração do dia no hero e deixar a pessoa ler a liturgia num painel, pedida a um serviço público, sem impedir o ciclo quando a rede falhar.

## Contexto Técnico

A página não tem servidor próprio. Esta spec autoriza um único pedido de rede, feito pelo navegador: `GET https://liturgia.cloudhub.ia.br/v1/liturgia`, com `dia`, `mes` e `ano` tirados de `todayKey()`. A data da liturgia é a mesma data da sequência. Sem parâmetro, a API usa `America/Sao_Paulo`; com os três parâmetros, o dia segue o relógio local do navegador, como a sequência.

Consulta em 26/10/2026. A resposta é um array. O primeiro item traz a féria em `nome` e a festa em `celebracoes`. Nesse dia, `nome` era “Segunda-feira da 30ª semana do Tempo Comum” e a celebração com `principal: true` era “Santos Simão e Judas, Apóstolos, Festa”, cor “Vermelho”. O santo do dia é essa celebração principal, não o campo `nome`.

O pedido nasce em `infra`. O caso de uso só vê um protocolo que devolve o corpo ou `null`. A leitura do JSON é função pura em `domain`. A tela chama factory e não usa `fetch`. Sem chave nova. O texto da liturgia não entra no repositório nem no `localStorage`.

Ciclo, jaculatória, dezena, frases, fundo, canto e as três chaves permanecem. A cor litúrgica não troca `data-accent`, tema nem fundo.

## Referências de Projeto

- [Produto](../../../memory/produto.md)
- [Contexto técnico global](../../../memory/contexto-tecnico.md)
- [Estrutura do projeto](../../../memory/estrutura.md)

## Referências Compartilhadas

- [Como executar](../../../shared/como-executar.md)
- [Regras de nomenclatura](../../../shared/regras-de-nomenclatura.md)
- Modelo de origem: [modelo-base](../../../templates/modelo-base.md)

## Observações Locais

A URL fica no adaptador. Tempo limite de 8 segundos. Falha de rede, resposta que não seja 200, corpo vazio, JSON inválido ou forma inesperada viram `null`. Sem segunda tentativa e sem aviso de erro na tela.

Do primeiro item do array, usar a celebração com `principal: true`. Se nenhuma tiver a marca, usar a primeira. Título é `liturgia`, cor é `cor`. Se o título vier vazio, cair em `nome`. Se os dois vierem vazios, o dia é `null`.

Entrar no modelo só o que o painel mostra:

| Campo | Origem |
| --- | --- |
| Título | `celebracoes[].liturgia`, ou `nome` |
| Cor | `celebracoes[].cor` |
| Antífona de entrada | `antifonas.entrada` |
| Coleta | `oracoes.coleta` |
| Leituras | `leituras`, em ordem de `ordem` |
| Antífona de comunhão | `antifonas.comunhao` |

Cada leitura usa só `opcoes[0]`. Rótulo é `rotulo`. Precisa de `referencia` e `texto`. `titulo` e `refrao` entram quando vierem. Oração sobre as oferendas, oração depois da comunhão e celebrações que não sejam a escolhida ficam de fora. Seção com texto vazio não aparece.

A conta da cor aceita Branco, Verde, Vermelho, Roxo e Rosa. Outra cor mostra o nome e não desenha a conta. A conta leva borda, para o branco continuar visível no véu escuro.

A linha fica acima do kicker na oração, na pausa e na pausa longa. Some no foco e quando a altura da janela esconde o kicker. O botão abre o painel “Liturgia de hoje”, no mesmo drawer das tarefas, com Escape e clique fora. Um painel por vez. O texto da leitura preserva a quebra de linha da resposta.

O hook pede a liturgia ao abrir a página e de novo se `todayKey()` mudar com a aba aberta. Até a resposta, e quando ela for `null`, a linha não existe. O relógio não espera o pedido.

## Tasks

### Tasks - Domain

- [x] Modelo do dia com título, cor e os campos da tabela acima
- [x] Função pura que lê o JSON desconhecido e devolve o dia ou `null`, com a celebração principal e a primeira opção de cada leitura
- [x] Contrato `ILoadLiturgy`, método `handle`, recebendo o dia `yyyy-mm-dd` e devolvendo o dia ou `null`

### Tasks - Data e infra

- [x] Protocolo de origem que devolve o corpo da resposta ou `null` e engole falha
- [x] Adaptador HTTP do `GET` com `dia`, `mes` e `ano`, tempo limite de 8 segundos, sem gravar o corpo
- [x] Caso de uso que pede o corpo, interpreta o JSON e aplica a função pura

### Tasks - Composicao

- [x] Factory `makeLoadLiturgy` e hook de fluxo que guarda o dia em memória, uma chamada por `todayKey()`, começando em `null`

### Tasks - Interface

- [x] Linha no hero com a conta da cor e o título, abrindo o painel, oculta no foco e na altura em que o kicker some
- [x] Painel “Liturgia de hoje” com cor, antífonas, coleta e leituras, e a fonte “rito romano, CNBB, via liturgia.cloudhub.ia.br”
- [x] Sem linha e sem aviso quando o dia é `null`
- [x] Texto e botão legíveis na Capela e na Alvorada, sem mudar accent, tema nem fundo

### Tasks - Documentacao

- [x] Na pergunta “Preciso de conta?”, dizer que tarefas, sequência, tempos e frase ficam neste navegador, e que a liturgia do dia é pedida a `liturgia.cloudhub.ia.br` e não é gravada
- [x] Registrar em `produto`, `contexto-tecnico`, `estrutura`, no README da página e na observação de `.spec/README.md` que a página não hospeda API e que a única saída de rede é esse `GET`

### Tasks - Verificacao

- [x] `npm run build`
- [x] Em `http://localhost:5174/`, com rede, ler a celebração principal de hoje na linha, abrir o painel e conferir coleta e a referência do evangelho
- [x] Bloquear o host ou ficar offline, recarregar e confirmar que a linha some, que oração, foco e pausa abrem, e que não há aviso de erro
- [x] No foco, confirmar que a linha some; na pausa, que ela volta
- [x] Conferir a linha na Capela e na Alvorada, sobre a Ceia, com o crédito da pintura visível
- [x] Confirmar que as chaves continuam `pomodoro-catolico-v1`, `pomodoro-catolico-fundo` e `pomodoro-catolico-music`, sem campo de liturgia

## Resultado Esperado

- A oração, a pausa e a pausa longa mostram a celebração principal do dia e a cor, quando o pedido responde.
- O painel mostra antífona de entrada, coleta, leituras e antífona de comunhão, com a fonte nomeada.
- Rede ausente ou resposta inútil deixam o timer como está, sem linha e sem erro.
- Accent, tema, fundo, ciclo e as três chaves não mudam. O texto da liturgia não fica gravado.

## Evidência

`npm run build` (`tsc -b && vite build`) passou em 26/10/2026. Saída: 65 módulos, `dist/assets/index-DLoKV5Za.css` 25,30 kB, `dist/assets/index-Mch_2Cgw.js` 275,71 kB.

Em `http://localhost:5174/`, com a Última Ceia, a Capela, o dourado e a oração em `01:00`:

- A linha abriu acima do kicker com a conta vermelha e “Santos Simão e Judas, Apóstolos, Festa”. O relógio já estava em `01:00` antes da resposta. O pedido foi um só: `GET https://liturgia.cloudhub.ia.br/v1/liturgia?dia=26&mes=10&ano=2026`.
- O botão abriu o painel “Liturgia de hoje”. A cor era Vermelho. A coleta começava em “Ó Deus, pelos santos Apóstolos…”. O evangelho trazia a referência `Lc 6, 12-19`. Entraram a antífona de entrada, a primeira leitura, o salmo com a quebra de linha e o refrão, e a antífona de comunhão. A fonte ficou “rito romano, CNBB, via liturgia.cloudhub.ia.br”. Escape e o clique fora fecharam o painel. Abrir Temas substituiu o painel.
- No foco, a linha sumiu e o relógio ofereceu “Começar o foco”. Na pausa, a linha voltou, com a dezena do dia. Com a janela a 480 px de altura, a linha e o kicker ficaram `display: none` e o relógio continuou em `01:00`.
- Na Capela, o título ficou em tinta clara sobre o véu da Ceia. Na Alvorada, o cartão de pergaminho mostrou o mesmo título em tinta escura, com a conta vermelha e borda. O accent continuou `gold`, o fundo continuou `ceia` e o tema só mudou quando o ambiente foi trocado. O crédito “Última Ceia, Leonardo da Vinci. Domínio público · fonte” continuou na página.
- Com o host `liturgia.cloudhub.ia.br` bloqueado, o recarregamento não mostrou a linha nem aviso de erro. A oração abriu em `01:00`, o foco em “Uma coisa de cada vez.” e a pausa na dezena.
- As chaves continuaram `pomodoro-catolico-v1`, `pomodoro-catolico-fundo` e `pomodoro-catolico-music`. O pacote não ganhou campo de liturgia. A pergunta “Preciso de conta?” respondeu que tarefas, sequência, tempos e a frase ficam neste navegador, e que a liturgia é pedida a liturgia.cloudhub.ia.br e não é gravada.

Depois da verificação, o navegador voltou à oração, 0 dias, Ceia, Capela e dourado, com a linha de novo visível.

## Encerramento

Esta spec termina apenas quando todos os itens estiverem marcados e com evidência registrada, no formato definido em [Como executar](../../../shared/como-executar.md).
