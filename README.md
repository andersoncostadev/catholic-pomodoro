# Pomodoro Católico

Página para rezar e trabalhar no mesmo ritmo: um minuto de oração, vinte e cinco de foco e cinco de pausa. Depois de quatro focos, uma pausa longa. A oração fica no centro do trabalho e do estudo.

A pessoa começa por uma jaculatória, segue para o foco e, na pausa, reza uma dezena do Terço, faz uma oração breve ou permanece em silêncio. Pode nomear a tarefa oferecida e uma intenção do dia, trocar a cena, o fundo, o ambiente e a cor, e ouvir um canto enquanto o ciclo corre.

Tudo o que a pessoa produz fica neste navegador. Não há conta nem sincronização. A página não hospeda API. Há duas saídas de rede, ambas `GET`: a liturgia do dia a `liturgia.cloudhub.ia.br` e o santo do dia à API do calendário dos santos. Nenhum dos dois textos é gravado.

## Santo do dia

A API do santo é um projeto ASP.NET Core à parte, fora deste repositório. A página só faz o pedido quando `VITE_SAINT_API_URL` aponta para um host que responde com `access-control-allow-origin`. Sem a variável, não há pedido, não há linha e não há painel do santo.

```bash
# .env.development.local, fora do git
VITE_SAINT_API_URL=http://localhost:5080
```

Na hospedagem estática, a variável entra no ambiente do build com a URL publicada da API.

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
  infra/           localStorage, sino, notificação e os GET da liturgia e do santo
  main/factories/  único lugar que instancia storage e caso de uso
  presentation/    timer, painéis, método e canto
  app/             casca da página
public/
  saints/          imagens de fundo
  chant/           áudios
```

Duração, sequência e avanço de fase ficam em `src/domain/cycle`. A tela chama factory e não recalcula isso. Crédito e licença de cada imagem e de cada canto estão no catálogo e aparecem na página.
