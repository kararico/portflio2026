import type { CareerEntry } from '@/types/career';

export const careerEntries: CareerEntry[] = [
  {
    id: 'fullgrimm',
    period: '2022 — Present',
    company: '풀그림',
    role: 'Frontend Publishing Lead',
    projects: [
      { title: 'MLB Korea', slug: 'mlb-korea' },
      { title: 'Discovery Expedition', slug: 'discovery-expedition' },
      { title: 'Starbucks Employee Platform', slug: 'starbucks-employee-platform' },
    ],
    stack: ['React', 'TypeScript', 'Vue', 'Nuxt', 'SCSS'],
  },
  {
    id: 'shinsegae-casa',
    period: '2019 — 2022',
    company: '신세계까사',
    role: 'Frontend Developer',
    projects: [{ title: 'Casamia', slug: 'casamia' }],
    stack: ['Vue', 'JavaScript', 'SCSS'],
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
