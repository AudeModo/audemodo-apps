import type { NowRow } from '../../model/to-now-rows';
import type { ReactElement } from 'react';

import { barStyleOf } from '../../model/to-now-rows';
import styles from './doing-now.module.css';

interface DoingNowProps {
  rows: NowRow[];
}

/** 종류를 화면의 말로 옮긴다. 색은 CSS가 `data-kind`로 고른다 */
const KIND_LABEL: Record<NowRow['kind'], string> = {
  project: '프로젝트',
  series: '연작',
  learning: '학습',
  reading: '읽는 중',
};

/**
 * 지금 하는 것.
 *
 * 줄을 만드는 일은 `toNowRows`가 한다 — 종류마다 진행 수치의 출처가 다른 것을
 * 화면이 알 필요는 없다. 여기서는 받은 줄을 그리기만 한다.
 */
export const DoingNow = ({ rows }: DoingNowProps): ReactElement => {
  if (rows.length === 0) {
    return <p className={styles.empty}>지금 하는 것이 아직 없다.</p>;
  }

  return (
    <ul className={styles.list}>
      {rows.map((row) => (
        <li className={styles.row} data-kind={row.kind} key={row.key}>
          <div className={styles.head}>
            <span className={styles.kind}>{KIND_LABEL[row.kind]}</span>
            <span className={styles.title}>{row.title}</span>
          </div>

          {row.note !== null && <span className={styles.note}>{row.note}</span>}

          {row.progress !== null && (
            <div className={styles.progressRow}>
              {barStyleOf(row.kind) === 'cells' ? (
                <span aria-hidden className={styles.cells}>
                  {Array.from({ length: row.progress.total }, (_, index) => (
                    <span
                      className={styles.cell}
                      data-filled={index < (row.progress?.done ?? 0)}
                      key={index}
                    />
                  ))}
                </span>
              ) : (
                <span aria-hidden className={styles.track}>
                  <span
                    className={styles.fill}
                    style={{ width: `${String((row.progress.done / row.progress.total) * 100)}%` }}
                  />
                </span>
              )}

              <span className={styles.progress}>
                {row.progress.done} / {row.progress.total}
                {row.progress.unit}
              </span>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};
