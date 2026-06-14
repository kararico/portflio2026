export const siteConfig = {
  name: '허정원',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3030',
  hero: {
    title: 'Jungwon Heo.',
    titleParts: ['Jungwon', 'Heo.'] as const,
    titleAlt: '허정원',
    index: '01',
    indexLabel: 'Selected Works',
    credential: 'Since 2013',
    backgroundImages: [
      '/images/projects/mlb-korea/hero.jpg',
      '/images/projects/starbucks-employee-platform/hero.jpg',
    ] as const,
    roles: ['Frontend Developer', 'UI Engineer'] as const,
    location: 'Seoul, South Korea',
    clientsLabel: 'Selected Clients',
    clients: ['MLB', 'DISCOVERY', 'STARBUCKS', 'W CONCEPT', 'CASAMIA'] as const,
    scrollLabel: 'Scroll',
    subtitle: 'portfolio',
  },
  about: {
    sectionLabel: 'Profile',
    intro:
      '12년 이상 웹 퍼블리싱 업무를 수행하며 다양한 브랜드 사이트와 디지털 서비스를 구축해왔습니다. 사용자 경험과 접근성을 고려한 마크업, 스타일링, 인터랙션 구현에 집중합니다.',
    careerLine: '2013 — Present · 12 Years',
    roleLine: 'Web Publisher & UI Engineer',
    roleLineParts: ['Web Publisher', '& UI Engineer'] as const,
    selectedLabel: 'Selected Projects',
    viewAllLabel: 'View all projects',
    portraitImage: '/images/products/Profile-img.png',
    portraitAlt:
      'Black and white workspace portrait of a frontend developer reviewing a design layout',
    portraitCaption: {
      label: 'Seoul',
      year: '2026',
      line: 'Frontend Developer Workspace',
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
    'mlb-korea',
    'discovery-expedition',
    'starbucks-employee-platform',
    'wconcept-us',
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
  },
  detail: {
    backLabel: 'Back to works',
    backToTopLabel: 'Back to top',
    nextProjectLabel: 'Next HIGHLIGHT project',
    overviewLabel: 'Overview',
    objectivesLabel: 'Objectives',
    responsibilitiesLabel: 'Responsibilities',
    stackLabel: 'Tech Stack',
    achievementsLabel: 'Key Achievements',
    galleryLabel: 'Gallery',
    nextLabel: 'Next Project',
  },
  experience: {
    sectionId: 'experience',
    sectionLabel: 'Experience',
    sectionDesc: '2013년부터 현재까지 — Frontend Developer & UI Engineer로서의 12년 경력 아카이브.',
    projectsLabel: 'Projects',
    stackLabel: 'Stack',
  },
} as const;

export type SiteConfig = typeof siteConfig;
