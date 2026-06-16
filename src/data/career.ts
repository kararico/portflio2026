import type { CareerEntry } from '@/types/career';

export const careerEntries: CareerEntry[] = [
  {
    id: 'fullgrimm',
    period: '2022 — Present',
    company: '플그림',
    role: 'Web Publisher & UI Developer',
    projects: [
      { title: '스타벅스 사이렌 119', slug: 'starbucks-siren119' },
      { title: 'Hyundai EZWEL', slug: 'hyundai-ezwel' },
      { title: '스타벅스 임직원 통합 플랫폼', slug: 'starbucks-employee-platform' },
      { title: 'MLB Korea', slug: 'mlb-korea' },
      { title: '디스커버리', slug: 'discovery-expedition' },
    ],
    stack: ['React', 'Next.js', 'TypeScript', 'Vue', 'Nuxt', 'SCSS'],
  },
  {
    id: 'shinsegae-casa',
    period: '2019 — 2022',
    company: '신세계까사',
    role: 'Web Publisher & UI Developer',
    projects: [
      { title: 'Guud', slug: 'guud' },
      { title: 'Casamia', slug: 'casamia' },
    ],
    stack: ['Vue', 'JavaScript', 'SCSS'],
  },
  {
    id: 'adcqua',
    period: '2017 — 2019',
    company: '애드쿠아인터렉티브',
    role: 'Web Publisher',
    projects: [
      { title: '삼성화재 프로포즈', slug: 'samsung-proposal' },
      { title: '교보라이프플랫닛', slug: 'lifeplanet' },
      { title: '좋은사람들', slug: 'goodpeople' },
      { title: '불스원'},
      { title: '호두 잉글리시' },
      { title: '팸퍼스' },
    ],
    stack: ['HTML', 'CSS3', 'JavaScript', 'jQuery', 'Vue', 'SCSS'],
  },
  {
    id: 'phishingtree',
    period: '2016 — 2017',
    company: '피싱트리',
    role: 'Web Publisher',
    projects: [{ title: 'LG Signature' }, { title: 'Lineage M' }, { title: 'CARBY' }],
    stack: ['HTML5', 'CSS3', 'jQuery', 'JavaScript', 'Responsive Web'],
  },
  {
    id: 'hyeri-korea',
    period: '2013 — 2014',
    company: '해리코리아',
    role: 'Web Publisher',
    projects: [{ title: '트레블 앤쿡' }, { title: '삼육지' }, { title: '펀비어킹' }],
    stack: ['HTML5', 'CSS3', 'jQuery', 'Photoshop'],
  },
];
