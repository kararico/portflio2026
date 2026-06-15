import { assetPath } from '@/utils/assetPath';

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
      assetPath('/images/projects/mlb-korea/hero.jpg'),
      assetPath('/images/projects/starbucks-employee-platform/hero.jpg'),
    ] as const,
    roles: ['Frontend Developer', 'UI Engineer'] as const,
    location: 'Seoul, South Korea',
    clientsLabel: 'Selected Clients',
    clients: ['MLB', 'DISCOVERY', 'STARBUCKS', 'W CONCEPT', 'CASAMIA'] as const,
    scrollLabel: 'Scroll',
  },
  about: {
    sectionLabel: 'Profile',
    introParagraphs: [
      '12년 이상 다양한 브랜드 사이트와 디지털 서비스를 구축해왔습니다.',
      '웹 퍼블리셔로서 디자인과 사용자를 연결하는 역할에 집중하고 있으며, 마크업, 스타일링, 인터랙션 구현을 통해 사용자가 자연스럽게 경험할 수 있는 인터페이스를 만드는 것을 중요하게 생각합니다.',
      '브랜드의 의도를 정확하게 전달하면서도 접근성과 사용성을 고려한 결과물을 만드는 것이 저의 역할입니다.',
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
