# 013-catalogo-limpo-do-santo

## Objetivo

Fazer cada dia do painel do santo mostrar o santo que a Canção Nova celebra naquele dia, com o artigo, a foto e os fatos dele, um título em português correto, o crédito da foto legível e só símbolos em “Na arte”.

## Contexto Técnico

A mudança é só da API do calendário dos santos (`C:\Levva\Estudo\SaintCalendar.Api`, repositório [saint-calendar-api](https://github.com/andersoncostadev/saint-calendar-api)). A página não muda: o contrato do `GET /santo-do-dia/{mm}-{dd}` fica igual, e o que muda é o conteúdo do retrato `src/Infrastructure.Data/Calendar/saints.json`.

O catálogo continua sendo um retrato gerado uma vez e commitado; o pedido do dia não consulta Wikipédia nem Wikidata. Do texto da Canção Nova continua saindo só qual santo cada dia celebra.

O retrato foi revisado inteiro em 27/10/2026, contra a Canção Nova (`tools/cancaonova-calendar.json`), a Wikidata e a Wikipédia em português. Os defeitos, por ordem de gravidade:

1. **Artigo de outra coisa ou de outra pessoa (17 dias).** `tools/generate-calendar.mjs` procura o nome da Canção Nova na Wikipédia (`resolveCancaoNova`) e aceita o artigo em `accepts`. Quando o item da Wikidata não é pessoa (`P31` diferente de `Q5`), basta o nome bater. Assim entraram uma dupla sertaneja, uma telenovela, um rio e outros homônimos. Dos 33 dias de pessoa sem festa (`P841`) no próprio dia, comparados um a um com a Canção Nova, 31 são o santo certo com outra grafia, e 2 são outra pessoa (02/06 e 10/09).
2. **Dia que não segue a Canção Nova (44 dias, 43 a corrigir).** Quando nenhum artigo da Canção Nova é aceito, o dia cai num santo escolhido pela Wikidata e perde a linha “Calendário”. É assim que o Natal mostra “Pedro, o Venerável”, a Anunciação mostra “Maria Alfonsina Danil Ghattas” e São José Operário mostra “Valburga”.
3. **Título.** Honorífico ausente (“Papa Paulo VI”, “Faustina Kowalska”), “Papa” entre o honorífico e o nome (“São Papa Leão IX”, 17 dias), concordância errada (“São Marta”, “São Inocentes”, “Beata Irmãs”), espanhol (“San Francisco Caracciolo”) e nome diferente do usado pela Canção Nova (“Santa Irmã Dulce”, “São Giuseppe Moscati”).
4. **Crédito da foto.** 57 dias com “Unknown author Unknown author”, outros com “Anonymous”, “unknown autor”, “op unknown”, avisos do Commons (“No machine-readable author provided…”) e pedidos de contato do autor. A licença “Public domain” sai em inglês em 258 dias.
5. **“Na arte” sem símbolo (18 dias).** A infobox traz feitos, apelidos ou patronatos (“Coroou Carlos Magno”, “Impedir Átila de destruir Roma”, “Concepção sem pecado”), atributos de outra santa (03/02, “Esposa, mãe…” para uma freira) ou texto cortado no meio (07/11).
6. **Pontuação repetida.** A biografia de 03/02 tem “Guerrero y González,, era”, que passou para a introdução.

Branch desta mudança, na API: `feature/clean-saint-catalog`. A página não ganha branch: só esta spec muda no repositório dela.

## Referências de Projeto

- [Produto](../../../memory/produto.md)
- [Contexto técnico global](../../../memory/contexto-tecnico.md)
- [Estrutura do projeto](../../../memory/estrutura.md)

## Referências Compartilhadas

- [Como executar](../../../shared/como-executar.md)
- [Regras de nomenclatura](../../../shared/regras-de-nomenclatura.md)
- Modelo de origem: [modelo-base](../../../templates/modelo-base.md)
- Contrato da API: [011-api-do-santo](../011-api-do-santo/spec.md) e [012-mais-sobre-o-santo](../012-mais-sobre-o-santo/spec.md)

## Observações Locais

### O santo do dia

- Todo dia com santo ou celebração na Canção Nova mostra esse santo ou essa celebração, com a linha “Calendário”. Ficam de fora só os dias sem nada na Canção Nova (29/02 e 05/10), que seguem a regra da Wikidata como hoje.
- Com mais de uma entrada no dia, vale a primeira que tiver artigo. Sem artigo em nenhuma, vale a primeira, com biografia escrita.
- Celebração móvel não fixa dia: Sagrado Coração de Jesus, Imaculado Coração de Maria, Cristo Rei, Batismo do Senhor, Sagrada Família, Santíssima Trindade, Corpus Christi, Pentecostes, Ascensão e Páscoa. Vale só a entrada cujo nome começa pela celebração (“Solenidade do Sagrado Coração de Jesus”), e não a de um santo devoto dela (“São José Manyanet, devoto da Sagrada Família”). Sem outra entrada no dia, vale a regra da Wikidata. Isso muda 06/25 (São Guilherme de Vercelli), 11/20 (fica o santo da Wikidata) e 12/30 (sai a Sagrada Família, que em 2026 cai em 27/12).
- Um item da Wikidata continua sem se repetir em dois dias. Celebração do mesmo santo em outro dia usa o artigo da celebração (01/05, “São José Operário”), ou biografia escrita.

### Aceite do artigo

- Item que não é pessoa só entra pelo nome quando o `P31` dele é de um tipo religioso: título de Maria, festividade cristã, episódio do Evangelho, dogma, solenidade, grupo de humanos, dupla, personagem bíblico humano, anjo ou arcanjo. Palacete, dupla sertaneja, filme, telenovela, rio, município, freguesia, protolíngua, figura mitológica e lista ficam de fora.
- Grupo, dupla ou personagem bíblico sem festa (`P841`) no dia não entra só pelo nome: precisa de título manual em `tools/cancaonova-titles.json`.
- O gerador lista no console os dias aceitos por item que não é pessoa, e os de pessoa sem festa no dia, para a revisão do retrato.
- Dia que hoje está certo e a regra nova recusar, como “Exaltação da Santa Cruz” (item sem `P31`) ou “Cátedra de São Pedro” (item de escultura), ganha título manual com o mesmo artigo de hoje.

### Artigo de outra coisa ou de outra pessoa

| Dia | Hoje | O que é | Passa a |
| --- | --- | --- | --- |
| 01/23 | Santo Ildefonso | freguesia do Porto | artigo “Ildefonso de Toledo” |
| 02/01 | Santa Veridiana | Palacete Veridiana da Silva Prado | biografia escrita |
| 02/17 | Sete Santos | os Sete Apóstolos dos Eslavos | biografia escrita, “Sete Santos Fundadores dos Servitas” |
| 02/19 | São Conrado | dupla sertaneja Conrado & Aleksandro | artigo “Conrado de Placência” |
| 02/24 | São Sérgio | Sérgio e Baco, festa em 7 de outubro | artigo “Sérgio da Capadócia” |
| 03/16 | Santa Eusébia | daemon da mitologia grega | biografia escrita |
| 03/22 | São Zacarias | o pai de João Batista | artigo “Papa Zacarias” |
| 03/31 | São Benjamim | o filho de Jacó | biografia escrita |
| 06/02 | São Marcelino e São Pedro | o Papa Marcelino | artigo “Marcelino e Pedro” |
| 06/16 | São Ciro | Ciro e João | artigo “Ciro e Julita”, título “São Ciro e Santa Julita” |
| 06/20 | Beata Irmãs | o filme *Sisters* | artigo “Beata Teresa de Portugal”, título “Beatas Teresa, Mafalda e Sancha” |
| 09/11 | São Proto | protolíngua | biografia escrita, “Santos Proto e Jacinto” |
| 09/12 | São Nilo | rio Nilo | artigo “Nilo, o Moço” (a Canção Nova celebra Nilo, o Jovem) |
| 10/09 | São Papa Dionísio | o Papa Dionísio | biografia escrita, “São Dionísio de Paris” |
| 10/19 | São Pedro de Alcântara | município de Santa Catarina | artigo “Pedro de Alcântara” |
| 12/10 | Nossa Senhora de Loreto | lista de datas | biografia escrita (o artigo restante é o do santuário, um lugar) |
| 12/28 | São Inocentes | telenovela da Rede Tupi | artigo “Massacre dos Inocentes”, título “Santos Inocentes” |

Os artigos foram conferidos na Wikipédia em português em 27/10/2026. Em 06/20, as três irmãs têm artigo próprio; o dia usa o da primeira, como 05/03 usa o de São Filipe para “São Filipe e São Tiago”.

### Dia que não segue a Canção Nova

Cada dia passa ao santo ou à celebração da Canção Nova: artigo por título manual quando houver, biografia escrita quando não houver.

| Dia | Hoje | Canção Nova |
| --- | --- | --- |
| 01/12 | Martinho de Leão | São Bernardo de Corleone |
| 01/18 | Margarida da Hungria | Santa Prisca |
| 01/29 | Gildas | São Constâncio |
| 01/30 | Batilde | Santa Jacinta Marescotti |
| 02/02 | Nicola Saggio | São Cornélio de Cesareia; Apresentação do Senhor |
| 02/25 | Papa Félix III | São Toríbio Romo |
| 03/01 | Davi de Menévia | Santa Inês Cao Kuiying |
| 03/03 | Cunegunda de Luxemburgo | Santa Catarina Drexel |
| 03/10 | João Ogilvie | Santa Maria Eugênia de Jesus |
| 03/11 | Eulógio de Córdoba | Santos Marcos Chong e Aleixo Se-yong |
| 03/13 | Rodrigo de Córdova | Santos Rodrigo e Salomão |
| 03/14 | Matilde de Ringelheim | Santa Matilde da Alemanha |
| 03/20 | Józef Bilczewski | Santa Maria Josefa |
| 03/23 | Toríbio de Mongrovejo | São Turíbio de Mongrovejo |
| 03/25 | Maria Alfonsina Danil Ghattas | Anunciação do Senhor |
| 03/28 | Gontrão da Borgonha | São Sebastião Pelczar |
| 04/14 | Santa Lidvina | Santa Ludovina |
| 04/20 | Papa Aniceto | Santa Inês de Montepulciano |
| 04/24 | Fiel de Sigmaringa | Santa Maria Isabel Hesselblad |
| 05/01 | Valburga | São José Operário |
| 05/04 | Gotardo de Hildesheim | Santa Antonina de Niceia |
| 05/05 | Ângelo da Sicília | Beato Gregório Frackowiak |
| 05/07 | Dômnio de Salona | Beato Francisco Paleari |
| 05/08 | Vítor da Mauritânia | Beata Ulrica |
| 05/09 | Luísa de Marillac | Beato Estêvão Grelewski |
| 05/16 | André Bobola | Beato Vital Vladimiro Bajrak |
| 05/17 | Pascoal Bailão | São Pedro Liu Wenyuan |
| 05/23 | Desidério de Vienne | São João Batista de Rossi |
| 05/29 | Papa Paulo VI | Santa Úrsula Ledóchowska |
| 06/12 | Papa Leão III | Beato Francisco Kesy e companheiros |
| 06/25 | Próspero da Aquitânia | São Guilherme de Vercelli |
| 07/28 | Pedro Poveda Castroverde | Beatos José Caselles Moncho e José Castell Camps |
| 08/05 | Osvaldo da Nortúmbria | Dedicação da Basílica de Santa Maria Maior |
| 08/06 | Anna Maria Rubatto | Transfiguração do Senhor |
| 08/26 | Mariam Baouardy | São Zeferino |
| 08/29 | Dominik Jędrzejewski | Martírio de São João Batista |
| 10/02 | Emilie de Villeneuve | Santos Anjos da Guarda |
| 11/02 | São Vitorino de Pettau | Fiéis Defuntos |
| 11/09 | Teodoro de Amásia | Dedicação da Basílica de Latrão |
| 11/18 | Paulo de Tarso | Dedicação das Basílicas de São Pedro e de São Paulo |
| 12/15 | Virginia Centurione Bracelli | São Valeriano |
| 12/17 | Begga de Landen | São José Manyanet |
| 12/25 | Pedro, o Venerável | Natal do Senhor |

11/20 também está fora da Canção Nova hoje, mas a única entrada é Cristo Rei, que é móvel: o dia fica como está. Em vários dias o nome da Canção Nova é uma frase (“São Toríbio Romo rezava…”), e o gerador não separou o nome; o título manual resolve. O santo que hoje ocupa um desses dias e sai dele não precisa aparecer em outro dia.

### Biografia escrita

- Vale para os dias de santo da Canção Nova sem artigo na Wikipédia em português. Ela fica em `tools/written-biographies.json`, como 29/02.
- Uma ou duas frases, escritas a partir dos fatos da Wikidata (CC0), com texto próprio. O texto da Canção Nova não é copiado.
- O item da Wikidata é o do santo (pessoa ou grupo, com status de santo ou beato em `P411`, ou festa no dia). Sem item, o dia sai só com título, biografia e a linha “Calendário”, e isso fica registrado na evidência.
- O dia mantém a linha “Calendário”, com o link da Canção Nova. A fonte é “Wikidata; biografia escrita para esta API”, CC0 1.0, com o link do item.
- Sem `summary`, pela regra da 012. Foto, vida e veneração vêm do item quando houver.

### Foto e fatos dos dias que mudam de santo

Hoje esses dias carregam a foto e os fatos do item errado. Exemplos: a vista de Cairo em 12/09, uma cena do filme em 20/06, a prefeitura do Porto em 23/01, “Nascimento: 1653 a.C., Canaã” em 31/03 e “Na arte: Espírito da piedade, da lealdade e do respeito filial” em 16/03.

- Em todo dia que muda de santo, nada do item antigo fica: foto, crédito, vida, veneração, introdução e fonte dos fatos vêm do artigo ou do item novo, ou saem quando ele não tiver.
- Sem foto com licença de reuso, o dia fica sem foto, como já acontece em 14 dias.

### Título

- Dia da Canção Nova: honorífico e nome como a Canção Nova escreve, sem o aposto que vem depois da vírgula, dos dois-pontos ou do verbo: “São Leão IX”, “Santa Dulce dos Pobres”, “São José Moscati”, “Beato João Schiavo”, “São Henrique II”, “Santo Antônio de Sant’Anna Galvão”, “São Francisco e Santa Jacinta Marto”, “Santos Marta, Maria e Lázaro”. Grupo cujo nome tem vírgula fica no título manual.
- Dia da Wikidata: honorífico pelo status em `P411` e pelo sexo em `P21`. “São” antes de consoante, “Santo” antes de vogal ou H, “Santa”, “Beato” e “Beata”. Sem status de santo ou beato, sem honorífico (“Serva de Deus” não vira “Santa”).
- “Papa” nunca fica entre o honorífico e o nome: “São Papa Pio X” vira “São Pio X”, “Papa Paulo VI” vira “São Paulo VI”.
- Honorífico concorda em gênero e número (“Santa Marta”, “Santos Inocentes”, “Beatas”), e o título fica em português (“São Francisco Caracciolo”, não “San”).
- Celebração (“Natal do Senhor”, “Anunciação do Senhor”, “Nossa Senhora de Lourdes”) não leva honorífico.

### Crédito da foto

- Autor desconhecido em qualquer forma vira “Autor desconhecido”: “Unknown author”, “Unknown artist”, “Unknown photographer”, “Unknown”, “Anonymous”, “anonymous”, “artist unknow”, “unknown autor”, “op unknown”, “Auteur inconnu…”, “Original author unknown…”, “Unknown Spanish painter”, “Anonymous Byzantine painter…”.
- Nome repetido sai (“Unknown author Unknown author”). A parte identificada fica: “Unknown author Unknown author ; Photo taken by Arnaldo Vescovo” vira “Autor desconhecido; foto: Arnaldo Vescovo”.
- Aviso do Commons sai: “No machine-readable author provided. Sailko assumed (based on copyright claims).” vira “Sailko”; pedido de contato, texto de licença, “Public domain image” e “originally uploaded by…” saem; o nome do arquivo e “derivative work” viram só os autores.
- No máximo 80 caracteres, cortado no último separador (`;`, `,` ou `:`) antes do limite.
- “Public domain” vira “Domínio público”, como nos créditos de fundo da página. As licenças Creative Commons ficam como estão.

### “Na arte”

Infobox que traz feito, apelido, patronato, atributo de outra santa ou texto cortado não vale para estes dias. Fica em `tools/fact-overrides.json`, por dia e campo: `null` recusa a infobox e usa a Wikidata (`P4185`) ou tira a linha; texto substitui o valor.

| Dia | Hoje | Passa a |
| --- | --- | --- |
| 02/11 | Aparição mariana presenciada por Santa Bernardete Soubirous | `null` |
| 02/20 | Devoção a Jesus-Eucaristia | `null` |
| 03/02 | Esposa, mãe, mìstica, visionária, terceira trinitário… | `null` |
| 03/17 | Pregar o cristianismo na Irlanda, … trebor e cruz | “Trevo e cruz” |
| 05/24 | Protetora da família e do lar | `null` |
| 06/10 | Proteção da nação portuguesa, … | `null` |
| 06/12 | Coroou Carlos Magno como Sacro Imperador Romano-Germânico | `null` |
| 06/21 | Jovens e estudantes | `null` |
| 06/23 | Padre da Forca | `null` |
| 06/27 | Imagem pintada pelo evangelista São Lucas | `null` |
| 08/24 | Faca e pedaço de pele. Padroeiro dos padeiros, … | “Faca e pedaço de pele” |
| 09/04 | Salvar Palermo da peste e ser alimentada… | `null` |
| 10/13 | Membro da Associação dos Salesianos Cooperadores | `null` |
| 10/16 | Vidente do Sagrado Coração de Jesus | `null` |
| 11/07 | Hábito de bispo e báculo. Ele é muitas vezes representado … porque segundo a lenda | “Hábito de bispo e báculo” |
| 11/10 | Impedir Átila de destruir Roma | `null` |
| 11/27 | Aparições a Santa Catarina de Labouré e a revelação da Medalha Milagrosa | `null` |
| 12/08 | Concepção sem pecado | `null` |

Em 06/12 e 11/10, o dia pode mudar de santo pela seção “Título” ou pela Canção Nova; a recusa vale enquanto o dia for desse santo. Atributo de dia que muda de santo vem do item novo.

### Pontuação

- Vírgula, ponto e vírgula ou dois-pontos repetidos, com ou sem espaço entre eles, viram um só, na biografia e na introdução. O ponto de reticências fica.
- O dia corrigido assim passa a “Wikipédia, trecho adaptado”, se ainda não estiver.

## Tasks

### Tasks - API

- [x] Aceite do artigo: item que não é pessoa só pelos tipos religiosos, título manual para grupo, dupla ou personagem bíblico sem festa no dia, e lista no console dos aceites para revisão
- [x] O santo do dia: primeira entrada da Canção Nova com artigo, depois biografia escrita; celebração móvel ignorada; título manual para os 17 dias de “Artigo de outra coisa ou de outra pessoa”, os 43 de “Dia que não segue a Canção Nova” que tiverem artigo, e cada dia certo que a regra nova recusar
- [x] Biografia escrita, com o item da Wikidata, para cada dia de santo da Canção Nova sem artigo, e o gerador mantendo neles a linha “Calendário”
- [x] Título pelas regras de “Título”
- [x] Crédito da foto pelas regras de “Crédito da foto”
- [x] `tools/fact-overrides.json` com os 18 dias de “Na arte”, aplicado por `enrich-life-veneration.mjs`
- [x] Juntar pontuação repetida na biografia e na introdução
- [x] Regenerar o retrato (`generate-calendar.mjs`, `enrich-summary.mjs`, `enrich-life-veneration.mjs`) e conferir que fora dos dias que mudam de santo só mudaram título, crédito, “Na arte” dos 18 dias e pontuação, com o mesmo santo, artigo, biografia, foto e fatos
- [x] Testes: os 17 dias com o artigo ou o item esperado e sem a foto ou o item de fatos de antes; todo dia com entrada fixa na Canção Nova com a linha “Calendário”; dias com biografia escrita sem `summary`; título com honorífico ou de celebração, sem “Papa” depois do honorífico e sem “San”; crédito sem forma de autor desconhecido em outra língua, sem nome repetido, até 80 caracteres e com “Domínio público”; os 18 dias de “Na arte” com o valor da tabela ou sem a infobox; nenhuma pontuação repetida; endpoint igual ao arquivo exportado
- [x] `dotnet test` e exportação; PR para o `main` da API e Pages publicado

### Tasks - Documentacao

- [x] README da API: santo do dia pela Canção Nova, aceite do artigo, celebração móvel, biografia escrita, título, crédito e `fact-overrides.json`
- [x] Registrar nesta spec cada dia que mudou de santo, com o artigo ou o item, a foto de antes e de depois, e a lista final de dias com biografia escrita

### Tasks - Verificacao

- [x] No Pages, `GET` de 02/19, 06/20, 12/25, 05/01, 03/25, 02/01, 03/02 e 04/19 com o santo, o título, o crédito e o texto esperados
- [ ] Em `http://localhost:5174/`, com o retrato exportado servido como no Pages, abrir no lugar de hoje um dia com biografia escrita (02/01), o Natal (12/25) e um dia com crédito corrigido, e conferir texto, título, linha “Calendário”, crédito e fonte, sem linha vazia
- [x] Confirmar que as chaves do navegador continuam `pomodoro-catolico-v1`, `pomodoro-catolico-fundo` e `pomodoro-catolico-music`, sem campo de santo

## Resultado Esperado

- Todo dia com santo ou celebração fixa na Canção Nova mostra esse santo ou essa celebração, com a linha “Calendário”.
- Nenhum dia fala de um lugar, obra, grupo musical ou pessoa que não seja o santo do dia, nem mostra a foto ou os fatos deles.
- Santo sem artigo em português aparece com biografia curta e o link da Canção Nova, e não é trocado por outro santo.
- Título em português, com honorífico certo e sem “Papa” no meio; crédito da foto legível e em português; “Na arte” só com símbolos.
- O próximo `generate-calendar.mjs` não aceita de novo um homônimo que não seja de tipo religioso, e os títulos, créditos e recusas de infobox saem iguais.
- O contrato da API e a página ficam como estão.

## Evidência

Retrato gerado em 28/10/2026 por `generate-calendar.mjs`, `enrich-summary.mjs` e `enrich-life-veneration.mjs`. `dotnet test src/SaintCalendar.Api.slnx`: 80 testes aprovados. Exportação: 359 dias em `site/santo-do-dia`.

Pull request [saint-calendar-api#2](https://github.com/andersoncostadev/saint-calendar-api/pull/2) entrou no `main` em 28/10/2026 (`654a5ba`). O workflow do Pages `40758050153` concluiu com sucesso. Em `https://andersoncostadev.github.io/saint-calendar-api/santo-do-dia/{mm}-{dd}`, os oito dias responderam 200, com `Access-Control-Allow-Origin: *` e `Last-Modified: Wed, 28 Oct 2026 19:52:09 GMT`:

- 02/19: São Conrado; foto de Giovanni Lanfranco, domínio público; linha da Canção Nova.
- 06/20: Beatas Teresa, Mafalda e Sancha; foto de António de Holanda, domínio público.
- 12/25: Natal do Senhor; foto de Bartolomé Esteban Murillo, domínio público.
- 05/01: São José Operário; sem foto.
- 03/25: Anunciação do Senhor; foto de El Greco, domínio público.
- 02/01: Santa Veridiana; biografia escrita; sem `summary`; crédito “Autor desconhecido”.
- 03/02: Santa Ângela da Cruz; fonte “Wikipédia, trecho adaptado”; sem vírgula dupla e sem a linha “Na arte” da infobox.
- 04/19: São Leão IX; crédito “Autor desconhecido”, domínio público.

359 dias no catálogo. 356 com a linha da Canção Nova. Ausentes, como já estavam ou pela regra de celebração móvel: 02/13, 03/29, 06/08, 06/17, 09/06, 12/22 e 12/30. Sem Canção Nova: 02/29 (já era biografia escrita), 10/05 e 11/20 (a única entrada da Canção Nova é Cristo Rei, móvel; o dia fica Santo Edmundo). 10/29 entrou: São Narciso, que a Canção Nova celebra e o retrato anterior não tinha.

Nos 302 dias com o mesmo artigo ou item, mudaram 147 títulos, 233 créditos e 17 atributos de “Na arte”. A biografia mudou só em 03/02, para tirar a vírgula dupla. Fotos trocadas no mesmo santo: 0. Fatos de vida trocados no mesmo santo: 0. Três arquivos de foto que o gerador tinha trocado no mesmo santo (05/30, 06/01 e 11/08) voltaram ao arquivo anterior, com o crédito limpo.

02/17 usa o artigo “Sete Santos Fundadores da Ordem Servita”, e 10/09 usa “Dinis de Paris”. A tabela desta spec previa biografia escrita; o artigo certo em português existe, então o dia ficou no artigo.

Sem item da Wikidata, e por isso sem `source`: 03/16, 05/04, 05/07, 07/28, 11/18, 12/15. Nesses dias ficam título, biografia e a linha “Calendário”. Francisco Paleari tem o item Q3750384, mas sem status de santo ou beato e sem festa no dia, então o item não foi ligado. Valeriano (Q3554325) tem festa em 23/07, não em 15/12, e não foi chamado de bispo de Cimiez.

Frases conferidas em página do Vaticano, sem copiar o que a página não diz: Bernardo de Corleone (nascimento, capuchinho, morte em Palermo); Toríbio Romo (nascimento, morte, devoção à Eucaristia; o patronato dos migrantes não entra); Catarina Drexel (nascimento em Filadélfia, fundação, morte; o ano de beatificação fica de fora porque a biografia e a lista de beatos divergem); Úrsula Ledóchowska (ursulina, 1865–1939); José Manyanet (1833–1901; o corpo da página diz 1933, o cabeçalho diz 1833). Pelczar: a página vaticana situa a festa em 19/01 e a morte na noite de 28/03/1924. O catálogo segue a Canção Nova e o artigo, em 28/03. Prisca está na Wikidata como existência disputada; a frase não afirma ano de nascimento.

Biografias escritas: 01/12 (Q733329); 01/18 (Q426200); 01/29 (Q936653); 01/30 (Q2528727); 02/01 (Q3949268); 02/25 (Q1408965); 02/29 (Q1273281); 03/01 (Q4503086); 03/03 (Q254227); 03/11 (Q11768071); 03/16 (sem item); 03/31 (Q540436); 05/04 (sem item); 05/05 (Q1551196); 05/07 (sem item); 05/09 (Q2208870); 05/16 (Q4075668); 05/17 (Q20062935); 05/29 (Q78649); 06/12 (Q95014); 06/25 (Q2197784); 07/28 (sem item); 09/11 (Q3394205); 11/18 (sem item); 12/10 (Q9094350); 12/15 (sem item).

Dias que mudaram de artigo ou de item:

| Dia | Antes | Depois | Foto antes | Foto depois |
| --- | --- | --- | --- | --- |
| 01/12 | Martinho_de_Leão, Martinho de Leão | Q733329, São Bernardo de Corleone | 960px-MartinLeo12.jpg | 960px-Fortunat_Bergant_-_Sv._Bernard_Korleonski.jpg |
| 01/18 | Margarida_da_Hungria, Margarida da Hungria | Q426200, Santa Prisca | Arpadhazi_szent_margit.jpg | Santa_Prisca.jpg |
| 01/23 | Santo_Ildefonso, Santo Ildefonso | Ildefonso_de_Toledo, Santo Ildefonso | 960px-Ayuntamiento_de_Oporto,_Portugal,_2012-05-09,_DD_02.JPG | 960px-El_Greco_032_(cropped).jpg |
| 01/29 | Gildas, Gildas | Q936653, São Constâncio | 960px-Statue_St-Gildas_0708_NB1.jpg | Pietro_Perugino_Virgin_Mary_and_Saints.JPG |
| 01/30 | Batilda, Batilde | Q2528727, Santa Jacinta Marescotti | 960px-Luxembourg_-_Sainte_Bathilde.jpg | Santa_Giacinta_Marescotti.jpg |
| 02/01 | Palacete_Veridiana_da_Silva_Prado, Santa Veridiana | Q3949268, Santa Veridiana | 960px-Chacara_Da._Veridiana.jpg | 960px-S.Verdiana,_Museo_di_Santa_Verdiana.jpg |
| 02/02 | Nicola_Saggio, Nicola Saggio | Cornélio,_o_Centurião, São Cornélio de Cesareia | 960px-San_Nicola_Saggio_da_Longobardi_(cropped).JPG | Baptism_of_cornelius.jpg |
| 02/17 | Sete_Santos, Sete Santos | Sete_Santos_Fundadores_da_Ordem_Servita, Sete Santos Fundadores dos Servitas | Sv_Sedmočislenici_with_Jovan_Kukuzel_in_Ardenica.jpg | SetServitesFondatori.jpg |
| 02/19 | Conrado_&_Aleksandro, São Conrado | Conrado_de_Placência, São Conrado | sem foto | 960px-Saint_Conrad_Confalonieri-Giovanni_Lanfranco-MBA_Lyon_A124-IMG_0341.jpg |
| 02/24 | Sérgio_e_Baco, São Sérgio | Sérgio_da_Capadócia, São Sérgio | Sergebac7thcentury.jpg | sem foto |
| 02/25 | Papa_Félix_III, Papa Félix III | Q1408965, São Toríbio Romo | Pope_Felix_III_Illustration.jpg | Toribio_Romo_González.jpg |
| 03/01 | Davi_de_Menévia, Davi de Menévia | Q4503086, Santa Inês Cao Kuiying | 960px-Saint_Non's_Chapel_-_Fenster_5_St.David_top.jpg | sem foto |
| 03/03 | Cunegunda_de_Luxemburgo, Cunegunda de Luxemburgo | Q254227, Santa Catarina Drexel | 960px-Kunigunde.png | Katharine_Drexel.jpg |
| 03/10 | João_Ogilvie, João Ogilvie | Marie-Eugénie_de_Jésus, Santa Maria Eugênia de Jesus | John_Ogilvie_martyr.jpg | Marie_Eugénie_de_Jésus_Milleret_de_Brou.jpg |
| 03/11 | Eulógio_de_Córdova, Eulógio de Córdoba | Q11768071, Santos Marcos Chong e Aleixo Se-yong | 960px-EulogioCordovamart.JPG | sem foto |
| 03/16 | Eusébia, Santa Eusébia | sem item, Santa Eusébia | sem foto | sem foto |
| 03/20 | Józef_Bilczewski, Józef Bilczewski | María_Josefa_Sancho, Santa Maria Josefa | Józef_Bilczewski.png | MSanchodeGuerra.jpg |
| 03/22 | Zacarias_(sacerdote), São Zacarias | Papa_Zacarias, São Zacarias | Prophet_Zechariah,_Daphni.jpg | 960px-Età_di_papa_Zaccaria,_cappella_del_primicerius_Teodoro,_Madonna_in_trono_con_Theodoto_e_la_moglie,_741-752_(09).jpg |
| 03/25 | Maria_Alfonsina_Danil_Ghattas, Maria Alfonsina Danil Ghattas | Anunciação, Anunciação do Senhor | Marie-Alphonsine-Danil-Ghattas.jpg | 960px-Annunciation_by_El_Greco_(1570-1575,_Prado).jpg |
| 03/28 | Gontrão_de_Borgonha, Gontrão da Borgonha | Józef_Sebastian_Pelczar, São Sebastião Pelczar | Gontran_et_Childebert_II.JPG | Pelczar.jpg |
| 03/31 | Benjamim, São Benjamim | Q540436, São Benjamim | 960px-Attributed_to_Abraham_van_Dijck_001.jpg | Benjamin_von_Persien.jpg |
| 04/20 | Papa_Aniceto, Papa Aniceto | Inês_de_Montepulciano, Santa Inês de Montepulciano | Pope_Anicetus.jpg | 960px-Friesach_-_Dominikanerkirche_-_Hochaltar_-_Hl_Agnes_von_Montepulciano0.jpg |
| 04/24 | Fiel_de_Sigmaringa, Fiel de Sigmaringa | Elisabeth_Hesselblad, Santa Maria Isabel Hesselblad | 960px-Pfärrenbach_Wandmalerei_Fidelis_von_Sigmaringen.jpg | Elisabeth_Hesselblad.jpg |
| 05/01 | Valburga, Valburga | Festa_de_São_José_Operário, São José Operário | Heilige_Walburga.jpg | sem foto |
| 05/04 | Gotardo_de_Hildesheim, Gotardo de Hildesheim | sem item, Santa Antonina de Nicéia | 960px-Corenno_Plinio_-_St.Gotthard.jpg | sem foto |
| 05/05 | Ângelo_da_Sicília, Ângelo da Sicília | Q1551196, Beato Gregório Frackowiak | 960px-San_Ángelo,_de_Antonio_de_Pereda_y_Salgado_(Museo_del_Prado).jpg | GRZEGORZ_FRACKOWIAK.jpg |
| 05/07 | Dômnio_de_Salona, Dômnio de Salona | sem item, Beato Francisco Paleari | Saintduje.jpg | sem foto |
| 05/08 | Vítor,_o_Mouro, Vítor da Mauritânia | Franziska_Nisch, Beata Ulrica | 960px-Jacopo,_gentile_e_giovanni_bellini,_polittico_della_natività,_da_s.m._della_carità,_1464-70_ca.,_05.JPG | Ulrika_Nisch.jpg |
| 05/09 | Luísa_de_Marillac, Luísa de Marillac | Q2208870, Beato Estêvão Grelewski | 960px-Lima_Miraflores_Cathedral_Stained_Glass_Santa_Luisa.jpg | sem foto |
| 05/16 | André_Bobola, André Bobola | Q4075668, Beato Vital Vladimiro Bajrak | Bobola.jpg | Vitalij_Bajrak.jpg |
| 05/17 | Pascoal_Bailão, Pascoal Bailão | Q20062935, São Pedro Liu Wenyuan | LienzoS_Pascual.jpg | sem foto |
| 05/23 | Desidério_de_Vienne, Desidério de Vienne | João_Batista_de_Rossi, São João Batista de Rossi | 960px-Saint-Didier_(35)_Église_Saint-Didier_et_Saint-Golven_07.jpg | Giovanni_Battista_de'_Rossi.jpg |
| 05/29 | Papa_Paulo_VI, Papa Paulo VI | Q78649, Santa Úrsula Ledóchowska | 960px-Pope_Paul_VI_1969_Portrait_(4x5_cropped).jpg | Ursula_Leduhovskaya_in_1907.jpg |
| 06/02 | Papa_Marcelino, São Marcelino e São Pedro | Marcelino_e_Pedro, São Marcelino e São Pedro | Marcellinus.jpg | 960px-Codex_Bodmer_127_073r_Detail_1.jpg |
| 06/12 | Papa_Leão_III, Papa Leão III | Q95014, Beato Francisco Kesy e companheiros | Pope_Leo_III_–_Triclinium_Leoninum.jpg | 960px-X_Franciszek_Kesy.jpg |
| 06/16 | Ciro_e_João, São Ciro | Ciro_e_Julita, São Ciro e Santa Julita | Cyrus_and_John.jpg | 960px-QuricusJulietIconLife.jpg |
| 06/20 | Sisters_(filme), Beata Irmãs | Beata_Teresa_de_Portugal, Beatas Teresa, Mafalda e Sancha | Jennifer_Salt,_William_Finley,_and_Margot_Kidder_in_Sisters.png | 960px-D._Teresa_de_Portugal,_Rainha_de_Leão_-_The_Portuguese_Genealogy_(Genealogia_dos_Reis_de_Portugal).png |
| 06/25 | Próspero_da_Aquitânia, Próspero da Aquitânia | Q2197784, São Guilherme de Vercelli | Aquitániai_Szent_Prosper.jpg | 960px-StWilliam-FounderSaint.jpg |
| 07/28 | Pedro_Poveda_Castroverde, Pedro Poveda Castroverde | sem item, Beatos José Caselles Moncho e José Castell Camps | Pedro_Poveda.jpg | sem foto |
| 08/05 | Osvaldo_da_Nortúmbria, Osvaldo da Nortúmbria | Basílica_de_Santa_Maria_Maior, Dedicação da Basílica de Santa Maria Maior | 960px-Hl._Oswald_von_Northumbrien_2.jpg | 960px-Basilica_di_Santa_Maria_Maggiore_-_Roma.jpg |
| 08/06 | Anna_Maria_Rubatto, Anna Maria Rubatto | Transfiguração_de_Jesus, Transfiguração do Senhor | Anna_Maria_Rubatto.jpg | 960px-Transfiguration_by_Feofan_Grek_from_Spaso-Preobrazhensky_Cathedral_in_Pereslavl-Zalessky_(15th_c,_Tretyakov_gallery).jpeg |
| 08/26 | Mariam_Baouardy, Mariam Baouardy | Papa_Zeferino, São Zeferino | L_srmariam.jpg | 960px-Fresco_of_Pope_Zephyrinus_-_Basilica_of_Saint_Paul_Outside_the_Walls_(Before_1823).png |
| 08/29 | Dominik_Jędrzejewski, Dominik Jędrzejewski | Decapitação_de_João_Baptista, Martírio de São João Batista | KsDominikJedrzejewski.jpg | 960px-Salome_with_the_Head_of_John_the_Baptist-Caravaggio_(1610).jpg |
| 09/11 | Proto-macro-jê, São Proto | Q3394205, Santos Proto e Jacinto | sem foto | Protus_hyacinth.jpg |
| 09/12 | Rio_Nilo, São Nilo | Nilo,_o_Moço, São Nilo | 960px-Cairo_skyline,_Panoramic_view,_Egypt.jpg | 960px-San_Nicodemo_-_Ritratto_San_Nilo.jpg |
| 10/02 | Emilie_de_Villeneuve, Emilie de Villeneuve | Anjo_da_guarda, Santos Anjos da Guarda | 960px-Jeanne_Emilie_de_Villeneuve.jpg | 960px-Ангел-хранитель_Мстёрская_икона.jpg |
| 10/09 | Papa_Dionísio, São Papa Dionísio | Dinis_de_Paris, São Dionísio de Paris | Pope_Dionysius.jpg | sem foto |
| 10/19 | São_Pedro_de_Alcântara, São Pedro de Alcântara | Pedro_de_Alcântara, São Pedro de Alcântara | 960px-Igreja.São_Pedro_de_Alcântara.JPG | 960px-Clevelandart_2009.81.jpg |
| 10/29 | ausente | Narciso_de_Jerusalém, São Narciso | sem foto | 960px-Bénévent-l’Abbaye_Saint-Barthélémy_Vitrail_Narcissus_of_Jerusalem_(cropped).jpg |
| 11/02 | Vitorino_de_Pettau, São Vitorino de Pettau | Dia_dos_Fiéis_Defuntos, Fiéis Defuntos | Victorinus_(cropped).jpg | 960px-William-Adolphe_Bouguereau_(1825-1905)_-_The_Day_of_the_Dead_(1859).jpg |
| 11/09 | Teodoro_de_Amásia, Teodoro de Amásia | Arquibasílica_de_São_João_de_Latrão, Dedicação da Basílica de Latrão | Theodore_Tyro.jpg | 960px-San_Giovanni_in_Laterano_2021.jpg |
| 11/18 | Paulo_de_Tarso, Paulo de Tarso | sem item, Dedicação das Basílicas de São Pedro e de São Paulo | 960px-Giovanni_Francesco_Barbieri_-_Saint_Paul.jpg | sem foto |
| 12/10 | Lista_de_datas_comemorativas_de_Nossa_Senhora, Nossa Senhora de Loreto | Q9094350, Nossa Senhora de Loreto | sem foto | 960px-Madonna_di_Loreto.jpg |
| 12/15 | Virginia_Centurione_Bracelli, Virginia Centurione Bracelli | sem item, São Valeriano | 960px-Virgina_Centurione_Pittura_Busto.jpg | sem foto |
| 12/17 | Begga_de_Landen, Begga de Landen | Josep_Manyanet_i_Vives, São José Manyanet | 960px-Jacob_Jordaens_-_Saint_Begga.jpg | PadreManyanetPortrait.jpg |
| 12/25 | Pedro,_o_Venerável, Pedro, o Venerável | Natal, Natal do Senhor | Peter_the_Venerable.jpg | 960px-Adoration_of_the_Shepherds,_Murillo_(Prado_Museum).jpg |
| 12/28 | Os_Inocentes, São Inocentes | Massacre_dos_Inocentes, Santos Inocentes | sem foto | 960px-Santa_Giustina_(Padua)_-_Chapel_of_Saint_Luke_-_Massacre_of_the_Innocents_by_Sebastiano_Galvano.jpg |
| 12/30 | Sagrada_Família, Sagrada Família | ausente | 960px-Julius_Frank_Maria_und_Josef_mit_dem_Jesusknaben.jpg | sem foto |

## Encerramento

Esta spec termina apenas quando todos os itens estiverem marcados e com evidência registrada, no formato definido em [Como executar](../../../shared/como-executar.md).
