# 003-pacote-juventude

## Objetivo

Oferecer um pacote Juventude: três cenas da vida jovem católica, cada uma com imagem larga e uma cor leve, para quem reza e estuda.

## Contexto Técnico

Cena grava fundo, ambiente e cor. Cor sugerida do fundo aplica o acento e mantém o ambiente. O palco usa `object-fit: cover`. A miniatura é 16/9. O acento mora em `settings.accent`, dentro de `pomodoro-catolico-v1`.

Esta spec cria três acentos: `lima`, `brisa` e `manto`. Não cria ambiente, tom nem chave nova. Dourado, rosa, azul, coral e menta permanecem. A Pietà já foi trocada na [002-fundo-proporcional](../002-fundo-proporcional/spec.md). Esta spec não a reabre.

## Referências de Projeto

- [Produto](../../../memory/produto.md)
- [Contexto técnico global](../../../memory/contexto-tecnico.md)
- [Estrutura do projeto](../../../memory/estrutura.md)

## Referências Compartilhadas

- [Como executar](../../../shared/como-executar.md)
- [Regras de nomenclatura](../../../shared/regras-de-nomenclatura.md)
- Modelo de origem: [modelo-base](../../../templates/modelo-base.md) e [modelo-interface](../../../templates/modelo-interface.md)

## Observações Locais

O pacote é uma lista nova, `youthScenes`, ao lado das cenas já existentes. No painel Temas, ela aparece com o título Juventude, depois das cenas atuais. As três imagens também entram no catálogo livre, com a cor sugerida da tabela.

As cores do pacote são Lima, Brisa e Manto. Cada uma acompanha uma foto: o verde da trilha, o turquesa do encontro de dia e o céu da peregrinação à noite. Elas entram no tipo `Accent`, na fila de amostras e no `data-accent`. Escolher a cena grava essa cor. Escolher só a imagem aplica a cor sugerida e deixa o ambiente como está. Quem já gravou dourado, rosa, azul, coral ou menta continua nessa cor.

Ilustração, figurinha, fonte nova e ambiente novo ficam de fora. Retrato de santo jovem também: o timer cobre o rosto, como na Pietà.

### Busca

A procura não exige templo, basílica nem santuário. A foto precisa mostrar a juventude católica: o caminho a pé, a Jornada Mundial da Juventude, a peregrinação, a oração ao ar livre ou o encontro de jovens. Uma fachada de igreja fica de fora deste pacote, mesmo com licença e boa proporção. O catálogo antigo continua com Fátima, Aparecida e as outras igrejas.

Busca em 22/10/2026 no Wikimedia Commons. Toda candidata é católica, com licença de domínio público, CC0, CC BY ou CC BY-SA. A trilha ou a multidão continua reconhecível com `cover` e o timer no centro. Um rosto isolado não entra.

