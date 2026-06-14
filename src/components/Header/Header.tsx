'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './Header.module.scss';

const NAV_ITEMS = [
  { label: 'About', href: '#about' },
  { label: 'Works', href: '#works' },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact', href: '#contact' },
];

export default function Header() {
  const pathname = usePathname();
  const isWorkDetail = pathname.startsWith('/work/');
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNavClick = () => {
    setMenuOpen(false);
  };

  useEffect(() => {
    if (isWorkDetail) {
      setMenuOpen(false);
    }
  }, [isWorkDetail]);

  return (
    <header className={styles.header} id="header">
      <div className={styles.inner}>
        {!isWorkDetail ? (
          <div className={styles.logoCol}>
            <Link href="/" className={styles.logo} data-cursor-style="small">
              <span className="sr-only">허정원</span>
              <span className={styles.logoText}>허정원.</span>
            </Link>
          </div>
        ) : (
          <div className={styles.logoCol} aria-hidden="true" />
        )}

        {!isWorkDetail ? (
          <div className={styles.menuCol}>
            <button
              type="button"
              className={styles.menuBtn}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((prev) => !prev)}
              data-cursor-style="menu"
            >
              <span className={styles.menuBar} />
              <span className={styles.menuBar} />
            </button>

            <nav className={`${styles.menu} ${menuOpen ? styles.menuOpen : ''}`} aria-hidden={!menuOpen}>
              <div className={styles.menuWrapper}>
                <ul className={styles.menuList}>
                  {NAV_ITEMS.map((item) => (
                    <li key={item.href}>
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
