export interface CareerProject {
  title: string;
  /** 포트폴리오 상세 페이지 slug — 없으면 텍스트만 표시 */
  slug?: string;
}

export interface CareerEntry {
  id: string;
  period: string;
  company: string;
  role: string;
  projects: CareerProject[];
  stack?: string[];
}
