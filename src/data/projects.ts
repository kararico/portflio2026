import { siteConfig } from '@/data/site';
import { projectDetailsBySlug } from '@/data/projectDetails';
import type { Project } from '@/types/project';
import {
  buildProjectImages,
  buildHomeHeroPath,
  buildProductThumbnailPath,
} from '@/utils/projectImage';

type ProjectSeed = Omit<Project, 'projectDetail'>;

const projectSeeds: ProjectSeed[] = [
  {
    id: '1',
    slug: 'mlb-korea',
    title: 'MLB Korea',
    year: '2022',
    client: 'F&F',
    platform: 'E-commerce Web',
    role: 'Web Publisher & UI Engineer',
    contribution: '100%',
    description: '국내 MLB 공식몰 프론트엔드 Publishing Lead',
    thumbnail: buildProductThumbnailPath('mlb-korea'),
    homeHero: buildHomeHeroPath('mlb-korea'),
    images: buildProjectImages('mlb-korea'),
    heroImage: {
      objectPosition: '50% 40%',
    },
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
    year: '2022',
    client: 'F&F',
    platform: 'E-commerce Web',
    role: 'Web Publisher & UI Engineer',
    contribution: '100%',
    description: 'Discovery Expedition 이커머스 플랫폼 UI 개발',
    thumbnail: buildProductThumbnailPath('discovery-expedition'),
    homeHero: buildHomeHeroPath('discovery-expedition'),
    images: buildProjectImages('discovery-expedition'),
    heroImage: {
      objectPosition: '50% 40%',
    },
    overview:
      '아웃door 브랜드 Discovery Expedition의 공식 이커머스 플랫폼 프론트엔드를 담당했습니다. 대용량 상품 카탈로그와 시즌별 룩북 콘텐츠를 효과적으로 전달하면서도, 모바일 퍼스트 쇼핑 경험을 유지하는 UI를 구현했습니다.',
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
  },
  {
    id: '3',
    slug: 'starbucks-employee-platform',
    title: 'Starbucks\nPartner Hub',
    subtitle: '스타벅스 임직원 플랫폼',
    year: '2026',
    client: 'Starbucks Korea',
    platform: 'Enterprise Web',
    role: 'Web Publisher & UI Engineer',
    contribution: '80%',
    description: '스타벅스 임직원 전용 내부 플랫폼 UI 개발',
    thumbnail: buildProductThumbnailPath('starbucks-employee-platform'),
    homeHero: buildHomeHeroPath('starbucks-employee-platform'),
    images: buildProjectImages('starbucks-employee-platform'),
    heroImage: { position: 'center' },
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
    id: '9',
    slug: 'starbucks-siren119',
    title: 'Starbucks\nSiren119',
    subtitle: '스타벅스 Siren119',
    year: '2024',
    client: 'Starbucks Korea',
    platform: 'Hybrid Web',
    role: 'Web Publisher & UI Engineer',
    contribution: '100%',
    description: '스타벅스 Siren119 내부 업무 플랫폼 UI 개발',
    thumbnail: buildProductThumbnailPath('starbucks-siren119'),
    homeHero: buildHomeHeroPath('starbucks-siren119'),
    images: buildProjectImages('starbucks-siren119'),
    heroImage: { position: 'top' },
    overview:
      '스타벅스 코리아 Siren119 내부 업무 플랫폼의 UI 개발을 담당했습니다. 매장·본사 임직원이 사용하는 업무 프로세스를 웹표준과 웹접근성 기준에 맞춰 구현하는 것이 핵심 과제였습니다.',
    objectives:
      '업무 모듈별 UI 일관성 확보, 접근성·반응형 대응, 운영 효율을 고려한 컴포넌트 구조 설계.',
    responsibilities: [
      '업무 모듈 UI 마크업 및 스타일링',
      'React·TypeScript 기반 화면 개발',
      '웹접근성·크로스브라우저 QA 대응',
      '공통 UI 컴포넌트 및 레이아웃 표준화',
    ],
    achievements: [
      '모듈형 UI 패턴으로 신규 화면 개발 효율 개선',
      '웹접근성 기준을 반영한 폼·네비게이션 UI 정립',
      '공통 컴포넌트 재사용으로 UI 일관성 확보',
    ],
    stack: ['HTML5', 'CSS3', 'JavaScript', 'jQuery', 'SCSS'],
    featured: true,
  },
  {
    id: '10',
    slug: 'hyundai-ezwel',
    title: 'Hyundai\nEZWEL',
    subtitle: '현대이지웰',
    year: '2024 ~ 2025',
    client: 'Hyundai EZWEL',
    platform: 'Welfare Platform',
    role: 'Web Publisher & UI Engineer',
    contribution: '100%',
    description: '현대이지웰 복지 플랫폼 UI 개발',
    thumbnail: buildProductThumbnailPath('hyundai-ezwel'),
    homeHero: buildHomeHeroPath('hyundai-ezwel'),
    images: buildProjectImages('hyundai-ezwel'),
    heroImage: { position: 'center' },
    overview:
      '현대이지웰 복지 플랫폼의 UI 개발에 참여했습니다. 다양한 복지 서비스와 제휴 콘텐츠를 하나의 플랫폼에서 탐색·이용할 수 있도록, 웹표준과 사용성을 고려한 인터페이스를 구현했습니다.',
    objectives:
      '복지 서비스 탐색 UX 개선, 반응형·접근성 기준 충족, 운영 팀이 유지보수하기 쉬운 UI 구조 확립.',
    responsibilities: [
      '메인·카테고리·상세 페이지 UI 개발',
      'Vue.js 기반 컴포넌트 구현',
      '레이아웃 및 인터랙션 적용',
      '웹접근성·크로스 디바이스 QA',
    ],
    achievements: [
      '복지 서비스 카테고리 UI 구조 표준화',
      '모바일·데스크톱 일관된 탐색 경험 제공',
      '웹표준 마크업 기반 SEO·접근성 개선',
    ],
    stack: ['Vue', 'TypeScript', 'SCSS'],
    featured: true,
  },
  {
    id: '4',
    slug: 'wconcept-us',
    title: 'W Concept\nUS',
    year: '2023',
    client: 'W Concept',
    platform: 'Global E-commerce',
    role: 'Web Publisher & UI Engineer',
    contribution: '100%',
    description: 'W Concept US 글로벌 패션 이커머스 UI',
    thumbnail: buildProductThumbnailPath('wconcept-us'),
    homeHero: buildHomeHeroPath('wconcept-us'),
    images: buildProjectImages('wconcept-us'),
    heroImage: { objectPosition: '50% 40%' },
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
  },
  {
    id: '5',
    slug: 'casamia',
    title: 'Casamia',
    year: '2021',
    client: 'Casamia',
    platform: 'Brand Website',
    role: 'Web Publisher & UI Engineer',
    contribution: '100%',
    description: 'Casamia 홈퍼니싱 브랜드 웹사이트 리뉴얼',
    thumbnail: buildProductThumbnailPath('casamia'),
    homeHero: buildHomeHeroPath('casamia'),
    images: buildProjectImages('casamia'),
    heroImage: { objectPosition: '50% 40%' },
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
    id: '7',
    slug: 'bullsone',
    title: 'Bullsone',
    subtitle: '불스원',
    year: '2018',
    client: 'Bullsone',
    platform: 'Brand Web',
    role: 'Web Publisher & UI Engineer',
    contribution: '90%',
    description: '불스원 브랜드 웹사이트 UI 개발',
    thumbnail: buildProductThumbnailPath('bullsone'),
    homeHero: buildHomeHeroPath('bullsone'),
    images: buildProjectImages('bullsone'),
    heroImage: { position: 'center' },
    overview:
      '자동차 관리 브랜드 불스원의 웹사이트 UI 개발을 담당했습니다. 제품 정보 탐색과 브랜드 스토리 전달을 중심으로, 모바일·데스크톱 환경에서 일관된 사용자 경험을 구현했습니다.',
    objectives:
      '브랜드 아이덴티티를 반영한 UI 구축, 제품 카테고리 탐색 UX 개선, 반응형·접근성 기준 충족.',
    responsibilities: [
      '메인·제품·브랜드 페이지 UI 개발',
      '반응형 레이아웃 및 인터랙션 구현',
      '공통 UI 컴포넌트 정리',
      '크로스브라우저·접근성 QA',
    ],
    achievements: [
      '제품 카테고리 UI 구조 표준화로 탐색 효율 개선',
      '모바일 퍼스트 레이아웃으로 모바일 체류 시간 증가',
      '공통 컴포넌트 재사용으로 페이지 제작 효율 향상',
    ],
    stack: ['HTML', 'CSS', 'JavaScript', 'jQuery', 'SCSS'],
  },
  {
    id: '8',
    slug: 'goodpeople',
    title: 'Goodpeople',
    subtitle: '좋은사람들',
    year: '2019',
    client: 'Goodpeople',
    platform: 'NGO Website',
    role: 'Web Publisher',
    contribution: '100%',
    description: '좋은사람들 통합 플랫폼 웹사이트',
    thumbnail: buildProductThumbnailPath('goodpeople'),
    homeHero: buildHomeHeroPath('goodpeople'),
    images: buildProjectImages('goodpeople'),
    heroImage: { position: 'top' },
    overview:
      '좋은사람들 통합 플랫폼 웹사이트 UI를 개발했습니다. 상품 상세·목록 페이지를 통합 플랫폼에 맞게 구현하고, 모바일·데스크톱에서 동일한 브랜드 톤을 유지하도록 구현했습니다.',
    objectives: '후원 전환율 향상, 캠페인 스토리텔링 강화, 저사양 모바일 환경에서의 성능 확보.',
    responsibilities: [
      '메인·상품상세·상품목록· 페이지 마크업 및 인터랙션',
      '상품 폼 UX 및 유효성 검증',
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

export const projects: Project[] = projectSeeds.map((project) => ({
  ...project,
  projectDetail: projectDetailsBySlug[project.slug],
}));

/** PROJECT INDEX — 동일 연도 내 우선순위 (Featured와 별도) */
const WORKS_INDEX_SLUG_ORDER = [
  'starbucks-employee-platform',
  'hyundai-ezwel',
  'starbucks-siren119',
  'wconcept-us',
  'mlb-korea',
  'discovery-expedition',
  'guud',
  'casamia',
  'goodpeople',
  'bullsone',
] as const;

const worksIndexSlugRank = new Map<string, number>(
  WORKS_INDEX_SLUG_ORDER.map((slug, index) => [slug, index]),
);

/** "2024 ~ 2025" 등 범위 연도는 최댓값 기준 정렬 */
export function parseProjectYear(year: string): number {
  const matches = year.match(/\d{4}/g);
  if (!matches?.length) return 0;
  return Math.max(...matches.map(Number));
}

/** Works PROJECT INDEX — year 내림차순, 동일 연도는 WORKS_INDEX_SLUG_ORDER */
export function getWorksIndexProjects(): Project[] {
  return [...projects].sort((a, b) => {
    const yearDiff = parseProjectYear(b.year) - parseProjectYear(a.year);
    if (yearDiff !== 0) return yearDiff;

    const aRank = worksIndexSlugRank.get(a.slug) ?? Number.MAX_SAFE_INTEGER;
    const bRank = worksIndexSlugRank.get(b.slug) ?? Number.MAX_SAFE_INTEGER;
    if (aRank !== bRank) return aRank - bRank;

    return a.title.localeCompare(b.title);
  });
}

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
