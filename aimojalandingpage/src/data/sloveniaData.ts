export interface Destination {
  id: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  icon: string;
  stats: { label: string; value: string }[];
  greenScheme?: boolean;
  sustainabilityLevel?: 'gold' | 'silver' | 'bronze';
}

export interface Testimonial {
  id: string;
  name: string;
  country: string;
  avatar: string;
  text: string;
  rating: number;
  destination: string;
}

export interface Experience {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

export const destinations: Destination[] = [
  {
    id: 'bled',
    name: 'Blejsko jezero',
    tagline: 'Otok sanj v srcu Alp',
    description: 'Biser slovenskih Alp s srednjeveškim gradom na pečini in cerkvico na otoku. Romantična pletna vožnja in kremšnita, ki osvaja svet.',
    image: '/bled.jpg',
    icon: '🏔️',
    stats: [
      { label: 'Nadmorska višina', value: '475m' },
      { label: 'Globina jezera', value: '30.6m' },
      { label: 'Let obiska', value: '1M+' },
    ],
    greenScheme: true,
    sustainabilityLevel: 'gold',
  },
  {
    id: 'postojna',
    name: 'Postojnska jama',
    tagline: 'Podzemno kraljestvo čudežev',
    description: '24 km podzemnih rovov, vilinsko kraljestvo kapnikov in edinstvena človeška ribica. Vlakovožnja v srce Zemlje.',
    image: '/postojna.jpg',
    icon: '🦎',
    stats: [
      { label: 'Dolžina rovov', value: '24km' },
      { label: 'Temperatura', value: '10°C' },
      { label: 'Obiskovalcev', value: '39M+' },
    ],
    greenScheme: true,
    sustainabilityLevel: 'silver',
  },
  {
    id: 'ljubljana',
    name: 'Ljubljana',
    tagline: 'Mala zelena prestolnica',
    description: 'Zeleno, živo in ustvarjalno mesto z gradom na hribu, zmajevim mostom in kavo ob Ljubljanici. Evropska zelena prestolnica 2016.',
    image: '/ljubljana.jpg',
    icon: '🏰',
    stats: [
      { label: 'Prebivalcev', value: '295K' },
      { label: 'Mostov', value: '17' },
      { label: 'Parkov', value: '40+' },
    ],
    greenScheme: true,
    sustainabilityLevel: 'gold',
  },
  {
    id: 'triglav',
    name: 'Triglav',
    tagline: 'Krov slovenskega ponosa',
    description: '2864m visok simbol naroda, triglavska roža in neštete poti navzgor. Izvir Soče, Bohinj in dolina sedmih jezer.',
    image: '/triglav.jpg',
    icon: '⛰️',
    stats: [
      { label: 'Višina', value: '2864m' },
      { label: 'Narodni park', value: '840km²' },
      { label: 'Planinskih poti', value: '700+' },
    ],
    greenScheme: true,
    sustainabilityLevel: 'gold',
  },
  {
    id: 'soca',
    name: 'Reka Soča',
    tagline: 'Smaragdna lepotica',
    description: 'Kristalno čista smaragdna reka, ki vije skozi Tolmin in Bovec. Raj za kajakaše, ribiče in ljubitelje netaknjene narave.',
    image: '/soca.jpg',
    icon: '🌊',
    stats: [
      { label: 'Dolžina', value: '138km' },
      { label: 'Temperatura', value: '8°C' },
      { label: 'Smer voditve', value: '96km' },
    ],
    greenScheme: true,
    sustainabilityLevel: 'gold',
  },
  {
    id: 'piran',
    name: 'Piran',
    tagline: 'Morski biser Istre',
    description: 'Benetke v malem - ozke uličice, kamnite hiše in Tartinijev trg. Soline Sečovlje in najlepši slovenski sončni zahodi.',
    image: '/piran.jpg',
    icon: '🌅',
    stats: [
      { label: 'Obala', value: '47km' },
      { label: 'Sončnih dni', value: '240+' },
      { label: 'Soline', value: '700let' },
    ],
    greenScheme: true,
    sustainabilityLevel: 'silver',
  },
];

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Hannah Müller',
    country: 'Nemčija',
    avatar: 'HM',
    text: 'Blejsko jezero je najlepše mesto, ki sem ga kdaj videla. Otok, grad, gore - kot pravljica! Slovenija je skriti dragulj Evrope.',
    rating: 5,
    destination: 'Blejsko jezero',
  },
  {
    id: '2',
    name: 'Marco Rossi',
    country: 'Italija',
    avatar: 'MR',
    text: 'Postojnska jama me je popolnoma očarala. Vlakovožnja v podzemlje je nekaj, kar morate doživeti. Naša družina se bo vračala.',
    rating: 5,
    destination: 'Postojnska jama',
  },
  {
    id: '3',
    name: 'Emma Johansson',
    country: 'Švedska',
    avatar: 'EJ',
    text: 'Ljubljana je tako čisto in zeleno mesto! Kava ob reki, zmajev most, grad nad mestom - popolna kombinacija kulture in narave.',
    rating: 5,
    destination: 'Ljubljana',
  },
  {
    id: '4',
    name: 'Thomas Dupont',
    country: 'Francija',
    avatar: 'TD',
    text: 'Soča je najlepša reka, ki sem jo kdaj videl. Smaragdno zelena in kristalno čista. Kajakarjenje tam je bilo nepozabno.',
    rating: 5,
    destination: 'Reka Soča',
  },
];

