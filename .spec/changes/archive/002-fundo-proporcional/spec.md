# 002-fundo-proporcional

## Objetivo

Tirar a Pietà, que ficou desproporcional ao lado do timer, e pôr no lugar uma imagem católica que cubra o palco como as outras.

## Contexto Técnico

A Pietà é a única imagem com `fit: contain` e tom `marmore`. O CSS a desenha numa placa à direita e empurra o relógio para um cartão estreito. As outras nove imagens usam `object-fit: cover` e preenchem o palco. A miniatura do catálogo é 16/9.

Esta spec não cria ambiente, cor, tom nem chave nova no `localStorage`. Quem gravou `saintId: "pieta"` passa a ver o fundo novo. Ambiente e cor já gravados permanecem.

## Referências de Projeto

- [Produto](../../../memory/produto.md)
- [Contexto técnico global](../../../memory/contexto-tecnico.md)
- [Estrutura do projeto](../../../memory/estrutura.md)

## Referências Compartilhadas

- [Como executar](../../../shared/como-executar.md)
- [Regras de nomenclatura](../../../shared/regras-de-nomenclatura.md)
- Modelo de origem: [modelo-base](../../../templates/modelo-base.md) e [modelo-interface](../../../templates/modelo-interface.md)

## Observações Locais

### Busca de imagens

A imagem nova sai de uma busca na internet. Toda candidata precisa ser católica: santuário, santo, basílica, adoração, peregrinação ou outra devoção da Igreja. Cruz genérica, silhueta de estoque e foto sem lugar ou devoção católica ficam de fora.

Cada candidata também precisa de:

- licença compatível com o catálogo: domínio público, CC0, CC BY ou CC BY-SA, com autor e URL da fonte;
- enquadramento largo, próximo de 16/9 ou 3/2, para `object-fit: cover` no palco e na miniatura;
- assunto que continue reconhecível com o timer no centro.

Foto em retrato, escultura isolada e objeto sacro em close repetem o problema da Pietà e não entram.

Busca feita em 22/10/2026 no Wikimedia Commons:

