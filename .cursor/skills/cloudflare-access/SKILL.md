---
name: cloudflare-access
description: >-
  Lê o analytics da Cloudflare do Pomodoro Católico e separa sonda de robô de
  abertura real da página. Use quando o usuário perguntar se catholic-pomodoro
  está recebendo acesso, visita, uso do Pomodoro, ou pedir para explicar o
  gráfico da Cloudflare.
---

# Acesso na Cloudflare

Conta `88a3122e7afaf9038bbf622b021e3d57`. Site `https://catholic-pomodoro.pages.dev`. Projeto Pages `catholic-pomodoro`. Sem domínio próprio. Responda no horário de Brasília (UTC−3).

O timer não sai do navegador. O Web Analytics não tem evento de ciclo.

## Web Analytics

Ligado em **Workers & Pages → catholic-pomodoro → Metrics**. O botão do painel fica **Disable** quando está ativo. O script não está no repositório: a Cloudflare injeta o beacon no próximo deploy de produção.

Antes de citar página vista, abra `https://catholic-pomodoro.pages.dev/` e procure `beacon.min.js`. Sem o script, o painel fica vazio e a abertura continua sendo o JPEG.

Com o beacon no ar, leia `https://dash.cloudflare.com/88a3122e7afaf9038bbf622b021e3d57/web-analytics`. Uma página vista é o JavaScript rodando, logo a tela abriu. País, origem e aparelho valem neste painel. Quem bloqueia o script não entra na conta.

## O que não tratar como uso

- **Total requests** e **Visits** da home ou do Account analytics. Visita é sessão da Cloudflare, não pessoa no timer. Use isso como sonda.
- **Requests by country.** Os números do mapa não fecham com o total de requests. Não cite país como contagem de gente.
- **Workers & Pages → Metrics**, os gráficos de Request e CPU. Contam invocação de Worker. O site é estático; zero ali é o esperado.

## Onde ler a sonda

1. Abra `https://dash.cloudflare.com/88a3122e7afaf9038bbf622b021e3d57/analytics` no navegador já autenticado.
2. Leia **Last 24 hours** e **Last 7 days**: requests, bandwidth, visits, content types (`html`, `js`, `jpeg`, `svg`, `empty`) e 4xx.
3. Para o recorte por hora, atualize a página com o `fetch` interceptado e leia a resposta de `https://dash.cloudflare.com/api/v4/graphql`. A série está em `viewer.scope_0[0].c0_sparkline`: `count` (requests), `sum.edgeResponseBytes`, `sum.visits`, `dimensions.ts` em UTC. Os tipos estão em `c17_topN`.
4. Some os buckets por dia em America/Sao_Paulo.

## Abertura quando o beacon ainda não está no HTML

O build tem um JavaScript, sem import dinâmico. O fundo `/saints/*.jpg` só é pedido depois que o React desenha. O `favicon.svg` o navegador pede ao ler o HTML, inclusive robô.

- HTML com cerca de 1–2 KB por request é sonda.
- JPEG é a evidência de que a tela desenhou. Uma abertura pede 1 JPEG; trocar o fundo pede outro.
- JavaScript sozinho pode ser robô seguindo a tag do HTML. Use o JS como apoio, não como contagem de gente.
- Hora com megabytes e JPEG é abertura. Hora com centenas de requests e poucos KB é sonda.

## Resposta

Em português, a primeira frase responde se houve acesso e se a página abriu. Com o beacon no ar, a abertura é a página vista do Web Analytics; a sonda continua no Account analytics. Sem o beacon, use o JPEG. Diga que início de ciclo não aparece na Cloudflare quando a pergunta for sobre uso do timer.
