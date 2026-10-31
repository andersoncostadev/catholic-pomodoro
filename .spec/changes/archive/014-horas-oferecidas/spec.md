# 014-horas-oferecidas

## Objetivo

Mostrar, neste navegador, as horas oferecidas da semana e o que levou mais tempo, e deixar o ritmo mais calmo: a oração pode começar sozinha, o foco espera a pessoa, cada oferta diz quantas entradas pede, e o sino e dois atalhos ficam à mão.

## Contexto Técnico

A mudança fica em `domain/cycle`, no pacote gravado em `pomodoro-catolico-v1`, na composição em `main/factories/flows/usePomodoro` e no painel da sequência e dos ajustes. O componente não recalcula duração, sequência, avanço nem os números da semana.

Não há chave nova. Fundo e canto seguem nas chaves que já existem. O texto da liturgia e o do santo não são gravados. Não há conta, ranking de outras pessoas, servidor nem segunda rota.

JSON antigo abre com os padrões desta spec quando o campo não existe. A sequência, o foco do dia e os segundos já gravados em cada tarefa permanecem. Dias anteriores a esta mudança entram no gráfico como zero: o diário começa a ser anotado quando um foco é concluído depois dela.

Branch: `feature/offered-hours`.

## Referências de Projeto

- [Produto](../../../memory/produto.md)
- [Contexto técnico global](../../../memory/contexto-tecnico.md)
- [Estrutura do projeto](../../../memory/estrutura.md)

## Referências Compartilhadas

