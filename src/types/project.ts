export interface ProjectAchievement {
  value: string;
  label: string;
}

export interface ProjectDetailContent {
  /** Detail 본문 overview — projects.overview(목록/SEO)와 역할 분리 */
  overview: string;
  /** Works·Detail 공통 role (SSOT) */
  role: string;
  contributions: string[];
  /** Works·Detail 공통 stack (SSOT) — projects.stack으로 주입 */
  techStack: string[];
  outcome: string;
  /** Outcome 아래 Key Features — 3~5개 권장 */
  keyFeatures?: string[];
}

export interface ProjectImages {
  /** Work Detail Hero 대표 이미지 */
  hero: string;
  /** Work Detail Gallery (editorial) */
  detail?: string[];
  /** 모바일 전용 크롭 · editorial duo 슬롯 등 */
  mobile?: string;
}

/** Hero cover crop 중심 — position 프리셋 또는 objectPosition 직접 지정 */
export type HeroImagePosition = 'center' | 'top' | 'bottom' | 'left' | 'right';

export interface HeroImage {
  /** Hero 이미지 경로 override (미지정 시 images.hero) */
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
  /** projectDetails.role에서 주입 (SSOT) */
  role: string;
  /** Work Detail Hero — Client / Platform 메타 */
  platform?: string;
  contribution: string;
  description: string;
  /** Home floating 카드 썸네일 — /images/products/* 또는 projects/{slug}/mobile */
  thumbnail: string;
  /** Home 중앙 Hero 슬라이더 — /images/products/home-main/* 또는 projects/{slug} 전용 */
  homeHero: string;
  images: ProjectImages;
  /** Work Detail Hero crop — focal point (src는 images.hero 사용) */
  heroImage?: HeroImage;
  /** SEO·카드·목록용 짧은 설명 — Detail 본문 overview는 projectDetail.overview */
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
  /** KPI 성과 지표 — Detail Achievements 섹션 */
  achievements: ProjectAchievement[];
  /** projectDetails.techStack에서 주입 (SSOT) */
  stack: string[];
  featured?: boolean;
}
