import type { CareerEntry } from '@/types/career';

export const careerEntries: CareerEntry[] = [
  {
    id: 'fullgrimm',
    period: '2022 — Present',
    company: '풀그림',
    role: 'Web Publisher & UI Developer',
    projects: [
      { title: 'Starbucks Siren119', slug: 'starbucks-siren119' },
      { title: 'Starbucks Partner Hub', slug: 'starbucks-employee-platform' },
      { title: 'MLB Korea', slug: 'mlb-korea' },
      { title: 'Discovery Expedition', slug: 'discovery-expedition' },
      { title: 'Hyundai EZWEL', slug: 'hyundai-ezwel' },
    ],
    stack: ['React', 'Next.js', 'TypeScript', 'Vue', 'Nuxt', 'SCSS'],
  },
  {
    id: 'shinsegae-casa',
    period: '2019 — 2022',
    company: '신세계까사',
    role: 'Web Publisher & UI Developer',
    projects: [
      { title: 'W Concept US', slug: 'wconcept-us' },
      { title: 'Casamia', slug: 'casamia' },
    ],
    stack: ['Vue', 'JavaScript', 'React', 'SCSS'],
  },
  {
    id: 'adcqua',
    period: '2017 — 2019',
    company: '애드쿠아인터렉티브',
    role: 'Web Publisher',
    projects: [
      { title: 'Samsung Fire', slug: 'samsung-fire' },
      { title: 'LifePlanet', slug: 'lifeplanet' },
      { title: 'GoodPeople', slug: 'goodpeople' },
      { title: 'Bullsone' },
      { title: 'HODOO English' },
    ],
    stack: ['HTML', 'CSS', 'JavaScript', 'jQuery', 'SCSS'],
  },
  {
    id: 'phishingtree',
    period: '2016 — 2017',
    company: '피싱트리',
    role: 'Web Publisher',
    projects: [{ title: 'LG Signature' }, { title: 'Lineage M' }, { title: 'CARBY' }],
  },
  {
    id: 'hyeri-korea',
    period: '2013 — 2014',
    company: '혜리코리아',
    role: 'Web Publisher',
    projects: [{ title: 'TandCook' }, { title: 'Sam6g' }, { title: 'Pennyoking' }],
  },
];
