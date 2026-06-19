'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
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
  const isHomePage = pathname === '/';
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { visible: headerVisible, isScrolled } = useMobileHeaderReveal(!menuOpen, {
    isHomePage: isHomePage && !isWorkDetail,
  });

  const handleNavClick = () => {
    setMenuOpen(false);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isWorkDetail) {
      setMenuOpen(false);
    }
  }, [isWorkDetail]);

  useEffect(() => {
    const root = document.documentElement;

    if (!menuOpen) {
      root.removeAttribute('data-mobile-menu-open');
      document.body.style.overflow = '';
      return;
    }

    root.setAttribute('data-mobile-menu-open', 'true');
    document.body.style.overflow = 'hidden';

    return () => {
      root.removeAttribute('data-mobile-menu-open');
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <header
      className={`${styles.header} ${headerVisible ? '' : styles.headerHidden} ${isScrolled ? styles.isScrolled : ''}`}
      id="header"
      data-header-theme={theme}
      data-header-surface={isWorkDetail ? 'transparent' : 'solid'}
      data-header-visible={headerVisible ? 'true' : 'false'}
      data-menu-open={menuOpen ? 'true' : 'false'}
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

            {mounted
              ? createPortal(
                  <nav
                    className={`${styles.menu} ${menuOpen ? styles.menuOpen : ''}`}
                    aria-hidden={!menuOpen}
                  >
                    <div className={styles.menuWrapper}>
                      <div className={styles.menuPanel}>
                        <Link
                          href="/"
                          className={styles.menuLogo}
                          onClick={handleNavClick}
                          data-cursor-style="small"
                        >
                          <span className="sr-only">허정원</span>
                          <HeaderLogo className={styles.menuLogoSvg} />
                        </Link>

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
                    </div>
                  </nav>,
                  document.body,
                )
              : null}
          </div>
        ) : (
          <div className={styles.menuCol} aria-hidden="true" />
        )}
      </div>
    </header>
  );
}
