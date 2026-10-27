# 011-api-do-santo

## Objetivo

Deixar registrado o caminho de uma API .NET própria, com um santo em cada dia civil do calendário atual e texto que se pode republicar, para a página passar a lê-la quando essa API existir.

## Contexto Técnico

Esta escrita não gera projeto, código, JSON nem pedido de rede. A página continua sem hospedar API, BFF, conta nem servidor. O projeto .NET nasce fora deste repositório. Aqui fica o contrato que a página poderá consumir.

A spec [010-santo-do-dia](../010-santo-do-dia/spec.md) segue parada. O `GET` da Canção Nova respondeu 200 sem `access-control-allow-origin`, e o artigo, a oração e a foto de `santo.cancaonova.com` não entram numa API nossa. Esta spec substitui essa origem no dia em que for executada. Até lá, a página não pede santo.

O calendário é o das festas fixas como estão em 2026, não o calendário anterior a 1970 e não a féria da liturgia. A liturgia que a página já pede permanece. A data do santo é o mês e o dia, porque a festa fixa se repete todo ano. 29 de fevereiro entra no catálogo. Festa móvel não vira santo do dia.

A página só aponta o adaptador para o host novo quando a resposta, com `Origin`, trouxer `access-control-allow-origin` (`*` ou a origem da página). O desenho é o da liturgia: o pedido nasce em `infra`, o caso de uso vê um protocolo que devolve o corpo ou `null`, a leitura do JSON é função pura em `domain`, e a tela chama factory. Sem chave nova. O texto e a URL da foto não entram no `localStorage`. A foto não substitui o fundo.

Branch desta mudança, quando a execução começar: `feature/saint-calendar-api`.

## Referências de Projeto

- [Produto](../../../memory/produto.md)
- [Contexto técnico global](../../../memory/contexto-tecnico.md)
- [Estrutura do projeto](../../../memory/estrutura.md)

## Referências Compartilhadas

- [Como executar](../../../shared/como-executar.md)
- [Regras de nomenclatura](../../../shared/regras-de-nomenclatura.md)
- Modelo de origem: [modelo-base](../../../templates/modelo-base.md)
- Tentativa anterior, parada: [010-santo-do-dia](../010-santo-do-dia/spec.md)
- Leitura de rede já existente: [007-liturgia-do-dia](../007-liturgia-do-dia/spec.md)

## Observações Locais

O projeto .NET é ASP.NET Core. A solution fica em `C:\Levva\Estudo`, fora de `PomodoroCatolico`. O código vai para o GitHub. A página de produção passa a consumir a URL publicada desse host, no mesmo `GET`, depois que o cabeçalho de CORS estiver na resposta. O repositório da página não contém a API.

Hospedagem: GitHub Pages, sem servidor. Como a API só lê o catálogo, o próprio projeto exporta um arquivo por dia (`dotnet run --project src/Api -- export site`), com a mesma regra do `GET`, em `santo-do-dia/{mm}-{dd}`. Um workflow do GitHub Actions testa, exporta e publica a cada push na `main`. O Pages responde com `access-control-allow-origin: *`, e o caminho do pedido não muda: `VITE_SAINT_API_URL` passa a ser o endereço do Pages. Servidor gratuito (Azure App Service F1, Cloud Run, Render) ficou de fora: o servidor que dorme demora para acordar e estoura os 8 segundos do adaptador, e não há lógica no pedido que o justifique.

Só santos e beatos reconhecidos pela Igreja Católica. O santo de cada dia é o que a Canção Nova celebra, porque ela segue o Martirológio Romano. Da Canção Nova vem só qual santo é celebrado em cada dia (nome, dia e URL da página); artigo, oração e foto dela continuam fora. O nome é ligado ao artigo da Wikipédia em português e ao item da Wikidata, e a pessoa precisa ter status de santo ou beato. Nome que a busca não acha sozinho é ligado à mão, depois de conferido na Wikipédia e na Wikidata. No dia sem Canção Nova entra só quem a Wikidata marca como santo católico, canonizado ou pré-congregação, ou quem está no Calendário Romano Geral; o status genérico “santo” sozinho não basta, porque também marca santos só das igrejas ortodoxas. Em “venerado por” ficam só igrejas e comunhões cristãs.

