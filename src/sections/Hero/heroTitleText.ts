import type { HeroTypoVariant } from '@/data/site';
import { siteConfig } from '@/data/site';

const HERO_WORD_REPEAT = 14;

export function buildHeroDisplayPhrase(titleParts: readonly [string, string]): string {
  const first = titleParts[0].replace(/\./g, '');
  const second = titleParts[1].replace(/\./g, '');
  return `${first} ${second}`.toUpperCase();
}

function buildRepeatedLine(phrase: string): string {
  return Array.from({ length: HERO_WORD_REPEAT }, () => phrase).join(' ');
}

export function resolveHeroTypoVariant(override?: string | null): HeroTypoVariant {
  if (override === 'single' || override === 'repeat' || override === 'roles') {
    return override;
  }
  return siteConfig.hero.displayVariant;
}

export function buildHeroTitleText(variant: HeroTypoVariant): string {
  const { hero, position } = siteConfig;
  const namePhrase = buildHeroDisplayPhrase(hero.titleParts);

  switch (variant) {
    case 'repeat':
      return buildRepeatedLine(namePhrase);
    case 'roles':
      return position.title.toUpperCase();
    case 'single':
    default:
      return namePhrase;
  }
}

export function isHeroTypoRepeat(variant: HeroTypoVariant): boolean {
  return variant === 'repeat';
}

export function usesHeroExpandTitle(variant: HeroTypoVariant): boolean {
  return variant === 'single';
}
