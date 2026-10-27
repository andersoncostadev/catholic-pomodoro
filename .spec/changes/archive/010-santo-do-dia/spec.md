# 010-santo-do-dia

## Objetivo

Mostrar o santo do dia na oração e na pausa, com o nome, uma biografia curta e a foto quando a resposta trouxer um retrato, sem impedir o ciclo quando a rede falhar.

## Contexto Técnico

A página não tem servidor próprio. Esta spec autoriza um segundo pedido de rede, no mesmo desenho da liturgia: `GET https://api-liturgia-diaria.vercel.app/santo-do-dia`, sem parâmetro de data. A rota ignora `date`. Quem escolhe o dia é a página da Canção Nova que essa API lê.

Consulta em 27/10/2026. O corpo veio 200, JSON, cerca de 3 kB. `today.title` era “São Gonçalo de Lagos, o padroeiro de Torres Vedras”. `today.day` era `27`, `today.month` era `Out`, `today.year` era `2026`. `today.full_text` é o artigo inteiro, em parágrafos separados por linha em branco: títulos curtos (`Origens`, `Vida`, `Minha oração`, `Fonte`) e, entre eles, os parágrafos. O primeiro parágrafo narrativo começa em “São Gonçalo nasceu em Lagos…”. `today.image` era `https://static.cancaonova.com/images/icon-x-extwitter.svg`, ícone de compartilhar, não o retrato. O retrato existe na página `santo.cancaonova.com`, fora desse campo. `today.outros_santos` veio como lista de strings vazias.

A mesma consulta, com `Origin: http://localhost:5174`, não devolveu `access-control-allow-origin`. A liturgia em `liturgia.cloudhub.ia.br` devolve `access-control-allow-origin: *`. Sem esse cabeçalho, o navegador não entrega o corpo ao JavaScript. A página não cria proxy, Worker nem BFF para contornar isso.

Decisão: o pedido só entra no adaptador quando a resposta, com `Origin`, trouxer `access-control-allow-origin` (`*` ou a origem da página). Enquanto o cabeçalho não vier, não há linha, não há painel e não há `fetch` para esse host. O restante desta spec descreve a leitura e a sessão para o dia em que a origem permitir a leitura.

O pedido nasce em `infra`. O caso de uso só vê um protocolo que devolve o corpo ou `null`. A leitura do JSON é função pura em `domain`. A tela chama factory e não usa `fetch`. Sem chave nova. O texto e a URL da foto não entram no repositório nem no `localStorage`. A foto da API não substitui o fundo escolhido.

Ciclo, liturgia, jaculatória, dezena, frases, fundo, canto e as três chaves permanecem. A linha do santo não troca `data-accent`, tema nem fundo.

Branch desta mudança: `feature/saint-of-the-day`.

## Referências de Projeto

- [Produto](../../../memory/produto.md)
- [Contexto técnico global](../../../memory/contexto-tecnico.md)
- [Estrutura do projeto](../../../memory/estrutura.md)

## Referências Compartilhadas

- [Como executar](../../../shared/como-executar.md)
- [Regras de nomenclatura](../../../shared/regras-de-nomenclatura.md)
- Modelo de origem: [modelo-base](../../../templates/modelo-base.md)
- Leitura de rede já existente: [007-liturgia-do-dia](../007-liturgia-do-dia/spec.md)

## Observações Locais

A URL fica no adaptador. Tempo limite de 8 segundos. Falha de rede, resposta que não seja 200, corpo vazio, JSON inválido, forma inesperada, data que não seja a de `todayKey()` ou título vazio viram `null`. Sem segunda tentativa e sem aviso de erro na tela. A liturgia e o santo falham separados: um `null` não apaga o outro.

Do objeto `today`:

| Campo do modelo | Origem |
| --- | --- |
| Título | `title`, com espaços aparados |
| Biografia | primeiro parágrafo narrativo de `full_text` |
| Oração | parágrafo que segue o título `Minha oração` |
| Foto | `image`, só se for um retrato |
| Também neste dia | `outros_santos`, sem string vazia |

`full_text` parte em parágrafos pelo separador de linha em branco. Parágrafo vazio sai. Parágrafo narrativo é o que contém `.`, `?` ou `!`. Os outros são títulos. A biografia é o primeiro parágrafo narrativo que aparece antes de um título `Minha oração` ou de um parágrafo que comece com `Fonte`. A comparação desses títulos ignora maiúsculas e dois-pontos no fim. A oração é o parágrafo narrativo imediatamente depois de `Minha oração`. Se não houver, a oração fica de fora. Se a biografia vier vazia, o dia é `null`. O artigo completo não entra no modelo.

A data da resposta precisa ser o mesmo dia de `todayKey()`, no relógio local do navegador. `day` e `year` são números. `month` é a abreviação em português: `jan`, `fev`, `mar`, `abr`, `mai`, `jun`, `jul`, `ago`, `set`, `out`, `nov`, `dez`, sem distinguir maiúsculas. Abreviação desconhecida, ano ausente ou dia diferente de hoje tornam o dia `null`.

A foto entra só quando `image` é `https` e o caminho termina em `.jpg`, `.jpeg`, `.png` ou `.webp`. SVG, ícone de rede social e qualquer outro endereço ficam de fora. Sem foto, o painel abre assim mesmo.

A linha fica debaixo da linha da liturgia, na oração, na pausa e na pausa longa. Some no foco e quando a altura da janela esconde o kicker. Se a liturgia for `null`, a linha do santo continua no mesmo lugar. O botão abre o painel “Santo do dia”, no mesmo drawer das tarefas, com Escape e clique fora. Um painel por vez. A linha mostra só o título.

