import type { Project } from '@/types/project';
import {
  getDetailStorySections,
  type DetailStorySection,
} from '@/utils/detailStorySequence';
import { getProjectDetail, getProjectAchievements, getProjectKeyFeatures } from '@/utils/detailStoryContent';
import { hasKoreanText } from '@/utils/projectTitle';
import { siteConfig } from '@/data/site';
import {
  slotToImageLayout,
  type EditorialLayoutItem,
  type EditorialStoryRow,
} from '@/utils/detailEditorialLayout';
import WorkDetailHero from './WorkDetailHero';
import DetailImage from './DetailImage';
import styles from './WorkDetail.module.scss';

interface WorkDetailStoryProps {
  project: Project;
}

function StoryImage({
  item,
  project,
  priority,
}: {
  item: EditorialLayoutItem;
  project: Project;
  priority?: boolean;
}) {
  const slotClass = styles[`slot_${item.slot}`];

  return (
    <figure
      className={`${styles.storyImage} ${slotClass}`}
      data-story-image
      data-story-slot={item.slot}
      data-gallery-item
      data-cursor-style="view"
    >
      <DetailImage
        src={item.sources[0]}
        alt={item.alts[0]}
        slug={project.slug}
        priority={priority}
        variant="editorial"
        layout={slotToImageLayout(item.slot)}
      />
    </figure>
  );
}

function StoryRow({
  row,
  project,
  imageIndexOffset,
}: {
  row: EditorialStoryRow;
  project: Project;
  imageIndexOffset: number;
}) {
  const rowClass = styles[`storyRow_${row.id}`];

  return (
    <div
      className={`${styles.storyRow} ${rowClass}`}
      data-story-row={row.id}
      data-story-overlap={row.overlap ? 'true' : undefined}
    >
      {row.items.map((item, index) => (
        <StoryImage
          key={`${row.id}-${item.slot}`}
          item={item}
          project={project}
          priority={imageIndexOffset + index <= 2}
        />
      ))}
    </div>
  );
}

function StoryDetailContent({ project }: { project: Project }) {
  const detail = getProjectDetail(project);
  const keyFeatures = getProjectKeyFeatures(project);
  const achievements = getProjectAchievements(project);
  const labels = siteConfig.detail;

  return (
    <div className={styles.storyDetail} data-story-text data-detail-reveal>
      <div className={styles.detailChapterBody}>
        <header className={styles.detailChapterHeader}>
          <h2 className={styles.detailLabel} data-reveal-item>
            Case Study
          </h2>
        </header>

        <section className={styles.detailBlock}>
          <h3 className={styles.detailLabel} data-reveal-item>
            {labels.roleLabel}
          </h3>
          <p
            className={styles.detailRole}
            data-reveal-item
            lang={hasKoreanText(detail.role) ? 'ko' : undefined}
          >
            {detail.role}
          </p>
        </section>

        <section className={styles.detailBlock}>
          <h3 className={styles.detailLabel} data-reveal-item>
            {labels.contributionLabel}
          </h3>
          <ul className={styles.contributionGrid}>
            {detail.contributions.map((item) => (
              <li
                key={item}
                className={styles.contributionCard}
                data-reveal-item
                lang={hasKoreanText(item) ? 'ko' : undefined}
              >
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.detailBlock}>
          <h3 className={styles.detailLabel} data-reveal-item>
            {labels.stackLabel}
          </h3>
          <ul className={styles.detailStackList}>
            {detail.techStack.map((tech) => (
              <li key={tech} className={styles.detailStackTag} data-reveal-item>
                {tech}
              </li>
            ))}
          </ul>
        </section>

        {keyFeatures.length > 0 ? (
          <section className={styles.detailBlock}>
            <h3 className={styles.detailLabel} data-reveal-item>
              {labels.keyFeaturesLabel}
            </h3>
            <ul className={styles.featureList}>
              {keyFeatures.map((feature) => (
                <li key={feature} className={styles.featureItem} data-reveal-item>
                  {feature}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {achievements.length > 0 ? (
          <section className={`${styles.detailBlock} ${styles.detailAchievements}`}>
            <h3 className={styles.detailLabel} data-reveal-item>
              {labels.achievementsLabel}
            </h3>
            <ul className={styles.achievementGrid}>
              {achievements.map((item) => (
                <li key={`${item.value}-${item.label}`} className={styles.achievementCard} data-reveal-item>
                  <span className={styles.achievementValue}>{item.value}</span>
                  <span className={styles.achievementLabel} lang={hasKoreanText(item.label) ? 'ko' : undefined}>
                    {item.label}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section className={`${styles.detailBlock} ${styles.detailOutcome}`}>
          <h3 className={styles.detailLabel} data-reveal-item>
            {labels.outcomeLabel}
          </h3>
          <blockquote
            className={styles.outcomeStatement}
            data-reveal-item
            lang={hasKoreanText(detail.outcome) ? 'ko' : undefined}
          >
            {detail.outcome}
          </blockquote>
        </section>

        <div className={styles.galleryDivider} data-reveal-item>
          <span className={styles.detailLabel}>{labels.galleryLabel}</span>
        </div>
      </div>
    </div>
  );
}

function renderSection(section: DetailStorySection, project: Project, index: number) {
  switch (section.type) {
    case 'hero':
      return <WorkDetailHero key="hero" project={project} />;
    case 'row':
      return (
        <StoryRow
          key={`row-${section.row.id}-${index}`}
          row={section.row}
          project={project}
          imageIndexOffset={index}
        />
      );
    case 'detail':
      return <StoryDetailContent key="detail" project={project} />;
    default:
      return null;
  }
}

export default function WorkDetailStory({ project }: WorkDetailStoryProps) {
  const sections = getDetailStorySections(project).filter((section) => section.type !== 'hero');
  const galleryRows = sections.filter((section) => section.type === 'row');

  return (
    <div className={styles.story} data-detail-story>
      <WorkDetailHero project={project} />
      <div className={styles.storyCanvas}>
        {sections.map((section, index) => {
          if (section.type === 'row') return null;
          return renderSection(section, project, index + 1);
        })}
        {galleryRows.length > 0 ? (
          <div className={styles.gallerySection} data-gallery-section>
            {galleryRows.map((section, index) =>
              renderSection(section, project, index + 1),
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