As camadas seguem o corte de `C:\Levva\Azul\OperationsSafetyUnrulyPax\Operations.Safety.UnrulyPax.NoFlyPassenger.Api\src`: `Domain`, `Infrastructure.Data` e `Api`. `Domain` tem a entidade, a regra do dia e o contrato de leitura. `Api` só publica o `GET`. `Infrastructure.Data` implementa o contrato. Publisher, autenticação e Mongo desse referência não entram: lá o dado operacional muda o tempo todo; aqui o catálogo é leitura.

O catálogo é um JSON versionado no repositório da API, aberto por `Infrastructure.Data`. Não é uma lista de objetos escrita em classe C#. Não há banco nesta execução. Cerca de 366 festas fixas, lidas por mês e dia, não pagam conexão, segredo, backup nem migração. Corrigir um santo, acrescentar um campo ou outro idioma continua sendo commit e deploy. O contrato de leitura em `Domain` permanece se, mais adiante, a API passar a receber edição sem deploy ou dado gravado por pessoa: aí `Infrastructure.Data` troca para um banco e o `GET` que o Pomodoro chama fica o mesmo.

O JSON nasce de um retrato gerado uma vez e commitado com a API. O pedido do dia não consulta a Wikidata nem a Wikipédia. Sem conta e sem copiar a Canção Nova.

Fontes do retrato:

| Dado | Origem | Licença |
| --- | --- | --- |
| Qual santo em cada dia | Canção Nova, Santo do Dia: só nome, dia e URL | — |
| Dia sem Canção Nova | Wikidata, propriedade dia de festa (`P841`), só santo católico ou do Calendário Romano Geral | CC0 |
| Biografia curta | Primeira frase do artigo na Wikipédia em português, ou uma frase escrita para esta API | CC BY-SA 4.0 no texto da Wikipédia; a frase escrita fica da API |
| Foto | Wikimedia Commons, só quando a licença daquele arquivo permite reuso | A licença do arquivo, gravada junto do dia |

Vários santos no mesmo dia: fica quem tem artigo em português; entre esses, quem tem foto com licença de reuso. Dia sem biografia curta não entra no retrato. A API não inventa o texto que falta.

`GET /santo-do-dia/{mm}-{dd}`, com mês e dia em dois dígitos. Tempo limite de 8 segundos no adaptador da página. Resposta 200, JSON:

| Campo | Regra |
| --- | --- |
| `title` | Nome, com espaços aparados. Vazio torna o dia ausente |
| `biography` | Biografia curta. Vazia torna o dia ausente |
| `image` | `https` terminado em `.jpg`, `.jpeg`, `.png` ou `.webp`, ou ausente |
| `source` | Nome da fonte, URL do artigo, nome da licença e URL da licença |
| `imageCredit` | Autor, licença e URL, só quando houver foto |
| `calendar` | `name` e `url` da página da Canção Nova, quando o santo do dia é o dela |
| `life` | `birth` e `death`, cada um com data e local em texto. Campo vazio sai; bloco vazio some |
| `veneration` | `veneratedBy`, `canonization`, `feast` e `patronOf`, em texto. `feast` vem do próprio dia. Campo vazio sai; bloco vazio some |
| `factsSource` | Item da Wikidata das datas e locais, com licença CC0, quando a fonte da biografia não for a própria Wikidata |

Status diferente de 200, corpo vazio, JSON inválido, dia fora de `01-01` a `12-31` ou biografia vazia viram ausência. A página trata ausência como `null`: sem linha, sem painel e sem aviso. A liturgia segue. Sem segunda tentativa.

A linha e o painel, quando esta spec for executada na página, repetem o lugar da 010: debaixo da liturgia, na oração, na pausa e na pausa longa; ocultos no foco e na altura em que o kicker some. O painel se chama “Santo do dia” e mostra a foto quando houver, o título, a biografia, a seção “Vida” (nascimento e morte), a seção “Veneração” (venerado por, canonização, festa e padroeiro), a linha “Calendário: Canção Nova, Santo do Dia” com link quando houver e a fonte nomeada. Seção vazia não aparece. O texto chega em português.

## Tasks

### Tasks - API

