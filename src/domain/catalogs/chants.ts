import type { Chant } from '@domain/models/chant/chant'

const bySa = 'https://creativecommons.org/licenses/by-sa/3.0/deed.pt'

export const chants: Chant[] = [
  {
    id: 'kyrie',
    title: 'Kyrie eleison',
    subtitle: 'Da missa',
    src: '/chant/kyrie.mp3',
    credit: 'Rick Dechance',
    license: 'CC BY-SA 3.0',
    licenseUrl: bySa,
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Kyrie_55,_Vatican_ad_lib._VI,_Cambrai.ogg',
  },
  {
    id: 'salve',
    title: 'Salve Regina',
    subtitle: 'Antífona à Mãe de Deus',
    src: '/chant/salve-regina.mp3',
    credit: 'Les Petits Chanteurs de Passy',
    license: 'CC BY-SA 3.0',
    licenseUrl: bySa,
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:Petits_Chanteurs_de_Passy_-_Salve_Regina_de_Hermann_Contract.ogg',
  },
  {
    id: 'ave',
    title: 'Ave Maria',
    subtitle: 'Saudação a Maria',
    src: '/chant/ave-maria.mp3',
    credit: 'Schola Gregoriana',
    license: 'CC BY-SA 3.0',
    licenseUrl: bySa,
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Schola_Gregoriana-Ave_Maria.ogg',
  },
  {
    id: 'pater',
    title: 'Pater noster',
    subtitle: 'O Pai-Nosso em canto',
    src: '/chant/pater-noster.mp3',
    credit: 'Schola Gregoriana',
    license: 'CC BY-SA 3.0',
    licenseUrl: bySa,
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Schola_Gregoriana-Pater_Noster.ogg',
  },
  {
    id: 'veni',
    title: 'Veni Sancte Spiritus',
    subtitle: 'Sequência ao Espírito Santo',
    src: '/chant/veni-sancte.mp3',
    credit: 'Membeth',
    license: 'Domínio público',
    licenseUrl: 'https://commons.wikimedia.org/wiki/File:Veni.sancte.spiritus.ogg',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Veni.sancte.spiritus.ogg',
  },
  {
    id: 'miserere',
    title: 'Miserere mei, Deus',
    subtitle: 'Salmo 50, de Allegri',
    src: '/chant/miserere.mp3',
    credit: 'Ensamble Escénico Vocal',
    license: 'CC BY 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/3.0/deed.pt',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:Allegri_-_Miserere_Mei,_Deus_-_Ensamble_Escénico_Vocal_(audio).ogg',
  },
]
