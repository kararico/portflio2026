import type { ProjectDetailContent } from '@/types/project';

export const projectDetailsBySlug: Record<string, ProjectDetailContent> = {
  'starbucks-siren119': {
    overview:
      '스타벅스 매장에서 발생하는 사건·사고를 신속하게 보고하고 관리할 수 있도록 구축된 모바일 기반 하이브리드 웹 플랫폼입니다.',
    role: 'Web Publisher & UI Developer',
    contributions: [
      '모바일 UI 구축',
      'GSAP 인터랙션 개발',
      '바텀시트 컴포넌트 설계',
      'iOS Safari 대응',
      '접근성 개선',
    ],
    techStack: ['HTML', 'SCSS', 'JavaScript', 'GSAP', 'jQuery'],
    outcome:
      '실제 임직원이 사용하는 업무 플랫폼으로 운영되었으며, 다양한 모바일 환경에서 안정적으로 동작할 수 있도록 구현했습니다.',
  },
  'starbucks-employee-platform': {
    overview: '스타벅스 임직원을 위한 통합 업무 플랫폼 구축 프로젝트입니다.',
    role: 'Web Publisher & UI Developer',
    contributions: [
      'React 기반 UI 개발',
      'Next.js 퍼블리싱',
      '컴포넌트 설계',
      '반응형 UI 구축',
      '개발 협업',
    ],
    techStack: ['React', 'Next.js', 'TypeScript', 'SCSS'],
    outcome:
      '운영 효율성과 사용성을 고려한 UI 구조를 구축하고, 유지보수하기 쉬운 컴포넌트 단위로 정리하는 데 기여했습니다.',
  },
  'mlb-korea': {
    overview: 'F&F MLB 브랜드 사이트 운영 및 UI 고도화 프로젝트입니다.',
    role: 'Web Publishing Lead',
    contributions: [
      '브랜드 메인 운영',
      '프로모션 페이지 구축',
      '이벤트 랜딩 제작',
      'UI 개선',
      '운영 퍼블리싱 리드',
    ],
    techStack: ['HTML', 'SCSS', 'JavaScript', 'Git'],
    outcome:
      '브랜드 아이덴티티를 유지하면서 시즌 캠페인과 프로모션 페이지를 지속적으로 제작·운영할 수 있는 환경을 구축했습니다.',
  },
  'hyundai-ezwel': {
    overview:
      '기업 복지몰 구축 및 운영 프로젝트로, 프로젝트 리더 역할을 수행하며 구축부터 운영까지 전반적인 업무를 담당했습니다.',
    role: 'PL · Web Publisher',
    contributions: [
      '프로젝트 일정 관리',
      '퍼블리싱 총괄',
      '개발 협업',
      '품질 관리',
      '운영 대응',
    ],
    techStack: ['HTML', 'SCSS', 'JavaScript', 'Vue'],
    outcome:
      '프로젝트 리더로서 일정과 품질을 관리하며 서비스를 안정적으로 구축하고 운영했습니다.',
  },
  'discovery-expedition': {
    overview:
      'F&F Discovery Expedition 브랜드의 공식 이커머스 플랫폼 UI 개발 프로젝트입니다. 상품 카탈로그와 시즌 룩북 콘텐츠를 함께 다루는 구조로 구현했습니다.',
    role: 'Web Publisher & UI Developer',
    contributions: [
      'PLP·PDP·룩북 페이지 UI 개발',
      '반응형 레이아웃 및 인터랙션 구현',
      'GSAP ScrollTrigger 스크롤 모션 적용',
      'SCSS 모듈 기반 스타일 구조 정리',
      '크로스 디바이스 QA',
    ],
    techStack: ['React', 'JavaScript', 'SCSS', 'GSAP', 'Webpack'],
    outcome:
      '룩북과 상품 카탈로그를 하나의 탐색 흐름으로 연결하는 UI를 구현하고, 페이지 유형별 인터랙션 패턴을 통일했습니다.',
  },
  'wconcept-us': {
    overview:
      'W Concept 미국 시장 진출을 위한 글로벌 이커머스 플랫폼 UI 개발 프로젝트입니다. 다국어·다통화 환경을 반영한 화면을 구현했습니다.',
    role: 'Web Publisher & UI Developer',
    contributions: [
      '글로벌 PDP·Checkout·Account UI 개발',
      'i18n 다국어 리소스 구조 설계',
      'Styled Components 테마 시스템 구현',
      '반응형 레이아웃 및 크로스브라우저 대응',
      '이미지·에셋 로딩 최적화',
    ],
    techStack: ['React', 'Next.js', 'TypeScript', 'Styled Components'],
    outcome:
      '영문·국문 동시 운영이 가능한 UI 구조를 구축하고, 글로벌 쇼핑 플로우에 맞는 화면 단위로 정리했습니다.',
  },
  casamia: {
    overview:
      '신세계까사 Casamia 홈퍼니싱 브랜드 공식 웹사이트 리뉴얼 프로젝트입니다. 제품 카탈로그와 브랜드 스토리를 전달하는 페이지를 구현했습니다.',
    role: 'Web Publisher',
    contributions: [
      '메인·브랜드·제품 페이지 마크업',
      '반응형 그리드 및 타이포그래피 시스템 구현',
      'Swiper·스크롤 인터랙션 적용',
      '시맨틱 HTML 구조 설계',
      '크로스브라우저 호환성 테스트',
    ],
    techStack: ['HTML', 'CSS', 'JavaScript', 'jQuery', 'SCSS'],
    outcome:
      '운영팀이 콘텐츠를 업데이트하기 쉬운 마크업 구조로 정리하고, 모바일·데스크톱에서 동일한 브랜드 톤을 유지하도록 구현했습니다.',
  },
  'samsung-fire': {
    overview:
      '삼성화재 디지털 채널의 보험 상품 안내 및 가입 플로우 UI 개발 프로젝트입니다. 금융권 UI 가이드와 접근성 요건을 반영했습니다.',
    role: 'Web Publisher',
    contributions: [
      '상품 소개·가입·마이페이지 UI 개발',
      '폼 유효성 검증 및 에러 처리 UX 구현',
      '금융권 디자인 시스템 컴포넌트 적용',
      '접근성·사용성 테스트 대응',
      '공통 폼 컴포넌트 정리',
    ],
    techStack: ['React', 'JavaScript', 'SCSS', 'Redux'],
    outcome:
      '복잡한 보험 정보를 단계별로 전달하는 가입 플로우 UI를 구현하고, 금융권 심사 기준에 맞는 패턴을 화면 단위로 정리했습니다.',
  },
  lifeplanet: {
    overview:
      '온라인 보험 플랫폼 라이프플래닛의 UI 개발 프로젝트입니다. 보험료 계산·상품 비교·가입까지의 사용자 여정을 화면 단위로 구현했습니다.',
    role: 'Web Publisher & UI Developer',
    contributions: [
      '보험료 계산기·상품 비교·가입 UI 개발',
      'TypeScript 마이그레이션 지원',
      'API 연동 화면 및 상태 처리',
      '반응형 레이아웃 구현',
      '접근성·크로스브라우저 QA',
    ],
    techStack: ['React', 'TypeScript', 'SCSS', 'REST API'],
    outcome:
      '보험 상품 비교와 가입 과정을 단계별 UI로 정리하고, 모바일 환경에서도 동일한 가입 흐름을 유지하도록 구현했습니다.',
  },
  goodpeople: {
    overview:
      'NGO 굿피플 후원 플랫폼 웹사이트 UI 개발 프로젝트입니다. 캠페인 스토리와 후원 절차를 연결하는 페이지를 구현했습니다.',
    role: 'Web Publisher',
    contributions: [
      '메인·캠페인·후원 페이지 마크업 및 인터랙션',
      '후원 폼 UX 및 유효성 검증 UI',
      'PHP CMS 연동 템플릿 개발',
      '모바일 성능 최적화',
      '크로스브라우저 대응',
    ],
    techStack: ['HTML', 'CSS', 'JavaScript', 'PHP', 'jQuery'],
    outcome:
      '후원 전환을 위한 CTA와 폼 UI를 페이지별로 정리하고, CMS 템플릿 구조로 운영팀이 캠페인을 갱신할 수 있도록 구현했습니다.',
  },
};
