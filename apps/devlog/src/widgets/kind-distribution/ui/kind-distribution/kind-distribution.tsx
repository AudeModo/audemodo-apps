import type { ReactElement } from 'react';

import type { Share } from '@/shared/lib';

import styles from './kind-distribution.module.css';

export interface KindShare extends Share {
  kind: string;
}

interface KindDistributionProps {
  shares: KindShare[];
}

/**
 * 성격별 분포.
 *
 * 퍼센트는 반올림이 아니라 몫을 나눠 준 값이라 합이 정확히 100이다 — 화면에 합이
 * 100이 아닌 분포가 그려지면 보는 사람은 어느 칸이 틀렸는지 알 수 없다.
 *
 * 0편인 갈래는 막대에서 폭이 없지만 범례에는 남는다. 없는 것과 안 쓴 것은 다르다.
 */
export const KindDistribution = ({ shares }: KindDistributionProps): ReactElement => {
  return (
    <div>
      <div className={styles.bar}>
        {shares
          .filter((share) => share.percent > 0)
          .map((share) => (
            <span
              className={styles.segment}
              data-kind={share.kind}
              key={share.kind}
              style={{ width: `${String(share.percent)}%` }}
            />
          ))}
      </div>

      <div className={styles.legend}>
        {shares.map((share) => (
          <span className={styles.item} key={share.kind}>
            <span aria-hidden className={styles.swatch} data-kind={share.kind} />
            <span className={styles.name}>{share.kind}</span>
            {share.count}편 · {share.percent}%
          </span>
        ))}
      </div>
    </div>
  );
};
