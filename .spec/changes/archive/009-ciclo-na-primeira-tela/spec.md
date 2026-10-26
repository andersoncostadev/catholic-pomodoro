# 009-ciclo-na-primeira-tela

## Objetivo

Deixar a oração e a pausa usáveis na primeira tela, fechar o painel ao adicionar um oferecimento e colocar o ritmo do ciclo à mão, sem descartar em silêncio um tempo que já está correndo.

## Contexto Técnico

A mudança fica em `presentation` e na composição do ciclo em `main/factories/flows`. A sequência, a duração e o registro do foco continuam em `domain/cycle`. O componente não recalcula isso.

Não há chave nova. Sessão, tarefas, intenção, estatísticas e ajustes seguem em `pomodoro-catolico-v1`. Fundo e canto seguem nas chaves que já existem. O texto da liturgia não é gravado. JSON antigo abre com os mesmos padrões de hoje.

O `entryId` da sessão continua marcando uma entrada nova de fase. A troca de aba e o fim natural do tempo seguem incrementando esse id. O reinício do relógio deixa de incrementá-lo, para a jaculatória escolhida e as contas já rezadas permanecerem.

Branch: `feature/clearer-cycle`.

## Referências de Projeto

- [Produto](../../../memory/produto.md)
- [Contexto técnico global](../../../memory/contexto-tecnico.md)
- [Estrutura do projeto](../../../memory/estrutura.md)

## Referências Compartilhadas

- [Como executar](../../../shared/como-executar.md)
- [Regras de nomenclatura](../../../shared/regras-de-nomenclatura.md)
- Modelo de origem: [modelo-interface](../../../templates/modelo-interface.md)

## Observações Locais

### Primeira tela

Na oração, na pausa e na pausa longa, o anel fica menor do que no foco. No foco, o anel permanece no tamanho atual. A frase “Um minuto de oração, vinte e cinco de foco, cinco de pausa.” sai do hero. O método, em `#metodo`, continua na página.

Sem rolagem, numa janela de 900×874 e num celular de 390×844:

- Na oração, cabem a jaculatória, “Outra jaculatória” e, abaixo, “Ofereço:” com a tarefa ou o pedido “O que você oferece hoje?”.
- Na pausa de dezena, cabem as contas e o botão “Começar a dezena” ou “Rezei esta conta”. O quinto mistério da pausa longa pode ficar abaixo.
- Na oração breve, cabem o texto e “Outra oração”.
- Na presença, cabe a frase da presença.

A liturgia do dia continua acima do timer na oração e na pausa, e oculta no foco. O crédito da pintura continua visível.

### Abas com o tempo correndo

Clicar na aba da fase atual não faz nada, esteja o relógio parado ou correndo.

Com o relógio parado, clicar em outra aba troca a fase na hora, como hoje, e essa troca é uma entrada nova.

Com o relógio correndo, clicar em outra aba abre na própria tela a pergunta “Sair desta fase? O tempo em curso não fica registrado.”, com “Ficar” e “Sair mesmo assim”. O tempo continua correndo enquanto a pergunta está aberta. “Ficar” e Escape dispensam a pergunta e deixam a fase como está. “Sair mesmo assim” troca a fase e esse tempo não entra em oração, foco, pausa nem sequência. Se o tempo termina sozinho com a pergunta aberta, a pergunta some e o ciclo avança como já avança hoje.

### Ajustes

O botão da barra e o título do painel passam de “Temas” a “Ajustes”. O ícone de engrenagem permanece.

A ordem do painel é: Tempos, Tipo de pausa, Cenas, Juventude, Fundo e cor. Os interruptores de pausa longa, avanço automático e sino ficam em Tipo de pausa.

Cenas e Juventude continuam gravando juntas a imagem, o ambiente e a cor. Fundo e cor deixa de repetir uma imagem que já aparece em Cenas ou Juventude. Continuam ali Nenhum, Santos, São Pedro, Aparecida, São Miguel e Cristo, além de Ambiente, Cor e as fontes das imagens.

“Restaurar 1 · 25 · 5 · 15” devolve oração 1, foco 25, pausa 5 e pausa longa 15. Não mexe em tipo de pausa, sino, avanço, ambiente, cor nem fundo.

### Oferecimento

Em “O que você oferece”, Adicionar com um nome não vazio grava a tarefa, deixa essa tarefa selecionada, limpa o campo e fecha o painel. Enter no campo faz o mesmo. Nome vazio ou só com espaços não grava e não fecha. Intenção, marcar, selecionar e remover não fecham o painel.

### Frase, contagem e liturgia

O número da aba só aparece quando é maior que zero. Com zero, o nome acessível da aba é só “Oração”, “Foco” ou “Pausa”.

Na dezena, a frase de santo e “Outra frase” aparecem depois de “Dezena rezada”. Na oração breve e na presença, a frase continua desde o início da pausa. Oração e foco continuam sem essa frase.

No painel da liturgia, Coleta, Salmo e Evangelho levam a seção o mais alto que o conteúdo permite. Depois da linha de fonte fica só o respiro normal do painel, sem um vão da altura da janela. A página atrás não se move, a fase não muda e o painel permanece aberto.

