import type { Project } from '@/types/project';
import {
  getDetailStorySections,
  type DetailStorySection,
} from '@/utils/detailStorySequence';
import {
  getDetailBodyParagraphs,
  getDetailCredits,
} from '@/utils/detailStoryContent';
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

function StoryCredits({ project }: { project: Project }) {
  const lines = getDetailCredits(project);

  return (
    <div className={styles.storyCredits} data-story-text data-detail-reveal>
      {lines.map((line) => (
        <p key={line} className={styles.storyCreditLine} data-reveal-item>
          {line}
        </p>
      ))}
    </div>
  );
}

function StoryBody({ project }: { project: Project }) {
  const paragraphs = getDetailBodyParagraphs(project);

  return (
    <div className={styles.storyBody} data-story-text data-detail-reveal>
      {paragraphs.map((paragraph) => (
        <p key={paragraph.slice(0, 48)} className={styles.storyBodyProse} data-reveal-item>
          {paragraph}
        </p>
      ))}
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
    case 'credits':
      return <StoryCredits key="credits" project={project} />;
    case 'body':
      return <StoryBody key="body" project={project} />;
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
