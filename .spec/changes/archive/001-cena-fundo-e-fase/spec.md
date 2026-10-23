# 001-cena-fundo-e-fase

## Objetivo

Fazer o timer continuar legível e reconhecível em qualquer fundo, ambiente e cor, e fazer cada fase mostrar só o que serve naquele momento.

## Contexto Técnico

Hoje o fundo, o ambiente e a cor são três escolhas soltas. O véu da imagem é um só para Capela e Noite. A Alvorada clareia a pintura inteira. Rosa e azul não escurecem na Alvorada. A página abaixo do timer repete o produto em cima da mesma imagem.

Esta spec não cria conta, servidor nem chave nova no `localStorage`. Cena pronta só grava o que já existe: fundo, `theme` e `accent`. Quem já tem estado antigo continua de onde parou.

## Referências de Projeto

- [Produto](../../../memory/produto.md)
- [Contexto técnico global](../../../memory/contexto-tecnico.md)
- [Estrutura do projeto](../../../memory/estrutura.md)

## Referências Compartilhadas

- [Como executar](../../../shared/como-executar.md)
- [Regras de nomenclatura](../../../shared/regras-de-nomenclatura.md)
- Modelo de origem: [modelo-base](../../../templates/modelo-base.md) e [modelo-interface](../../../templates/modelo-interface.md)

## Observações Locais

- A imagem cobre só o timer. Método, sentido, perguntas e o convite final usam a cor sólida do ambiente: marrom na Capela, azul na Noite, pergaminho na Alvorada.
- O tom do fundo manda no véu. O ambiente modula esse véu. A cor manda no anel e no botão.
- Escolher uma cena grava fundo, ambiente e cor juntos. Escolher só um fundo aplica a cor sugerida e mantém o ambiente atual. A pessoa pode trocar a cor depois.
- A opção sem imagem não muda o ambiente. Só a cena Alvorada leva a **Nenhum** com Alvorada e dourado.
- No foco, a barra recua e o hero esconde citação, frase de abertura e o sinal de rolar. O texto abaixo do timer continua na página.
- O atalho de espaço continua começando e pausando. A frase “Espaço começa ou pausa” sai da hierarquia visual.
- Trocar o tipo de pausa continua nos ajustes. No timer, a pausa mostra qual tipo está ativo.

### Tom e cor sugerida

| Fundo | Tom | Cor sugerida |
|-------|-----|---------------|
| Ceia, Santos | `escura` | Dourado |
| Angelus, São Pedro, São Miguel | `clara` | Dourado |
| Fátima, Aparecida, Cristo | `clara` | Azul |
| Praça | `ceu` | Azul |
| Pietà | `marmore` | Rosa |
| Nenhum | sem tom | mantém a cor atual |

Véu por tom:

- `escura`: véu moderado, texto em creme nos ambientes escuros.
- `clara`: a foto fica mais viva nas bordas; o texto do timer senta numa faixa escura no centro.
- `ceu`: véu azul.
- `marmore`: a escultura permanece inteira no centro; o texto fica na faixa ao redor, nunca sobre o mármore.
- Noite, com qualquer imagem: véu azul, no lugar do véu marrom.
- Alvorada sobre tom `escura` ou `ceu`: o texto vai para um cartão de pergaminho. A pintura não é clareada por inteiro.
- Rosa e azul, na Alvorada, escurecem como o dourado, o coral e a menta já fazem. Anel e botão permanecem legíveis no ambiente ativo.

### Cenas prontas

| Cena | Fundo | Ambiente | Cor |
|------|-------|----------|-----|
| Capela | Ceia | Capela | Dourado |
| Campo | Angelus | Capela | Dourado |
| Santuário | Fátima | Capela | Azul |
| Alvorada | Nenhum | Alvorada | Dourado |
| Vigília | Praça | Noite | Azul |
| Mármore | Pietà | Capela | Rosa |

Aparecida permanece no catálogo livre, com a mesma cor sugerida da Fátima.

### O que cada fase mostra