### Encerrar o foco e reiniciar

“Encerrar este foco” aparece só na fase de foco, e só depois que ao menos um segundo dessa entrada já passou, com o relógio correndo ou pausado. É um botão de texto, separado do botão principal. Conclui o foco pelo mesmo caminho do relógio chegar a zero: conta o foco, a sequência, o aviso, o sino se estiver ligado e o avanço automático se estiver ligado. A tarefa selecionada recebe os segundos já decorridos nessa entrada. Quando o relógio chega a zero sozinho, esses segundos são a duração planejada.

Reiniciar devolve o relógio da fase atual ao tempo inteiro e o para. Não cria entrada nova: a jaculatória escolhida, o passo da dezena e a oração breve escolhida permanecem. O botão continua sendo o ícone, com o nome acessível “Reiniciar esta fase”, e fica separado do botão principal.

### Canto

Ao entrar na oração, um canto que esteja tocando pausa. Não volta sozinho na fase seguinte. A faixa escolhida continua gravada. Se a pessoa escolher um canto já estando na oração, ele toca. Foco, pausa e pausa longa não pausam o canto por conta própria.

## Tasks

### Tasks - Domain

- [x] O fim antecipado do foco registra a conclusão pelo mesmo caminho do relógio em zero, e a tarefa selecionada soma os segundos já decorridos nessa entrada

### Tasks - Composicao

- [x] Com o relógio correndo, a troca de aba só vale depois da confirmação; a aba atual não reinicia a fase
- [x] Reiniciar o relógio não incrementa `entryId`
- [x] Ao entrar na oração, pausar o canto que estiver tocando, sem retomá-lo sozinho e sem apagar a faixa gravada

### Tasks - Interface

- [x] Na oração, na pausa e na pausa longa, anel menor e sem a frase de ritmo no hero, com a ação do guia visível sem rolagem em 900×874 e em 390×844
- [x] No foco, manter o anel no tamanho atual
- [x] Pergunta “Sair desta fase? O tempo em curso não fica registrado.” com “Ficar” e “Sair mesmo assim”; Escape e “Ficar” dispensam; o tempo segue correndo
- [x] Renomear o painel para “Ajustes”, com Tempos e Tipo de pausa antes das imagens
- [x] Fundo e cor sem repetir imagem de Cenas ou Juventude; manter Nenhum, Santos, São Pedro, Aparecida, São Miguel, Cristo, Ambiente e Cor
- [x] Rótulo “Restaurar 1 · 25 · 5 · 15” devolvendo esses quatro tempos
- [x] Adicionar um oferecimento com nome fecha o painel; nome vazio não fecha
- [x] Esconder o número da aba quando for zero
- [x] Frase de santo na dezena só depois de “Dezena rezada”
- [x] “Encerrar este foco” só depois de um segundo decorrido, separado do botão principal
- [x] Reiniciar separado do botão principal, sem zerar jaculatória nem contas
- [x] Liturgia sem vão da altura da janela depois da fonte; o atalho ainda leva a seção o mais alto que der
- [x] Texto e botão legíveis na Capela e na Alvorada, com o crédito da pintura visível

### Tasks - Documentacao

- [x] Atualizar [produto](../../../memory/produto.md) com o painel Ajustes, o oferecimento que fecha ao adicionar, o foco encerrado antes do zero e o canto que pausa ao entrar na oração

### Tasks - Verificação

- [x] `npm run build`
- [x] Em `http://localhost:5174/`, na oração e na pausa de dezena, ver a ação do guia sem rolagem em 900×874 e em 390×844
- [x] Adicionar um oferecimento e ver o painel fechar com a tarefa selecionada; repetir com o campo vazio e ver o painel continuar aberto
- [x] Com o foco correndo, tentar trocar de aba, ficar, e depois sair; confirmar que sair não conta o dia
- [x] Encerrar um foco depois de alguns segundos e ver o dia entrar na sequência, com o tempo da tarefa menor que a duração planejada
- [x] Reiniciar no meio de uma dezena e ver as contas permanecerem
- [x] Abrir Ajustes e ver Tempos antes das imagens; restaurar e ler 1, 25, 5 e 15
- [x] Entrar na oração com um canto tocando e ouvir a pausa; escolher o canto de novo na oração e ouvir tocar
- [x] Abrir a liturgia, ir ao Evangelho e rolar até o fim, sem um vão da altura da janela
- [x] Conferir Capela e Alvorada, com o crédito visível
- [x] Confirmar as chaves `pomodoro-catolico-v1`, `pomodoro-catolico-fundo` e `pomodoro-catolico-music`

## Resultado Esperado

- A jaculatória e a dezena cabem na primeira tela da oração e da pausa, no computador e no celular citados.
- Adicionar um oferecimento fecha o painel. O campo vazio não fecha.
- Um tempo que está correndo só muda de fase depois de confirmação. “Encerrar este foco” conta o dia e grava os segundos já decorridos.
- O painel se chama Ajustes, abre pelos tempos e não repete as imagens das cenas.
- A aba sem contagem não mostra zero. A frase de santo espera o fim da dezena. A liturgia não termina num vão alto. O canto pausa ao entrar na oração e pode ser retomado à mão.
- Fundo, ambiente, cor, as três chaves e o texto da liturgia continuam como já estão.