- [x] Criar a solution ASP.NET Core em `C:\Levva\Estudo`, fora deste repositório, com os projetos `Domain`, `Infrastructure.Data` e `Api`
- [x] Publicar `GET /santo-do-dia/{mm}-{dd}` com `access-control-allow-origin` na resposta
- [x] Guardar o calendário num JSON do repositório, lido por `Infrastructure.Data`, sem lista hardcoded em classe C# e sem banco
- [x] Gerar esse JSON uma vez, a partir das fontes e das licenças da tabela acima, e commitá-lo; o pedido do dia não consulta a Wikidata nem a Wikipédia
- [x] Incluir 29 de fevereiro e omitir o dia que não tiver biografia curta
- [x] Escolher o santo de cada dia pelo calendário da Canção Nova, só com santos e beatos reconhecidos pela Igreja Católica, e no dia sem Canção Nova só santo católico ou do Calendário Romano Geral
- [x] Exportar um arquivo por dia com a mesma regra do `GET` e o workflow que publica no GitHub Pages
- [x] Publicar o repositório no GitHub e ligar o Pages; a página de produção só aponta para a URL desse host quando o cabeçalho de CORS estiver na resposta

### Tasks - Domain

- [x] Modelo do santo com título, biografia, foto opcional e a fonte nomeada
- [x] Função pura que lê o JSON desconhecido e devolve o santo do dia ou `null`
- [x] Contrato `ILoadSaint`, método `handle`, recebendo o dia `mm-dd` e devolvendo o santo ou `null`

### Tasks - Data e infra

- [x] Repetir o `GET` com `Origin`. Sem `access-control-allow-origin`, parar: o adaptador não aponta para esse host e a página não faz o pedido
- [x] Protocolo de origem que devolve o corpo da resposta ou `null` e engole falha
- [x] Adaptador HTTP do `GET` com mês e dia, tempo limite de 8 segundos, sem gravar o corpo
- [x] Caso de uso que pede o corpo, interpreta o JSON e aplica a função pura

### Tasks - Composicao

- [x] Factory `makeLoadSaint` e hook de fluxo que guarda o santo em memória, uma chamada por `todayKey()`, começando em `null`

### Tasks - Interface

- [x] Linha no hero, debaixo da liturgia, com o título, abrindo o painel, oculta no foco e na altura em que o kicker some
- [x] Painel “Santo do dia” com foto, título, biografia e a fonte nomeada, com a licença visível
- [x] Seções “Vida” e “Veneração” no painel, cada uma só com as linhas que tiverem texto
- [x] Linha “Calendário” no painel, com link para a página da Canção Nova, só quando a resposta trouxer `calendar`
- [x] Sem linha e sem aviso quando o santo é `null`, mesmo que a liturgia esteja visível
- [x] Texto, foto e botão legíveis na Capela e na Alvorada, sem mudar accent, tema nem fundo

### Tasks - Documentacao

- [x] Na pergunta “Preciso de conta?”, dizer que o santo do dia também é pedido e não é gravado
- [x] Registrar em `produto`, `contexto-tecnico`, `estrutura`, no README da página, na observação de `.spec/README.md` e nas rules que a página passa a ter dois `GET`: a liturgia e o santo do dia

### Tasks - Verificacao

- [x] `npm run build`
- [x] Em `http://localhost:5174/`, com a API no ar, confirmar que a linha mostra o santo de hoje quando o retrato tiver biografia, que o painel mostra a biografia curta e a licença, e que a foto só aparece se a URL for um retrato
- [x] Num dia sem biografia no retrato, ou com o host bloqueado, confirmar que a linha some, que a liturgia e o ciclo seguem, e que não há aviso de erro
- [x] No foco, confirmar que a linha some; na pausa, que ela volta
- [x] Conferir a linha e o painel na Capela e na Alvorada, com o crédito da pintura de fundo visível
- [x] Confirmar que as chaves continuam `pomodoro-catolico-v1`, `pomodoro-catolico-fundo` e `pomodoro-catolico-music`, sem campo de santo

## Resultado Esperado

- Quando a API existir e a origem permitir a leitura, a oração, a pausa e a pausa longa mostram o santo daquele mês e dia.
- O painel mostra a biografia curta, a foto só quando a URL for um retrato com licença de reuso, e a fonte com a licença.
- Dia sem biografia, rede ausente ou resposta inútil deixam o timer como está, sem linha de santo e sem erro.
- Accent, tema, fundo, ciclo, liturgia e as três chaves não mudam. O texto do santo não fica gravado neste navegador.
- O artigo da Canção Nova não é copiado para a API.
- O calendário vive num JSON no GitHub, nas camadas `Domain`, `Infrastructure.Data` e `Api`, em `C:\Levva\Estudo`. Sem banco enquanto a API só ler o catálogo.

