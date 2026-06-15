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
  /** Detail hero 짧은 intro (Septiembre hero 카피) */
  detailHeroIntro?: string;
  /** Detail credits 블록 (Septiembre 6줄 meta) */
  detailCredits?: string[];
  /** Detail 본문 단락 (Septiembre 4 paragraphs) */
  detailBody?: string[];
  /** CMS: 담당 업무 */
  responsibilities: string[];
  /** CMS: 주요 성과 */
  achievements: string[];
  /** CMS: 기술 스택 */
  stack: string[];
  featured?: boolean;
}
