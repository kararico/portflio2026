export interface ProjectDetailContent {
  overview: string;
  role: string;
  contributions: string[];
  techStack: string[];
  outcome: string;
}

export interface ProjectImages {
  /** 대표 이미지 (Works / Detail Hero) */
  hero: string;
  /** 상세 페이지 갤러리 */
  detail?: string[];
  /** 모바일 전용 크롭 */
  mobile?: string;
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
  thumbnail: string;
  images: ProjectImages;
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