| Candidata | Proporção | Licença | Decisão |
|-----------|-----------|---------|---------|
| [Caminho Lebaniego, Cantábria](https://commons.wikimedia.org/wiki/File:Camino_Lebaniego,_Estrada,_Cantabria_03.jpg), Simon Burchell | 4000×3000 | CC BY-SA 4.0 | Entra. A trilha do Caminho, sem fachada |
| [Jovens na JMJ de Cracóvia, 2016](https://commons.wikimedia.org/wiki/File:02016_02_Junge_Menschen_auf_dem_Weltjugendtag_in_Krakau_2016.jpg), Silar | 2877×1802 | CC BY-SA 4.0 | Entra. Encontro de dia |
| [Peregrinos na JMJ do Rio, Copacabana](https://commons.wikimedia.org/wiki/File:Pilgrims_Pelegrinos_(9371607407).jpg), Leandro Neumann Ciuffo | 3872×2592 | CC BY 2.0 | Entra. Peregrinação à noite, 3/2 |
| [Celebração da JMJ em Barangaroo, 2008](https://commons.wikimedia.org/wiki/File:WYD-2008.JPG), Socrates2008 | 3008×2000 | CC BY-SA 3.0 | Reserva, se o encontro de Cracóvia sumir atrás do timer |
| [Basílica da Imaculada e a gruta, Lourdes](https://commons.wikimedia.org/wiki/File:Basilica_of_the_Immaculate_Conception_and_surroundings_of_the_grotto.jpg), Jan Hager | 5982×3365 | CC BY-SA 4.0 | Fora. Templo |
| [Santuário de Guadalupe](https://commons.wikimedia.org/wiki/File:Ciudad_de_M%C3%A9xico_-_Santuario_de_Santa_Mar%C3%ADa_de_Guadalupe_0310.JPG), Phyrexian | 5902×3934 | CC BY-SA 4.0 | Fora. Templo |
| [Pórtico da Glória, Santiago](https://commons.wikimedia.org/wiki/File:Catedral_de_Santiago_de_Compostela,_Panorama_del_Portico_de_la_Gloria.jpg), D. Rovchak | 8249×4743 | CC BY-SA 4.0 | Fora. Templo |
| [Vigília da JMJ em Sydney, panorama](https://commons.wikimedia.org/wiki/File:WYD_2008_Vigil_Stitch.jpg), Jmaxxz | 14595×1474 | CC BY 3.0 | Fora. Faixa estreita demais |
| [Alto del Perdón](https://commons.wikimedia.org/wiki/File:Alto_del_Perdon.jpg), Birgitta Hellman Magnusson | 4032×3024 | CC BY-SA 4.0 | Fora. As figuras de ferro ficam na linha do céu e o cover as corta |

### Cenas

| Cena | Id do fundo | Nome na grade | Subtítulo | Arquivo | Tom | Ambiente | Cor | Crédito | Licença |
|------|-------------|---------------|-----------|---------|-----|----------|-----|---------|---------|
| Caminho | `caminho` | Caminho | Caminho de Santiago | `/saints/caminho.jpg` | `clara` | Alvorada | Lima | Simon Burchell | CC BY-SA 4.0 |
| Jornada | `jornada` | Jornada | JMJ, Cracóvia | `/saints/jornada.jpg` | `clara` | Capela | Manto | Silar | CC BY-SA 4.0 |
| Peregrinos | `peregrinos` | Peregrinos | JMJ, Rio | `/saints/peregrinos.jpg` | `ceu` | Noite | Brisa | Leandro Neumann Ciuffo | CC BY 2.0 |

Fonte de cada uma: a página do Commons da tabela de busca.

Caminho e Jornada usam o véu de `clara`, o mesmo de Fátima e Aparecida. Peregrinos usa o véu de `ceu`, o mesmo da Praça. Na Alvorada sobre `clara`, o hero recupera o tom claro da cor. Na Alvorada sobre `ceu`, o texto vai para o cartão de pergaminho.

### Paleta

Lima é o verde-sol da trilha, mais amarelo que a menta. Manto é o turquesa do encontro de dia, mais vivo que o azul da capela. Brisa é o azul do céu e do mar na peregrinação à noite.

Na Capela e na Noite, anel e botão usam o tom claro, com texto escuro no botão. Na Alvorada, sobre o pergaminho, os dois escurecem e o texto do botão fica claro. Sobre tom `clara` na Alvorada, o hero volta ao tom claro.

| Cor | Id | Claro | Tinta no claro | Escuro na Alvorada | Botão escuro | Tinta no escuro |
|-----|----|-------|----------------|--------------------|--------------|-----------------|
| Lima | `lima` | `#c6e857` | `#243006` | `#5a7020` | `#465818` | `#f7fbe8` |
| Brisa | `brisa` | `#67d4ef` | `#062833` | `#1a6f8a` | `#14586e` | `#f3fbfe` |
| Manto | `manto` | `#3ecfc4` | `#042824` | `#0f6e68` | `#0c564f` | `#f3fffd` |

O brilho do anel segue o tom claro: Lima `rgba(198, 232, 87, 0.5)`, Brisa `rgba(103, 212, 239, 0.5)`, Manto `rgba(62, 207, 196, 0.48)`. Na Alvorada escura, o brilho usa o tom escuro com opacidade `0.35`.

Se a licença de uma foto tiver saído do filtro no dia do download, a cena usa a próxima linha da busca que ainda mostre juventude católica sem ser templo. Se o encontro de Cracóvia não se reconhecer com o timer no centro, a Jornada usa a celebração de Barangaroo.

## Tasks

### Tasks - Conteudo

- [x] Confirmar na página do Commons a licença de cada foto da tabela de cenas. Gravar `public/saints/caminho.jpg`, `public/saints/jornada.jpg` e `public/saints/peregrinos.jpg`. Se o arquivo passar de 4 MB, exportar um JPEG menor sem cortar para retrato.
- [x] Em `saints.ts`, acrescentar os três fundos com o tom, a cor sugerida, o crédito, a licença e a fonte da tabela.
- [x] Declarar `youthScenes` com Caminho, Jornada e Peregrinos. A lista `scenes` das cenas atuais permanece.

### Tasks - Estado

- [x] Incluir `lima`, `brisa` e `manto` em `Accent` e em `sanitizeBundle`. Um acento desconhecido continua abrindo em dourado. Dourado, rosa, azul, coral e menta gravados permanecem. Não criar chave nova.
- [x] Escolher uma cena da Juventude grava `saintId`, `theme` e o acento novo da tabela.
- [x] Escolher só o fundo no catálogo livre aplica a cor sugerida e preserva o ambiente atual.
- [x] Estado antigo, sem esses fundos, abre no ciclo e no fundo que a pessoa já tinha.

### Tasks - Interface

- [x] No painel Temas, a seção Juventude lista as três cenas, com miniatura 16/9 em `cover`, depois das cenas atuais.
- [x] As três imagens aparecem também em Fundo e cor. O crédito de cada uma continua visível no fim do palco.
- [x] Na fila Cor, depois de Menta, mostrar Lima, Brisa e Manto, com amostra na cor clara da tabela.
- [x] Anel e botão de Lima, Brisa e Manto seguem a tabela na Capela, na Noite e na Alvorada. Sobre tom `clara` na Alvorada, o hero usa o tom claro.
- [x] Acrescentar o pacote e as três cores em `.spec/memory/contexto-tecnico.md` e em `.spec/templates/modelo-interface.md`, sem desfazer a troca da Pietà.

### Tasks - Verificação

- [x] `npm run build`
- [x] Em `http://localhost:5174/`, abrir Caminho, Jornada e Peregrinos. Ler o timer na oração e no foco. Cada foto cobre o palco. A trilha, o encontro e a multidão da praia continuam reconhecíveis em volta do timer.
- [x] Confirmar cor e ambiente: Caminho em Alvorada e Lima, Jornada em Capela e Manto, Peregrinos em Noite e Brisa. Na Alvorada, o anel Lima fica escuro no pergaminho e claro sobre o Caminho.
- [x] Escolher só Peregrinos a partir da Capela: a cor vai para Brisa, o tom vai para `ceu` e a Capela permanece.
- [x] Na fila Cor, aplicar Brisa na Capela sem imagem e Manto na Alvorada sem imagem. Ler o botão nos dois casos. Dourado, rosa, azul, coral e menta continuam na fila.
- [x] Abrir uma cena já existente, Capela ou Vigília, e confirmar que ela continua no painel e aplica o fundo de antes.
- [x] Recarregar com o `localStorage` anterior: ciclo, tarefas, sequência, fundo e ajustes permanecem. As chaves continuam `pomodoro-catolico-v1` e `pomodoro-catolico-fundo`.

## Resultado Esperado

- O painel Temas tem a seção Juventude, com Vocação, Votos e Adoração.
- As três imagens mostram um jovem santo ou a adoração ao Santíssimo. Nenhuma é fachada de templo.
- Cada cena aplica a imagem, o ambiente e a cor da tabela de uma vez.
- As três fotos usam o mesmo `cover` das outras e entram no catálogo livre, com crédito.
- Lima, Brisa e Manto aparecem na fila Cor e permanecem legíveis no anel e no botão, na Capela, na Noite e na Alvorada.
- Dourado, rosa, azul, coral e menta continuam disponíveis.
- Quem já usava o app não perde tarefas, sequência, ajustes nem fundo.
- Fátima, Aparecida e as outras igrejas do catálogo permanecem. Esta spec não publica fachada de templo no pacote Juventude.

## Evidência

A API do Commons, em 22/10/2026, confirmou as três licenças da tabela de cenas:

- Caminho: `LicenseShortName: CC BY-SA 4.0`, Simon Burchell, original 4000×3000, 5,1 MB. O JPEG gravado ficou em `public/saints/caminho.jpg`, 1920×1440, 950 KB, sem corte.
- Jornada: `LicenseShortName: CC BY-SA 4.0`, Silar, original 2877×1802, 2,1 MB. Ficou abaixo de 4 MB, então `public/saints/jornada.jpg` guarda o original.
- Peregrinos: `LicenseShortName: CC BY 2.0`, Leandro Neumann Ciuffo, original 3872×2592, 5,5 MB. O JPEG gravado ficou em `public/saints/peregrinos.jpg`, 1920×1285, 577 KB, sem corte.

O encontro de Cracóvia continuou reconhecível com o timer no centro, então a reserva de Barangaroo não entrou. Nenhuma fachada de templo foi publicada.

`npm run build` (`tsc -b && vite build`) passou em 22/10/2026. Saída: 27 módulos, `dist/assets/index-pzbxRb-E.css` 23,75 kB, `dist/assets/index-BmQgrSRZ.js` 267,58 kB.

Em `http://localhost:5174/`:

- Estado anterior, com rosa, Noite, Fátima, foco em `25:00`, tarefa “Ler o evangelho”, intenção “Pelos estudos” e sequência de 3 dias (2 de 4). Depois de recarregar, ciclo, tarefa, intenção, fundo e rosa permaneceram. Um acento gravado como `violeta` abriu em dourado, sem apagar tarefa, sequência, Noite nem Fátima.
- Cena Caminho: `/saints/caminho.jpg`, tom `clara`, Alvorada e Lima. Oração em `01:00` e foco em `25:00`, texto `rgb(247, 241, 231)`. No hero, anel e botão `#c6e857` com tinta `#243006`. No pergaminho da página, anel `#5a7020` e botão `#465818` com tinta `#f7fbe8`. A foto cobre o palco (1094×906, `object-fit: cover`). O oratório, a vieira e as setas do Caminho continuam visíveis em volta do timer. Crédito: “Caminho, Simon Burchell. CC BY-SA 4.0 · fonte”.
- Cena Jornada: tom `clara`, Capela e Manto. Oração `01:00` e foco `25:00`. Anel e botão `#3ecfc4`, tinta `#042824`, brilho `rgba(62, 207, 196, 0.48)`. A multidão da JMJ continua reconhecível em volta do timer. Crédito: “Jornada, Silar. CC BY-SA 4.0 · fonte”.
- Cena Peregrinos: tom `ceu`, Noite e Brisa. Oração `01:00` e foco `25:00`. Anel e botão `#67d4ef`, tinta `#062833`, brilho `rgba(103, 212, 239, 0.5)`. A praia, as bandeiras e a multidão continuam visíveis. O hero mede 832 px, sem cartão estreito. Crédito: “Peregrinos, Leandro Neumann Ciuffo. CC BY 2.0 · fonte”.
- A partir da Capela, só o fundo Peregrinos: tom `ceu`, Brisa e Capela mantida. A cena Peregrinos deixou de ficar marcada, porque ela aplicaria a Noite.
- Brisa na Capela sem imagem: botão `#67d4ef` com tinta `#062833`, relógio `01:00` legível. Manto na Alvorada sem imagem: anel `#0f6e68`, botão `#0c564f` com tinta `#f3fffd`, brilho `rgba(15, 110, 104, 0.35)`, texto do hero `rgb(44, 36, 28)` no pergaminho. Lima no mesmo pergaminho: anel `#5a7020`, botão `#465818`, tinta `#f7fbe8`.
- A fila Cor lista Dourado, Rosa, Azul, Coral, Menta, Lima `#c6e857`, Brisa `#67d4ef` e Manto `#3ecfc4`. As miniaturas de Caminho, Jornada e Peregrinos medem 116×65 (16/9) com `object-fit: cover`.
- A cena Vigília continua no painel e aplica Praça, Noite e azul. Capela, Campo, Santuário, Alvorada e Assis também continuam. Fátima, Aparecida e as outras igrejas seguem no catálogo livre.
- As chaves continuaram `pomodoro-catolico-v1`, `pomodoro-catolico-fundo` e a chave de canto que o app já gravava, `pomodoro-catolico-music`. Esta spec não criou chave nova.

Depois da verificação, o navegador voltou à oração, 0 dias, Ceia, Capela e dourado.

### Substituição pedida depois

As três fotos de trilha e de multidão saíram a pedido. No lugar entraram arte de um jovem santo e a adoração ao Santíssimo. As cores Lima, Brisa e Manto permaneceram. Quem tinha gravado `caminho`, `jornada` ou `peregrinos` passa a ver Vocação, Votos ou Adoração.

- Vocação: Guercino, *A vocação de São Luís Gonzaga*, Metropolitan Museum of Art, CC0. `public/saints/vocacao.jpg`, 1920×2493, 1,1 MB. Tom `clara`, Alvorada e Lima. Oração `01:00` e foco `25:00`. O jovem santo fica à direita do timer; o anjo e o crucifixo, à esquerda. Crédito: “Vocação, Guercino. CC0 · fonte”.
- Votos: Theodoor Boeyermans, *Os votos de São Luís Gonzaga*, domínio público. `public/saints/votos.jpg`, 1000×562, 309 KB, a única resolução pública. Tom `escura`, Capela e Manto. Foco `25:00`. A cruz e o jovem ajoelhado continuam em volta do timer.
- Adoração: ProtoplasmaKid, adoração noturna no Templo Expiatório de São Felipe de Jesus, CC BY-SA 4.0. `public/saints/adoracao.jpg`, 3000×1924, 1,2 MB. Tom `escura`, Noite e Brisa. Oração `01:00` e foco `25:00`. As pessoas ajoelhadas e as velas do altar ficam visíveis; o ostensório fica atrás dos números.

`npm run build` passou de novo: `dist/assets/index-pzbxRb-E.css` 23,75 kB e `dist/assets/index-mom_h8ya.js` 267,79 kB. A cena Capela voltou a aplicar a Última Ceia, a Capela e o dourado. As chaves continuaram as três de antes.

## Encerramento

Esta spec termina apenas quando todos os itens estiverem marcados e com evidência registrada, no formato definido em [Como executar](../../../shared/como-executar.md).