## Evidência

### API

A solution está em `C:\Levva\Estudo\SaintCalendar.Api\src\SaintCalendar.Api.slnx`, num repositório git próprio (`main`, commits `1292adf` e `6082e37`), ainda sem remoto. Projetos: `Domain` (entidade, `CalendarDay`, `SaintOfTheDayRule`, `ISaintRepository` e `GetSaintOfTheDayQueryHandler`), `Infrastructure.Data` (`SaintJsonRepository`, que abre `Calendar/saints.json`), `Api` (`SaintOfTheDayController` e CORS `AllowAnyOrigin` só para `GET`) e `Tests.Unit`. Um `nuget.config` local limpa as fontes e deixa só nuget.org, porque o feed privado herdado da máquina respondia 401.

`dotnet test src/SaintCalendar.Api.slnx` passou em 27/10/2026: 33 aprovados, 0 com falha. Os testes cobrem a validação de `mm-dd` com 29/02 e sem 02-30, a regra que descarta título ou biografia vazios e a foto que não é retrato, cada entrada do JSON e o endpoint (200 com `Access-Control-Allow-Origin: *`; 404 para `02-30`, `13-01` e `hoje`).

O retrato foi gerado uma vez por `tools/generate-calendar.mjs` e commitado. A API não consulta Wikidata nem Wikipédia no pedido do dia. Critérios:

- Candidatos: pessoas com dia de festa (`P841`) e status de santo ou beato (`P411`), ou com qualificador do Calendário Romano Geral. Ficam de fora a data com fim (`P582`), a data de calendário retirado (tridentino, 1960) e a data de religião não ocidental. Quem tem data no Calendário Romano Geral só conta nessa data.
- Escolha do dia: artigo em português obrigatório; depois Calendário Romano Geral, foto com licença de reuso, status católico e número de sitelinks. Um santo não se repete em dois dias.
- Biografia: a primeira frase da introdução da Wikipédia em português, sem as notas de idioma entre parênteses. A fonte fica “Wikipédia, trecho adaptado”, CC BY-SA 4.0, com o link do artigo. O ponto solto “reinou entre. c.” de 27/10, que vinha do próprio artigo, foi corrigido no retrato.
- 29/02: Osvaldo de Worcester, com uma frase escrita para a API (`tools/written-biographies.json`), porque nenhum artigo do dia passou nos critérios.
- Foto: arquivo do Commons com domínio público, CC0, CC BY ou CC BY-SA, sem SVG, miniatura de 800 px sem query string. O crédito grava autor, licença e página do arquivo.
- Resultado: 363 dias, 355 com foto. Ficaram fora `09-06`, `11-27` e `12-22`, por falta de candidato com biografia curta.

Com a API em `http://localhost:5080` e `Origin: https://catholic-pomodoro.pages.dev`, `curl.exe -i`:

- `GET /santo-do-dia/10-27`: 200, `Access-Control-Allow-Origin: *`, Elesbão de Axum, com `image`, `source` e `imageCredit`.
- `GET /santo-do-dia/02-29`: 200, Osvaldo de Worcester.
- `GET /santo-do-dia/09-06` e `/02-30`: 404, também com `Access-Control-Allow-Origin: *`.

A publicação no GitHub e a hospedagem continuam abertas. A página só lê o santo quando `VITE_SAINT_API_URL` aponta para um host; sem essa variável, o adaptador devolve `null` sem fazer o pedido. Em desenvolvimento, `.env.development.local` (ignorado pelo git) aponta para `http://localhost:5080`. O build de produção fica sem santo até existir URL publicada com o cabeçalho de CORS.

### Página

`npm run build` (`tsc -b && vite build`) passou em 27/10/2026. Saída: 73 módulos, `dist/assets/index-CICkTxdP.css` 27,54 kB, `dist/assets/index-8QClLvk-.js` 282,80 kB.

Em `http://localhost:5174/`, com a API no ar, a Última Ceia, a Capela, o dourado e a pausa:

