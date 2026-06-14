import { siteConfig } from '@/data/site';
import type { Project } from '@/types/project';
import { buildProjectImages } from '@/utils/projectImage';

export const projects: Project[] = [
  {
    id: '1',
    slug: 'mlb-korea',
    title: 'MLB Korea',
    year: '2024',
    client: 'F&F',
    role: 'Frontend Publishing Lead',
    contribution: '100%',
    description: '국내 MLB 공식몰 프론트엔드 Publishing Lead',
    thumbnail: '/images/projects/mlb-korea/hero.jpg',
    images: buildProjectImages('mlb-korea', 4),
    overview:
      'MLB Korea 공식 온라인 스토어의 프론트엔드 Publishing Lead로 참여하여, 대규모 프로모션 대응 체계와 UI 컴포넌트 표준화를 주도했습니다. 시즌 캠페인·한정판 드롭 등 빈번한 콘텐츠 업데이트 환경에서 운영 효율과 브랜드 일관성을 동시에 확보하는 것이 핵심 과제였습니다.',
    objectives:
      '프로모션 대응 리드타임 단축, 재사용 가능한 템플릿 체계 구축, 크로스브라우저·접근성 기준을 충족하는 UI 품질 유지.',
    responsibilities: [
      '프론트엔드 Publishing 아키텍처 설계 및 코드 리뷰',
      '신규 프로모션·이벤트 페이지 템플릿 구축',
      '공통 UI 컴포넌트 라이브러리 표준화',
      '백엔드·디자인·운영팀과 협업 워크플로우 정립',
    ],
    achievements: [
      '신규 프로모션 템플릿 구축으로 페이지 제작 리드타임 40% 단축',
      '운영효율 개선을 위한 CMS 연동 가이드 및 컴포넌트 문서화',
      'UI 컴포넌트 표준화로 브랜드 일관성 및 QA 비용 절감',
      'Core Web Vitals 개선을 위한 이미지·레이아웃 최적화 적용',
    ],
    stack: ['React', 'Next.js', 'TypeScript', 'SCSS', 'GSAP'],
    featured: true,
  },
  {
    id: '2',
    slug: 'discovery-expedition',
    title: 'Discovery Expedition',
    year: '2023',
    client: 'F&F',
    role: 'Frontend Development',
    contribution: '100%',
    description: 'Discovery Expedition 이커머스 플랫폼 UI 개발',
    thumbnail: '/images/projects/discovery-expedition/hero.jpg',
    images: buildProjectImages('discovery-expedition', 3),
    overview:
      '아웃door 브랜드 Discovery Expedition의 공식 이커머스 플랫폼 프론트엔드를 담당했습니다. 대용량 상품 카탈로그와 시즌별 룩북 콘텐츠를 효과적으로 전달하면서도, 모바일 퍼스트 쇼핑 경험을 유지하는 UI를 구현했습니다.',
    detailHeroIntro:
      '이커머스는 단순히 상품을 파는 공간이 아닙니다. 브랜드의 아웃door 정체성과 시즌 스토리를 동시에 전달해야 합니다. Discovery Expedition에서는 이 두 가지를 하나의 경험으로 엮었습니다.',
    detailCredits: [
      'Discovery Expedition E-commerce Platform',
      'Frontend Development · F&F',
      'Client Discovery Expedition',
      'Role Frontend Development · Contribution 100%',
      'Year 2023',
      'Stack React · JavaScript · SCSS · GSAP',
    ],
    detailBody: [
      '핵심 목표는 실내·실외 어디서든 자연스럽게 브랜드를 경험하는 것이었습니다. 이를 위해 룩북과 카탈로그를 분리하지 않고, 스크롤 하나로 시즌 내러티브를 따라갈 수 있는 구조를 설계했습니다.',
      '대규모 상품 데이터를 다루면서도 첫 화면의 여백과 타이포그래피 리듬을 유지하는 것이 과제였습니다. 카테고리 진입 전에도 브랜드 무드를 먼저 느끼도록, 이미지·텍스트·여백의 비율을 editorial layout 기준으로 맞췄습니다.',
      '모바일 퍼스트 쇼핑 경험을 위해 PLP·PDP·룩북 페이지의 인터랙션 패턴을 통일했습니다. GSAP ScrollTrigger 기반 스크롤 모션으로 캠페인 콘텐츠의 몰입감을 높였고, SCSS 모듈·디자인 토큰으로 운영 효율을 확보했습니다.',
      'Discovery Expedition 프로젝트는 브랜드 아웃door 아이덴티티와 전환율을 동시에 잡는 UI 아키텍처를 정립한 사례입니다. 콘텐츠·커머스·모션이 한 흐름으로 이어지는 경험을 완성했습니다.',
    ],
    objectives:
      '브랜드 아웃door 아이덴티티를 디지털에 반영하고, 상품 탐색·필터링 UX를 개선하여 전환율을 높이는 것.',
    responsibilities: [
      'PLP·PDP·룩북 페이지 UI 개발',
      '반응형 레이아웃 및 인터랙션 구현',
      'GSAP 기반 스크롤 모션 및 마이크로 인터랙션',
      '성능 최적화 및 크로스 디바이스 QA',
    ],
    achievements: [
      '룩북·카탈로그 통합 UI로 콘텐츠 탐색 깊이 향상',
      '모바일 PDP 전환율 개선을 위한 레이아웃 재설계',
      'GSAP ScrollTrigger 기반 immersive 스크롤 경험 도입',
      'SCSS 모듈 기반 디자인 토큰 체계 정립',
    ],
    stack: ['React', 'JavaScript', 'SCSS', 'GSAP', 'Webpack'],
    featured: true,
  },
  {
    id: '3',
    slug: 'starbucks-employee-platform',
    title: '스타벅스 임직원 플랫폼',
    year: '2023',
    client: 'Starbucks Korea',
    role: 'Frontend Engineer',
    contribution: '80%',
    description: '스타벅스 임직원 전용 내부 플랫폼 프론트엔드',
    thumbnail: '/images/projects/starbucks-employee-platform/hero.jpg',
    images: buildProjectImages('starbucks-employee-platform', 3),
    overview:
      '스타벅스 코리아 임직원 전용 내부 플랫폼의 프론트엔드 개발에 참여했습니다. 복잡한 권한 체계와 다양한 업무 모듈을 단순하고 일관된 UI로 통합하는 것이 핵심이었습니다.',
    objectives:
      '임직원 업무 효율 향상, 모듈별 UI 일관성 확보, 접근성·보안 요건을 충족하는 엔터프라이즈급 인터페이스 구현.',
    responsibilities: [
      '대시보드·공지·신청 모듈 UI 개발',
      'Redux 기반 상태 관리 및 API 연동',
      '공통 레이아웃·네비게이션 컴포넌트 설계',
      'TypeScript 타입 정의 및 코드 품질 관리',
    ],
    achievements: [
      '모듈형 UI 아키텍처로 신규 기능 온boarding 시간 단축',
      '접근성 WCAG 2.1 AA 기준 준수 UI 패턴 적용',
      '공통 컴포넌트 재사용률 70% 이상 달성',
      '내부 사용자 만족도 조사 UX 개선 항목 1위',
    ],
    stack: ['React', 'TypeScript', 'Redux', 'SCSS', 'REST API'],
    featured: true,
  },
  {
    id: '4',
    slug: 'wconcept-us',
    title: 'W Concept US',
    year: '2022',
    client: 'W Concept',
    role: 'Frontend Development',
    contribution: '100%',
    description: 'W Concept US 글로벌 패션 이커머스 UI',
    thumbnail: '/images/projects/wconcept-us/hero.jpg',
    images: buildProjectImages('wconcept-us', 4),
    overview:
      'W Concept의 미국 시장 진출을 위한 글로벌 이커머스 플랫폼 UI를 개발했습니다. 다국어·다통화·글로벌 배송 정책 등 현지화 요구사항을 반영한 프론트엔드 아키텍처를 구축했습니다.',
    objectives:
      '글로벌 UX 표준에 맞는 쇼핑 경험 제공, i18n/l10n 인프라 구축, 북미 시장 브랜드 톤앤매너 반영.',
    responsibilities: [
      '글로벌 PDP·Checkout·Account UI 개발',
      'i18n 다국어 리소스 구조 설계',
      'Styled Components 기반 테마 시스템 구현',
      '글로벌 CDN·이미지 최적화 전략 적용',
    ],
    achievements: [
      'i18n 아키텍처 구축으로 EN/KR 동시 운영 지원',
      'Checkout 전환율 개선을 위한 UX 플로우 단순화',
      '글로벌 브랜드 가이드에 맞춘 UI 컴포넌트 시스템',
      'Lighthouse Performance 90+ 달성',
    ],
    stack: ['React', 'Next.js', 'TypeScript', 'Styled Components', 'i18n'],
    featured: true,
  },
  {
    id: '5',
    slug: 'casamia',
    title: 'Casamia',
    year: '2022',
    client: 'Casamia',
    role: 'Frontend Publishing',
    contribution: '100%',
    description: 'Casamia 홈퍼니싱 브랜드 웹사이트 리뉴얼',
    thumbnail: '/images/projects/casamia/hero.jpg',
    images: buildProjectImages('casamia', 2),
    overview:
      '홈퍼니싱 브랜드 Casamia의 공식 웹사이트 리뉴얼 프로젝트에서 프론트엔드 Publishing을 담당했습니다. 제품 카탈로그와 브랜드 스토리를 미니멀한 레이아웃으로 표현하는 데 집중했습니다.',
    objectives:
      '브랜드 프리미엄 이미지 강화, 모바일·데스크톱 일관된 쇼룸 경험, 운영팀이 쉽게 업데이트할 수 있는 마크업 구조.',
    responsibilities: [
      '메인·브랜드·제품 페이지 마크업 및 스크립트',
      '반응형 그리드 및 타이포그래피 시스템 구현',
      'Swiper·스크롤 인터랙션 적용',
      '크로스브라우저 호환성 테스트',
    ],
    achievements: [
      '모바일 트래픽 60% 환경에 최적화된 반응형 UI',
      '이미지 lazy load로 초기 로딩 속도 35% 개선',
      '시맨틱 HTML 구조로 SEO 점수 향상',
    ],
    stack: ['HTML', 'CSS', 'JavaScript', 'jQuery', 'SCSS'],
  },
  {
    id: '6',
    slug: 'samsung-fire',
    title: '삼성화재',
    year: '2021',
    client: 'Samsung Fire & Marine Insurance',
    role: 'UI Development',
    contribution: '70%',
    description: '삼성화재 디지털 서비스 UI 개발',
    thumbnail: '/images/projects/samsung-fire/hero.jpg',
    images: buildProjectImages('samsung-fire', 2),
    overview:
      '삼성화재 디지털 채널의 보험 상품 안내·가입 플로우 UI를 개발했습니다. 금융 규제와 접근성 요건을 충족하면서도, 복잡한 보험 정보를 직관적으로 전달하는 인터페이스 설계가 핵심이었습니다.',
    objectives:
      '가입 전환율 개선, 복잡한 약관·혜택 정보의 단계적 disclosure, 금융권 UI 가이드 준수.',
    responsibilities: [
      '상품 소개·가입·마이페이지 UI 개발',
      '폼 유효성 검증 및 에러 핸들링 UX',
      '금융권 디자인 시스템 컴포넌트 적용',
      '접근성·사용성 테스트 대응',
    ],
    achievements: [
      '가입 플로우 단계 최적화로 이탈률 15% 감소',
      '접근성 심사 기준 충족 UI 패턴 라이브러리 구축',
      '공통 폼 컴포넌트로 개발 생산성 향상',
    ],
    stack: ['React', 'JavaScript', 'SCSS', 'Redux'],
  },
  {
    id: '7',
    slug: 'lifeplanet',
    title: '라이프플래닛',
    year: '2021',
    client: 'Lifeplanet',
    role: 'Frontend Development',
    contribution: '90%',
    description: '라이프플래닛 온라인 보험 플랫폼',
    thumbnail: '/images/projects/lifeplanet/hero.jpg',
    images: buildProjectImages('lifeplanet', 2),
    overview:
      '온라인 보험 플랫폼 라이프플래닛의 프론트엔드 개발을 담당했습니다. 보험료 계산·비교·가입까지의 사용자 여정을 간결한 UI로 설계했습니다.',
    objectives:
      '복잡한 보험 상품 비교 UX 단순화, 모바일 가입 전환율 향상, TypeScript 기반 유지보수성 확보.',
    responsibilities: [
      '보험료 계산기·상품 비교·가입 UI 개발',
      'TypeScript 마이그레이션 및 타입 안정성 강화',
      'API 연동 및 상태 관리',
      '반응형·접근성 대응',
    ],
    achievements: [
      '보험료 계산 UX 개선으로 가입 전환율 12% 상승',
      'TypeScript 전환으로 런타임 에러 50% 감소',
      '모바일 퍼스트 레이아웃으로 모바일 가입 비율 증가',
    ],
    stack: ['React', 'TypeScript', 'SCSS', 'REST API'],
  },
  {
    id: '8',
    slug: 'goodpeople',
    title: '굿피플',
    year: '2020',
    client: 'Goodpeople',
    role: 'Frontend Publishing',
    contribution: '100%',
    description: '굿피플 NGO 후원 플랫폼 웹사이트',
    thumbnail: '/images/projects/goodpeople/hero.jpg',
    images: buildProjectImages('goodpeople', 2),
    overview:
      'NGO 굿피플의 후원 플랫폼 웹사이트 UI를 개발했습니다. 후원 캠페인 스토리와 신뢰감을 전달하면서, 후원 전환을 자연스럽게 유도하는 UX가 목표였습니다.',
    objectives:
      '후원 전환율 향상, 캠페인 스토리텔링 강화, 저사양 모바일 환경에서의 성능 확보.',
    responsibilities: [
      '메인·캠페인·후원 페이지 마크업 및 인터랙션',
      '후원 폼 UX 및 유효성 검증',
      'PHP CMS 연동 템플릿 개발',
      '모바일 성능 최적화',
    ],
    achievements: [
      '후원 CTA 배치 최적화로 전환율 20% 개선',
      '스토리텔링 중심 레이아웃으로 체류 시간 증가',
      '이미지·폰트 최적화로 모바일 Lighthouse 85+ 달성',
    ],
    stack: ['HTML', 'CSS', 'JavaScript', 'PHP', 'jQuery'],
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getFeaturedProjects(): Project[] {
  return projects.filter((p) => p.featured);
}

export function getHeroFeaturedProjects(): Project[] {
  return siteConfig.featuredProjectSlugs
    .map((slug) => projects.find((p) => p.slug === slug))
    .filter((p): p is Project => p !== undefined);
}

export function getNextProject(slug: string): Project | undefined {
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) return undefined;
  return projects[(index + 1) % projects.length];
}

export function getPrevProject(slug: string): Project | undefined {
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) return undefined;
  return projects[(index - 1 + projects.length) % projects.length];
}
