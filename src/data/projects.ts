/**
 * 프로젝트 카드·목록·SEO 메타 데이터
 *
 * - overview: 카드/목록/SEO용 짧은 설명 (상세 본문은 projectDetails.ts)
 * - role, stack: projectDetails.ts에서 attachProjectDetail()로 주입 (SSOT)
 * - achievements: 이 파일에서만 관리
 */

import { siteConfig } from '@/data/site';
import { projectDetailsBySlug } from '@/data/projectDetails';
import type { Project } from '@/types/project';
import {
  buildProjectImages,
  buildHomeHeroPath,
  buildProductThumbnailPath,
} from '@/utils/projectImage';

type ProjectSeed = Omit<Project, 'projectDetail' | 'role' | 'stack'>;

const projectSeeds: ProjectSeed[] = [
  {
    id: '1',
    slug: 'mlb-korea',
    title: 'MLB Korea',
    year: '2022',
    client: 'F&F',
    platform: 'Commerce Platform',
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
      { value: '40%', label: '프로모션 제작 리드타임 단축' },
      { value: '100+', label: '프로모션 페이지 운영' },
      { value: '모바일', label: '중심 커머스 경험' },
      { value: '퍼블리싱 리드', label: '프로모션 UI 운영' },
    ],
    featured: true,
  },
  {
    id: '2',
    slug: 'discovery-expedition',
    title: 'Discovery Expedition',
    year: '2022',
    client: 'F&F',
    platform: 'Commerce Platform',
    contribution: '100%',
    description: 'Discovery Expedition 이커머스 플랫폼 UI 개발',
    thumbnail: buildProductThumbnailPath('discovery-expedition'),
    homeHero: buildHomeHeroPath('discovery-expedition'),
    images: buildProjectImages('discovery-expedition'),
    heroImage: {
      objectPosition: '50% 40%',
    },
    overview:
      '아웃도어 브랜드 Discovery Expedition의 공식 이커머스 플랫폼 프론트엔드를 담당했습니다. 대용량 상품 카탈로그와 시즌별 룩북 콘텐츠를 효과적으로 전달하면서도, 모바일 퍼스트 쇼핑 경험을 유지하는 UI를 구현했습니다.',
    objectives:
      '브랜드 아웃도어 아이덴티티를 디지털에 반영하고, 상품 탐색·필터링 UX를 개선하여 전환율을 높이는 것.',
    responsibilities: [
      'PLP·PDP·룩북 페이지 UI 개발',
      '반응형 레이아웃 및 인터랙션 구현',
      'GSAP 기반 스크롤 모션 및 마이크로 인터랙션',
      '성능 최적화 및 크로스 디바이스 QA',
    ],
    achievements: [
      { value: 'PLP · PDP', label: '룩북·커머스 페이지' },
      { value: 'GSAP', label: '몰입형 스크롤 UX' },
      { value: '시즌', label: '캠페인 운영' },
      { value: '아웃도어', label: '브랜드 커머스' },
    ],
  },
  {
    id: '3',
    slug: 'starbucks-employee-platform',
    title: 'Starbucks\nPartner Hub',
    subtitle: '스타벅스 임직원 플랫폼',
    year: '2026',
    client: 'Starbucks Korea',
    platform: 'Enterprise Platform',
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
      { value: '90+', label: 'Lighthouse 성능 점수' },
      { value: '12+', label: '핵심 업무 모듈 구축' },
      { value: '70%+', label: '컴포넌트 재사용률' },
      { value: '엔터프라이즈', label: '플랫폼 구축' },
    ],
    featured: true,
  },
  {
    id: '9',
    slug: 'starbucks-siren119',
    title: 'Starbucks\nSiren119',
    subtitle: '스타벅스 Siren119',
    year: '2024',
    client: 'Starbucks Korea',
    platform: 'Hybrid Web App',
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
      { value: '30+', label: '모바일 업무 화면 구축' },
      { value: '인터랙션', label: 'GSAP 기반 구현' },
      { value: '하이브리드', label: '앱 환경 대응' },
      { value: '업무 프로세스', label: '최적화' },
    ],
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
      { value: '퍼블리싱 리드', label: '퍼블리싱 총괄' },
      { value: '30+', label: '핵심 화면 구축' },
      { value: 'Vue + TS', label: '컴포넌트 시스템' },
      { value: '복지', label: '플랫폼 UI' },
    ],
    featured: true,
  },
  {
    id: '4',
    slug: 'wconcept-us',
    title: 'W Concept\nUS',
    year: '2023',
    client: 'W Concept',
    platform: 'Global E-Commerce',
    contribution: '100%',
    description: 'W Concept US 영문 글로벌 이커머스 구축',
    thumbnail: buildProductThumbnailPath('wconcept-us'),
    homeHero: buildHomeHeroPath('wconcept-us'),
    images: buildProjectImages('wconcept-us'),
    heroImage: { objectPosition: '50% 40%' },
    overview:
      'W Concept의 미국 시장 진출을 위해 영문 글로벌 이커머스 쇼핑몰 UI를 신규 구축했습니다. React + TypeScript 기반으로 상품 탐색, 주문, 결제 경험을 구현하고, 미국 사용자에 맞는 쇼핑 플로우를 설계했습니다.',
    objectives:
      '영문 쇼핑몰 핵심 사용자 여정 구현, 글로벌 쇼핑 플로우 UI 설계, W Concept 브랜드 경험의 미국 시장 런칭.',
    responsibilities: [
      '글로벌 이커머스 서비스 신규 구축 참여',
      '상품 탐색부터 주문·결제까지 주요 쇼핑 화면 퍼블리싱',
      '영문 사용자 환경을 고려한 반응형 UI 구현',
      'React + TypeScript 기반 컴포넌트 구조 설계 및 퍼블리싱',
      '크로스브라우저 대응 및 서비스 품질 개선',
    ],
    achievements: [
      { value: '글로벌', label: '이커머스 신규 구축' },
      { value: 'React + TS', label: '타입 기반 개발' },
      { value: '90+', label: 'Lighthouse 성능 점수' },
      { value: '영문', label: '미국 시장 쇼핑몰 런칭' },
    ],
  },
  {
    id: '5',
    slug: 'casamia',
    title: 'Casamia',
    year: '2021',
    client: 'Casamia',
    platform: 'Commerce Platform',
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
      { value: '35%', label: '초기 로딩 속도 개선' },
      { value: '95+', label: 'Lighthouse SEO 점수' },
      { value: '브랜드', label: '쇼룸 경험 구축' },
      { value: '시맨틱', label: '마크업 최적화' },
    ],
  },
  {
    id: '7',
    slug: 'bullsone',
    title: 'Bullsone',
    subtitle: '불스원',
    year: '2018',
    client: 'Bullsone',
    platform: 'Brand Website',
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
      { value: '30+', label: '제품 페이지 구축' },
      { value: '브랜드', label: '스토리텔링 UI' },
      { value: '카테고리', label: '탐색 구조 설계' },
      { value: '자동차 관리', label: '브랜드 웹 플랫폼' },
    ],
  },
  {
    id: '8',
    slug: 'goodpeople',
    title: 'Goodpeople',
    subtitle: '좋은사람들',
    year: '2019',
    client: 'Goodpeople',
    platform: 'Commerce Platform',
    contribution: '100%',
    description: '좋은사람들 통합 플랫폼 웹사이트',
    thumbnail: buildProductThumbnailPath('goodpeople'),
    homeHero: buildHomeHeroPath('goodpeople'),
    images: buildProjectImages('goodpeople'),
    heroImage: { position: 'top' },
    overview:
      '좋은사람들 통합 플랫폼 웹사이트 UI를 개발했습니다. 상품 상세·목록 페이지를 통합 플랫폼에 맞게 구현하고, 모바일·데스크톱 환경에서 동일한 브랜드 경험을 제공할 수 있도록 퍼블리싱했습니다.',
    objectives: '후원 전환율 향상, 캠페인 스토리텔링 강화, 저사양 모바일 환경에서의 성능 확보.',
    responsibilities: [
      '메인·상품상세·상품목록 페이지 마크업 및 인터랙션 구현',
      '상품 폼 UX 및 유효성 검증',
      '모바일 성능 최적화',
    ],
    achievements: [
      { value: '85+', label: '모바일 Lighthouse 점수' },
      { value: '20%', label: '후원 전환율 개선' },
      { value: 'NGO', label: '커머스 플랫폼' },
      { value: '캠페인', label: '스토리 UX' },
    ],
  },
];

function attachProjectDetail(seed: ProjectSeed): Project {
  const projectDetail = projectDetailsBySlug[seed.slug];
  if (!projectDetail) {
    throw new Error(`Missing projectDetails for slug: ${seed.slug}`);
  }

  return {
    ...seed,
    projectDetail,
    role: projectDetail.role,
    stack: projectDetail.techStack,
  };
}

export const projects: Project[] = projectSeeds.map(attachProjectDetail);

/** PROJECT INDEX — 동일 연도 내 우선순위 (Featured와 별도) */
const WORKS_INDEX_SLUG_ORDER = [
  'starbucks-employee-platform',
  'hyundai-ezwel',
  'starbucks-siren119',
  'wconcept-us',
  'mlb-korea',
  'discovery-expedition',
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
