# Produto

## Pomodoro Católico

Página única para rezar e trabalhar no mesmo ritmo: um minuto de oração, vinte e cinco de foco e cinco de pausa. Depois de quatro focos, uma pausa longa. A proposta é colocar Deus no centro do trabalho e do estudo, sem transformar a oração em técnica de produtividade.

## O que a pessoa faz

- Começa pela oração, com uma jaculatória. Pode trocar a frase daquela entrada e segue para o foco e para a pausa.
- Na pausa, reza uma dezena do Terço, uma oração breve ou permanece em silêncio.
- Dá nome à tarefa oferecida e, se quiser, a uma intenção do dia. Cada oferta pede de 1 a 12 entradas de foco; ao adicionar, o padrão é 1. A linha mostra quantas já foram concluídas, no formato “N de M”, junto do tempo. Chegar ao número não marca a oferta como feita. Adicionar um nome grava a tarefa, deixa essa tarefa escolhida e fecha o painel. Intenção, marcar, escolher, remover e mudar as entradas de uma oferta já gravada permanecem no painel.
- Acompanha a sequência: um dia conta quando ao menos um foco é concluído. O mesmo botão abre o painel Sequência, na aba Resumo: horas oferecidas da semana ou do mês, dias com foco, a sequência e um gráfico de barras. A aba Ofertas lista o que a própria pessoa ofereceu no período, do maior tempo ao menor. Foco sem tarefa aparece como “Sem nome”. Pode encerrar o foco antes do zero: o dia entra na sequência, a tarefa escolhida recebe os segundos e uma entrada, e o diário daquele dia também. Sair da fase em curso não anota.
- Se quiser, grava um apelido e aparece na aba Ranking, ao lado de Resumo e Ofertas, na lista da semana com outras pessoas. A semana é a de Brasília. Sem apelido, nada é publicado. Sair apaga a linha para as outras pessoas.
- Com “Começar a oração sozinha” ligado, o fim do foco começa a pausa e o fim da pausa começa a oração. O foco espera “Começar o foco”. Com o interruptor desligado, nenhuma fase seguinte começa sozinha.
- Com a página à frente e nenhum painel aberto, Espaço começa ou pausa. T abre o nome da oferta. Escape fecha o painel.
- Abre Ajustes para mudar os tempos, o tipo de pausa, a cena, o fundo, o ambiente (Capela, Alvorada, Noite) e a cor do anel e do botão. “Restaurar 1 · 25 · 5 · 15” devolve esses quatro tempos. “1 · 25 · 10 · 20” grava oração 1, foco 25, pausa 10 e pausa longa 20, e não muda o restante.
- O sino ao terminar pode ter volume de 0 a 100 e uma repetição. “Avisar dois minutos antes” manda uma notificação, só com a aba oculta e a permissão já concedida, quando faltam dois minutos de uma fase maior que isso.
- Ouve um canto enquanto o ciclo corre. Ao entrar na oração, o canto que estiver tocando pausa e não volta sozinho; a faixa escolhida permanece, e a pessoa pode tocá-la de novo.
- Lê, abaixo do timer, o método, o sentido e as perguntas frequentes.
- Na oração e na pausa, vê a celebração do dia e pode abrir a liturgia. Debaixo dela, quando a API do santo responde, vê o santo do dia e pode abrir a foto, a introdução do artigo em até três parágrafos (ou a biografia curta, quando o dia não tem introdução), a vida (nascimento, morte, sepultura e ordem religiosa), a veneração (venerado por, beatificação, canonização, quem canonizou, festa, padroeiro e os símbolos na arte) e a fonte. O painel só mostra as linhas que têm texto e rola dentro do drawer. A linha do hero continua só com o nome.

## Ciclo

| Fase | Duração inicial | O que a tela mostra |
|------|-----------------|---------------------|
| Oração | 1 min | Jaculatória do dia, com botão para outra frase naquela entrada. Se houver tarefa ou intenção, elas aparecem no mesmo card. |
| Foco | 25 min | A tarefa escolhida, ou o convite a fazer uma coisa de cada vez. Esta fase não começa sozinha. |
| Pausa | 5 min | Dezena, oração breve ou presença, conforme o ajuste. |
| Pausa longa | 15 min | O mesmo da pausa, com o quinto mistério quando a pausa é dezena. |

Os quatro mistérios do dia (gozosos, dolorosos, gloriosos, luminosos) seguem o dia da semana.

## O que fica neste navegador

- Sessão, tarefas, intenção, estatísticas, ajustes e o diário dos últimos 62 dias de foco concluído, na chave `pomodoro-catolico-v1`. Dias anteriores a esse diário entram no gráfico como zero.
- Fundo escolhido, na chave `pomodoro-catolico-fundo`.
- Apelido e identificador de quem entrou no ranking, na chave `pomodoro-catolico-ranking`.

Não há conta nem mensalidade. A liturgia e o santo do dia continuam dois `GET` externos, e esses textos não são gravados. O ranking da semana pede a própria origem em `/api/ranking`.