- A página fez um só pedido, `GET http://localhost:5080/santo-do-dia/10-27`, com resposta 200. A linha “Santo do dia: Elesbão de Axum” apareceu debaixo de “3ª feira da 30ª Semana do Tempo Comum”, menor que a liturgia, com o rótulo “Santo do dia:” mais leve que o nome.
- O botão abriu o painel “Santo do dia”: a moeda de Calebe (`Kaleb.jpg`, carregada), a legenda “Foto: Classical Numismatic Group · CC BY-SA 3.0”, o título, a biografia curta e “Fonte: Wikipédia, trecho adaptado · CC BY-SA 4.0”, com links.
- `readSaintDay`, chamada no navegador, aceitou `https://…/a.JPG` e `.webp` e recusou `.svg`, `http:`, URL com query string ou hash, e `https://x.org/a?f=b.jpg`. Sem foto, o crédito da foto cai. Biografia vazia ou corpo que não é objeto devolvem `null`.
- No foco, a linha da liturgia e a do santo sumiram; na pausa, voltaram. Com a janela a 500 px de altura, as duas ficaram `display: none`.
- Na Capela, a linha e o painel escuro ficaram legíveis sobre a Ceia, e o crédito “Última Ceia, Leonardo da Vinci. Domínio público · fonte” continuou no rodapé do palco. Na Alvorada, com a pintura Santos, a linha ficou em tinta escura no cartão de pergaminho e o painel claro mostrou foto, legenda e fonte. O accent continuou `gold`, o tema `alvorada` e o tom `escura`. O crédito “Santos, Bonifacio de’ Pitati. Domínio público · fonte” continuou no fim do palco. Nessa combinação, com a dezena aberta, ele já ficava 10 px abaixo da dobra a 906 px de altura; a linha do santo soma 26 px, e o crédito aparece com uma rolagem curta.
- Com a API parada, o recarregamento mostrou a liturgia, nenhuma linha de santo e nenhum aviso. A pausa começou e o relógio foi de `05:00` a `04:58`.
- As chaves continuaram `pomodoro-catolico-v1`, `pomodoro-catolico-fundo` e `pomodoro-catolico-music`. Nenhum valor guarda o santo; a única ocorrência de “santo” era o id da pintura (`{"saintId":"santos"}`) no fundo. A pergunta “Preciso de conta?” cita o santo do dia como pedido e não gravado.

Depois da verificação, o navegador voltou à pausa em `05:00`, Ceia, Capela e dourado, com as duas linhas visíveis.

### Vida e veneração

`tools/enrich-life-veneration.mjs` rodou sobre o retrato já commitado, sem trocar nenhum santo (commit `cd5771a` da API). Nascimento e morte vêm da Wikidata, com a precisão gravada (dia, mês, ano, década ou século) e “c.” quando a data é aproximada. Venerado por, canonização e padroeiro vêm da infobox do artigo; sem infobox, venerado por e canonização vêm da Wikidata, que fica de fora no padroado por misturar lugar, táxon e ofício. Resultado nos 363 dias: 360 com nascimento, 362 com morte, 340 com venerado por, 160 com canonização, 132 com padroeiro e todos com a festa. Uma varredura não achou resto de wikitexto nem palavra colada.

`dotnet test` passou com 36 testes; os novos cobrem o texto aparado e o bloco vazio que some, a festa em todo dia do arquivo e `life`, `veneration` e `factsSource` no endpoint. `npm run build` passou.

Em `http://localhost:5174/`, na Capela, o painel de 27/10 mostrou “Vida”: nascimento “século V, Império de Axum” e morte “c. 540”; e “Veneração”: “Igreja Católica, Igreja Ortodoxa, Igrejas Ortodoxas Orientais”, festa “27 de outubro” e padroeiro “Viajantes”. Elesbão não tem canonização, e a linha não apareceu. A fonte ficou “Wikipédia, trecho adaptado · CC BY-SA 4.0; Wikidata · CC0 1.0”, com links.

### Só santos católicos e GitHub Pages

`tools/read-cancaonova-calendar.mjs` leu o sitemap de `santo.cancaonova.com` (401 páginas, 1 segundo entre pedidos) e gravou só o nome, o dia e a URL de cada santo em `tools/cancaonova-calendar.json`: 363 dias. As páginas de Santa Faustina, Santa Francisca Cabrini e São Frumêncio entram em loop de redirecionamento no próprio site e ficaram de fora.

