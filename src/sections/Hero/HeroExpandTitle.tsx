import styles from './Hero.module.scss';

const JUNG_CHARS = ['u', 'n', 'g'] as const;
const WON_CHARS = ['o', 'n'] as const;
const HEO_CHARS = ['h', 'e', 'o'] as const;

type HeroExpandTitleProps = {
  className?: string;
  revealRoot?: boolean;
  ariaHidden?: boolean;
};

function ExpandChar({ char }: { char: string }) {
  const content = char === ' ' ? '\u00A0' : char;

  return (
    <span className={styles.heroExpandCharMask} data-hero-expand-char>
      <span className={styles.heroExpandCharInner} data-hero-expand-char-inner>
        {content}
      </span>
    </span>
  );
}

/** j + [u n g] + w + [o n] + [ ] + [h e o] — JW에서 글자 단위 마스크 확장 */
export default function HeroExpandTitle({ className, revealRoot, ariaHidden }: HeroExpandTitleProps) {
  const rootClass = [styles.heroExpandTitle, className].filter(Boolean).join(' ');

  return (
    <span
      className={rootClass}
      {...(revealRoot ? { 'data-hero-expand-root': true } : {})}
      {...(ariaHidden ? { 'aria-hidden': true } : {})}
    >
      <span className={styles.heroExpandTrack} data-hero-expand-track>
        <span className={styles.heroExpandAnchor} data-hero-expand-j>
          j
        </span>
        {JUNG_CHARS.map((char) => (
          <ExpandChar key={`jung-${char}`} char={char} />
        ))}
        <span className={styles.heroExpandAnchor} data-hero-expand-w>
          w
        </span>
        {WON_CHARS.map((char) => (
          <ExpandChar key={`won-${char}`} char={char} />
        ))}
        <ExpandChar char=" " />
        {HEO_CHARS.map((char) => (
          <ExpandChar key={`heo-${char}`} char={char} />
        ))}
      </span>
    </span>
  );
}
