import { siteConfig } from '@/data/site';
import styles from './Contact.module.scss';

export default function Contact() {
  const { contact, name, position } = siteConfig;

  return (
    <footer className={styles.footer} id="contact">
      <div className="container-fluid">
        <div className={styles.row}>
          <div className={styles.col}>
            <span className={styles.label}>Write to</span>
            <a
              href={`mailto:${contact.email}`}
              className={styles.emailLink}
              data-cursor-style="small"
            >
              {contact.email}
            </a>
          </div>
          <div className={styles.col}>
            <span className={styles.label}>Links</span>
            <ul className={styles.socialList}>
              {contact.links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor-style="small"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={styles.identityRow}>
          <span className={styles.identityName}>{name}</span>
          <span className={styles.identityRole}>{position.title}</span>
        </div>

        <div className={styles.ctaRow}>
          <p className={styles.ctaText}>
            <span>Let&apos;s</span>
            <span className={styles.ctaAccent}>talk</span>
          </p>
        </div>

        <div className={styles.bottomRow}>
          <span className={styles.copyright}>
            &copy; {new Date().getFullYear()} {name}
          </span>
        </div>
      </div>
    </footer>
  );
}
