import { siteConfig } from '@/data/site';
import { assetPath } from '@/utils/assetPath';
import styles from './ResumeDownloadLink.module.scss';

interface ResumeDownloadLinkProps {
  className?: string;
  children: React.ReactNode;
  'data-cursor-style'?: string;
  'data-about-reveal'?: string;
}

function DownloadIcon() {
  return (
    <svg
      className={styles.icon}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M8 2.5v6.5"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <path
        d="M5.25 7.25 8 10l2.75-2.75"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.5 12.5h9"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function ResumeDownloadLink({
  className,
  children,
  'data-cursor-style': cursorStyle,
  'data-about-reveal': aboutReveal,
}: ResumeDownloadLinkProps) {
  const { path, fileName } = siteConfig.resume;

  return (
    <a
      href={assetPath(path)}
      download={fileName}
      className={className}
      data-cursor-style={cursorStyle}
      data-about-reveal={aboutReveal}
    >
      <span className={styles.inner}>
        {children}
        <DownloadIcon />
      </span>
    </a>
  );
}
