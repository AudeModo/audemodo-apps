import type { ReactElement } from 'react';

import { IconShieldCheck } from '@tabler/icons-react';

import type { ProjectDecision } from '@/entities/project';

import styles from './decision-table.module.css';

interface DecisionTableProps {
  decisions: ProjectDecision[];
}

const Badge = ({ children }: { children: string }): ReactElement => (
  <span className={styles.badge}>
    <IconShieldCheck aria-hidden size={13} />
    {children}
  </span>
);

/**
 * 결정 · 이유 · 검증.
 *
 * 넓은 화면은 표, 좁은 화면은 세로 카드다. 둘 다 그려두고 CSS가 고른다.
 * 카드에는 표의 머리가 없어 각 구획에 라벨을 붙인다 — 없으면 무엇을 읽고 있는지
 * 알 수 없다.
 */
export const DecisionTable = ({ decisions }: DecisionTableProps): ReactElement => {
  return (
    <>
      <div className={styles.table}>
        <div className={`${styles.row} ${styles.head}`}>
          <div className={styles.headCell}>결정</div>
          <div className={styles.headCell}>이유</div>
          <div className={styles.headCell}>검증</div>
        </div>

        {decisions.map((item) => (
          <div className={`${styles.row} ${styles.body}`} key={item.decision}>
            <div className={styles.decision}>{item.decision}</div>

            <p className={styles.reason}>{item.reason}</p>

            <div className={styles.verification}>
              <Badge>{item.verification}</Badge>
              <p className={styles.note}>{item.verificationNote}</p>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.cards}>
        {decisions.map((item) => (
          <div className={styles.card} key={item.decision}>
            <div className={styles.cardLabel}>결정</div>
            <div className={styles.cardDecision}>{item.decision}</div>

            <div className={`${styles.cardLabel} ${styles.cardGap}`}>이유</div>
            <p className={styles.cardReason}>{item.reason}</p>

            <div className={styles.cardVerification}>
              <div className={styles.cardLabel}>검증</div>

              <div className={styles.cardBadgeRow}>
                <Badge>{item.verification}</Badge>
              </div>

              <p className={styles.note}>{item.verificationNote}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