| Fase | Em primeiro plano | Fundo |
|------|-------------------|-------|
| Oração | Abas, relógio, botão e jaculatória. No mesmo card, a tarefa ou a intenção. Sem tarefa, o card diz “O que você oferece hoje?” e abre o painel de tarefas. | Véu do tom escolhido. |
| Foco | Relógio e o nome da tarefa. Sem citação e sem sinal de rolar. | Véu mais fechado que nas outras fases. |
| Pausa em dezena | Contas maiores, tipo “Dezena” visível, citação de volta. | Véu do tom. |
| Pausa breve | A oração breve, tipo “Oração breve” visível, citação de volta. | Véu do tom. |
| Presença | Uma frase. Menos chrome em volta do relógio. | Véu mais aberto, com mais imagem visível. |
| Pausa longa | O mesmo da pausa correspondente, mais o quinto mistério quando o tipo é dezena. | Igual à pausa. |

O relógio é o objeto principal: traço do anel mais espesso, brilho atrás do mostrador, quatro contas do ciclo com o texto “n de 4”, botão principal logo abaixo do relógio.

## Tasks

### Tasks - Conteudo

- [x] Em `saints.ts`, cada imagem ganha `tone` (`escura`, `clara`, `ceu` ou `marmore`) e `suggestedAccent`, conforme a tabela desta spec.
- [x] Declarar as seis cenas (id, nome, fundo, ambiente, cor) num único catálogo usado pelos ajustes.

### Tasks - Estado

- [x] Escolher uma cena grava `saintId`, `theme` e `accent` já existentes. Não criar chave nova no `localStorage`.
- [x] Escolher um fundo no catálogo aplica `suggestedAccent` e preserva o `theme` atual.
- [x] Escolher **Nenhum** no catálogo preserva `theme` e `accent`.
- [x] Estado antigo, sem os campos novos do catálogo, abre no ciclo e no fundo que a pessoa já tinha.

### Tasks - Interface

- [x] Marcar na página o tom do fundo e a fase (`data-tone`, `data-phase`), e fazer o véu seguir a tabela desta spec, inclusive Noite e Alvorada.
- [x] Escurecer rosa e azul na Alvorada, no anel e no botão.
- [x] Limitar a pintura ao timer. Método, sentido, perguntas e convite final ficam na cor sólida do ambiente. O crédito da imagem continua visível.
- [x] Na oração, o card reúne jaculatória e tarefa ou intenção. Sem tarefa, “O que você oferece hoje?” abre o painel de tarefas.
- [x] No foco, esconder citação, frase de abertura e sinal de rolar; escurecer mais o véu; mostrar o nome da tarefa.
- [x] Na pausa, mostrar o tipo ativo. Na dezena, aumentar as contas. Na presença, reduzir o chrome e abrir o véu. Na pausa longa em dezena, manter o quinto mistério.
- [x] Engrossar o anel, pôr brilho atrás do mostrador e trocar os quatro pontos por contas com “n de 4”.
- [x] Tirar da primeira tela a frase do espaço. O sinal de rolar vira um único sinal fino, oculto no foco.
- [x] A citação aparece na pausa e na pausa longa, e fica fora da oração e do foco.
- [x] Remover os seis cards de “O timer”. Manter os quatro passos, a frase “Não é rezar para produzir mais” em faixa própria, o FAQ e o convite final. Ajustar o link do rodapé que apontava para os cards.
- [x] Na barra, a sequência mostra uma conta acesa junto do número de dias. Tarefas mostra um ponto quando há uma oferta escolhida. No foco, a barra recua. O painel de música permanece sólido.
- [x] Nos ajustes, a ordem fica: cenas, fundo e cor, tempos, tipo de pausa. Cada cena tem miniatura reconhecível.

### Tasks - Verificação

- [x] `npm run build`
- [x] Em `http://localhost:5174/`, percorrer oração, foco, pausa em dezena e presença.
- [x] Aplicar as cenas Capela, Santuário, Alvorada, Vigília e Mármore e ler o timer em cada uma.
- [x] Trocar só o fundo para Aparecida e para Santos, confirmar a cor sugerida e confirmar que o ambiente não muda.
- [x] Abrir a página com estado antigo no `localStorage` e confirmar que o ciclo e o fundo anteriores permanecem.
- [x] Confirmar que o texto abaixo do timer não fica sobre a pintura.