## Evidência

`npm run build` (`tsc -b && vite build`) passou em 26/10/2026. Saída: 66 módulos, `dist/assets/index-CdFd6jL8.css` 27,09 kB, `dist/assets/index-CcR19U34.js` 279,07 kB.

Em `http://localhost:5174/`, com a Última Ceia, a Capela e o dourado:

- Na oração, em 900×874, a frase de ritmo saiu do hero e continuou em `#metodo`. A liturgia ficou acima do timer. O anel mediu 152 px. “Outra jaculatória” terminou por volta de 502 px e “O que você oferece hoje?” por volta de 539 px, com a página em `scrollY` 0 e o crédito visível (topo 819). Em 390×844 o anel continuou em 152 px, o oferecimento terminou por volta de 520 px e o crédito começou em 789. No foco o anel voltou a 320 px e a linha da liturgia sumiu.
- Na pausa de dezena, em 900×874, as contas e “Começar a dezena” couberam (botão por volta de 600 px, crédito no topo 819) e a frase de santo não apareceu. Em 390×844 o botão terminou por volta de 586 px e o crédito em 789. Depois de “Dezena rezada”, a frase e “Outra frase” apareceram. Reiniciar no meio da dezena manteve “Ave-Maria 1 de 10” e “Rezei esta conta”.
- Na oração breve, em 900×874, o texto terminou por volta de 527 px e “Outra oração” por volta de 563 px, com a frase desde o início e o crédito no topo 819. Em 390×844, “Outra oração” terminou por volta de 538 px e o crédito em 789. Na presença, em 390×844, “Permaneça na presença de Deus.” terminou em 403 px, a frase em 560 px e o crédito em 789, com `scrollY` 0. Em 900×874 a frase, “Outra frase” e o crédito (819–874) couberam na primeira tela.
- Adicionar “Ler o evangelho” gravou a tarefa, deixou-a escolhida (“Ofereço: Ler o evangelho”) e fechou o painel. Um nome só com espaços não gravou e o painel continuou aberto.
- Com o foco correndo, clicar na aba Foco não trocou a fase nem abriu a pergunta. Clicar em outra aba mostrou “Sair desta fase? O tempo em curso não fica registrado.”, com “Ficar” e “Sair mesmo assim”. O relógio seguiu (de 24:31 para 24:20). “Ficar” e Escape dispensaram a pergunta. “Sair mesmo assim” voltou à oração sem contar o dia: sequência 0 e a tarefa sem segundos de foco.
- “Encerrar este foco” só apareceu depois de um segundo, separado do botão principal. Encerrar com cerca de 33 s mostrou “Foco concluído. A pausa é para rezar.”, avançou para a pausa, marcou “1 dia” e a aba “Foco 1”. A aba Pausa ficou sem número. A tarefa recebeu 33 s, abaixo dos 1500 s planejados.
- Ajustes abriu com Tempos, Tipo de pausa, Cenas, Juventude e Fundo e cor, nesta ordem. Fundo e cor mostrou Nenhum, Santos, São Pedro, Aparecida, São Miguel e Cristo, além de Ambiente, Cor e as fontes. “Restaurar 1 · 25 · 5 · 15” devolveu esses quatro tempos e deixou o tipo de pausa como estava.
- Um Kyrie tocando pausou ao entrar na oração: o botão passou a “Música” e a faixa continuou gravada. Escolher o Kyrie de novo na oração voltou a tocar. Foco e pausa não pausaram o canto.
- No painel da liturgia, Evangelho subiu até o limite do conteúdo: o pedido de rolagem era 1178 px e o máximo era 1107 px, então o título ficou a 71 px do topo da área rolável. No fim, o respiro depois da fonte era o `padding-bottom` de 32 px, sem vão da altura da janela. A página atrás ficou em `scrollY` 0, a fase não mudou e “Liturgia de hoje” permaneceu aberto.
- Na Capela, o botão principal teve contraste 9,25 e o texto do hero ficou em tinta clara. Na Alvorada, o cartão ficou em pergaminho, a frase da presença em tinta `#2c241c` (contraste 13) e o botão em dourado escuro (contraste 5,99). O crédito “Última Ceia, Leonardo da Vinci. Domínio público · fonte” continuou visível nos dois.
- As chaves continuaram só `pomodoro-catolico-v1`, `pomodoro-catolico-fundo` (`{"saintId":"ceia"}`) e `pomodoro-catolico-music` (`{"trackId":"kyrie","volume":0.6}`). O texto da liturgia não foi gravado.

Depois da verificação, a página voltou à oração, à dezena, à Capela, ao dourado e à Ceia, com o canto pausado e a faixa ainda gravada. O dia 1 e a tarefa “Ler o evangelho”, com 33 s, ficaram do foco encerrado nessa conferência.

## Encerramento

Esta spec termina apenas quando todos os itens estiverem marcados e com evidência registrada, no formato definido em [Como executar](../../../shared/como-executar.md).