- [Como executar](../../../shared/como-executar.md)
- [Regras de nomenclatura](../../../shared/regras-de-nomenclatura.md)
- Modelo de origem: [modelo-interface](../../../templates/modelo-interface.md)
- Origem visual: as telas Summary e Ranking de [Pomofocus](https://pomofocus.io/app), adaptadas ao que esta página já guarda no navegador

## Observações Locais

### Fora desta mudança

Conta, login, outras pessoas no ranking, Todoist, webhook, alarme noutro aparelho, projeto, nota por tarefa, tique durante o foco, gráfico do ano, exportação, intervalo livre no lugar do “a cada 4 focos”, e tema que troca sozinho enquanto o foco corre. O ranking com outras pessoas fica na [015-ranking-publico](../015-ranking-publico/spec.md). A pausa longa continua a cada quatro focos, com o interruptor que já existe.

### Duas abas no painel da sequência

O botão da barra continua mostrando os dias da sequência e abrindo o mesmo painel. O título do painel continua “Sequência”. Dentro dele, duas abas: “Resumo” e “Ofertas”. Ao abrir, a aba é Resumo. Trocar de aba não muda a fase nem grava ajuste.

O período é compartilhado pelas duas abas. Os botões são “Semana” e “Mês”. Não há “Ano”. A semana começa na segunda-feira, no fuso do navegador, com os mesmos dias de `todayKey`. As setas andam para o período anterior e o seguinte. O período seguinte ao que contém hoje não abre. O anterior só abre se algum dia dele ainda estiver entre os 62 dias guardados.

### Resumo

Três cartões, depois o gráfico.

| Cartão | Conta |
| --- | --- |
| Horas oferecidas | Soma dos focos concluídos no período, em `HH:MM` |
| Dias com foco | Dias do período com ao menos um foco concluído |
| Sequência | O mesmo número do botão da barra, sem recortar pela semana ou pelo mês |

`HH:MM` arredonda os segundos ao minuto mais próximo. Hora com dois dígitos até 99; acima disso, mostra o número inteiro. Minuto sempre com dois dígitos. `00:00` é zero.

O gráfico é de barras, desenhado na página, sem biblioteca. Cada barra é um dia: na semana, Seg, Ter, Qua, Qui, Sex, Sáb, Dom; no mês, o número do dia. A altura usa os segundos exatos. O dia mais alto encosta no topo. Se todos forem zero, a escala vai de 0 a 1 hora, com linhas de 0,1. Dia com foco e barra que ficaria invisível ganha altura mínima. Cada barra tem nome acessível com o dia e o tempo, ou “sem foco”.

Em 390 px de largura, os três cartões continuam legíveis sem rolagem horizontal da página. O gráfico pode rolar dentro do painel. Em 900 px, semana e mês cabem no painel sem essa rolagem interna.

Sem foco no período, os cartões de horas e de dias mostram `00:00` e `0`, o gráfico fica vazio na escala de 1 hora, e uma linha diz “Nada oferecido neste período.” A sequência continua a que já estiver gravada.

### Ofertas

A segunda aba lista o que a própria pessoa ofereceu no período, da maior duração à menor. Cada linha tem a posição, o nome e o tempo em `HH:MM`, no mesmo arredondamento do resumo. Não há avatar nem nome de outra pessoa.

A soma de uma oferta é a dos focos concluídos com ela selecionada, nos dias do período, mesmo que a tarefa já tenha sido removida da lista. O nome é o da conclusão mais recente nesse período. Empate de tempo ordena pelo nome, em português. Oferta com zero segundo não aparece.

Foco concluído sem tarefa selecionada entra nas horas e no gráfico. Na lista, vira uma linha “Sem nome”, só quando essa soma é maior que zero.

Lista vazia: “Nada oferecido neste período.”

### O que entra no diário

Só o foco concluído, pelo mesmo caminho de hoje: o relógio chega a zero ou “Encerrar este foco”. “Sair mesmo assim” não anota. Os segundos são os já decorridos nessa entrada, os mesmos que a tarefa selecionada recebe.

Cada dia guarda a data, o total de segundos de foco e, por oferta, o id, o nome, os segundos e a quantidade de entradas. O mesmo id no mesmo dia soma na mesma linha. Ficam os últimos 62 dias, contando hoje. Dia mais antigo sai ao gravar um foco novo. Dia sem foco não precisa de linha: o gráfico preenche zero.

A tarefa também passa a ter `plannedFocuses` e `focusCount`. JSON sem eles abre com 1 e 0. Os `focusSeconds` antigos permanecem e não viram contagem de entradas: a contagem começa nos focos concluídos depois desta mudança.

`plannedFocuses` vai de 1 a 12. Ao adicionar, o padrão é 1. O campo fica no formulário, com o nome “Entradas de foco”. Adicionar com nome continua gravando, selecionando e fechando o painel. Nome vazio não grava e não fecha. Mudar as entradas de uma tarefa já gravada não fecha o painel e não mexe em `focusCount` nem em `focusSeconds`.

Na lista, a linha mostra “N de M” junto do tempo que já aparece. A ordem é: ainda abaixo do previsto, na ordem em que foram adicionadas; as que já chegaram ao previsto e não estão marcadas como feitas; por último, as marcadas como feitas. Chegar ao previsto não marca como feita e não tira a seleção.

### Oração que começa sozinha

O interruptor deixa de se chamar “Passar sozinho para a fase seguinte” e passa a “Começar a oração sozinha”. O campo gravado continua `autoAdvance`.

Com ele ligado, e a fase não tendo acabado há mais de dois segundos com a aba ausente:

- o fim do foco começa a pausa ou a pausa longa;
- o fim da pausa ou da pausa longa começa a oração;
- o fim da oração deixa o foco parado, à espera de “Começar o foco”.

Com ele desligado, nenhuma fase seguinte começa sozinha. O foco nunca começa sozinho, mesmo com o interruptor ligado. Quem já tinha `autoAdvance` ligado passa a este comportamento. Quem tinha desligado continua com tudo à mão.

O aviso, o sino e a notificação de fase encerrada seguem como hoje. A pergunta “Sair desta fase?” não muda.

### Atalhos

Com nenhum painel aberto, sem a pergunta de sair da fase, e com o foco do teclado fora de campo, botão e link:

- Espaço começa ou pausa a fase atual, o mesmo que o botão principal;
- T abre “O que você oferece” e leva o cursor ao campo do nome. Se outro painel estiver aberto, T não troca de painel.

Escape continua fechando o painel aberto e, sem painel, dispensando a pergunta de sair da fase.

Não há atalho para trocar de fase, abrir ajustes, abrir o resumo, mudar a estimativa, criar nota ou criar projeto. Não há modal de atalhos.

Nas perguntas frequentes entra uma pergunta: “Como começo sem tirar a mão do teclado?” A resposta diz que, com a página à frente e nenhum painel aberto, Espaço começa ou pausa, e que T abre o nome da oferta quando nenhum painel está aberto. Escape fecha o painel.

### Sino

“Sino ao terminar” continua. Desligado, não toca. Ligado, o volume vai de 0 a 100, padrão 100, que é o volume de hoje. Zero não toca. As frequências 523,25 Hz e 392 Hz e o envelope de cada batida permanecem. O volume multiplica o pico atual de 0,18.

“Repetir o sino” vem desligado. Ligado, a mesma dupla de batidas toca uma segunda vez, começando 2,4 s depois da primeira. Não há terceira vez. Não há tique durante o foco. O volume do canto não muda.

### Dois minutos antes

“Avisar dois minutos antes” vem desligado, junto do sino. Ligado, uma notificação por entrada de fase, só com a aba oculta e a permissão já concedida, quando o tempo restante chega a 2:00 vindo de cima disso. A fase planejada precisa ser maior que dois minutos. Pausa do relógio não dispara. O título da notificação continua “Pomodoro Católico”. O texto é “Faltam dois minutos de foco.” no foco e “Faltam dois minutos de oração.” na oração, na pausa e na pausa longa. A notificação de fase encerrada permanece.

### Dois ritmos

“Restaurar 1 · 25 · 5 · 15” continua devolvendo esses quatro tempos e nada mais.

Ao lado, “1 · 25 · 10 · 20”, com nome acessível “Pausa mais longa: 1, 25, 10 e 20”, grava oração 1, foco 25, pausa 10 e pausa longa 20. Não muda tipo de pausa, sino, aviso, avanço, ambiente, cor nem fundo.

## Tasks

### Tasks - Domain

- [x] Concluir um foco anota o dia e, se houver tarefa selecionada, soma segundos e uma entrada nela; “Sair mesmo assim” não anota
- [x] Guardar no máximo 62 dias e abrir JSON antigo com diário vazio, `plannedFocuses` 1 e `focusCount` 0, sem converter segundos antigos em entradas
- [x] “Começar a oração sozinha” só inicia pausa, pausa longa ou oração; o foco fica parado; atraso maior que dois segundos não inicia nada
- [x] Resumo e ofertas do período saem de funções puras: horas, dias com foco, barras e a lista ordenada, com a linha “Sem nome” quando couber
- [x] O aviso de dois minutos é uma regra pura: uma vez por entrada, fase maior que dois minutos, restante chegando a 2:00

### Tasks - Composicao

- [x] A conclusão do foco grava o diário no mesmo pacote da sessão, da tarefa e da sequência
- [x] O sino toca no volume gravado e, se a repetição estiver ligada, uma segunda vez
- [x] Com o aviso ligado e a aba oculta, notificar aos dois minutos sem alterar a notificação de fase encerrada

### Tasks - Interface

- [x] No painel Sequência, abas Resumo e Ofertas, com Semana e Mês e setas dentro dos 62 dias
- [x] Três cartões e o gráfico de barras, com a escala de 1 hora quando o período está em zero
- [x] Lista numerada de ofertas em `HH:MM`, e “Nada oferecido neste período.” quando não houver linha
- [x] Cartões e gráfico legíveis na Capela e na Alvorada, em 900 px e em 390 px, sem rolagem horizontal da página
- [x] Entradas de foco no adicionar e na tarefa já gravada, com “N de M” e a ordem: em aberto, já no previsto, feitas
- [x] Interruptor “Começar a oração sozinha” no lugar do avanço único
- [x] Volume do sino, “Repetir o sino” e “Avisar dois minutos antes”
- [x] Botão “1 · 25 · 10 · 20” ao lado de “Restaurar 1 · 25 · 5 · 15”
- [x] Espaço e T nas condições desta spec; Escape como já está
- [x] A pergunta frequente do teclado
- [x] Texto e botão legíveis na Capela e na Alvorada, com o crédito da pintura visível

### Tasks - Documentacao

- [x] Atualizar [produto](../../../memory/produto.md) com o resumo, as ofertas do período, as entradas previstas, a oração que começa sozinha, os atalhos, o sino e os dois ritmos

### Tasks - Verificação

- [x] `npm run build`
- [x] Em `http://localhost:5174/`, concluir um foco com tarefa selecionada e ver a hora, o dia e a linha na aba Ofertas; repetir sem tarefa e ver “Sem nome” só na lista
- [x] Sair de um foco em curso e confirmar que esse tempo não entra no resumo nem na tarefa
- [x] Andar da semana para o mês e para uma semana anterior vazia; confirmar que a semana seguinte a hoje não abre
- [x] Com “Começar a oração sozinha” ligado, ver a pausa começar ao fim do foco e o foco ficar parado ao fim da oração
- [x] Adicionar uma oferta com 2 entradas, concluir um foco e ler “1 de 2”; ao chegar em “2 de 2”, ver a linha descer sem ficar marcada como feita
- [x] Espaço com o painel fechado começa e pausa; Espaço dentro do campo do nome não começa a fase; T com o painel fechado abre o nome
- [x] Volume 0 não toca; volume 100 toca como hoje; repetir toca uma segunda vez
- [x] Com o aviso ligado, a aba oculta e uma fase maior que dois minutos, ver uma notificação aos 2:00 e outra ao encerrar
- [x] “1 · 25 · 10 · 20” grava esses tempos e deixa o tipo de pausa como estava
- [x] Conferir Capela e Alvorada, em 900×874 e em 390×844, com o crédito visível
- [x] Confirmar as chaves `pomodoro-catolico-v1`, `pomodoro-catolico-fundo` e `pomodoro-catolico-music`, e um JSON antigo abrindo com diário vazio

## Resultado Esperado

- O painel da sequência mostra as horas oferecidas, os dias com foco, a sequência e o gráfico da semana ou do mês, sem conta e sem outras pessoas.
- A aba Ofertas ordena o que foi oferecido no período. Foco sem nome aparece como “Sem nome”.
- A oração e a pausa podem começar sozinhas. O foco espera “Começar o foco”.
- Cada oferta diz quantas entradas pede e quantas já foram concluídas. Chegar ao número não marca a oferta como feita.
- Espaço e T funcionam fora dos campos e dos painéis. O sino tem volume e uma repetição opcional. O aviso de dois minutos só sai com a aba oculta e o interruptor ligado.
- Os dois ritmos só mudam os quatro tempos. As três chaves continuam as mesmas. Dias anteriores a esta mudança ficam em zero.

## Evidência

`npm run build` (`tsc -b && vite build`) passou em 30/10/2026. Saída: 82 módulos, `dist/assets/index-B0NmiS0m.css` 30,67 kB, `dist/assets/index-C6pZ_ZdU.js` 294,68 kB.

Em `http://localhost:5174/`, com a Última Ceia, a dezena e o dourado, hoje sexta 30/10/2026:

- A semana 26 de out. – 1 de nov. abriu em Resumo, título “Sequência”. Cartões: horas `00:01`, dias com foco `1`, sequência `1` (o mesmo “1 dia” da barra). Barras: Seg, Ter, Qua e Qui “sem foco”; Sex `00:01` com a barra no topo da trilha de 120 px; Sáb e Dom “sem foco”. O período seguinte ficou desabilitado. A aba Ofertas mostrou “1 Estudar o ciclo 00:01” e “2 Sem nome 00:00”. Trocar de aba não mudou a fase.
- Outubro de 2026 manteve as mesmas ofertas. O dia 30 leu “30, 00:01”; o dia 1, “1, sem foco”. Setembro e as semanas 31 de ago. – 6 de set. e 24–30 de ago. ficaram em `00:00`, 0 dias e “Nada oferecido neste período.”, com a escala em 1 e 0. A sequência continuou 1. Em 24–30 de ago. a seta anterior ficou desabilitada. Em 900 px o mês não rola dentro do painel (`overflow-x: hidden`; a largura do gráfico ficou 1 px acima da área, sem barra de rolagem). Em 390 px o mês rola só dentro do painel (544 px de conteúdo em 352 px) e a página não ganha rolagem horizontal. Os três cartões couberam lado a lado, o último terminando em 372 px.
- Concluir um foco de 3 s em “Outra oferta”, com 2 entradas previstas, anotou o dia (41 s), uma entrada de 3 s e “1 de 2”, sem marcar como feita e sem tirar a seleção. O ciclo já tinha 3 focos, então a fase seguinte foi a pausa longa, correndo. O segundo foco, de 2 s, chegou a “2 de 2”, somou 5 s na oferta e 43 s no dia, e a linha desceu para baixo das que ainda estão em aberto, com o botão “Marcar como feita”. Subir as entradas de “Ler o evangelho” de 2 para 3 manteve o painel aberto, `focusCount` 0 e o tempo já gravado.
- Um foco sem tarefa, com o sino desligado, somou no dia e na linha “Sem nome”. As outras ofertas não mudaram. A pausa seguinte ficou parada, porque o fim tinha passado de dois segundos. “Sair mesmo assim” de um foco em curso voltou à oração sem aumentar o diário, a oferta nem o foco do dia. Com “Começar a oração sozinha” ligado, o fim da oração deixou o foco parado em “Começar o foco”.
- A ordem na lista ficou: ainda abaixo do previsto, na ordem em que foram adicionadas; depois as que já chegaram ao previsto e não estão feitas. “1 · 25 · 10 · 20” gravou pausa 10 e pausa longa 20 e deixou a dezena. “Restaurar 1 · 25 · 5 · 15” devolveu os quatro tempos.
- Espaço, com o painel fechado, começou e pausou a fase. Espaço no campo do nome não começou a fase. T com o painel fechado abriu “O que você oferece” e levou o cursor ao nome. T com a pergunta de sair aberta não trocou de painel. Escape fechou o painel. A pergunta “Como começo sem tirar a mão do teclado?” abre a resposta: “Com a página à frente e nenhum painel aberto, Espaço começa ou pausa. T abre o nome da oferta quando nenhum painel está aberto. Escape fecha o painel.”
- Volume 0 não criou oscilador, e a pausa começou sozinha. Volume 100, sem repetir, criou as batidas 523,25 Hz e 392 Hz. Com “Repetir o sino”, a mesma dupla voltou 2,4 s depois. Não houve terceira dupla.
- O aviso de dois minutos não apareceu na tela: a permissão estava concedida, mas a aba da conferência não ficou oculta (`document.hidden` falso, também com outra aba à frente e com o estado frozen). `reachesTwoMinutes` só aceita o aviso ligado, a fase maior que dois minutos, o relógio correndo e o restante cruzando 2:00, uma vez por entrada. `notifyIfHidden` cria a notificação “Pomodoro Católico” só com a aba oculta. O texto é “Faltam dois minutos de foco.” no foco e “Faltam dois minutos de oração.” na oração, na pausa e na pausa longa. A notificação de fase encerrada continua em `notifyIfHidden`, com o texto da fase.
- Na Capela, em 900×874 e `scrollY` 0, o botão principal teve contraste 9,25 e o crédito “Última Ceia, Leonardo da Vinci. Domínio público · fonte” ficou na primeira tela (topo 819, base 874). Fora do foco, com altura até 920 px, o anel fica em no máximo 18 rem para esse crédito caber. Na Alvorada, o botão teve contraste 5,99, o título do cartão 14,68 e o rótulo dos três cartões 5,56. O crédito continuou legível. Em 390×844 a página não rolou na horizontal e o crédito continuou na primeira tela. O rótulo do cartão usa 88% da tinta, porque o cinza anterior somava contraste 2,18 no pergaminho da Alvorada.
- Um JSON sem diário, sem `plannedFocuses`, sem `focusCount`, sem volume, sem repetição e sem o aviso abriu com diário vazio, 1 entrada prevista, 0 entradas contadas, os 90 s antigos intactos, volume 100, repetição desligada e aviso desligado. `autoAdvance` falso e a oração breve permaneceram. As chaves continuaram só `pomodoro-catolico-v1`, `pomodoro-catolico-fundo` (`{"saintId":"ceia"}`) e `pomodoro-catolico-music` (`{"trackId":"kyrie","volume":0.6}`).

Depois da verificação, a página voltou à Capela, à dezena, ao dourado e à Ceia, com a pausa parada e o diário de 30/10 como estava antes da conferência.

## Encerramento

Esta spec termina apenas quando todos os itens estiverem marcados e com evidência registrada, no formato definido em [Como executar](../../../shared/como-executar.md).