| Candidata | Proporção | Licença | Decisão |
|-----------|-----------|---------|---------|
| [Basílica de São Francisco, Assis](https://commons.wikimedia.org/wiki/File:Papal_Basilica_of_Saint_Francis_of_Assisi.jpg), Peter K Burian | 2700×1472 | CC BY-SA 4.0 | Entra no lugar da Pietà |
| [Basílica da Imaculada e a gruta, Lourdes](https://commons.wikimedia.org/wiki/File:Basilica_of_the_Immaculate_Conception_and_surroundings_of_the_grotto.jpg), Jan Hager | 5982×3365 | CC BY-SA 4.0 | Vai para o pacote Juventude da spec 003 |
| [Claustro do Sacro Convento, Assis](https://commons.wikimedia.org/wiki/File:Sacro_Convento_-_Courtyard_of_the_friary,_Basilica_of_Saint_Francis,_Assisi_(panoramic).jpg), Marco Ober | 11823×3756 | CC BY-SA 4.0 | Fora. Faixa estreita demais para o cover |
| [Capela de adoração, Saint Thomas More](https://commons.wikimedia.org/wiki/File:Saint_Thomas_More_Church_(Munster,_Indiana)_-_Adoration_chapel.jpg), Nheyob | 4000×3000 | CC BY-SA 4.0 | Fora. Quase quadrada; o ostensório some sob o timer |
| [Ostensório em close](https://commons.wikimedia.org/wiki/File:Eucharistic_Adoration_-_Monstrance.jpg), PerfectUnityOrg | 1944×2592 | CC BY-SA 3.0 | Fora. Retrato |
| Cruz ao nascer do sol, Aaron Burden, e cruzes de estoque no Pixabay | paisagem | CC0 | Fora. Símbolo cristão genérico, sem devoção católica nomeada |

### Análise de temas mais jovens

Dá para ter temas mais jovens e continuar católico. O caminho é o mesmo catálogo: foto larga, `cover`, tom já existente (`escura`, `clara` ou `ceu`) e uma cor que o app já tem. Coral e menta já são as cores mais leves. Assis entra nessa linha: pedra clara, céu, São Francisco, vida ao ar livre.

Um pacote desenhado à parte — ilustração, santo em figurinha, fonte nova ou ambiente novo — fica para outra spec. Ele quebraria o véu, a leitura do timer e a frase de que a oração não é técnica de produtividade. Retrato de santo jovem (Teresinha, Carlo Acutis, João Paulo II) cai no mesmo recorte da Pietà.

A gruta de Lourdes entra no pacote Juventude da spec [003-pacote-juventude](../003-pacote-juventude/spec.md). Esta mudança só publica Assis. Se a licença de Assis sair do filtro, a substituta é outra foto larga católica que não seja essa gruta.

### Fundo e cena

| | Sai | Entra |
|--|-----|-------|
| Id | `pieta` | `assis` |
| Nome | Pietà | Assis |
| Subtítulo | Nossa Senhora, Vaticano | Basílica de São Francisco |
| Arquivo | `/saints/pieta.jpg` | `/saints/assis.jpg` |
| Tom | `marmore` | `clara` |
| Cor sugerida | Rosa | Dourado |
| Cena | Mármore (`marmore`) | Assis (`assis`): fundo Assis, Capela, dourado |
| Crédito | Sonse | Peter K Burian |
| Licença | CC BY 2.0 | CC BY-SA 4.0 |
| Fonte | Commons, Pietà de Michelangelo | [Commons, Papal Basilica of Saint Francis of Assisi](https://commons.wikimedia.org/wiki/File:Papal_Basilica_of_Saint_Francis_of_Assisi.jpg) |

O tom `marmore` e o campo `fit` saem do catálogo. O véu de Assis é o de `clara`, já usado por Fátima, Aparecida e Cristo. A cena Mármore sai da lista. As outras cinco cenas permanecem.

## Tasks

### Tasks - Conteudo

- [x] Confirmar, na página do Commons, que a basílica de Assis continua em CC BY-SA 4.0. Se a licença tiver saído do filtro, escolher outra foto larga católica da tabela, exceto a gruta de Lourdes, que pertence à spec 003. Gravar o JPEG em `public/saints/assis.jpg` e apagar `public/saints/pieta.jpg`.
- [x] Em `saints.ts`, trocar a Pietà por Assis, com tom `clara`, cor sugerida dourado, crédito, licença e fonte da tabela. Remover `fit` do tipo e o tom `marmore`.
- [x] Trocar a cena Mármore pela cena Assis: fundo Assis, ambiente Capela, cor dourado.

### Tasks - Estado

- [x] Se `pomodoro-catolico-fundo` tiver `saintId: "pieta"`, abrir em `assis`. Não criar chave nova. Ambiente e cor gravados em `pomodoro-catolico-v1` permanecem.

### Tasks - Interface

- [x] Todo fundo, inclusive Assis, usa `object-fit: cover` no palco e na miniatura 16/9. Remover o ramo `contain`, a placa da escultura e o CSS de `data-tone="marmore"`.
- [x] O crédito de Assis continua visível no fim do palco, com licença e fonte.
- [x] Atualizar `.spec/memory/contexto-tecnico.md` e `.spec/templates/modelo-interface.md` para descrever dez imagens com os tons `escura`, `clara` e `ceu`, sem Pietà e sem `marmore`.

### Tasks - Verificação

- [x] `npm run build`
- [x] Em `http://localhost:5174/`, abrir a cena Assis e ler o timer na oração e no foco. A basílica cobre o palco inteiro, como a Ceia e a Fátima.
- [x] Abrir só o fundo Assis a partir da Noite e confirmar tom `clara`, cor dourada e ambiente Noite mantido.
- [x] Gravar `saintId: "pieta"` e recarregar: o fundo passa a ser Assis; ciclo, tarefas e ambiente anterior permanecem.
- [x] Confirmar que Pietà e a cena Mármore saíram do painel e que o texto do timer não fica num cartão estreito ao lado da imagem.

## Resultado Esperado

- O catálogo continua com dez imagens e a opção sem imagem. A Pietà não está entre elas.
- Assis cobre o palco e a miniatura no mesmo enquadramento das outras imagens.
- A cena Assis aplica fundo, Capela e dourado. A escolha livre de fundo continua.
- Quem tinha a Pietà gravada vê Assis, sem perder ciclo, tarefas, sequência, ambiente nem cor.
- A gruta de Lourdes fica para o pacote Juventude da spec 003. Esta mudança não publica esse fundo.

## Evidência

A API do Commons, em 22/10/2026, devolveu `LicenseShortName: CC BY-SA 4.0`, artista Peter K Burian e original 2700×1472. O JPEG ficou em `public/saints/assis.jpg`, 1920×1047, 463 KB, no mesmo limite de largura das outras imagens. `public/saints/pieta.jpg` foi apagado. A gruta de Lourdes não entrou.

`npm run build` (`tsc -b && vite build`) passou em 22/10/2026. Saída: 27 módulos, `dist/assets/index-WMDgXTeS.css` 22,67 kB, `dist/assets/index-H-wpt5GZ.js` 265,88 kB.

Em `http://localhost:5174/`:

- Cena Assis: fundo `/saints/assis.jpg`, tom `clara`, Capela, dourado. Oração em `01:00`, texto `rgb(247, 241, 231)`, botão dourado `rgb(228, 194, 122)` com texto `rgb(42, 33, 24)`. A basílica cobre o palco (1079×957, `object-fit: cover`). O hero fica centralizado, com 832 px, e não vira cartão estreito.
- Foco: `25:00`, “Uma coisa de cada vez.”, véu mais fechado, anel e botão dourados legíveis. O crédito no fim do palco: “Assis, Peter K Burian. CC BY-SA 4.0 · fonte”, com a licença e a página do Commons. O método abaixo ficou na cor sólida do ambiente.
- A miniatura de Assis, a da Ceia e a de Fátima medem 116×65 (16/9) com `object-fit: cover`.
- A partir da Vigília (Noite, Praça, azul), só o fundo Assis: tom `clara`, dourado, ambiente Noite mantido. A cena Assis deixou de ficar marcada, porque ela aplicaria Capela.
- `saintId: "pieta"` com foco, 2 de 4, tarefa “Ler o evangelho”, Noite e dourado. Depois de recarregar: fundo Assis, a chave gravada passou a `{"saintId":"assis"}`, e fase, ciclo, tarefa, Noite e dourado permaneceram. As chaves continuaram só `pomodoro-catolico-v1`, `pomodoro-catolico-fundo` e `pomodoro-catolico-music`.
- O painel lista Capela, Campo, Santuário, Alvorada, Vigília e Assis. Os fundos são Nenhum e as dez imagens, com Assis no lugar da Pietà. Não há Pietà, Mármore nem Lourdes.

O crédito do palco passou a mostrar o link da fonte junto da licença, para Assis e para as outras imagens. O campo já existia; faltava no fim do palco.

Depois da verificação, o navegador voltou à oração, 0 dias, Ceia, Capela e dourado.

## Encerramento

Esta spec termina apenas quando todos os itens estiverem marcados e com evidência registrada, no formato definido em [Como executar](../../../shared/como-executar.md).
