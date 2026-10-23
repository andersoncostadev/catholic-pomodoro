# 005-frases-de-santos

## Objetivo

Aumentar o catálogo de frases da pausa, para quem já percorreu as sete de hoje e quer outra voz de santo no mesmo card.

## Contexto Técnico

As frases moram em `quotes`, em `src/domain/catalogs/content.ts`. A pausa e a pausa longa mostram `quotes[quoteIndex % quotes.length]`. O botão Outra frase só soma um ao índice. O índice já entra no pacote `pomodoro-catolico-v1`, com padrão `0`.

Não há API nesta página. Heiligenzitate, Minorum e Catholic Readings devolvem alemão ou inglês e tirariam a pausa do ar sem rede. Ficam de fora.

As sete frases atuais permanecem, na mesma ordem, no começo do array. As novas entram no fim. Quem ainda não passou da sétima continua na mesma frase. O formato continua `{ text, author }`. A fonte fica nesta spec. A tela não ganha campo novo.

Jaculatórias, orações breves, mistérios e perguntas frequentes não mudam. Sem chave nova.

## Referências de Projeto

- [Produto](../../memory/produto.md)
- [Contexto técnico global](../../memory/contexto-tecnico.md)
- [Estrutura do projeto](../../memory/estrutura.md)

## Referências Compartilhadas

- [Como executar](../../shared/como-executar.md)
- [Regras de nomenclatura](../../shared/regras-de-nomenclatura.md)
- Modelo de origem: [modelo-base](../../templates/modelo-base.md)

## Observações Locais

Busca em 23/10/2026. A frase entra se estiver em português, couber no card (não mais longa do que o “Nada te turbe” de Santa Teresa) e tiver uma página aberta com obra ou documento nomeado. Frase famosa sem essa página fica de fora, mesmo quando circula em blogs de citação.

A redação abaixo é a que o array deve copiar. Não traduzir de novo nem encurtar na implementação.

### Entram

