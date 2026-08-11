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
}: ContributionGridProps): ReactElement => {
  /*
   * 그린 칸에서 센다. `commitDays`에서 따로 세면 창을 어디서 끊었는지에 따라 숫자와
   * 그림이 어긋날 수 있다 — 같은 배열에서 나와야 둘이 같은 창을 말한다.
   */
  const total = cells.reduce((sum, cell) => sum + cell.count, 0);

  return (
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
        {repo} · 최근 12주 커밋 {total} · {fetchedAtLabel} 기준
      </span>
    </div>
  );
};
