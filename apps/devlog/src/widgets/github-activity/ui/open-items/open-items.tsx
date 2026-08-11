import type { OpenRow } from '../../model/to-activity';
import type { ReactElement } from 'react';

import { IconAlertCircle, IconGitPullRequest } from '@tabler/icons-react';

import styles from './open-items.module.css';

interface OpenItemsProps {
  rows: OpenRow[];
}

/**
 * 열린 PR과 이슈.
 *
 * 슬라이스 이름이 핸드오프 표의 `OpenPullRequests`와 다르다. 이 목록에는 이슈도
 * 들어오고(사양의 같은 줄이 「열린 PR · 이슈」라 적는다) PR만 있는 것처럼 부르면
 * 이름이 내용을 속인다.
 */
export const OpenItems = ({ rows }: OpenItemsProps): ReactElement => {
  if (rows.length === 0) {
    return <p className={styles.empty}>열려 있는 것이 없다.</p>;
  }

  return (
    <ul className={styles.list}>
      {rows.map((row) => (
        <li className={styles.row} data-aged={row.isAged} data-kind={row.kind} key={row.number}>
          {row.kind === 'pr' ? (
            <IconGitPullRequest aria-hidden className={styles.glyph} size={14} />
          ) : (
            <IconAlertCircle aria-hidden className={styles.glyph} size={14} />
          )}

          <span className={styles.title}>{row.title}</span>
          <span className={styles.elapsed}>{row.elapsedDays}일</span>
        </li>
      ))}
    </ul>
  );
};
