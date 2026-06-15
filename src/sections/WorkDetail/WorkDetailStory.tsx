import type { Project } from '@/types/project';
import {
  getDetailStorySections,
  type DetailStorySection,
} from '@/utils/detailStorySequence';
import { getProjectDetail } from '@/utils/detailStoryContent';
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
  const labels = siteConfig.detail;

  return (
    <div className={styles.storyDetail} data-story-text data-detail-reveal>
      <section className={styles.detailBlock}>
        <h2 className={styles.detailLabel} data-reveal-item>
          {labels.overviewLabel}
        </h2>
        <p className={styles.detailProse} data-reveal-item>
          {detail.overview}
        </p>
      </section>

      <section className={styles.detailBlock}>
        <h2 className={styles.detailLabel} data-reveal-item>
          {labels.roleLabel}
        </h2>
        <p className={styles.detailProse} data-reveal-item>
          {detail.role}
        </p>
      </section>

      <section className={styles.detailBlock}>
        <h2 className={styles.detailLabel} data-reveal-item>
          {labels.contributionLabel}
        </h2>
        <ul className={styles.detailList}>
          {detail.contributions.map((item) => (
            <li key={item} className={styles.detailListItem} data-reveal-item>
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.detailBlock}>
        <h2 className={styles.detailLabel} data-reveal-item>
          {labels.stackLabel}
        </h2>
        <p className={styles.detailStack} data-reveal-item>
          {detail.techStack.join(' · ')}
        </p>
      </section>

      <section className={styles.detailBlock}>
        <h2 className={styles.detailLabel} data-reveal-item>
          {labels.outcomeLabel}
        </h2>
        <p className={styles.detailProse} data-reveal-item>
          {detail.outcome}
        </p>
      </section>
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

  return (
    <div className={styles.story} data-detail-story>
      <WorkDetailHero project={project} />
      <div className={styles.storyCanvas}>
        {sections.map((section, index) => renderSection(section, project, index + 1))}
      </div>
    </div>
  );
}
