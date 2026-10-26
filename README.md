# Pomodoro Católico

Página para rezar e trabalhar no mesmo ritmo: um minuto de oração, vinte e cinco de foco e cinco de pausa. Depois de quatro focos, uma pausa longa. A oração fica no centro do trabalho e do estudo.

A pessoa começa por uma jaculatória, segue para o foco e, na pausa, reza uma dezena do Terço, faz uma oração breve ou permanece em silêncio. Pode nomear a tarefa oferecida e uma intenção do dia, trocar a cena, o fundo, o ambiente e a cor, e ouvir um canto enquanto o ciclo corre.

Tudo o que a pessoa produz fica neste navegador. Não há conta nem sincronização. A página não hospeda API. A única saída de rede é o `GET` da liturgia do dia a `liturgia.cloudhub.ia.br`, e esse texto não é gravado.

## Ciclo

| Fase | Duração | O que a tela mostra |
| --- | --- | --- |
| Oração | 1 min | Jaculatória. Dá para trocar a frase daquela entrada. |
| Foco | 25 min | A tarefa escolhida, ou o convite a fazer uma coisa de cada vez. |
| Pausa | 5 min | Dezena, oração breve ou presença. |
| Pausa longa | 15 min | O mesmo da pausa. Na dezena, entra o quinto mistério. |

Os mistérios do dia seguem o dia da semana: gozosos, dolorosos, gloriosos e luminosos. Um dia conta na sequência quando ao menos um foco é concluído.

## O que o navegador guarda

| Chave | Conteúdo |
| --- | --- |
| `pomodoro-catolico-v1` | Sessão, tarefas, intenção, estatísticas e ajustes |
| `pomodoro-catolico-fundo` | Fundo escolhido |
| `pomodoro-catolico-music` | Canto escolhido |

## Como rodar

É preciso Node.js 20.19 ou 22.12, ou uma versão mais nova de cada linha.

```bash
npm install
npm run dev
```

A página abre em [http://localhost:5174/](http://localhost:5174/).

```bash
npm run build
```

O build gera a pasta `dist`, pronta para uma hospedagem estática. `npm run preview` serve essa pasta localmente.

## Código

React 19, Vite e TypeScript. O estilo está em `src/presentation/styles/index.css`.

```text
src/
  domain/          ciclo, catálogos e contratos
  data/            carga e gravação via IStorage
  infra/           localStorage, sino, notificação e o GET da liturgia
  main/factories/  único lugar que instancia storage e caso de uso
  presentation/    timer, painéis, método e canto
  app/             casca da página
public/
  saints/          imagens de fundo
  chant/           áudios
```

Duração, sequência e avanço de fase ficam em `src/domain/cycle`. A tela chama factory e não recalcula isso. Crédito e licença de cada imagem e de cada canto estão no catálogo e aparecem na página.
