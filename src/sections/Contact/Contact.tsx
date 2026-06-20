import { siteConfig } from '@/data/site';
import styles from './Contact.module.scss';

export default function Contact() {
  const { contact, position, footer } = siteConfig;

  return (
    <footer className={styles.footer} id="contact" data-contact-section>
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
            <p className={styles.ctaDesc}>{footer.description}</p>
          </header>
        </div>

        <div className={styles.contactBlock}>
          <div className={styles.contactCol}>
            <span className={styles.label}>{footer.linksLabel}</span>
            <ul className={styles.contactLinkList}>
              <li>
                <a
                  href={`mailto:${contact.email}`}
                  className={`${styles.contactLink} ${styles.emailLink}`}
                  data-cursor-style="small"
                >
                  {contact.email}
                </a>
              </li>
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
