# NNN-documentacao

> Copie este arquivo para `changes/NNN-documentacao/spec.md`, substitua o placeholder do título e remova este bloco de instruções.

## Objetivo

Documentar ou ajustar uma parte do app para deixar a responsabilidade, o fluxo e os limites explícitos.

## Contexto Técnico

Descreva a peça (`domain/cycle`, uma factory, um componente em `presentation/`, um catálogo ou um painel), o que a pessoa faz nela e o que esta peça não decide.

## Tasks

### Tasks - Documentação

- [ ] Revisar a visão da peça em `memory/`
- [ ] Registrar o fluxo principal, da ação na tela até o estado gravado
- [ ] Registrar o que fica no `localStorage` e o que é só catálogo
- [ ] Registrar a restrição que a próxima mudança não pode furar

### Tasks - Verificação

- [ ] Conferir o texto com o código atual de `src/` e com as camadas em `memory/estrutura.md`
- [ ] Conferir que `.cursor/rules/` e `.cursor/skills/` descrevem as mesmas camadas, sem API, BFF, conta nem servidor

## Resultado Esperado

A documentação descreve o comportamento real da página e permanece consistente com `memory/`.
