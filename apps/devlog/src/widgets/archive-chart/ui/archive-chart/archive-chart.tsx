import type { ReactElement } from 'react';

import type { MonthBucket } from '@/shared/lib';

import styles from './archive-chart.module.css';

/** 빈 달도 눈에 보이게 남기는 최소 높이 */
const EMPTY_HEIGHT = 2;

interface ArchiveChartProps {
  buckets: MonthBucket[];
}

/** `2026-08` → `08` */
const monthLabel = (month: string): string => month.slice(5);

/**
 * 월별로 몇 편을 썼나.
 *
 * 최대값이 100%가 되도록 정규화한다. 빈 달을 빼지 않는 이유는, 빼면 막대가 촘촘히
 * 붙어 쉬지 않고 쓴 것처럼 보이기 때문이다.
 */
export const ArchiveChart = ({ buckets }: ArchiveChartProps): ReactElement => {
  const max = Math.max(...buckets.map((bucket) => bucket.count), 1);

  return (
    <div>
      <div className={styles.chart}>
        {buckets.map((bucket) => (
          <div className={styles.column} key={bucket.month}>
            <div
              className={styles.bar}
              data-empty={bucket.count === 0}
              style={{
                height:
                  bucket.count === 0
                    ? `${String(EMPTY_HEIGHT)}px`
                    : `${String(Math.round((bucket.count / max) * 100))}%`,
              }}
              title={`${bucket.month} · ${String(bucket.count)}편`}
            />
          </div>
        ))}
      </div>

      <div className={styles.axis}>
        {buckets.map((bucket) => (
          <div className={styles.month} key={bucket.month}>
            {monthLabel(bucket.month)}
          </div>
        ))}
      </div>
    </div>
  );
};