## Resultado Esperado

- As dez imagens e a opção sem imagem continuam disponíveis, cada uma com véu próprio.
- As seis cenas aplicam fundo, ambiente e cor de uma vez. A escolha livre continua.
- Anel e botão permanecem legíveis na Capela, na Noite e na Alvorada, inclusive em rosa e azul.
- Oração, foco, pausa e pausa longa mudam o que está na frente e o quanto a imagem aparece.
- Método, sentido, perguntas e convite final não dependem da foto escolhida.
- Quem já usava o app não perde tarefas, sequência, ajustes nem fundo.

## Evidência

`npm run build` (`tsc -b && vite build`) passou em 22/10/2026. Saída: 27 módulos, `dist/assets/index-DrNLwefT.css` 24,50 kB, `dist/assets/index-D6TFGafR.js` 266,02 kB.

Em `http://localhost:5174/`:

- Oração, fase `offering`, tom `escura`, Capela e dourado, fundo Ceia. Jaculatória no card. Sem citação e sem a frase do espaço. “O que você oferece hoje?” abriu o painel de tarefas. O espaço, com o foco fora de botão ou campo, passou o botão para “Pausar” e o segundo espaço devolveu “Começar a oração”.
- Foco: sem frase de abertura, sem citação e sem sinal de rolar. Nome da tarefa visível. Véu mais fechado. Barra transparente e painel de música sólido (`rgb(24, 32, 56)` na Noite).
- Pausa em dezena: tipo “Dezena”, contas maiores (cerca de 17 px), citação de volta.
- Oração breve: tipo “Oração breve” e o texto da oração.
- Presença: uma frase, “Permaneça na presença de Deus.”, abas transparentes e véu mais aberto.
- Pausa longa em dezena: 15:00, “4 de 4” e “Se sobrar tempo, siga com o quinto mistério: A instituição da Eucaristia.”
- Capela: Ceia, ambiente Capela, dourado, texto em creme.
- Santuário: Fátima, Capela, azul, tom `clara`, faixa escura no centro e bordas vivas.
- Alvorada: sem imagem, pergaminho na página, anel e botão dourados escuros. Rosa ficou no botão `rgb(141, 58, 80)` e no anel `rgb(168, 77, 99)`. Azul ficou no botão `rgb(47, 75, 128)` e no anel `rgb(62, 95, 154)`.
- Alvorada sobre a Ceia (`escura`): o hero virou cartão `rgb(244, 236, 223)` com texto `rgb(44, 36, 28)`. O véu ao redor continuou escuro.
- Vigília: Praça, Noite, azul, tom `ceu`, véu azul. O método abaixo do crédito ficou no azul sólido.
- Mármore: Pietà inteira à direita; o texto ficou no cartão opaco à esquerda, sem sobrepor a escultura.
- Só Aparecida: cor azul, tom `clara`, ambiente Noite mantido. Só Santos: cor dourada, tom `escura`, ambiente Noite mantido.
- Nenhum, partindo de Noite e menta: a imagem saiu e o tom saiu; ambiente Noite e cor menta permaneceram.
- Estado antigo em `pomodoro-catolico-v1` e `pomodoro-catolico-fundo`: foco, 2 de 4, 4 dias, tarefa “Ler o evangelho”, Angelus, Noite e menta. Recarregar manteve ciclo e fundo. As chaves continuaram só `pomodoro-catolico-v1`, `pomodoro-catolico-fundo` e `pomodoro-catolico-music`.
- Método, sentido, perguntas e convite final ficaram na cor sólida do ambiente. O crédito da imagem permaneceu no fim do palco.

Depois da verificação, o navegador voltou à oração, 0 dias, Ceia, Capela e dourado.

## Encerramento

Esta spec termina apenas quando todos os itens estiverem marcados e com evidência registrada, no formato definido em [Como executar](../../../shared/como-executar.md).