O painel mostra, nesta ordem, a foto quando houver, o título, a biografia, a oração quando houver e a lista “Também neste dia” quando houver item. A foto leva `alt` com o título. A fonte fica “Canção Nova, via api-liturgia-diaria.vercel.app”, com ligação para `https://santo.cancaonova.com/`. Seção vazia não aparece.

O hook pede o santo ao abrir a página e de novo se `todayKey()` mudar com a aba aberta. Até a resposta, e quando ela for `null`, a linha não existe. O relógio não espera o pedido.

## Tasks

### Tasks - Domain

- [ ] Modelo do santo com título, biografia e os campos opcionais da tabela acima
- [ ] Função pura que lê o JSON desconhecido e devolve o santo de hoje ou `null`, com a biografia curta, a oração separada e a foto só quando for retrato
- [ ] Contrato `ILoadSaint`, método `handle`, recebendo o dia `yyyy-mm-dd` e devolvendo o santo ou `null`

### Tasks - Data e infra

- [x] Repetir o `GET` com `Origin`. Sem `access-control-allow-origin`, parar: o adaptador não aponta para esse host e a página não faz o pedido
- [ ] Protocolo de origem que devolve o corpo da resposta ou `null` e engole falha
- [ ] Adaptador HTTP do `GET` sem parâmetro, tempo limite de 8 segundos, sem gravar o corpo
- [ ] Caso de uso que pede o corpo, interpreta o JSON e aplica a função pura com o dia recebido

### Tasks - Composicao

- [ ] Factory `makeLoadSaint` e hook de fluxo que guarda o santo em memória, uma chamada por `todayKey()`, começando em `null`

### Tasks - Interface

- [ ] Linha no hero, debaixo da liturgia, com o título, abrindo o painel, oculta no foco e na altura em que o kicker some
- [ ] Painel “Santo do dia” com foto, título, biografia, oração, outros santos e a fonte nomeada
- [ ] Sem linha e sem aviso quando o santo é `null`, mesmo que a liturgia esteja visível
- [ ] Texto, foto e botão legíveis na Capela e na Alvorada, sem mudar accent, tema nem fundo

### Tasks - Documentacao

- [ ] Na pergunta “Preciso de conta?”, dizer que o santo do dia também é pedido e não é gravado
- [ ] Registrar em `produto`, `contexto-tecnico`, `estrutura`, no README da página, na observação de `.spec/README.md` e nas rules que a página passa a ter dois `GET`: a liturgia e o santo do dia

### Tasks - Verificacao

- [ ] `npm run build`
- [ ] Em `http://localhost:5174/`, com rede, confirmar no navegador que o JavaScript leu o JSON. A linha mostra o título de hoje, o painel mostra a biografia curta e não o artigo inteiro, e a foto só aparece se a URL for um retrato
- [ ] Bloquear o host ou ficar offline, recarregar e confirmar que a linha do santo some, que a liturgia e o ciclo seguem, e que não há aviso de erro
- [ ] No foco, confirmar que a linha some; na pausa, que ela volta
- [ ] Conferir a linha e o painel na Capela e na Alvorada, com o crédito da pintura de fundo visível
- [ ] Confirmar que as chaves continuam `pomodoro-catolico-v1`, `pomodoro-catolico-fundo` e `pomodoro-catolico-music`, sem campo de santo

## Resultado Esperado

- A oração, a pausa e a pausa longa mostram o nome do santo do dia quando o navegador consegue ler a resposta e a data é a de hoje.
- O painel mostra a biografia curta, a oração quando vier, os outros santos quando vierem, e a foto só quando a URL for um retrato.
- Rede ausente, CORS ausente ou resposta inútil deixam o timer como está, sem linha de santo e sem erro.
- Accent, tema, fundo, ciclo, liturgia e as três chaves não mudam. O texto do santo não fica gravado.

## Evidência

Em 27/10/2026, `GET https://api-liturgia-diaria.vercel.app/santo-do-dia` com `Origin: http://localhost:5174` respondeu 200, `Content-Type: application/json`, 3258 bytes. Nem esse `GET` nem o `OPTIONS` com `Access-Control-Request-Method: GET` trouxeram `access-control-allow-origin`. O mesmo `Origin` em `GET https://liturgia.cloudhub.ia.br/v1/liturgia?dia=27&mes=10&ano=2026` trouxe `access-control-allow-origin: *`.

Sem o cabeçalho, o adaptador não aponta para `api-liturgia-diaria.vercel.app` e a página não faz `fetch` para esse host. Não há linha nem painel do santo. A leitura do JSON, a sessão e a interface desta spec ficam para o dia em que a origem permitir a leitura.

O corpo, lido fora do navegador, tinha `today.title` “São Gonçalo de Lagos, o padroeiro de Torres Vedras”, `today.month` “Out”, `today.image` em `.svg` e `today.outros_santos` só com strings vazias. `today.day` e `today.year` vieram como texto (`"27"`, `"2026"`).

## Encerramento

Arquivada em 27/10/2026 sem execução, substituída pela [011-api-do-santo](../011-api-do-santo/spec.md). A origem `api-liturgia-diaria.vercel.app` nunca trouxe `access-control-allow-origin`, e o santo do dia passou a vir da API própria do calendário dos santos. As tasks abertas acima não foram feitas por esta spec; o que a página entregou está na 011.

Esta spec termina apenas quando todos os itens estiverem marcados e com evidência registrada, no formato definido em [Como executar](../../../shared/como-executar.md).
