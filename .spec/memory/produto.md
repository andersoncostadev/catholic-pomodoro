# Produto

## Pomodoro Católico

Página única para rezar e trabalhar no mesmo ritmo: um minuto de oração, vinte e cinco de foco e cinco de pausa. Depois de quatro focos, uma pausa longa. A proposta é colocar Deus no centro do trabalho e do estudo, sem transformar a oração em técnica de produtividade.

## O que a pessoa faz

- Começa pela oração, com uma jaculatória. Pode trocar a frase daquela entrada e segue para o foco e para a pausa.
- Na pausa, reza uma dezena do Terço, uma oração breve ou permanece em silêncio.
- Dá nome à tarefa oferecida e, se quiser, a uma intenção do dia. Adicionar um nome grava a tarefa, deixa essa tarefa escolhida e fecha o painel. Intenção, marcar, escolher e remover permanecem no painel.
- Acompanha a sequência: um dia conta quando ao menos um foco é concluído. Pode encerrar o foco antes do zero: o dia entra na sequência e a tarefa escolhida recebe os segundos que já passaram nessa entrada.
- Abre Ajustes para mudar os tempos, o tipo de pausa, a cena, o fundo, o ambiente (Capela, Alvorada, Noite) e a cor do anel e do botão.
- Ouve um canto enquanto o ciclo corre. Ao entrar na oração, o canto que estiver tocando pausa e não volta sozinho; a faixa escolhida permanece, e a pessoa pode tocá-la de novo.
- Lê, abaixo do timer, o método, o sentido e as perguntas frequentes.
- Na oração e na pausa, vê a celebração do dia e pode abrir a liturgia. Debaixo dela, quando a API do santo responde, vê o santo do dia e pode abrir a foto, a introdução do artigo em até três parágrafos (ou a biografia curta, quando o dia não tem introdução), a vida (nascimento, morte, sepultura e ordem religiosa), a veneração (venerado por, beatificação, canonização, quem canonizou, festa, padroeiro e os símbolos na arte) e a fonte. O painel só mostra as linhas que têm texto e rola dentro do drawer. A linha do hero continua só com o nome.

## Ciclo

| Fase | Duração inicial | O que a tela mostra |
|------|-----------------|---------------------|
| Oração | 1 min | Jaculatória do dia, com botão para outra frase naquela entrada. Se houver tarefa ou intenção, elas aparecem no mesmo card. |
| Foco | 25 min | A tarefa escolhida, ou o convite a fazer uma coisa de cada vez. |
| Pausa | 5 min | Dezena, oração breve ou presença, conforme o ajuste. |
| Pausa longa | 15 min | O mesmo da pausa, com o quinto mistério quando a pausa é dezena. |

Os quatro mistérios do dia (gozosos, dolorosos, gloriosos, luminosos) seguem o dia da semana.

## O que fica neste navegador

- Sessão, tarefas, intenção, estatísticas e ajustes, na chave `pomodoro-catolico-v1`.
- Fundo escolhido, na chave `pomodoro-catolico-fundo`.

Não há conta nem sincronização. A página não hospeda API. Há dois `GET`: a liturgia do dia a `liturgia.cloudhub.ia.br` e o santo do dia à API do calendário dos santos. Nenhum dos dois textos é gravado.
