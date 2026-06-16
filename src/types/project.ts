export interface ProjectDetailContent {
  overview: string;
  role: string;
  contributions: string[];
  techStack: string[];
  outcome: string;
  /** Outcome 아래 Key Features — 3~5개 권장 */
  keyFeatures?: string[];
}

export interface ProjectImages {
  /** 대표 이미지 (Works / Detail Hero) */
  hero: string;
  /** 상세 페이지 갤러리 */
  detail?: string[];
  /** 모바일 전용 크롭 */
  mobile?: string;
}

/** Hero cover crop 중심 — position 프리셋 또는 objectPosition 직접 지정 */
export type HeroImagePosition = 'center' | 'top' | 'bottom' | 'left' | 'right';

export interface HeroImage {
  /** Hero 이미지 경로 (선택 — 미지정 시 visual-main 매핑 우선) */
  src?: string;
  /** 프리셋 중심점 — objectPosition보다 우선순위 낮음 */
  position?: HeroImagePosition;
  /** CSS object-position 값 (예: '50% 40%', 'center top') */
  objectPosition?: string;
}

export interface Project {
  id: string;
  slug: string;
  /** Works·Detail 메인 제목 (영문 Editorial 톤) — `\n`으로 줄 나눔 가능 */
  title: string;
  /** Works 보조 설명 (한글 프로젝트명 등) */
  subtitle?: string;
  year: string;
  client: string;
  role: string;
  contribution: string;
  description: string;
  /** Home floating thumbnail — /images/products/* */
  thumbnail: string;
  /** Home 중앙 Hero 슬라이더 — /images/products/home-main/* */
  homeHero: string;
  images: ProjectImages;
  /** Work Detail Hero focal point · cover crop 중심 */
  heroImage?: HeroImage;
  /** CMS: 프로젝트 개요 */
  overview: string;
  /** CMS: 프로젝트 목표 */
  objectives: string;
  /** Detail hero 짧은 intro (overview 요약) */
  detailHeroIntro?: string;
  /** @deprecated projectDetail 사용 */
  detailCredits?: string[];
  /** @deprecated projectDetail 사용 */
  detailBody?: string[];
  /** 상세 페이지 공통 템플릿 콘텐츠 */
  projectDetail: ProjectDetailContent;
  /** CMS: 담당 업무 */
  responsibilities: string[];
  /** CMS: 주요 성과 */
  achievements: string[];
  /** CMS: 기술 스택 */
  stack: string[];
  featured?: boolean;
}
