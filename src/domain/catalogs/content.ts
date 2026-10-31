import type { MysterySet } from '@domain/models/content/mystery-set'

const joyful: MysterySet = {
  id: 'joyful',
  name: 'Mistérios gozosos',
  items: [
    { title: 'A Anunciação do Anjo a Maria', fruit: 'Humildade' },
    { title: 'A Visitação de Maria a Isabel', fruit: 'Caridade' },
    { title: 'O Nascimento de Jesus em Belém', fruit: 'Pobreza de espírito' },
    { title: 'A Apresentação do Menino no Templo', fruit: 'Obediência' },
    { title: 'O encontro do Menino Jesus no Templo', fruit: 'Alegria de buscar a Deus' },
  ],
}

const sorrowful: MysterySet = {
  id: 'sorrowful',
  name: 'Mistérios dolorosos',
  items: [
    { title: 'A agonia de Jesus no Horto', fruit: 'Conformidade com a vontade de Deus' },
    { title: 'A flagelação de Jesus', fruit: 'Pureza' },
    { title: 'A coroação de espinhos', fruit: 'Coragem' },
    { title: 'Jesus carrega a cruz', fruit: 'Paciência' },
    { title: 'A crucificação e morte de Jesus', fruit: 'Perdão' },
  ],
}

const glorious: MysterySet = {
  id: 'glorious',
  name: 'Mistérios gloriosos',
  items: [
    { title: 'A Ressurreição de Jesus', fruit: 'Fé' },
    { title: 'A Ascensão de Jesus ao céu', fruit: 'Esperança' },
    { title: 'A vinda do Espírito Santo', fruit: 'Amor de Deus' },
    { title: 'A Assunção de Maria ao céu', fruit: 'Graça de uma boa morte' },
    { title: 'A coroação de Maria no céu', fruit: 'Confiança em Maria' },
  ],
}

const luminous: MysterySet = {
  id: 'luminous',
  name: 'Mistérios luminosos',
  items: [
    { title: 'O Batismo de Jesus no Jordão', fruit: 'Abertura ao Espírito Santo' },
    { title: 'As bodas de Caná', fruit: 'Confiança na intercessão de Maria' },
    { title: 'O anúncio do Reino de Deus', fruit: 'Conversão' },
    { title: 'A Transfiguração', fruit: 'Desejo de santidade' },
    { title: 'A instituição da Eucaristia', fruit: 'Adoração' },
  ],
}

const weekdays = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado']

export function mysterySetFor(date = new Date()): { set: MysterySet; weekday: string } {
  const day = date.getDay()
  const set = day === 1 || day === 6 ? joyful : day === 2 || day === 5 ? sorrowful : day === 4 ? luminous : glorious
  return { set, weekday: weekdays[day] }
}

export const jaculatories = [
  'Senhor, eu vos ofereço este trabalho.',
  'Jesus, eu confio em Vós.',
  'Tudo por Jesus, nada sem Maria.',
  'Vinde, Espírito Santo.',
  'Sagrado Coração de Jesus, tende piedade de nós.',
  'Meu Deus e meu tudo.',
  'Faça-se em mim segundo a vossa palavra.',
  'Maria, Mãe de Deus, rogai por nós.',
]

export const briefPrayers = [
  {
    title: 'Oração de Jesus',
    text: 'Senhor Jesus Cristo, Filho de Deus, tende piedade de mim, pecador.',
  },
  {
    title: 'Invocação',
    text: 'Vinde, Espírito Santo. Iluminai o que acabei de fazer e o que ainda falta.',
  },
  {
    title: 'Confiança',
    text: 'Jesus, eu confio em Vós. Ficai comigo neste intervalo.',
  },
  {
    title: 'Oferecimento',
    text: 'Meu Jesus, misericórdia. Recebei este trabalho e esta pausa.',
  },
]

export const paiNosso =
  'Pai nosso, que estais nos céus, santificado seja o vosso nome. Venha a nós o vosso reino. Seja feita a vossa vontade, assim na terra como no céu. O pão nosso de cada dia nos dai hoje. Perdoai-nos as nossas ofensas, assim como nós perdoamos a quem nos tem ofendido. E não nos deixeis cair em tentação, mas livrai-nos do mal. Amém.'

export const aveMaria =
  'Ave Maria, cheia de graça, o Senhor é convosco. Bendita sois vós entre as mulheres, e bendito é o fruto do vosso ventre, Jesus. Santa Maria, Mãe de Deus, rogai por nós, pecadores, agora e na hora da nossa morte. Amém.'

export const gloria =
  'Glória ao Pai, ao Filho e ao Espírito Santo. Como era no princípio, agora e sempre. Amém.'

