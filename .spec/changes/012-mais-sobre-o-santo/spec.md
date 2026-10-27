# 012-mais-sobre-o-santo

## Objetivo

Dar mais a conhecer o santo do dia no painel: a introdução do artigo no lugar de uma frase só, e mais fatos da vida e da veneração, sem tirar do ciclo quem só quer o nome.

## Contexto Técnico

O painel “Santo do dia” mostra hoje uma frase de biografia, nascimento, morte, venerado por, canonização, festa e padroeiro. A frase é a primeira da introdução da Wikipédia em português (`readFirstSentences` em `tools/generate-calendar.mjs`). Os fatos vêm de `tools/enrich-life-veneration.mjs`, da Wikidata e da infobox do artigo.

A mudança começa na API do calendário dos santos (`C:\Levva\Estudo\SaintCalendar.Api`, repositório [saint-calendar-api](https://github.com/andersoncostadev/saint-calendar-api)) e termina na página. O pedido continua sendo o mesmo `GET /santo-do-dia/{mm}-{dd}`, com os campos novos acrescentados ao corpo. Nenhum campo existente muda de nome, tipo ou regra: a página publicada antes desta spec continua lendo a resposta nova, e a página nova continua lendo um corpo sem os campos novos.

O catálogo continua sendo um retrato gerado uma vez e commitado. O pedido do dia não consulta a Wikipédia nem a Wikidata. Sem banco, sem chave nova no `localStorage`, e nenhum texto do santo é gravado no navegador. Sem oração: o texto da Canção Nova continua de fora, e a página não escreve oração própria.

Branch desta mudança, nos dois repositórios: `feature/saint-details`. A API entra no `main` dela antes da página, porque o campo novo é opcional para a página antiga.

## Referências de Projeto

- [Produto](../../memory/produto.md)
- [Contexto técnico global](../../memory/contexto-tecnico.md)
- [Estrutura do projeto](../../memory/estrutura.md)

## Referências Compartilhadas

- [Como executar](../../shared/como-executar.md)
- [Regras de nomenclatura](../../shared/regras-de-nomenclatura.md)
- Modelo de origem: [modelo-base](../../templates/modelo-base.md)
- Contrato atual da API: [011-api-do-santo](../archive/011-api-do-santo/spec.md)

## Observações Locais

### Introdução do artigo

Campo novo `summary`: lista de parágrafos em texto, tirados da introdução do mesmo artigo da Wikipédia que já dá a `biography` (`prop=extracts`, `exintro`, `explaintext`).

- Parágrafo vazio sai. As notas de idioma entre parênteses saem, como já saem da `biography`.
- No máximo 3 parágrafos e 1.200 caracteres somados. O corte acontece no fim de uma frase; parágrafo que não cabe inteiro é cortado na última frase que cabe, e o que sobra sai.
- O primeiro parágrafo começa pela mesma frase da `biography`.
- Sobra de wikitexto, chave, colchete ou palavra colada tornam o parágrafo inválido; com o primeiro inválido, `summary` sai do dia.
- Dia com biografia escrita para a API (`tools/written-biographies.json`, hoje 29/02) não tem `summary`.
- `biography` fica como está e continua obrigatória. A fonte continua “Wikipédia, trecho adaptado”, CC BY-SA 4.0, com o link do artigo.

### Mais fatos

Da Wikidata (CC0), com a mesma regra de `enrich-life-veneration.mjs`: declaração preferida antes das normais, depreciada fora, rótulo em `pt-br` ou `pt`, e o campo sai quando não há valor.

| Bloco | Campo | Rótulo no painel | Origem |
| --- | --- | --- | --- |
| `life` | `burial` | Sepultura | local de sepultamento (`P119`) |
| `life` | `order` | Ordem religiosa | ordem religiosa (`P611`) |
| `veneration` | `beatification` | Beatificação | data do status de beato em `P411`, qualificador de data |
| `veneration` | `canonizedBy` | Canonizado por | papa que canonizou, qualificador da declaração de santo em `P411`, quando a Wikidata registrar |
| `veneration` | `attributes` | Na arte | símbolo iconográfico (`P4185`), separado por vírgula |

- Data no formato que a API já usa: “15 de outubro de 1422”, “c.” quando aproximada, precisão de mês, ano, década ou século.
- Beatificação anterior à morte ou anterior a 993 sai, como na canonização.
- Texto com mais de 160 caracteres é cortado na última vírgula, como já acontece; sem vírgula antes dos 20 caracteres, o campo sai.
- O rótulo da Wikidata que vier em inglês ou só com o id (`Q…`) sai.
- Quando a infobox do artigo trouxer beatificação ou atributos, ela vale antes da Wikidata, como já vale para canonização.

### Painel

Ordem: foto, título, introdução (os parágrafos de `summary`; sem ela, a `biography`), “Vida” (Nascimento, Morte, Sepultura, Ordem religiosa), “Veneração” (Venerado por, Beatificação, Canonização, Canonizado por, Festa, Padroeiro, Na arte), a linha “Calendário” e a fonte. Linha vazia não aparece; seção vazia some. A linha do santo no hero continua só com o nome.

O painel rola dentro do drawer, como a liturgia. O texto segue legível na Capela e na Alvorada, sem mudar accent, tema nem fundo.

## Tasks

### Tasks - API

- [x] Acrescentar `summary` ao retrato a partir da introdução da Wikipédia, com as regras de “Introdução do artigo”
- [x] Acrescentar `burial`, `order`, `beatification`, `canonizedBy` e `attributes` ao retrato, com as regras de “Mais fatos”
- [x] Rodar os scripts sobre o `saints.json` commitado sem trocar nenhum santo de dia, e registrar quantos dias ganharam cada campo
- [x] Levar os campos novos à entidade, à regra do dia (texto aparado, vazio sai, bloco vazio some) e à resposta do `GET`
- [x] Testes: `summary` com no máximo 3 parágrafos e 1.200 caracteres, primeiro parágrafo começando pela `biography`, campos novos aparados e omitidos quando vazios, endpoint e arquivo exportado iguais
- [x] `dotnet test` e exportação; PR para o `main` da API e Pages publicado com os campos novos

### Tasks - Domain

- [x] Modelo do santo com `summary` (lista de parágrafos) e os campos novos de vida e veneração
- [x] `readSaintDay` lê os campos novos com a mesma regra dos atuais: texto aparado, vazio vira ausente, lista sem item vazio, e corpo sem os campos novos continua válido

### Tasks - Interface

- [x] Painel mostra os parágrafos da introdução; sem `summary`, mostra a `biography`
- [x] “Vida” e “Veneração” com as linhas novas, na ordem de “Painel”, só com as que tiverem texto
- [x] Texto legível na Capela e na Alvorada, com o crédito da foto e da pintura de fundo visíveis

### Tasks - Documentacao

- [x] Atualizar `produto` com o que o painel do santo mostra
- [x] Registrar o contrato novo na seção da API desta spec e no README da API

### Tasks - Verificacao

- [x] `npm run build`
- [x] Em `http://localhost:5174/`, com o retrato novo servido como no Pages, abrir o painel de hoje e conferir a introdução, as linhas novas e a fonte
- [x] Abrir um dia sem `summary` (29/02) e um dia com poucos fatos, e conferir que a biografia curta aparece e que nenhuma linha vazia aparece
- [x] Apontar a página para um corpo sem os campos novos e conferir que o painel abre como antes
- [x] Na pausa, conferir o painel na Capela e na Alvorada; no foco, a linha do santo some
- [x] Confirmar que as chaves continuam `pomodoro-catolico-v1`, `pomodoro-catolico-fundo` e `pomodoro-catolico-music`, sem campo de santo

## Resultado Esperado

- O painel do santo mostra a introdução do artigo, em parágrafos, e não só uma frase.
- Quando a Wikidata ou a infobox registram, o painel mostra sepultura, ordem religiosa, beatificação, quem canonizou e os símbolos na arte.
- Dia sem esses dados mostra o que tiver, sem linha vazia e sem erro.
- A página publicada antes desta spec e a página nova leem a mesma resposta.
- O pedido do dia continua sem consultar Wikipédia ou Wikidata, e nenhum texto do santo é gravado no navegador.

## Evidência

### API

Branch `feature/saint-details` em [saint-calendar-api](https://github.com/andersoncostadev/saint-calendar-api), commit `8a48051`, enviada ao GitHub em 27/10/2026. PR para o `main`: [saint-calendar-api#1](https://github.com/andersoncostadev/saint-calendar-api/pull/1), com merge em 27/10/2026 às 17:41 (commit `9735c2d`).

Depois do merge, o Pages publicou às 17:42 (`Last-Modified: Tue, 27 Oct 2026 20:42:56 GMT`). Em `https://andersoncostadev.github.io/saint-calendar-api/santo-do-dia/{mm}-{dd}`, os três dias responderam 200, com `Access-Control-Allow-Origin: *` e `Content-Type: application/octet-stream`:

- 10/27: `summary` com 1 parágrafo, ordem “Agostinianos”, beatificação “2 de maio de 1778” e atributos “Hábito agostiniano”.
- 07/31: `summary` com 3 parágrafos, sepultura “Igreja de Jesus”, ordem “Companhia de Jesus”, beatificação “27 de julho de 1609”, canonização “12 de março de 1622”, “Papa Gregório XV” e atributos “Casula, livro”.
- 02/29: sem `summary`, com ordem “Ordem de São Bento” e veneração só com a festa.

Contrato novo do `GET /santo-do-dia/{mm}-{dd}`, acrescentado ao de [011-api-do-santo](../archive/011-api-do-santo/spec.md). Nenhum campo existente mudou de nome, tipo ou regra.

| Campo | Regra |
| --- | --- |
| `summary` | Lista de parágrafos da introdução do artigo, no máximo 3 e 1.200 caracteres somados, cortada no fim de uma frase. O primeiro começa pela `biography`. Parágrafo vazio sai; lista vazia some |
| `life.burial` | Local de sepultamento (`P119`) |
| `life.order` | Ordem religiosa (`P611`), separada por vírgula |
| `veneration.beatification` | Infobox (`data_beatificação`); sem ela, data do status de beato em `P411`. Anterior à morte ou a 993 sai |
| `veneration.canonizedBy` | Qualificador “conferido por” (`P1027`) da declaração de santo em `P411`, só quando o rótulo é de um papa |
| `veneration.attributes` | Infobox (`atribuições`); sem ela, símbolo iconográfico (`P4185`), separado por vírgula |

Cada campo novo é aparado, sai quando vazio, e o bloco some quando fica sem texto. Texto acima de 160 caracteres é cortado na última vírgula. O README da API registra o mesmo contrato e as fontes.

O retrato foi enriquecido sobre o `saints.json` commitado, por `tools/enrich-summary.mjs` (novo) e `tools/enrich-life-veneration.mjs`. A regra de frase e de nota de idioma saiu de `generate-calendar.mjs` para `tools/intro-text.mjs`, para a introdução seguir a mesma regra da biografia. Comparado ao arquivo anterior: os mesmos 359 dias, com os mesmos santos, biografias, fotos, créditos e calendário; nascimento, morte, venerado por, canonização, festa e padroeiro sem nenhum valor alterado.

Quantos dias ganharam cada campo, dos 359:

| Campo | Dias |
| --- | --- |
| `summary` | 353 (154 com 1 parágrafo, 93 com 2, 106 com 3) |
| `life.burial` | 130 |
| `life.order` | 149 |
| `veneration.beatification` | 125 |
| `veneration.canonizedBy` | 54 |
| `veneration.attributes` | 137 |

Ficaram sem `summary` o 29/02 (biografia escrita para a API) e cinco dias cujo primeiro parágrafo tem colchete: 02/04 e 06/04 (marca de idioma `[en]`, `[it]`), 06/28 (`[pacífico]`, `[Eirenaios]`), 11/30 (`[a ser]`) e 12/27 (`[carece de fontes]`). Nesses dias o painel mostra a biografia. Sete fontes passaram a “Wikipédia, trecho adaptado” (01/01, 01/17, 06/11, 07/10, 10/09, 10/15 e 11/21), porque a introdução perdeu notas de idioma, como já acontece com a biografia.

Decisões tomadas na revisão dos valores:

- Beatificação “633” vinda de uma infobox saiu: a regra de 993 e da data da morte vale também para o ano da infobox.
- “Canonizado por: Genádio de Constantinopla” saiu: a spec pede o papa que canonizou, e o rótulo precisa começar por “Papa”.
- Nos atributos, links vizinhos da infobox não são separados (“Hábito redentorista”, não “Hábito, redentorista”), e `•` vira vírgula.
- O filtro de rótulo em inglês descarta só palavras inglesas comuns (`of`, `the`, `and`, `church`, `order`, `abbey`, `cathedral`, `cemetery`, `chapel`, `monastery`). “St” ficou de fora porque derrubava “Abadia de Bury St Edmunds”.

Pontos anteriores a esta spec, que ela não corrige: 02/01 (“Santa Veridiana”) está ligado ao artigo do Palacete Veridiana da Silva Prado, e a biografia publicada já fala do palacete; a introdução repete esse erro. A biografia de 03/02 tem uma vírgula dupla, herdada pela introdução. Alguns atributos da infobox descrevem feitos e não símbolos (“Devoção a Jesus-Eucaristia”); a spec manda a infobox valer antes da Wikidata.

`dotnet test src/SaintCalendar.Api.slnx` passou em 27/10/2026: 46 aprovados, 0 com falha. Os novos cobrem `summary` aparado e sem parágrafo vazio, campos novos aparados e omitidos, bloco só com campo vazio que some, cada `summary` do arquivo com 1 a 3 parágrafos, até 1.200 caracteres, começando pela biografia e terminando em fim de frase, 29/02 sem `summary`, campos novos sem wikitexto e até 160 caracteres, e o endpoint de 07/31 com todos os campos novos e o de 29/02 sem eles. O teste que compara cada arquivo exportado com o endpoint continua passando. O cache NuGet do ambiente estava corrompido; os testes rodaram com `NUGET_PACKAGES` apontado para a pasta de pacotes do usuário.

`dotnet run --project src/Api -- export "$PWD/site"` gravou 359 dias. O 07/31 exportado traz `summary` com 3 parágrafos, sepultura “Igreja de Jesus”, ordem “Companhia de Jesus”, beatificação “27 de julho de 1609”, “Papa Gregório XV” e atributos “Casula, livro”.

### Página

`npm run build` (`tsc -b && vite build`) passou em 27/10/2026: 73 módulos, `dist/assets/index-DRmWhdPV.css` 27,94 kB, `dist/assets/index-DZ8wPiil.js` 284,75 kB.

Em `http://localhost:5174/`, com a pasta exportada servida em `http://localhost:5080` por `http-server --cors`, como o Pages serve os arquivos, na pausa, Capela, Última Ceia e dourado:

- A página fez um só pedido, `GET http://localhost:5080/santo-do-dia/10-27`, 200, e mostrou “Santo do dia: São Gonçalo de Lagos” debaixo da liturgia, só com o nome.
- O painel mostrou a foto com “Foto: Vitor Oliveira from Torres Vedras, PORTUGAL · CC BY-SA 2.0”, o título, a introdução (a biografia seguida de mais duas frases), “Vida” com Nascimento, Morte e Ordem religiosa (“Agostinianos”), “Veneração” com Venerado por, Beatificação (“2 de maio de 1778”), Festa, Padroeiro e Na arte (“Hábito agostiniano”), a linha “Calendário” e a fonte do texto e dos fatos. Sepultura, Canonização e Canonizado por não têm texto nesse dia e não apareceram. O corpo do drawer rolou até a fonte.
- Com o corpo de 07/31 servido no lugar de hoje: três parágrafos, “Vida” com as quatro linhas (Nascimento, Morte, Sepultura, Ordem religiosa) e “Veneração” com Venerado por, Beatificação, Canonização, Canonizado por, Festa e Na arte, nessa ordem.
- Com o corpo de 29/02: a biografia curta escrita para a API, “Vida” com Nascimento, Morte e Ordem religiosa, “Veneração” só com a festa, sem linha “Calendário” e sem nenhum `dd` vazio.
- Com o corpo publicado no Pages antes do merge da API (sem os campos novos): o painel abriu como antes, com a frase única de biografia, Nascimento e Morte, Venerado por, Festa e Padroeiro.
- Na Alvorada, o painel claro mostrou a foto, a legenda, a introdução, as linhas e a fonte legíveis. Com a pintura Santos ao fundo, o crédito “Santos, Bonifacio de’ Pitati. Domínio público · fonte” continuou visível no fim do palco, logo abaixo da dobra, como já acontecia na 011. Accent `gold` e tom `escura` não mudaram.
- No foco, a linha do santo saiu do DOM; na pausa, voltou.
- As chaves continuaram `pomodoro-catolico-music`, `pomodoro-catolico-v1` e `pomodoro-catolico-fundo`. Nenhum valor contém nome, introdução nem campo do santo.

Depois da verificação, o arquivo servido de 10/27 voltou a ser o exportado, e o navegador voltou à pausa, Capela, Última Ceia e dourado.

## Encerramento

Esta spec termina apenas quando todos os itens estiverem marcados e com evidência registrada, no formato definido em [Como executar](../../shared/como-executar.md).
