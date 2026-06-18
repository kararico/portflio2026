import type { CareerEntry } from '@/types/career';

export const careerEntries: CareerEntry[] = [
  {
    id: 'fullgrimm',
    period: '2022 — Present',
    company: '플그림',
    role: 'Web Publisher & UI Engineer',
    projects: [
      {
        title: 'Starbucks Partner Hub — 메인·핵심 업무 모듈 UI 및 공통 UI 구조 구축',
        slug: 'starbucks-employee-platform',
      },
      {
        title: 'Hyundai EZWEL — 메인·핵심 화면 UI 구축, PL·퍼블리싱 총괄',
        slug: 'hyundai-ezwel',
      },
      {
        title: 'Starbucks Siren119 — 핵심 모바일 UX 및 고난도 인터랙션 구현',
        slug: 'starbucks-siren119',
      },
      {
        title: 'MLB Korea — Publishing Lead, 메인·프로모션 UI 운영·고도화',
        slug: 'mlb-korea',
      },
      {
        title: 'Discovery Expedition — PLP·PDP·룩북 핵심 커머스 화면 운영·UI 고도화',
        slug: 'discovery-expedition',
      },
    ],
    stack: ['React', 'Next.js', 'TypeScript', 'Vue', 'Nuxt', 'SCSS'],
  },
  {
    id: 'shinsegae-casa',
    period: '2019 — 2022',
    company: '신세계까사',
    role: 'Web Publisher & UI Engineer',
    projects: [
      {
        title: 'W Concept US — 영문 쇼핑몰 PDP·Checkout·Account 핵심 화면 UI 구축',
        slug: 'wconcept-us',
      },
      {
        title: 'GUUD — 메인·핵심 사용자 경험 영역 UI 구축',
        slug: 'guud',
      },
      {
        title: 'Casamia — 메인·브랜드·제품 핵심 페이지 UI 구축',
        slug: 'casamia',
      },
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
      { title: '불스원', slug: 'bullsone' },
      { title: '좋은사람들', slug: 'goodpeople' },
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
