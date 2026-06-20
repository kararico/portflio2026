import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import styles from './not-found.module.scss';

export const metadata: Metadata = {
  title: {
    absolute: '404 | Jungwon Heo Portflio site',
  },
  robots: {
    index: false,
    follow: false,
  },
};

const REVEAL_ITEMS = [
  { key: 'code', className: styles.code, content: '404' },
  {
    key: 'title',
    className: styles.title,
    content: 'Page Not Found',
    as: 'h1' as const,
  },
  {
    key: 'message',
    className: styles.message,
    content: (
      <>
        찾으시는 페이지를 찾을 수 없습니다.
        <br />
        삭제되었거나 잘못된 주소입니다.
      </>
    ),
    as: 'p' as const,
  },
];

export default function NotFound() {
  return (
    <section className={styles.notFound} aria-labelledby="not-found-title">
      <div className={styles.content}>
        {REVEAL_ITEMS.map((item, index) => {
          const Tag = item.as ?? 'p';

          return (
            <Tag
              key={item.key}
              id={item.key === 'title' ? 'not-found-title' : undefined}
              className={`${item.className} ${styles.reveal}`}
              style={{ '--reveal-index': index } as CSSProperties}
            >
              {item.content}
            </Tag>
          );
        })}

        <Link
          href="/"
          className={`${styles.homeLink} ${styles.reveal}`}
          style={{ '--reveal-index': REVEAL_ITEMS.length } as CSSProperties}
          data-cursor-style="small"
        >
          Back Home
        </Link>
      </div>
    </section>
  );
}
