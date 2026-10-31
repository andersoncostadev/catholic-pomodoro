# 015-ranking-publico

## Objetivo

Deixar quem quiser aparecer, só com um apelido, numa lista da semana com outras pessoas, sem conta e sem mensalidade, sem impedir o timer quando essa lista não carregar.

## Contexto Técnico

A lista pública não cabe no `localStorage`. A página continua uma só, sem rota nova. Quem não escolhe apelido não entra na lista e não gera pedido.

O que muda na rede: além do `GET` da liturgia e do `GET` do santo, a página passa a falar com a própria origem em `/api/ranking` (`GET`, `POST` e `DELETE`). A função que responde mora em `functions/`, no mesmo projeto Cloudflare Pages que já publica `https://catholic-pomodoro.pages.dev`, no plano gratuito de Workers e de D1. Não há plano pago, não há Azure, não há banco fora dessa conta e não há servidor que precise ficar acordado. A API do santo continua fora deste repositório.

A função não entra no bundle do Vite. `src/` não importa `functions/`. O pedido nasce em `infra/http`, o caso de uso vê um protocolo, a leitura do JSON é função pura em `domain`, e a tela chama factory. Tempo limite de 8 segundos, como a liturgia. Falha, corpo inválido ou limite diário do plano gratuito viram ausência: o ciclo segue e a aba explica que o ranking não carregou.

O identificador e o apelido ficam na chave nova `pomodoro-catolico-ranking`. As chaves `pomodoro-catolico-v1`, `pomodoro-catolico-fundo` e `pomodoro-catolico-music` não mudam de formato. Sem cookie, sem JWT e sem login.

A semana pública é uma só para todo mundo: segunda a domingo, no horário de Brasília (`America/Sao_Paulo`). O navegador não escolhe a semana que será somada. A [014-horas-oferecidas](../014-horas-oferecidas/spec.md) continua com o resumo local no fuso do navegador. Esta spec não a espera para existir: a aba entra no painel Sequência que já existe. Quando a 014 estiver na página, a aba fica ao lado de Resumo e Ofertas.

Branch: `feature/public-ranking`.

## Referências de Projeto

- [Produto](../../../memory/produto.md)
- [Contexto técnico global](../../../memory/contexto-tecnico.md)
- [Estrutura do projeto](../../../memory/estrutura.md)

## Referências Compartilhadas

