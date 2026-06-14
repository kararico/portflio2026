import styles from './Contact.module.scss';

export default function Contact() {
  return (
    <footer className={styles.footer} id="contact">
      <div className="container-fluid">
        <div className={styles.row}>
          <div className={styles.col}>
            <span className={styles.label}>Write to</span>
            <a
              href="mailto:hello@example.com"
              className={styles.emailLink}
              data-cursor-style="small"
            >
              hello@example.com
            </a>
          </div>
          <div className={styles.col}>
            <span className={styles.label}>Social</span>
            <ul className={styles.socialList}>
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor-style="small"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor-style="small"
                >
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.ctaRow}>
          <p className={styles.ctaText}>
            <span>Let&apos;s</span>
            <span className={styles.ctaAccent}>talk</span>
          </p>
        </div>

        <div className={styles.bottomRow}>
          <span className={styles.copyright}>
            &copy; {new Date().getFullYear()} Frontend Developer Portfolio
          </span>
        </div>
      </div>
    </footer>
  );
}
