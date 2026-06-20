import type { CareerEntry } from '@/types/career';

export const careerEntries: CareerEntry[] = [
  {
    id: 'fullgrimm',
    period: '2022 — 현재',
    company: '플그림',
    role: 'Web Publisher & UI Engineer',
    projects: [
      {
        name: 'Starbucks Partner Hub',
        description: '임직원 플랫폼·공통 UI 설계',
        slug: 'starbucks-employee-platform',
      },
      {
        name: 'Hyundai EZWEL',
        description: '복지 플랫폼 퍼블리싱 총괄·PL',
        slug: 'hyundai-ezwel',
      },
      {
        name: 'W Concept US',
        description: '영문 글로벌 이커머스 신규 구축',
        slug: 'wconcept-us',
      },
      {
        name: 'Starbucks Siren119',
        description: '모바일 업무 UX·인터랙션 구현',
        slug: 'starbucks-siren119',
      },
      {
        name: 'MLB Korea',
        description: '커머스 운영·프로모션 퍼블리싱 리드',
        slug: 'mlb-korea',
      },
      {
        name: 'Discovery Expedition',
        description: '커머스 경험 운영·UI 고도화',
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
        name: 'Casamia',
        description: '브랜드 쇼룸·커머스 UI 구축',
        slug: 'casamia',
      },
      {
        name: 'Guud',
        description: '리빙&라이프스타일 이커머스 플랫폼 퍼블리싱',
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
        description: '브랜드 스토리텔링·제품 경험 구축',
        slug: 'bullsone',
      },
      {
        name: '좋은사람들',
        description: '쇼핑몰 핵심 UX·상품 탐색 경험',
        slug: 'goodpeople',
      },
      {
        name: '호두 잉글리시',
        description: '에듀테크 서비스 UI 구축',
      },
      {
        name: '팸퍼스',
        description: '캠페인·프로모션 페이지 구축',
      },
    ],
    stack: ['HTML5', 'CSS3', 'JavaScript', 'jQuery', 'Vue', 'SCSS'],
  },
  {
    id: 'phishingtree',
    period: '2016 — 2017',
    company: '피싱트리',
    role: 'Web Publisher',
    projects: [
      {
        name: 'LG Signature',
        description: '글로벌 브랜드 사이트 구축',
      },
      {
        name: 'Lineage M',
        description: '게임 프로모션·이벤트 페이지 구축',
      },
      {
        name: 'CARBY',
        description: '중고차 서비스 플랫폼 UI 구축',
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
        description: '음식 커머스 서비스 UI 구축',
      },
      {
        name: '삼육지',
        description: '프랜차이즈 브랜드 서비스 구축',
      },
      {
        name: '펀비어킹',
        description: '프랜차이즈 브랜드 서비스 구축',
      },
    ],
    stack: ['HTML5', 'CSS3', 'jQuery', 'Photoshop'],
  },
];
