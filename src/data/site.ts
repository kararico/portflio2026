import { assetPath } from '@/utils/assetPath';

export type HeroTypoVariant = 'single' | 'repeat' | 'roles';

export const siteConfig = {
  name: '허정원',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3030',
  seo: {
    homeTitle: 'Jungwon Heo | Web Publisher & UI Engineer',
    homeDescription:
      '12+ years experience in web publishing, UI engineering and digital product implementation. Portfolio featuring Starbucks, MLB, Discovery, Hyundai EZWEL and W Concept US projects.',
    ogImagePath: '/og-image.jpg',
    ogImageAlt: 'Jungwon Heo — Web Publisher & UI Engineer',
    ogImageWidth: 1200,
    ogImageHeight: 630,
    homeSections: ['#about', '#works', '#experience', '#contact'] as const,
  },
  position: {
    title: 'Web Publisher & UI Engineer',
    heroRoles: ['Web Publisher', 'UI Engineer'] as const,
    seoDescription:
      '12+ Years Experience in Web Publishing, UI Engineering, Accessibility and Large-scale Service Operations',
  },
  contact: {
    email: 'jungwon11082015@gmail.com',
    github: 'https://github.com/kararico',
    linkedin: 'https://www.linkedin.com/in/kararico',
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
  hero: {
    title: 'Jungwon Heo',
    titleParts: ['Jungwon', 'Heo'] as const,
    /** Hero 대형 타이포: single(이름 1회) | repeat(이름 반복) | roles(직무) — ?heroTypo= 로 A/B */
    displayVariant: 'single' as HeroTypoVariant,
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
      '12년 이상 Web Publisher & UI Engineer로 활동하며 브랜드 사이트, 커머스 플랫폼, 임직원 서비스 등 다양한 디지털 서비스를 구축해왔습니다.',
      '스타벅스 Partner Hub·Siren119, 현대이지웰 복지 플랫폼, W Concept US, 신세계까사 등 구축 프로젝트에서는 메인 페이지와 핵심 사용자 경험 영역의 UI 설계 및 퍼블리싱을 담당했으며, F&F MLB Korea·Discovery Expedition 운영 프로젝트에서는 Publishing Lead로서 메인·프로모션·커머스 UI 고도화를 주도했습니다.',
      '사용자가 가장 먼저 경험하는 화면과 핵심 플로우를 중요하게 생각합니다. 서비스의 목적과 사용성을 고려해 UI 구조를 설계하고, 디자인·기획·개발 조직과 긴밀하게 협업하며 완성도 높은 결과물을 만드는 데 집중해왔습니다.',
      '또한 컴포넌트 기반 설계와 퍼블리싱 표준화를 통해 운영 효율과 유지보수성을 높이고, 일관된 사용자 경험을 제공할 수 있는 UI 시스템 구축에 강점을 가지고 있습니다.',
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
    achievementsLabel: 'Achievements',
    galleryLabel: 'Gallery',
    nextLabel: 'Next Project',
  },
  experience: {
    sectionId: 'experience',
    sectionLabel: 'Experience',
    sectionDesc:
      '2013년부터 현재까지 구축 프로젝트에서는 메인과 핵심 사용자 경험 영역을,\n운영 프로젝트에서는 브랜드 서비스의 운영·고도화와 퍼블리싱 리드를 담당해 온 Web Publisher & UI Engineer 경력',
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