export const quotes = [
  {
    text: 'Nada te turbe, nada te espante. Tudo passa. Deus não muda. A paciência tudo alcança. Quem a Deus tem, nada lhe falta. Só Deus basta.',
    author: 'Santa Teresa de Ávila',
  },
  {
    text: 'A oração não é senão um tratar de amizade, estando muitas vezes a sós com quem sabemos que nos ama.',
    author: 'Santa Teresa de Ávila',
  },
  {
    text: 'Fizeste-nos para Vós, Senhor, e o nosso coração está inquieto enquanto não repousar em Vós.',
    author: 'Santo Agostinho',
  },
  {
    text: 'Ama e faz o que quiseres.',
    author: 'Santo Agostinho',
  },
  {
    text: 'No entardecer da vida, seremos julgados sobre o amor.',
    author: 'São João da Cruz',
  },
  {
    text: 'A minha vocação é o amor.',
    author: 'Santa Teresinha do Menino Jesus',
  },
  {
    text: 'Ora et labora.',
    author: 'Máxima beneditina',
  },
  {
    text: 'Altíssimo e glorioso Deus, iluminai as trevas do meu coração.',
    author: 'São Francisco de Assis',
  },
  {
    text: 'É o amor que dá perfeição às nossas obras.',
    author: 'São Francisco de Sales',
  },
  {
    text: 'Para a maior glória de Deus.',
    author: 'Santo Inácio de Loyola',
  },
  {
    text: 'Entendi consagrar todo o meu trabalho à maior glória de Deus e ao bem das almas.',
    author: 'São João Bosco',
  },
  {
    text: 'Os meus amigos serão Jesus e Maria.',
    author: 'São Domingos Sávio',
  },
  {
    text: 'A morte, mas não o pecado.',
    author: 'São Domingos Sávio',
  },
  {
    text: 'Eu Vos amo, ó meu Deus, e o meu único desejo é amar-Vos até ao último suspiro da minha vida.',
    author: 'São João Maria Vianney',
  },
  {
    text: 'Na santa Igreja, tudo pertence ao amor, vive no amor, faz-se por amor e vem do amor.',
    author: 'São Francisco de Sales',
  },
  {
    text: 'Tem presença de Deus e terás vida sobrenatural.',
    author: 'São Josemaría Escrivá',
  },
  {
    text: 'Põe um motivo sobrenatural na tua atividade profissional de cada dia, e terás santificado o trabalho.',
    author: 'São Josemaría Escrivá',
  },
  {
    text: 'Fazei tudo por Amor. - Assim não há coisas pequenas: tudo é grande. - A perseverança nas pequenas coisas, por Amor, é heroísmo.',
    author: 'São Josemaría Escrivá',
  },
  {
    text: 'Queres de verdade ser santo? - Cumpre o pequeno dever de cada momento; faz o que deves e está no que fazes.',
    author: 'São Josemaría Escrivá',
  },
  {
    text: 'Que procures Cristo. Que encontres Cristo. Que ames a Cristo.',
    author: 'São Josemaría Escrivá',
  },
  {
    text: 'Não tenhais medo! Abri antes, ou melhor, escancarai as portas a Cristo!',
    author: 'São João Paulo II',
  },
  {
    text: 'O homem não pode viver sem amor.',
    author: 'São João Paulo II',
  },
  {
    text: 'A fé e a razão constituem como que as duas asas pelas quais o espírito humano se eleva para a contemplação da verdade.',
    author: 'São João Paulo II',
  },
  {
    text: 'Talvez não fale a língua deles, mas posso sorrir.',
    author: 'Santa Teresa de Calcutá',
  },
  {
    text: 'A glorificação da Tua misericórdia, ó Jesus, é a missão exclusiva da minha vida.',
    author: 'Santa Faustina Kowalska',
  },
  {
    text: 'Se deveis decidir entre mim e o filho, nenhuma hesitação: escolhei - e isto o exijo - a criança. Salvai-a.',
    author: 'Santa Gianna Beretta Molla',
  },
]

export const faqs = [
  {
    q: 'O que é o Pomodoro católico?',
    a: 'É o mesmo ritmo simples da técnica Pomodoro — blocos curtos de foco e pausa — com um lugar marcado para a oração. Um minuto para oferecer a Deus o que você vai fazer, vinte e cinco de trabalho ou estudo, cinco para rezar uma dezena, fazer uma breve oração ou ficar na presença d’Ele. Depois, recomece.',
  },
  {
    q: 'Isso é rezar para render mais?',
    a: 'Não. A proposta não é rezar para ser mais produtivo. É colocar Deus no centro também dos momentos de trabalho e de estudo, de modo que a oração esteja presente no ritmo do dia.',
  },
  {
    q: 'O que faço no minuto inicial?',
    a: 'Uma jaculatória. Em uma frase, ofereça a Deus o estudo, o trabalho ou a leitura que vem a seguir. O timer sugere uma frase; você pode rezar com as suas próprias palavras.',
  },
  {
    q: 'O que faço nos cinco minutos?',
    a: 'O melhor é não entregar a pausa ao celular. Reze uma dezena do Terço — o app acompanha o mistério do dia, o Pai-Nosso, as dez Ave-Marias e o Glória. Se preferir, use uma oração breve ou apenas permaneça em silêncio diante de Deus.',
  },
  {
    q: 'E depois de quatro focos?',
    a: 'Vem uma pausa mais longa, de quinze minutos. Dá para rezar outra dezena, fazer um exame breve ou só ficar com Deus antes de recomeçar pela oração. Esse passo pode ser desligado em Temas.',
  },
  {
    q: 'O timer continua se eu fechar a aba?',
    a: 'Enquanto a sessão está correndo, o fim é calculado pelo relógio real e guardado neste navegador. Se você reabrir a página antes do fim, o tempo retoma. Se a fase já tiver acabado com a aba fechada, ela é contada e a seguinte espera você — não começa sozinha depois de uma ausência.',
  },
  {
    q: 'Como começo sem tirar a mão do teclado?',
    a: 'Com a página à frente e nenhum painel aberto, Espaço começa ou pausa. T abre o nome da oferta quando nenhum painel está aberto. Escape fecha o painel.',
  },
  {
    q: 'Preciso de conta?',
    a: 'Não. Tarefas, sequência, tempos e a frase ficam neste navegador. A liturgia do dia é pedida a liturgia.cloudhub.ia.br, o santo do dia é pedido à API do calendário dos santos, e nenhum dos dois é gravado.',
  },
]
