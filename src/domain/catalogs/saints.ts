import type { Saint } from '@domain/models/backdrop/saint'
import type { Scene } from '@domain/models/backdrop/scene'

const pd = 'https://creativecommons.org/publicdomain/mark/1.0/deed.pt'
const cc0 = 'https://creativecommons.org/publicdomain/zero/1.0/deed.pt'
const by2 = 'https://creativecommons.org/licenses/by/2.0/deed.pt'
const by3 = 'https://creativecommons.org/licenses/by/3.0/br/deed.pt'
const bySa3 = 'https://creativecommons.org/licenses/by-sa/3.0/deed.pt'
const bySa4 = 'https://creativecommons.org/licenses/by-sa/4.0/deed.pt'

export const saints: Saint[] = [
  {
    id: 'ceia',
    title: 'Última Ceia',
    subtitle: 'Santa Maria delle Grazie',
    src: '/saints/ceia.jpg',
    tone: 'escura',
    suggestedAccent: 'gold',
    credit: 'Leonardo da Vinci',
    license: 'Domínio público',
    licenseUrl: pd,
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Leonardo_da_Vinci_-_The_Last_Supper_high_res.jpg',
  },
  {
    id: 'angelus',
    title: 'O Angelus',
    subtitle: 'Oração no campo',
    src: '/saints/angelus.jpg',
    tone: 'clara',
    suggestedAccent: 'gold',
    credit: 'Jean-François Millet',
    license: 'Domínio público',
    licenseUrl: pd,
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:Jean-Fran%C3%A7ois_Millet_-_The_Angelus_-_Google_Art_Project.jpg',
  },
  {
    id: 'fatima',
    title: 'Fátima',
    subtitle: 'Santuário',
    src: '/saints/fatima.jpg',
    tone: 'clara',
    suggestedAccent: 'blue',
    credit: 'Tomasz Przechlewski',
    license: 'CC BY 2.0',
    licenseUrl: by2,
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Sanctuary_of_Fatima.jpg',
  },
  {
    id: 'santos',
    title: 'Santos',
    subtitle: 'Com Nossa Senhora',
    src: '/saints/santos.jpg',
    tone: 'escura',
    suggestedAccent: 'gold',
    credit: 'Bonifacio de’ Pitati',
    license: 'Domínio público',
    licenseUrl: pd,
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:Ca%27_Rezzonico_-_Sacra_Conversazione_(Inv.018)_-_Bonifacio_de%27_Pitati.jpg',
  },
  {
    id: 'assis',
    title: 'Assis',
    subtitle: 'Basílica de São Francisco',
    src: '/saints/assis.jpg',
    tone: 'clara',
    suggestedAccent: 'gold',
    credit: 'Peter K Burian',
    license: 'CC BY-SA 4.0',
    licenseUrl: bySa4,
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Papal_Basilica_of_Saint_Francis_of_Assisi.jpg',
  },
  {
    id: 'pedro',
    title: 'São Pedro',
    subtitle: 'Basílica, Vaticano',
    src: '/saints/pedro.jpg',
    tone: 'clara',
    suggestedAccent: 'gold',
    credit: 'Marcus Obal',
    license: 'CC BY-SA 3.0',
    licenseUrl: bySa3,
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Saint_Peter%27s_Basilica.JPG',
  },
  {
    id: 'praca',
    title: 'Praça',
    subtitle: 'São Pedro ao anoitecer',
    src: '/saints/praca.jpg',
    tone: 'ceu',
    suggestedAccent: 'blue',
    credit: 'Prayitno',
    license: 'CC BY 2.0',
    licenseUrl: by2,
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:St._Peter%27s_Square_with_purple_sky.jpg',
  },
  {
    id: 'aparecida',
    title: 'Aparecida',
    subtitle: 'Santuário nacional',
    src: '/saints/aparecida.jpg',
    tone: 'clara',
    suggestedAccent: 'blue',
    credit: 'Valter Campanato/ABr',
    license: 'CC BY 3.0',
    licenseUrl: by3,
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:Basilica_of_the_National_Shrine_of_Our_Lady_of_Aparecida,_2007.jpg',
  },
  {
    id: 'michel',
    title: 'São Miguel',
    subtitle: 'Abadia ao amanhecer',
    src: '/saints/michel.jpg',
    tone: 'clara',
    suggestedAccent: 'gold',
    credit: 'Lynx1211',
    license: 'CC BY-SA 4.0',
    licenseUrl: bySa4,
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Mont_St_Michel_at_sunrise.jpg',
  },
  {
    id: 'redentor',
    title: 'Cristo',
    subtitle: 'Redentor, Rio de Janeiro',
    src: '/saints/redentor.jpg',
    tone: 'clara',
    suggestedAccent: 'blue',
    credit: 'Summerbrize',
    license: 'CC BY-SA 4.0',
    licenseUrl: bySa4,
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Rio_de_Janeiro_-_Cristo_Redentor.jpg',
  },
  {
    id: 'vocacao',
    title: 'Vocação',
    subtitle: 'São Luís Gonzaga',
    src: '/saints/vocacao.jpg',
    tone: 'clara',
    suggestedAccent: 'lima',
    credit: 'Guercino',
    license: 'CC0',
    licenseUrl: cc0,
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:The_Vocation_of_Saint_Aloysius_(Luigi)_Gonzaga_MET_DT1956.jpg',
  },
  {
    id: 'votos',
    title: 'Votos',
    subtitle: 'São Luís Gonzaga',
    src: '/saints/votos.jpg',
    tone: 'escura',
    suggestedAccent: 'manto',
    credit: 'Theodoor Boeyermans',
    license: 'Domínio público',
    licenseUrl: pd,
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:Theodor_Boeyermans_-_The_Vows_of_Saint_Aloysius_of_Gonzaga.jpg',
  },
  {
    id: 'adoracao',
    title: 'Adoração',
    subtitle: 'Santíssimo',
    src: '/saints/adoracao.jpg',
    tone: 'escura',
    suggestedAccent: 'brisa',
    credit: 'ProtoplasmaKid',
    license: 'CC BY-SA 4.0',
    licenseUrl: bySa4,
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:Templo_Expiatorio_Nacional_de_San_Felipe_de_Jesús_-_Adoración_nocturna.jpg',
  },
]

export const scenes: Scene[] = [
  { id: 'capela', name: 'Capela', saintId: 'ceia', theme: 'capela', accent: 'gold' },
  { id: 'campo', name: 'Campo', saintId: 'angelus', theme: 'capela', accent: 'gold' },
  { id: 'santuario', name: 'Santuário', saintId: 'fatima', theme: 'capela', accent: 'blue' },
  { id: 'alvorada', name: 'Alvorada', saintId: null, theme: 'alvorada', accent: 'gold' },
  { id: 'vigilia', name: 'Vigília', saintId: 'praca', theme: 'noite', accent: 'blue' },
  { id: 'assis', name: 'Assis', saintId: 'assis', theme: 'capela', accent: 'gold' },
]

export const youthScenes: Scene[] = [
  { id: 'vocacao', name: 'Vocação', saintId: 'vocacao', theme: 'alvorada', accent: 'lima' },
  { id: 'votos', name: 'Votos', saintId: 'votos', theme: 'capela', accent: 'manto' },
  { id: 'adoracao', name: 'Adoração', saintId: 'adoracao', theme: 'noite', accent: 'brisa' },
]