export const experiences: Experience[] = [
  {
    id: 'hiking',
    title: 'Planinjenje',
    description: 'Od Julijskih Alp do Pohorja - več kot 10.000 km označenih poti za vsak nivo izkušenj.',
    icon: '🥾',
    color: 'from-green-500/20 to-emerald-600/20',
  },
  {
    id: 'cycling',
    title: 'Kolesarjenje',
    description: 'Pohorska transverzala, Parenzana in okoli Bohinja - kolesarski raj za cestne in gorske kolesarje.',
    icon: '🚴',
    color: 'from-blue-500/20 to-cyan-600/20',
  },
  {
    id: 'water',
    title: 'Vodne avanture',
    description: 'Kajak na Soči, sup na Bledu, rafting na Savi - adrenalinski odmerek v kristalno čisti vodi.',
    icon: '🛶',
    color: 'from-teal-500/20 to-blue-600/20',
  },
  {
    id: 'cuisine',
    title: 'Kulinarična pot',
    description: 'Od prekmurske gibanice do primorskega pršuta. 24 gastronomskih regij, ena nepozabna izkušnja.',
    icon: '🍷',
    color: 'from-amber-500/20 to-orange-600/20',
  },
  {
    id: 'wellness',
    title: 'Zdravje & Wellness',
    description: 'Terme, savne in naravna zdravilišča. Rogaška, Čatež in Dobrna - sprostitev v slovenskem slogu.',
    icon: '♨️',
    color: 'from-rose-500/20 to-pink-600/20',
  },
  {
    id: 'culture',
    title: 'Kultura & dediščina',
    description: 'Od Ljubljane do Ptuja - srednjeveški gradovi, samostani in najstarejše vino na svetu v Ptuju.',
    icon: '🏛️',
    color: 'from-purple-500/20 to-indigo-600/20',
  },
];

export const stats = [
  { label: 'Obiskovalcev letno', value: '5.2M+', icon: '👥' },
  { label: 'Naravnih parkov', value: '3', icon: '🌲' },
  { label: 'UNESCO dediščin', value: '3', icon: '🏛️' },
  { label: 'Planinskih poti', value: '10K+', icon: '🥾' },
  { label: 'Kilometrov obale', value: '47', icon: '🏖️' },
  { label: 'Termalnih vrelcev', value: '15+', icon: '♨️' },
];

export const navigationLinks = [
  { label: 'Destinacije', href: '#destinations' },
  { label: 'Izkušnje', href: '#experiences' },
  { label: 'Statistike', href: '#stats' },
  { label: 'Mnenja', href: '#testimonials' },
  { label: 'Načrtuj', href: '#plan' },
];
