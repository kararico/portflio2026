import { assetPath } from '@/utils/assetPath';

export const siteConfig = {
  name: '허정원',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3030',
  position: {
    title: 'Web Publisher & UI Developer',
    heroRoles: ['Web Publisher', 'UI Developer'] as const,
    seoDescription:
      '12+ Years Experience in Web Publishing, UI Development, Accessibility and Frontend Engineering',
  },
  contact: {
    email: 'jungwon11082015@gmail.com',
    links: [
      { label: 'GitHub', href: 'https://github.com/kararico' },
      { label: 'Portfolio', href: 'https://kararico.github.io' },
    ] as const,
  },
  hero: {
    title: 'Jungwon Heo.',
    titleParts: ['Jungwon', 'Heo.'] as const,
    titleAlt: '허정원',
    index: '01',
    indexLabel: 'Selected Works',
    credential: 'Since 2013',
    backgroundImages: [
      assetPath('/images/projects/mlb-korea/hero.jpg'),
      assetPath('/images/projects/starbucks-employee-platform/hero.jpg'),
    ] as const,
    location: 'Seoul, South Korea',
    clientsLabel: 'Selected Clients',
    clients: [
      'STARBUCKS',
      'MLB',
      'DISCOVERY',
      'HYUNDAI EZWEL',
      'CASAMIA',
      'LG SIGNATURE',
      'NCSOFT',
    ] as const,
    scrollLabel: 'Scroll',
  },
  about: {
    sectionLabel: 'Profile',
    introParagraphs: [
      '12년 이상 스타벅스, F&F, 현대이지웰 등 다양한 브랜드 사이트와 디지털 서비스를 구축해왔습니다.',
      '웹 퍼블리셔 및 UI 개발자로서 웹표준과 웹접근성을 기반으로 마크업, 스타일링, 인터랙션을 구현합니다. Vue.js, React, Next.js, TypeScript를 활용해 브랜드 의도를 정확히 전달하는 인터페이스를 만듭니다.',
      '디자인과 사용자를 연결하는 역할에 집중하며, 접근성과 사용성을 고려한 결과물을 만드는 것이 저의 역할입니다.',
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
    'starbucks-siren119',
    'starbucks-employee-platform',
    'mlb-korea',
    'hyundai-ezwel',
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
    roleLabel: 'Role',
    contributionLabel: 'Contribution',
    objectivesLabel: 'Objectives',
    responsibilitiesLabel: 'Responsibilities',
    stackLabel: 'Tech Stack',
    outcomeLabel: 'Outcome',
    achievementsLabel: 'Key Achievements',
    galleryLabel: 'Gallery',
    nextLabel: 'Next Project',
  },
  experience: {
    sectionId: 'experience',
    sectionLabel: 'Experience',
    sectionDesc:
      '2013년부터 현재까지 — Web Publisher & UI Developer로서의 12년 경력 아카이브.',
    projectsLabel: 'Projects',
    stackLabel: 'Stack',
  },
} as const;

export type SiteConfig = typeof siteConfig;
