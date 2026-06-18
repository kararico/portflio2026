import { assetPath } from '@/utils/assetPath';

export const siteConfig = {
  name: '허정원',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3030',
  position: {
    title: 'Web Publisher & UI Engineer',
    heroRoles: ['Web Publisher', 'UI Engineer'] as const,
    seoDescription:
      '12+ Years Experience in Web Publishing, UI Engineering, Accessibility and Large-scale Service Operations',
  },
  contact: {
    email: 'jungwon11082015@gmail.com',
    github: 'https://github.com/kararico',
    location: 'Incheon, South Korea',
    social: [
      {
        platform: 'instagram',
        href: 'https://www.instagram.com/',
        label: 'Instagram',
      },
      {
        platform: 'facebook',
        href: 'https://www.facebook.com/',
        label: 'Facebook',
      },
    ] as const,
  },
  resume: {
    path: '/resume/HeoJungwon_Resume.pdf',
    fileName: 'HeoJungwon_Resume.pdf',
    aboutLabel: 'Download Resume',
    contactLabel: 'Resume PDF',
  },
  hero: {
    title: 'Jungwon Heo.',
    titleParts: ['Jungwon', 'Heo.'] as const,
    titleAlt: '허정원',
    index: '01',
    indexLabel: 'Selected Works',
    credential: 'Since 2013',
    backgroundImages: [
      assetPath('/images/products/home-main/mlb-main-bg.png'),
      assetPath('/images/products/home-main/st-main-bg.png'),
    ] as const,
    location: 'Seoul, South Korea',
    clientsLabel: 'Selected Clients',
    clients: [
      'STARBUCKS',
      'F&F',
      'HYUNDAI EZWEL',
      'SHINSEGAE CASA',
      'LG SIGNATURE',
      'NCSOFT',
      'GOODPEOPLE',
      'BULLS ONE',
      'HODOO ENGLISH',
      'PAMPERS',
      'SHANY',
      'CARBY',
      'MADFORGARLIC',
      'TOXNFILL',
    ] as const,
    scrollLabel: 'Scroll',
  },
  about: {
    sectionLabel: 'Profile',
    introParagraphs: [
      '12년 이상 Web Publisher & UI Engineer로 활동하며, 스타벅스 임직원 플랫폼·현대이지웰 복지 플랫폼·W Concept US 영문 커머스·신세계까사 브랜드 사이트 등 서비스 구축에서는 메인 페이지와 핵심 사용자 경험 영역을 직접 설계·구현했습니다. F&F MLB Korea·Discovery Expedition 등 운영·고도화 프로젝트에서는 Publishing Lead로 메인·프로모션·핵심 커머스 UI를 담당했습니다.',
      '프로젝트에서는 메인 페이지와 핵심 사용자 경험 영역을 주로 담당했습니다. Starbucks Partner Hub의 공통 UI 구조와 업무 핵심 모듈, Siren119의 모바일 업무 화면, MLB Korea 메인·프로모션 영역 등 서비스의 첫인상과 핵심 플로우에 해당하는 UI를 직접 구축·리드했습니다.',
      '디자인·기획·개발·운영과 화면 단위 산출물(마크업 구조, 컴포넌트 명세, QA 기준)을 기준으로 협업합니다. 구축 단계에서는 메인·핵심 화면 우선으로 UI 구조를 잡고, 운영 단계에서는 템플릿·컴포넌트 표준으로 반복 제작과 품질을 맞춥니다.',
    ] as const,
    selectedLabel: 'Selected Projects',
    viewAllLabel: 'View all projects',
    portraitImage: assetPath('/images/products/Profile-img.png'),
    portraitAlt:
      'Black and white workspace portrait of a web publisher reviewing a design layout',
    portraitCaption: {
      label: 'Incheon',
      year: '2026',
      line: 'Digital Experience Workspace',
    },
    background: {
      /** 시안 비교: ?about-type=profile | ?about-type=since2013 */
      defaultTypeLabel: 'profile' as const,
      typeLabels: {
        profile: 'PROFILE',
        since2013: 'SINCE 2013',
      },
    },
  },
  featuredProjectSlugs: [
    'starbucks-employee-platform',
    'hyundai-ezwel',
    'starbucks-siren119',
    'mlb-korea',
    'discovery-expedition',
    'wconcept-us',
    'guud',
    'casamia',
  ] as const,
  works: {
    sectionId: 'works',
    indexLabel: 'PROJECT INDEX',
    metaLabels: {
      client: 'Client',
      year: 'Year',
      role: 'Role',
      contribution: 'Contribution',
    },
    mobileInfoLabels: {
      toggle: 'Project Info',
      keyWork: 'Key Work',
      techStack: 'Tech Stack',
    },
  },
  detail: {
    backLabel: 'Back to works',
    backToTopLabel: 'Back to top',
    nextProjectLabel: 'Next HIGHLIGHT project',
    clientLabel: 'Client',
    periodLabel: 'Period',
    platformLabel: 'Platform',
    overviewLabel: 'Overview',
    roleLabel: 'Role',
    contributionLabel: 'Contribution',
    objectivesLabel: 'Objectives',
    responsibilitiesLabel: 'Responsibilities',
    stackLabel: 'Tech Stack',
    outcomeLabel: 'Outcome',
    keyFeaturesLabel: 'Key Features',
    achievementsLabel: 'Key Achievements',
    galleryLabel: 'Gallery',
    nextLabel: 'Next Project',
  },
  experience: {
    sectionId: 'experience',
    sectionLabel: 'Experience',
    sectionDesc:
      '2013년부터 현재까지 구축 프로젝트에서는 메인과 핵심 사용자 경험 영역을, 운영 프로젝트에서는 브랜드 서비스의 운영·고도화와 퍼블리싱 리드를 담당해 온 Web Publisher & UI Engineer 경력',
    projectsLabel: 'Projects',
    stackLabel: 'Stack',
  },
  footer: {
    sectionLabel: "Let's Talk",
    lead: 'Available for collaboration',
    headlineLines: ["Let's build something", 'together'] as const,
    description:
      '프로젝트 문의 및 협업 제안은 언제든 편하게 연락해주세요.',
    emailLabel: 'Email',
    linksLabel: 'Links',
    locationLabel: 'Location',
    roleLabel: 'Role',
    copyrightName: 'Heo Jungwon',
  },
} as const;

export type SiteConfig = typeof siteConfig;
