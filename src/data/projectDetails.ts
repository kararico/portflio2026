import type { ProjectDetailContent } from '@/types/project';

export const projectDetailsBySlug: Record<string, ProjectDetailContent> = {
  'starbucks-siren119': {
    overview:
      '스타벅스 Siren119 하이브리드 웹에서 매장·본사 직원이 현장에서 사용하는 모바일 업무 화면 UI를 Web Publisher & UI Engineer로 직접 구축했습니다. 사고·이슈 보고 등 핵심 업무 화면과 GSAP 인터랙션, 바텀시트 UI가 필요한 화면을 담당해 구현했습니다.',
    role: 'Web Publisher & UI Engineer',
    contributions: [
      '매장·본사 직원용 모바일 업무 화면 UI 직접 구축',
      'GSAP 기반 인터랙션 및 바텀시트 컴포넌트 설계·구현',
      'iOS Safari 등 현장 모바일 환경 대응',
      '업무 화면 간 공통 UI 패턴 정립',
      '웹표준·웹접근성 기준 폼·네비게이션 UI 구현',
    ],
    techStack: ['HTML', 'SCSS', 'JavaScript', 'GSAP', 'jQuery'],
    outcome:
      '매장 직원이 실제 사용하는 모바일 업무 화면 UI를 직접 구축해, 현장 모바일 환경에서 안정적으로 동작하는 업무 UI를 완성했습니다. 바텀시트·인터랙션이 필요한 화면을 컴포넌트 단위로 정리해 이후 화면 추가에도 동일한 UI 패턴을 적용할 수 있게 했습니다.',
    keyFeatures: [
      'Mobile Work Screens',
      'GSAP Interaction',
      'Bottom Sheet UI',
      'iOS Safari Support',
      'Form & Navigation UI',
    ],
  },
  'starbucks-employee-platform': {
    overview:
      '스타벅스 코리아 임직원 통합 업무 플랫폼(Partner Hub) 구축에서 메인 화면, 대시보드, 공지·신청 등 핵심 업무 모듈 UI를 Web Publisher & UI Engineer로 직접 구축했습니다. 화면 확장을 전제로 공통 레이아웃·네비게이션·UI 컴포넌트 구조를 먼저 설계하고, React·Next.js 기반으로 핵심 모듈 UI를 구현했습니다.',
    role: 'Web Publisher & UI Engineer',
    contributions: [
      '메인·대시보드 UI 직접 구축',
      '공지·신청 등 핵심 업무 모듈 UI 직접 구축',
      '공통 레이아웃·네비게이션·UI 컴포넌트 구조 설계',
      'React·Next.js 기반 화면 단위 퍼블리싱 및 UI 구현',
      '반응형·접근성 기준 반영 UI 품질 관리',
    ],
    techStack: ['React', 'Next.js', 'TypeScript', 'SCSS'],
    outcome:
      '메인·대시보드·핵심 업무 모듈 UI를 직접 구축하고, 신규 모듈 추가와 운영 과정에서도 일관된 사용자 경험을 유지할 수 있는 공통 UI 구조를 마련했습니다.',
    keyFeatures: [
      'Main Page UI',
      'Dashboard UI',
      'Notice Module',
      'Application Flow',
      'Component System',
      'Common Layout',
    ],
  },
  'mlb-korea': {
    overview:
      'MLB Korea 공식몰 운영·고도화에서 Publishing Lead로 브랜드 메인, 프로모션·이벤트 페이지 UI를 담당했습니다. 시즌 캠페인·한정판 드롭 등 프로모션 페이지 제작이 반복되는 환경에서, 템플릿·UI 컴포넌트 표준화를 설계·리드했습니다.',
    role: 'Web Publisher & UI Engineer',
    contributions: [
      '브랜드 메인·프로모션·이벤트 페이지 UI 운영·고도화 리드',
      '프로모션·이벤트 페이지 템플릿 설계 및 구축',
      '공통 UI 컴포넌트 표준화 — 브랜드 일관성·QA 효율 확보',
      '프론트엔드 Publishing 코드 리뷰·품질 기준 수립',
      '시즌 캠페인 프로모션 페이지 제작·운영 프로세스 정립',
    ],
    techStack: ['HTML', 'SCSS', 'JavaScript', 'Git'],
    outcome:
      '메인·프로모션·이벤트 페이지 UI 운영·고도화를 리드하며, 시즌 캠페인과 프로모션 페이지를 지속적으로 제작·운영할 수 있는 템플릿·컴포넌트 체계를 구축했습니다. 프로모션 템플릿 체계를 통해 페이지 제작 리드타임을 단축하고, 브랜드 아이덴티티를 유지한 채 UI 품질을 안정적으로 관리했습니다.',
    keyFeatures: [
      'Brand Main',
      'Promotion Landing',
      'Event Page',
      'Campaign Template',
      'Publishing Lead',
      'UI Standardization',
    ],
  },
  'hyundai-ezwel': {
    overview:
      '현대이지웰 복지 플랫폼 구축에서 메인, 카테고리, 서비스 상세 등 핵심 화면 UI를 PL·Web Publisher & UI Engineer로 직접 구축했습니다. Vue.js 기반 컴포넌트·레이아웃 구조를 설계하고, 퍼블리싱 총괄을 맡아 핵심 화면부터 UI를 구현했습니다.',
    role: 'PL · Web Publisher & UI Engineer',
    contributions: [
      '메인·카테고리·서비스 상세 화면 UI 직접 구축',
      '퍼블리싱 총괄 — 마크업·스타일·화면 품질 기준 수립',
      'Vue.js 기반 컴포넌트·레이아웃 구조 설계',
      '복지 서비스 카테고리·상세 페이지 UI 표준화',
      '웹표준·웹접근성·크로스 디바이스 QA 기준 수립 및 적용',
    ],
    techStack: ['Vue', 'TypeScript', 'SCSS'],
    outcome:
      '메인·카테고리·서비스 상세 등 플랫폼 핵심 화면 UI를 직접 구축하고, 복지 서비스가 추가되더라도 일관된 화면 경험을 제공할 수 있는 UI 기반을 마련했습니다. PL로서 퍼블리싱 품질 기준을 수립하고 운영 가능한 UI 구조를 서비스에 반영했습니다.',
    keyFeatures: [
      'Main Page UI',
      'Category UI',
      'Service Detail',
      'Vue Component Structure',
      'Publishing Lead',
      'Web Accessibility QA',
    ],
  },
  'discovery-expedition': {
    overview:
      'Discovery Expedition 이커머스 운영·고도화에서 PLP, PDP, 룩북 페이지 UI를 Web Publisher & UI Engineer로 담당했습니다. GSAP ScrollTrigger 스크롤 모션과 SCSS 모듈 구조를 기준으로, PLP·PDP·룩북 페이지 유형별 UI를 정리·고도화했습니다.',
    role: 'Web Publisher & UI Engineer',
    contributions: [
      'PLP·PDP·룩북 페이지 UI 운영·고도화 담당',
      'GSAP ScrollTrigger 기반 스크롤 모션 적용·개선',
      'SCSS 모듈 기반 스타일 구조 정리 — PLP·PDP·룩북 UI 패턴 통일',
      '모바일·데스크톱 반응형 레이아웃·인터랙션 구현',
      '크로스 디바이스 QA 및 UI 품질 관리',
    ],
    techStack: ['React', 'JavaScript', 'SCSS', 'GSAP', 'Webpack'],
    outcome:
      'PLP·PDP·룩북 핵심 페이지 UI를 운영·고도화해, 페이지 유형별 UI 패턴을 통일했습니다. 시즌 룩북·상품 페이지 업데이트에도 브랜드 톤과 UI 일관성을 유지할 수 있는 운영 구조를 마련했습니다.',
    keyFeatures: [
      'PLP',
      'PDP',
      'Lookbook',
      'GSAP ScrollTrigger',
      'SCSS Module System',
      'Responsive Layout',
    ],
  },
  'wconcept-us': {
    overview:
      'W Concept 미국 시장 진출을 위한 글로벌 이커머스 플랫폼 UI 개발 프로젝트입니다. 다국어·다통화 환경을 반영한 화면을 구현했습니다.',
    role: 'Web Publisher & UI Engineer',
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
    keyFeatures: [
      '글로벌 i18n',
      'Checkout UX',
      '테마 시스템',
      '반응형 레이아웃',
      '성능 최적화',
    ],
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
    keyFeatures: [
      '브랜드 스토리텔링',
      '반응형 그리드',
      'Swiper 인터랙션',
      '시맨틱 마크업',
      '운영 친화 구조',
    ],
  },
  bullsone: {
    overview:
      '자동차 관리 브랜드 불스원 웹사이트 UI 개발 프로젝트입니다. 제품 정보와 브랜드 콘텐츠를 효과적으로 전달하는 페이지 구조와 반응형 UI를 구현했습니다.',
    role: 'Web Publisher & UI Engineer',
    contributions: [
      '메인·제품·브랜드 페이지 UI 개발',
      '반응형 레이아웃 및 인터랙션 구현',
      '공통 UI 컴포넌트 정리',
      '크로스브라우저·접근성 QA',
      '운영팀 협업을 위한 마크업 구조 표준화',
    ],
    techStack: ['HTML', 'CSS', 'JavaScript', 'jQuery', 'SCSS'],
    outcome:
      '브랜드 톤앤매너에 맞는 UI 체계를 정리하고, 제품 탐색과 콘텐츠 소비가 자연스럽게 이어지도록 화면 구조를 개선했습니다.',
    keyFeatures: [
      '제품 카테고리 UI',
      '반응형 레이아웃',
      '브랜드 스토리텔링',
      '공통 컴포넌트',
      '접근성 대응',
    ],
  },
  goodpeople: {
    overview:
      '좋은사람들 통합 플랫폼 웹사이트 UI 개발 프로젝트입니다.   페이지를 구현했습니다.',
    role: 'Web Publisher',
    contributions: [
      '메인·상품상세·상품목록· 페이지 마크업 및 인터랙션',
      '상품 폼 UX 및 유효성 검증 UI',
      '모바일 성능 최적화',
      '크로스브라우저 대응',
    ],
    techStack: ['HTML', 'CSS', 'JavaScript', 'PHP', 'jQuery'],
    outcome:
      '상품 상세·목록 페이지를 통합 플랫폼에 맞게 구현하고, 모바일·데스크톱에서 동일한 브랜드 톤을 유지하도록 구현했습니다.',
    keyFeatures: [
      '상품 상세 UX',
      '상품 목록 UX',
      '모바일 성능',
      '데스크톱 성능',
    ],
  },
};
