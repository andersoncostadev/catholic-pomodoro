# NNN-interface

> Copie este arquivo para `changes/NNN-interface/spec.md`, substitua o placeholder do título e remova este bloco de instruções.
>
> Use quando a mudança mexe no timer, nos painéis, no texto da página, no fundo, no ambiente ou na cor.

## Objetivo

Descrever o que a pessoa passa a ver ou fazer, e em qual fase do ciclo isso aparece.

## Contexto Técnico

- A fase vem de `session.phase`: `offering`, `focus`, `pause`, `longPause`.
- O ambiente vem de `settings.theme`: `capela`, `alvorada`, `noite`.
- A cor vem de `settings.accent`: `gold`, `rose`, `blue`, `coral`, `menta`, `lima`, `brisa`, `manto`.
- O fundo vem de `main/factories/flows/useBackdrop` e do catálogo em `domain/catalogs/saints.ts`, inclusive a opção sem imagem. Cada imagem tem tom e cor sugerida. As cenas em `scenes` gravam fundo, ambiente e cor juntos. O pacote `youthScenes` traz Vocação, Votos e Adoração.
- O véu segue o tom. A Noite usa véu azul. Na Alvorada, as cores escurecem no anel e no botão. Sobre tom `escura` ou `ceu`, o texto do timer vai para um cartão de pergaminho. Sobre tom `clara`, o hero recupera o tom claro da cor.
- Há treze imagens e a opção sem imagem. Os tons são `escura`, `clara` e `ceu`. Toda imagem usa `object-fit: cover` no palco e na miniatura 16/9.

## Referências de Projeto

- [Produto](../memory/produto.md)
- [Contexto técnico global](../memory/contexto-tecnico.md)
- [Estrutura do projeto](../memory/estrutura.md)

## Referências Compartilhadas

- [Como executar](../shared/como-executar.md)
- [Regras de nomenclatura](../shared/regras-de-nomenclatura.md)

## Tasks

### Tasks - Interface

- [ ] Alterar o componente ou o CSS nomeado na spec
- [ ] Garantir leitura do texto e do botão no ambiente claro e no escuro
- [ ] Garantir leitura sobre um fundo escuro (Ceia), um fundo claro (Fátima, Aparecida, Cristo ou Assis) e um céu (Praça), quando o fundo entrar na mudança
- [ ] Manter crédito da imagem ou do canto visível quando o bloco correspondente continuar na página

### Tasks - Estado

- [ ] Se a tela passar a depender de um campo novo, gravá-lo com valor padrão para quem já tem estado antigo

### Tasks - Verificação

- [ ] `npm run build`
- [ ] Abrir `http://localhost:5174/` e percorrer a fase e o painel alterados
- [ ] Repetir com outro fundo e com Alvorada ou Noite, conforme o alcance da spec

## Resultado Esperado

A tela continua usável em qualquer combinação de fundo, ambiente e cor que o app já oferece, e a fase alterada mostra só o que a spec descreve.