| Texto | Autor | Fonte |
|-------|-------|-------|
| Altíssimo e glorioso Deus, iluminai as trevas do meu coração. | São Francisco de Assis | Oração diante do Crucifixo, primeira frase, no folheto da [Ordem Franciscana Secular do Brasil](https://ofs.org.br/wp-content/uploads/2026/03/ORACOES-DE-SAO-FRANCISCO-2026.pdf). O latim começa *Summe et gloriose Deus, illumina tenebras cordis mei*. |
| É o amor que dá perfeição às nossas obras. | São Francisco de Sales | Palavras dele em Lião, dois dias antes de morrer, na [Totum amoris est](https://www.vatican.va/content/francesco/pt/apost_letters/documents/20221228-totum-amoris-est.html). |
| Para a maior glória de Deus. | Santo Inácio de Loyola | Lema *Ad maiorem Dei gloriam*, no mesmo registro de “Ora et labora”. A [Strenna salesiana de 2014](http://sdl.sdb.org:9393/greenstone3/library/collection/strenna/document/HASHfee73529170b109f6416d9/assoc/Strenna_2014_pt.pdf) registra a fórmula portuguesa dos jesuítas. |
| Entendi consagrar todo o meu trabalho à maior glória de Deus e ao bem das almas. | São João Bosco | Trecho da “história da alma” de 1854, na mesma Strenna. |
| Os meus amigos serão Jesus e Maria. | São Domingos Sávio | Terceiro propósito da primeira comunhão, em [São Domingos Sávio: “A morte, mas não o pecado”](https://rsb.org.br/noticias/rede/sao-domingos-savio). |
| A morte, mas não o pecado. | São Domingos Sávio | Quarto propósito, na mesma página. |
| Eu Vos amo, ó meu Deus, e o meu único desejo é amar-Vos até ao último suspiro da minha vida. | São João Maria Vianney | Primeira frase da oração no [Catecismo da Igreja Católica, n. 2658](https://www.vatican.va/content/dam/wss/archive/cathechism_po/index_new/p4s1cap2_2650-2696_po.html), nota 7. |
| Na santa Igreja, tudo pertence ao amor, vive no amor, faz-se por amor e vem do amor. | São Francisco de Sales | Reserva da mesma Totum amoris est, prefácio do *Tratado do Amor de Deus*. Entra a pedido: a frase curta de Lião permanece, e esta cabe no card. |

### Entram também — santos do século XX

Busca em 23/10/2026, no mesmo critério: português, não mais longa do que o “Nada te turbe” (132 caracteres) e página aberta com obra ou documento nomeado. A redação é a da página. Ponto de *Caminho* entra inteiro. Frase famosa sem essa página fica de fora.

| Texto | Autor | Fonte |
|-------|-------|-------|
| Tem presença de Deus e terás vida sobrenatural. | São Josemaría Escrivá | *Caminho*, ponto 278, em [escriva.org](https://escriva.org/pt-br/camino/278/). |
| Põe um motivo sobrenatural na tua atividade profissional de cada dia, e terás santificado o trabalho. | São Josemaría Escrivá | *Caminho*, ponto 359, em [escriva.org](https://escriva.org/pt-br/camino/359/). |
| Fazei tudo por Amor. - Assim não há coisas pequenas: tudo é grande. - A perseverança nas pequenas coisas, por Amor, é heroísmo. | São Josemaría Escrivá | *Caminho*, ponto 813, em [escriva.org](https://escriva.org/pt-br/camino/813/). |
| Queres de verdade ser santo? - Cumpre o pequeno dever de cada momento; faz o que deves e está no que fazes. | São Josemaría Escrivá | *Caminho*, ponto 815, em [escriva.org](https://escriva.org/pt-br/camino/815/). |
| Que procures Cristo. Que encontres Cristo. Que ames a Cristo. | São Josemaría Escrivá | Dedicatória citada em *Caminho*, ponto 382, em [escriva.org](https://escriva.org/pt-br/camino/382/). |
| Não tenhais medo! Abri antes, ou melhor, escancarai as portas a Cristo! | São João Paulo II | Frase da homilia no início do pontificado (22 de outubro de 1978), no [ofício de leitura](https://www.vatican.va/roman_curia/congregations/ccdds/documents/rc_con_ccdds_doc_20110402_uff-letture_po.html). |
| O homem não pode viver sem amor. | São João Paulo II | Primeira frase do n. 10 da [Redemptor hominis](http://www.vatican.va/content/john-paul-ii/pt/encyclicals/documents/hf_jp-ii_enc_04031979_redemptor-hominis.html). |
| A fé e a razão constituem como que as duas asas pelas quais o espírito humano se eleva para a contemplação da verdade. | São João Paulo II | Primeira frase da [Fides et ratio](http://www.vatican.va/content/john-paul-ii/pt/encyclicals/documents/hf_jp-ii_enc_14091998_fides-et-ratio.html). |
| Talvez não fale a língua deles, mas posso sorrir. | Santa Teresa de Calcutá | Palavra dela na [homilia de canonização](https://www.vatican.va/content/francesco/pt/homilies/2016/documents/papa-francesco_20160904_omelia-canonizzazione-madre-teresa.html). |
| A glorificação da Tua misericórdia, ó Jesus, é a missão exclusiva da minha vida. | Santa Faustina Kowalska | Frase do *Diário*, em 1937, na [biografia da Santa Sé](https://www.vatican.va/news_services/liturgy/saints/ns_lit_doc_20000430_faustina_po.html). |
| Se deveis decidir entre mim e o filho, nenhuma hesitação: escolhei - e isto o exijo - a criança. Salvai-a. | Santa Gianna Beretta Molla | Palavra dela na [biografia da Santa Sé](https://www.vatican.va/news_services/liturgy/saints/ns_lit_doc_20040516_beretta-molla_po.html). |

### Ficam de fora

| Candidata | Decisão |
|-----------|---------|
| “Senhor, fazei-me instrumento da vossa paz” | Fora. Não é de São Francisco. [All Saints Pictures](https://allsaintspic.com/) registra a atribuição falsa. |
| “Quem canta, reza duas vezes” | Fora. Não é de Santo Agostinho. A mesma página registra a atribuição falsa. |
| “Não se opor ao erro é aprová-lo” | Fora. A frase é anterior a São Tomás de Aquino. |
| “Comece fazendo o necessário, depois o possível…” | Fora. Circula como de São Francisco sem obra localizada nesta busca. |
| Resto da oração diante do Crucifixo e o resto da oração do Cura d’Ars | Fora. A primeira frase já cabe no card. O parágrafo inteiro passa do “Nada te turbe”. |
| “Na santa Igreja, tudo pertence ao amor…” | Entrou. Era reserva. A frase curta de Lião continua na página de origem, e o pedido desta execução foi incluir até as reservas. |
| Traduções soltas de All Saints Pictures, Memórias Biográficas em inglês e livros recentes | Fora. A página cita a obra, mas o português é tradução de terceiros. |
| Heiligenzitate, Minorum, Catholic Readings, lectio-api | Fora. Não são um acervo em português que esta página possa chamar. |
| Ponto 1 de *Caminho* por inteiro | Fora. As duas partes juntas passam do “Nada te turbe”. Não recortei o ponto. |
| “Que busques a Cristo…”, na matéria do Opus Dei | Fora como redação. O livro, no ponto 382, diz “Que procures Cristo…”. Entrou a do livro. |
| Padre Pio, São Maximiliano Kolbe e Santa Teresa Benedita da Cruz | Fora nesta busca. A biografia de Padre Pio e a de Edith Stein em português na Santa Sé não trazem uma frase curta da própria pessoa. A de Kolbe não está em português. |

## Tasks

### Tasks - Domain

- [x] Acrescentar as sete linhas da tabela “Entram” ao fim de `quotes`, com o texto e o autor dessa tabela
- [x] Acrescentar a reserva de São Francisco de Sales e as onze linhas da tabela “santos do século XX”, na mesma ordem
- [x] Manter as sete frases atuais no início, sem alterar texto nem autor
- [x] Deixar `jaculatories`, `briefPrayers`, mistérios e `faqs` como estão

### Tasks - Verificação

- [x] `npm run build`
- [x] Em `http://localhost:5174/`, encurtar oração e foco para 1 minuto em Temas, concluir as duas fases e ler a frase na pausa
- [x] Clicar Outra frase até passar das sete primeiras e ler “Altíssimo e glorioso Deus…”, “Eu Vos amo, ó meu Deus…”, “Tem presença de Deus…” e “Não tenhais medo!”
- [x] Confirmar que oração e foco continuam sem o card da frase
- [x] Repetir a leitura da frase sobre a Ceia e na Alvorada

## Resultado Esperado

- A pausa e a pausa longa percorrem vinte e seis frases. As sete primeiras são as de hoje.
- Cada frase nova aparece com o autor da tabela.
- O card continua só com o texto, o autor e o botão Outra frase.
- A página segue sem pedido de rede para buscar frase.

## Evidência

`npm run build` (`tsc -b && vite build`) passou em 23/10/2026. Saída: 59 módulos, `dist/assets/index-pzbxRb-E.css` 23,75 kB, `dist/assets/index-CjP3bISl.js` 270,85 kB.

Em `http://localhost:5174/`, com a Última Ceia e o índice da frase em 0:

- A pausa abriu em “Nada te turbe…”, Santa Teresa de Ávila, com o botão Outra frase. Percorrer Outra frase manteve as sete primeiras nessa ordem e, em seguida, mostrou “Altíssimo e glorioso Deus…”, São Francisco de Assis; “Eu Vos amo, ó meu Deus…”, São João Maria Vianney; “Tem presença de Deus…”, São Josemaría Escrivá; e “Não tenhais medo! Abri antes, ou melhor, escancarai as portas a Cristo!”, São João Paulo II. A vigésima sexta, “Se deveis decidir entre mim e o filho…”, Santa Gianna Beretta Molla, voltou à primeira no clique seguinte. O card ficou só com o texto, o autor e o botão. Nenhum pedido de rede trouxe frase.
- Oração e foco seguiram sem o card. Na oração, a jaculatória “Senhor, eu vos ofereço este trabalho.” No foco, “Uma coisa de cada vez.”
- Sobre a Ceia, na Capela, a frase de Santa Gianna ficou legível no véu, com o crédito “Última Ceia, Leonardo da Vinci. Domínio público · fonte”. Na Alvorada, ainda sobre a Ceia, “Fazei tudo por Amor…”, São Josemaría Escrivá, ficou em tinta escura no cartão de pergaminho. O crédito da pintura continuou visível.
- Em Temas, a oração já estava em 1 minuto e o botão de diminuir vinha desligado. O foco desce só até 5 minutos. Com o foco em 5, a oração correu de `01:00` e passou sozinha ao foco. O foco chegou à pausa: abas Oração 1, Foco 1, relógio da pausa em contagem, uma dezena e a frase com Outra frase. A sequência marcou 1 dia.

Depois da verificação, o navegador voltou à oração, 0 dias, Ceia, Capela, foco de 25 minutos e índice 0. As chaves continuaram `pomodoro-catolico-v1`, `pomodoro-catolico-fundo` e `pomodoro-catolico-music`.

## Encerramento

Esta spec termina apenas quando todos os itens estiverem marcados e com evidência registrada, no formato definido em [Como executar](../../shared/como-executar.md).
