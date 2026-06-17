import { siteConfig } from '@/data/site';
import styles from './Contact.module.scss';

type SocialPlatform = (typeof siteConfig.contact.social)[number]['platform'];

const iconProps = {
  className: styles.socialIcon,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  focusable: 'false' as const,
};

function SocialIcon({ platform }: { platform: SocialPlatform }) {
  if (platform === 'instagram') {
    return (
      <svg {...iconProps}>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  return (
    <svg {...iconProps}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

export default function Contact() {
  const { contact, position, footer } = siteConfig;

  return (
    <footer className={styles.footer} id="contact">
      <div className="container-fluid">
        <div className={styles.topGrid}>
          <header className={styles.ctaBlock}>
            <span className={styles.sectionLabel}>{footer.sectionLabel}</span>
            <p className={styles.ctaLead}>{footer.lead}</p>
            <h2 className={styles.ctaHeadline}>
              <span className={styles.ctaHeadlineLine}>{footer.headlineLines[0]}</span>
              <span className={`${styles.ctaHeadlineLine} ${styles.ctaHeadlineAccent}`}>
                {footer.headlineLines[1]}
              </span>
            </h2>
          </header>

          <p className={styles.ctaDesc}>{footer.description}</p>
        </div>

        <div className={styles.contactBlock}>
          <div className={styles.contactCol}>
            <span className={styles.label}>{footer.emailLabel}</span>
            <a
              href={`mailto:${contact.email}`}
              className={styles.emailLink}
              data-cursor-style="small"
            >
              {contact.email}
            </a>
          </div>

          <div className={styles.contactCol}>
            <span className={styles.label}>{footer.linksLabel}</span>
            <ul className={styles.socialList}>
              {contact.social.map((item) => (
                <li key={item.platform}>
                  <a
                    href={item.href}
                    className={styles.socialLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.label}
                    data-cursor-style="small"
                  >
                    <SocialIcon platform={item.platform} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.contactCol}>
            <span className={styles.label}>{footer.locationLabel}</span>
            <p className={styles.valueText}>{contact.location}</p>
          </div>

          <div className={styles.contactCol}>
            <span className={styles.label}>{footer.roleLabel}</span>
            <p className={`${styles.valueText} ${styles.roleText}`}>{position.title}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