`tools/generate-calendar.mjs` liga cada nome ao artigo da Wikipédia e ao item da Wikidata. Os 22 títulos ligados à mão (`tools/cancaonova-titles.json`) foram conferidos antes na Wikipédia e na Wikidata; dois candidatos caíram nessa conferência: “Martiniano” era o ex-imperador romano e “João Batista de Rossi” apontava para outra pessoa. Resultado: 359 dias, 313 com a escolha da Canção Nova, 345 com foto. Ficaram sem santo `02-13`, `03-29`, `06-08`, `06-17`, `09-06`, `10-29` e `12-22`. Os 46 dias sem Canção Nova têm todos “Igreja Católica” em “venerado por”; nenhum dia tem religião não cristã nesse campo. 27/10 passou de Elesbão de Axum a São Gonçalo de Lagos, que é o santo da Canção Nova.

`dotnet test` passou com 38 testes; os novos comparam cada arquivo exportado com a resposta do endpoint e exigem que pelo menos 3/4 dos dias venham da Canção Nova, com URL em `santo.cancaonova.com/santo/`. `dotnet run --project src/Api -- export "$PWD/site"` gravou 359 arquivos e `.nojekyll`. `npm run build` passou.

Com a pasta exportada servida como arquivos estáticos na porta 5080 (`http-server --cors`, como o Pages): `GET /santo-do-dia/10-27` respondeu 200 com `Access-Control-Allow-Origin: *` e sem `content-type`; `/02-30`, 404. Em `http://localhost:5174/`, a página fez um só pedido a esse arquivo, mostrou “Santo do dia: São Gonçalo de Lagos” debaixo da liturgia, e o painel mostrou a foto com crédito, a biografia, Vida (1360, Lagos; 15 de outubro de 1422, Torres Vedras), Veneração (Igreja Católica; 27 de outubro; Torres Vedras, Lagos, pescadores do Algarve), “Calendário: Canção Nova, Santo do Dia” com link e “Fonte: Wikipédia · CC BY-SA 4.0; Wikidata · CC0 1.0”.

### Publicação

O repositório é [andersoncostadev/saint-calendar-api](https://github.com/andersoncostadev/saint-calendar-api), com `main` e `feature/saint-calendar-api` no commit `3810aba`, `main` como branch padrão e o Pages ligado com origem em GitHub Actions. O push no `main` disparou o workflow antes de o Pages existir e falhou no passo do Pages; a execução manual seguinte ([40566309113](https://github.com/andersoncostadev/saint-calendar-api/actions/runs/40566309113)) passou no `build` (testes e exportação) e no `deploy` em 27/10/2026.

Com `Origin: https://catholic-pomodoro.pages.dev`, `curl.exe -i`:

- `GET https://andersoncostadev.github.io/saint-calendar-api/santo-do-dia/10-27`: 200, `Access-Control-Allow-Origin: *`, `Content-Type: application/octet-stream`, São Gonçalo de Lagos com `calendar` da Canção Nova.
- `GET …/santo-do-dia/02-30`: 404.

O `VITE_SAINT_API_URL` de produção passa a ser `https://andersoncostadev.github.io/saint-calendar-api`, no ambiente de build do projeto `catholic-pomodoro` na Cloudflare.

### Produção

A variável foi criada como texto em **Production** no projeto `catholic-pomodoro` da Cloudflare antes do merge do [PR #2](https://github.com/andersoncostadev/catholic-pomodoro/pull/2) (`2f4ce52`). O build seguinte publicou `assets/index-v1NgBZus.js`, que contém o endereço da API.

Em `https://catholic-pomodoro.pages.dev/`, na oração, a página pediu `https://liturgia.cloudhub.ia.br/v1/liturgia?dia=27&mes=10&ano=2026` e `https://andersoncostadev.github.io/saint-calendar-api/santo-do-dia/10-27`, e mostrou “Santo do dia: São Gonçalo de Lagos” debaixo de “3ª feira da 30ª Semana do Tempo Comum”.

## Encerramento

Esta spec termina apenas quando todos os itens estiverem marcados e com evidência registrada, no formato definido em [Como executar](../../../shared/como-executar.md).
