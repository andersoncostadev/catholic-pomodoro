# Como executar uma spec

## Objetivo

Esta ficha padroniza a execução, rastreabilidade e encerramento de uma spec deste projeto.

## Fluxo de trabalho

1. Crie uma pasta em `changes/NNN-descricao/`.
2. Copie um template de [../templates/](../templates/).
3. Preencha objetivo, contexto técnico e tasks.
4. Execute as tasks na ordem definida na spec. Se a spec não ordenar, use: domain, data/infra, factories, presentation, documentação.
5. Registre evidência em comentários, comandos ou o que foi conferido na tela.
6. Ao final, valide:
   - `npm run build`;
   - o fluxo alterado no navegador, em `http://localhost:5174/`;
   - leitura do estado já gravado no `localStorage`, quando a mudança mexe em sessão, tarefas ou ajustes;
   - legibilidade com os fundos, ambientes e cores que a mudança alcança;
   - ausência de segredo em código.

## Evidência esperada

- Comando de build com saída validada.
- O que foi exercitado na tela: fase, painel, fundo ou tema, e o que se observou.
- Decisão de interface ou de estado, com a justificativa, quando a mudança sair do que está em `memory/`.

## Encerramento

A spec só é considerada concluída quando:

- todos os checkboxes estiverem marcados;
- o resultado esperado foi atingido;
- a evidência foi registrada;
- a página continua usável sem conta e sem servidor.
