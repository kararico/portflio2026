import type { CareerEntry } from '@/types/career';

export const careerEntries: CareerEntry[] = [
  {
    id: 'fullgrimm',
    period: '2022 — Present',
    company: '플그림',
    role: 'Web Publisher & UI Engineer',
    projects: [
      {
        name: 'Starbucks Partner Hub',
        description: '업무 모듈·공통 UI 설계',
        slug: 'starbucks-employee-platform',
      },
      {
        name: 'Hyundai EZWEL',
        description: '퍼블리싱 총괄·PL',
        slug: 'hyundai-ezwel',
      },
      {
        name: 'Starbucks Siren119',
        description: '모바일 UX·인터랙션 구현',
        slug: 'starbucks-siren119',
      },
      {
        name: 'MLB Korea',
        description: '퍼블리싱 리드·운영 고도화',
        slug: 'mlb-korea',
      },
      {
        name: 'Discovery Expedition',
        description: '커머스 UI 운영·고도화',
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
        name: 'W Concept US',
        description: '글로벌 PDP·Checkout UI',
        slug: 'wconcept-us',
      },
      {
        name: 'Casamia',
        description: '브랜드·제품 페이지 UI',
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
      {
        name: '불스원',
        description: '브랜드·제품 페이지 UI',
        slug: 'bullsone',
      },
      {
        name: '좋은사람들',
        description: '쇼핑몰 핵심 화면 UI',
        slug: 'goodpeople',
      },
      {
        name: '호두 잉글리시',
        description: '영어 학습 서비스 UI',
      },
      {
        name: '팸퍼스',
        description: '캠페인·프로모션 페이지',
      },
    ],
    stack: ['HTML', 'CSS3', 'JavaScript', 'jQuery', 'Vue', 'SCSS'],
  },
  {
    id: 'phishingtree',
    period: '2016 — 2017',
    company: '피싱트리',
    role: 'Web Publisher',
    projects: [
      {
        name: 'LG Signature',
        description: '프리미엄 브랜드 사이트 UI',
      },
      {
        name: 'Lineage M',
        description: '프로모션·이벤트 페이지',
      },
      {
        name: 'CARBY',
        description: '자동차 서비스 웹 UI',
      },
    ],
    stack: ['HTML5', 'CSS3', 'jQuery', 'JavaScript', 'Responsive Web'],
  },
  {
    id: 'hyeri-korea',
    period: '2013 — 2014',
    company: '해리코리아',
    role: 'Web Publisher',
    projects: [
      {
        name: '트레블 앤쿡',
        description: '여행·레시피 콘텐츠 UI',
      },
      {
        name: '삼육지',
        description: '출판 브랜드 사이트 UI',
      },
      {
        name: '펀비어킹',
        description: '프랜차이즈 브랜드 사이트 UI',
      },
    ],
    stack: ['HTML5', 'CSS3', 'jQuery', 'Photoshop'],
  },
];
