import type { ContributionCell } from '../../model/to-activity';
import type { ReactElement } from 'react';

import styles from './contribution-grid.module.css';

interface ContributionGridProps {
  cells: ContributionCell[];
  /** 어느 저장소를 세는가 */
  repo: string;
  /** 언제 받아둔 값인가. 이미 다듬어진 문자열을 받는다 */
  fetchedAtLabel: string;
}

/**
 * 잔디.
 *
 * 칸은 모델이 만든다. 여기서는 그리기만 한다 — 창을 어디서 끊는지와 단계를 어떻게
 * 나누는지는 계산이고, 계산은 테스트가 있는 곳에 둔다.
 */
export const ContributionGrid = ({
  cells,
  repo,
  fetchedAtLabel,
}: ContributionGridProps): ReactElement => (
  <div className={styles.frame}>
    <div className={styles.grid}>
      {cells.map((cell) => (
        <span
          className={styles.cell}
          data-level={cell.level}
          key={cell.day}
          title={`${cell.day} · 커밋 ${String(cell.count)}`}
        />
      ))}
    </div>

    <span className={styles.caption}>
      {repo} · 최근 12주 · {fetchedAtLabel} 기준
    </span>
  </div>
);
