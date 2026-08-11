import type { CommitRow } from '../../model/to-activity';
import type { ReactElement } from 'react';

import styles from './recent-commits.module.css';

interface RecentCommitsProps {
  rows: CommitRow[];
}

/** 최근 커밋 세 줄 */
export const RecentCommits = ({ rows }: RecentCommitsProps): ReactElement => (
  <ul className={styles.list}>
    {rows.map((row) => (
      <li className={styles.row} key={row.sha}>
        <span className={styles.sha}>{row.sha}</span>
        <span className={styles.message}>{row.message}</span>
        <span className={styles.day}>{row.day}</span>
      </li>
    ))}
  </ul>
);