- [Como executar](../../../shared/como-executar.md)
- [Regras de nomenclatura](../../../shared/regras-de-nomenclatura.md)
- Modelo de origem: [modelo-base](../../../templates/modelo-base.md)
- Resumo local, que não publica ninguém: [014-horas-oferecidas](../014-horas-oferecidas/spec.md)
- Plano gratuito de Workers: [Pricing](https://developers.cloudflare.com/workers/platform/pricing/)
- Plano gratuito de D1: [Pricing](https://developers.cloudflare.com/d1/platform/pricing/)
- Origem visual: a aba Ranking de [Pomofocus](https://pomofocus.io/app)

## Observações Locais

### Fora desta mudança

E-mail, senha, Google, perfil, foto, país, projeto, nota, gráfico, mês, ano e ranking de outro período. A página não guarda IP nem user-agent no D1. Não há moderação manual de apelido além das regras de tamanho e de caractere desta spec.

### Apelido

A aba se chama “Ranking”. Sem apelido gravado, ela mostra o campo “Como você quer aparecer” e o botão “Entrar no ranking”. O texto, depois de aparar e de juntar espaços internos, tem de 2 a 24 caracteres. Entram letras, números, espaço, hífen e apóstrofo. Ficam de fora `<`, `>`, quebra de linha e os demais símbolos. Nome vazio ou recusado não grava e não pede a rede.

Ao entrar, a página gera um UUID e grava `{ id, name }` em `pomodoro-catolico-ranking`. Trocar o apelido grava o nome novo e pede a troca na semana atual, sem somar segundos. Se ainda não houver linha na semana, a troca fica só neste navegador até o próximo foco.

“Sair do ranking” pede confirmação: “Sair do ranking? Sua linha some para as outras pessoas.”, com “Ficar” e “Sair”. Sair apaga a chave local e pede o `DELETE`. Se o `DELETE` falhar, a chave permanece e a aba diz que não foi possível sair.

### O que é publicado

Só um foco concluído, pelo caminho que já existe: o relógio chega a zero ou “Encerrar este foco”. “Sair mesmo assim” não publica. Oração e pausa não publicam. Os segundos são os já decorridos nessa entrada.

A fase seguinte não espera o `POST`. O pedido sai depois da gravação local. Falha de rede não desfaz o foco, a sequência nem a tarefa.

Sem apelido, não há `POST`.

### Função e base

Arquivo `functions/api/ranking.ts`, rota `/api/ranking`. Binding D1 `RANKING_DB`, base `catholic-pomodoro-ranking`, na conta que já publica o Pages. O `wrangler.toml` aponta o build do Vite e esse binding, sem segredo no arquivo. Criar a base e aplicar `functions/schema.sql` fazem parte da execução. O plano da conta permanece o gratuito: esta spec não assina Workers Paid.

Tabelas:

| Tabela | Chave | Colunas |
| --- | --- | --- |
| `week_total` | `id`, `week_start` | `name`, `seconds` |
| `day_total` | `id`, `day` | `seconds` |
| `hour_post` | `id`, `hour_key` | `posts` |

`week_start` e `day` são `YYYY-MM-DD` em Brasília. `week_start` é a segunda-feira dessa semana. `hour_key` é `YYYY-MM-DDTHH` em Brasília. Índice em `week_total (week_start, seconds)`. A consulta da semana filtra por `week_start`. Não há varredura da tabela inteira.

Ao gravar, saem as semanas cujo `week_start` é anterior a oito semanas e os dias e os horários anteriores a 62 dias.

### Contrato

`POST /api/ranking`, JSON `{ id, name, seconds }`. `seconds` ausente ou zero só troca o nome da semana atual, se a linha existir. Com segundos:

- `id` é um UUID;
- `name` obedece à regra do apelido;
- `seconds` é inteiro de 1 a 5400 (um foco, no máximo 90 minutos);
- o dia daquele `id` não passa de 57600 segundos (16 horas); o que excederia é recusado por inteiro;
- aquele `id` não passa de 30 gravações na hora de Brasília.

Resposta de sucesso: 204. Corpo inválido: 400. Acima de um foco ou das 16 horas: 422. Acima de 30 na hora: 429. A página trata esses status como ausência e não repete o pedido sozinha.

`GET /api/ranking?id=` com `id` opcional. A função guarda em cache, por 60 segundos, as vinte primeiras linhas da semana, sem identificador. Com `id`, procura a linha dessa pessoa à parte.

JSON:

| Campo | Regra |
| --- | --- |
| `weekStart` | Segunda-feira da semana em Brasília |
| `rows` | Até 20 itens `{ place, name, seconds }`, só com `seconds` maior que zero |
| `me` | `{ place, name, seconds }` de quem passou o `id`, ou `null` se não houver segundos na semana |

A ordem é a dos segundos, do maior ao menor. Empate ordena pelo nome, em português. As posições são 1, 2, 3, sem repetir número. A resposta não devolve `id` de ninguém. Status diferente de 200, JSON inválido ou o erro de limite diário do D1 viram ausência.

`DELETE /api/ranking`, JSON `{ id }`. Apaga as três tabelas para esse `id`. Resposta 204 mesmo se o `id` não existir. `id` inválido: 400.

### Aba

Com apelido, a aba pede o `GET` ao abrir. A lista mostra a posição, o nome e o tempo em `HH:MM`, no mesmo arredondamento da 014: minuto mais próximo, hora com dois dígitos até 99, minuto sempre com dois dígitos. A linha cujo nome e cujo tempo coincidem com `me` leva o sufixo “você”. Se `me` estiver fora das vinte, ela aparece depois da lista, com a posição real.

Sem ninguém na semana: “Ninguém entrou nesta semana.” Com apelido e zero segundo: “Você ainda não concluiu um foco nesta semana.” Sem rede ou com ausência: “O ranking não carregou. O que você ofereceu continua neste navegador.”

Em 390 px e em 900 px a lista cabe na largura do painel, sem rolagem horizontal da página. Texto e botão continuam legíveis na Capela e na Alvorada. O crédito da pintura permanece.

## Tasks

### Tasks - Função

- [x] Criar `functions/api/ranking.ts` e `functions/schema.sql` com as três tabelas, o índice e a limpeza de oito semanas e de 62 dias
- [x] `POST` soma um foco, recusa acima de 5400 segundos, de 16 horas no dia e de 30 gravações na hora, e troca o nome sem somar quando `seconds` vem ausente ou zero
- [x] `GET` devolve as vinte primeiras e `me`, com cache de 60 segundos das vinte, sem varrer a tabela e sem devolver `id`
- [x] `DELETE` apaga as linhas daquele `id` e responde 204
- [x] Ligar a base `catholic-pomodoro-ranking` ao Pages `catholic-pomodoro` no binding `RANKING_DB`, no plano gratuito, com `wrangler.toml` sem segredo

### Tasks - Domain

- [x] Validar apelido, UUID, segundos de um foco e o JSON do `GET`, devolvendo ausência quando o corpo não serve
- [x] Formatar o tempo da lista em `HH:MM` pela mesma regra de arredondamento da 014

### Tasks - Data e infra

- [x] Protocolo de ranking com carregar, publicar e sair; o adaptador em `infra/http` chama `/api/ranking` com tempo limite de 8 segundos e traduz falha em ausência
- [x] Gravar e ler `{ id, name }` só na chave `pomodoro-catolico-ranking`

### Tasks - Composicao

- [x] Depois de um foco concluído, e só se houver apelido, publicar os segundos dessa entrada sem atrasar a fase seguinte
- [x] “Sair mesmo assim”, oração e pausa não publicam

### Tasks - Interface

- [x] Aba Ranking no painel Sequência, com apelido, lista, “você”, os três textos de vazio e de falha, e “Sair do ranking” com confirmação
- [x] Lista legível na Capela e na Alvorada, em 900 px e em 390 px, com o crédito da pintura visível

### Tasks - Documentacao

- [x] Atualizar [produto](../../../memory/produto.md) e [contexto técnico](../../../memory/contexto-tecnico.md) com o apelido, a aba e o `/api/ranking`
- [x] Atualizar a regra de rede em `.cursor/rules/01-monorepo-overview.mdc` e em `.cursor/AGENTS.md`: a página passa a pedir também `/api/ranking`, e a chave `pomodoro-catolico-ranking` existe porque esta spec pediu

### Tasks - Verificação

- [x] `npm run build`, com `functions/` fora do bundle
- [x] Na função local, publicar um foco, ler a lista, estourar 5400 segundos, estourar a hora e apagar o `id`
- [x] Em `http://localhost:5174/`, entrar com um apelido, encerrar um foco de alguns segundos e ver a linha “você”; sair e ver a confirmação
- [x] Desligar a função e ver o timer concluir o foco com o texto de que o ranking não carregou
- [x] Conferir Capela e Alvorada, em 900×874 e em 390×844, com o crédito visível
- [x] Confirmar que o plano da conta continua gratuito e que as chaves antigas seguem nos formatos de hoje

## Resultado Esperado

- Quem grava um apelido aparece na semana de Brasília, ao lado de outras pessoas, com posição e `HH:MM`.
- Quem não grava apelido não é publicado. Sair apaga a linha para as outras pessoas.
- Um pedido só soma um foco já concluído, com teto de 90 minutos, 16 horas no dia e 30 gravações na hora.
- A fase não espera a rede. Sem função, o timer e o que está neste navegador continuam.
- A base é a D1 gratuita da mesma conta do Pages. A resposta pública não leva identificador, IP nem e-mail.

## Evidência

`npm run build` (`tsc -b && vite build`) passou em 31/10/2026. Saída: 102 módulos, `dist/assets/index-BubXDUFS.css` 31,22 kB, `dist/assets/index-DxI-REGv.js` 302,21 kB. O bundle não contém `week_total` nem `RANKING_DB`.

Na função local (`wrangler pages dev` em `127.0.0.1:8788`, D1 local, semana `2026-10-26`):

- `POST` de um foco válido respondeu 204. O `GET` devolveu lugares 1 a 5, sem `id` no corpo: Dia 54000, Ágata 120, Bruno 120, Ana Maria 65, Hora 30. O desempate em português pôs Ágata antes de Bruno.
- 5401 segundos respondeu 422. Nome com `<` respondeu 400. Trinta gravações na hora responderam 204 e a 31ª respondeu 429. Dez focos de 5400 segundos responderam 204 e o 11º respondeu 422, porque passaria de 57600 no dia.
- Troca de nome sem `seconds` respondeu 204 e o `me` veio como Ana Maria. `DELETE` respondeu 204, o `GET` seguinte trouxe `me` nulo, e a linha sumiu da base. `DELETE` com id inválido respondeu 400.

Em `http://localhost:5174/`, com a Última Ceia e o dourado:

- A aba Ranking, ao lado de Resumo e Ofertas, pediu o apelido. “Clara” gravou a chave e a lista disse “Ninguém entrou nesta semana.” e “Você ainda não concluiu um foco nesta semana.”
- Encerrar um foco de cerca de onze segundos passou na hora para a pausa (`05:00 · Pausa`). A lista mostrou “1 Clara você 00:00”, no arredondamento da 014.
- “Sair do ranking” mostrou “Sair do ranking? Sua linha some para as outras pessoas.”, com “Ficar” e “Sair”. “Ficar” manteve a linha.
- Com a função desligada, outro foco encerrado também passou na hora para a pausa (`Foco 2`) e a aba mostrou “O ranking não carregou. O que você ofereceu continua neste navegador.” O relógio da pausa seguiu.
- Capela e Alvorada, em 900×874 e 390×844, sem rolagem horizontal da página. O campo do apelido ficou em 47 px. O crédito “Última Ceia, Leonardo da Vinci. Domínio público · fonte” ficou na primeira tela. Na Alvorada o botão teve contraste 5,99 e o texto da lista, com 88% da tinta, 10,13. Na Capela o botão teve 9,25.
- As chaves antigas seguiram `pomodoro-catolico-v1` (settings, tasks, selectedTaskId, stats, session, intention, quoteIndex, journal), `pomodoro-catolico-fundo` (`{"saintId":"ceia"}`) e `pomodoro-catolico-music` (`{"trackId":"kyrie","volume":0.6}`). A chave nova guarda só `{ id, name }`.

A base `catholic-pomodoro-ranking` (`647a527c-c764-463a-9a91-a4e8944ae150`) foi criada na conta que já hospeda o Pages, e o `functions/schema.sql` rodou nela. O `wrangler.toml` aponta o binding `RANKING_DB` e não tem segredo. O preview `https://public-ranking.catholic-pomodoro.pages.dev/api/ranking` respondeu 200 com `weekStart` `2026-10-26` e `me` nulo. A criação e o preview não pediram plano pago. O endereço de produção `catholic-pomodoro.pages.dev` não foi substituído.

## Encerramento

Esta spec termina apenas quando todos os itens estiverem marcados e com evidência registrada, no formato definido em [Como executar](../../../shared/como-executar.md).
