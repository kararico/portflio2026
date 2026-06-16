'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState, type CSSProperties } from 'react';
import { useMobileHeaderReveal } from '@/hooks/useMobileHeaderReveal';
import HeaderLogo from './HeaderLogo';
import styles from './Header.module.scss';

export type HeaderTheme = 'light' | 'dark';

interface HeaderProps {
  /** light: #111 · dark: #fff — Hero/Detail 등 섹션별 재사용 */
  theme?: HeaderTheme;
}

const NAV_ITEMS = [
  { label: 'About', href: '#about' },
  { label: 'Works', href: '#works' },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact', href: '#contact' },
];

export default function Header({ theme = 'light' }: HeaderProps) {
  const pathname = usePathname();
  const isWorkDetail = pathname.startsWith('/work/');
  const [menuOpen, setMenuOpen] = useState(false);
  const headerVisible = useMobileHeaderReveal(!menuOpen);

  const handleNavClick = () => {
    setMenuOpen(false);
  };

  useEffect(() => {
    if (isWorkDetail) {
      setMenuOpen(false);
    }
  }, [isWorkDetail]);

  return (
    <header
      className={`${styles.header} ${headerVisible ? '' : styles.headerHidden}`}
      id="header"
      data-header-theme={theme}
      data-header-visible={headerVisible ? 'true' : 'false'}
    >
      <div className={styles.inner}>
        {!isWorkDetail ? (
          <div className={styles.logoCol}>
            <Link href="/" className={styles.logo} data-cursor-style="small">
              <span className="sr-only">허정원</span>
              <HeaderLogo className={styles.logoSvg} />
            </Link>
          </div>
        ) : (
          <div className={styles.logoCol} aria-hidden="true" />
        )}

        {!isWorkDetail ? (
          <div className={styles.menuCol}>
            <button
              type="button"
              className={`${styles.menuBtn} ${menuOpen ? styles.menuBtnOpen : ''}`}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((prev) => !prev)}
              data-cursor-style="small"
            >
              <span className={styles.menuHoverLabel} aria-hidden="true">
                {menuOpen ? 'CLOSE' : 'OPEN'}
              </span>
              <span className={styles.menuIcon} aria-hidden="true">
                <span className={styles.menuBar} />
                <span className={styles.menuBar} />
              </span>
            </button>

            <nav className={`${styles.menu} ${menuOpen ? styles.menuOpen : ''}`} aria-hidden={!menuOpen}>
              <div className={styles.menuWrapper}>
                <ul className={styles.menuList}>
                  {NAV_ITEMS.map((item, index) => (
                    <li
                      key={item.href}
                      className={styles.menuItem}
                      style={{ '--menu-index': index } as CSSProperties}
                    >
                      <Link
                        href={item.href}
                        className={styles.menuLink}
                        onClick={handleNavClick}
                        data-cursor-style="small"
                      >
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </nav>
          </div>
        ) : (
          <div className={styles.menuCol} aria-hidden="true" />
        )}
      </div>
    </header>
  );
}
