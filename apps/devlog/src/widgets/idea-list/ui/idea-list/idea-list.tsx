import type { ReactElement } from 'react';

import type { IdeaItem } from '@/entities/dashboard';
import type { PostSummary } from '@/entities/post';

import styles from './idea-list.module.css';

interface IdeaListProps {
  /** 아직 쓰는 중인 글 */
  drafts: PostSummary[];
  /** 아직 글이 아닌 것 */
  items: IdeaItem[];
}

/**
 * 초안 · 글감.
 *
 * 초안이 위다. 글이 될 가능성이 더 가까운 것이 먼저 보여야 「무엇부터」가 형태로 읽힌다.
 *
 * 초안은 글 frontmatter에서, 글감은 정적 JSON에서 온다. 출처가 다른데 한 목록에
 * 놓이므로 라벨이 그 차이를 말한다 — 초안은 옅은 파랑, 글감은 중립이다.
 */
export const IdeaList = ({ drafts, items }: IdeaListProps): ReactElement => {
  if (drafts.length === 0 && items.length === 0) {
    return <p className={styles.empty}>초안도 글감도 아직 없다.</p>;
  }

  return (
    <ul className={styles.list}>
      {drafts.map((draft) => (
        <li className={styles.row} key={draft.slug}>
          <div className={styles.head}>
            <span className={`${styles.label} ${styles.draftLabel}`}>초안</span>
            <a className={styles.title} href={`/posts/${draft.slug}`}>
              {draft.title}
            </a>
          </div>

          <span className={styles.note}>{draft.summary}</span>
        </li>
      ))}

      {items.map((item) => (
        <li className={styles.row} key={item.title}>
          <div className={styles.head}>
            <span className={styles.label}>글감</span>
            <span className={styles.title}>{item.title}</span>
          </div>

          {item.note !== undefined && <span className={styles.note}>{item.note}</span>}
        </li>
      ))}
    </ul>
  );
};
