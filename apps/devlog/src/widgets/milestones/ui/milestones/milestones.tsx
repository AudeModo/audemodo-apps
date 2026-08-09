import type { ReactElement } from 'react';

import { IconCheck, IconPlayerPlay } from '@tabler/icons-react';

import type { ProjectMilestone } from '@/entities/project';

import styles from './milestones.module.css';

interface MilestonesProps {
  milestones: ProjectMilestone[];
}

/** 예정인 것은 번호로 자리를 표시한다 — 몇 번째인지가 곧 순서다 */
const StateMark = ({ state, order }: { state: ProjectMilestone['state']; order: number }) => (
  <span className={styles.state} data-state={state}>
    {state === 'done' && <IconCheck aria-hidden size={14} />}
    {state === 'active' && <IconPlayerPlay aria-hidden size={13} />}
    {state === 'planned' && order}
  </span>
);

/**
 * 마일스톤.
 *
 * 전체 진행 막대와, 진행 중인 항목 안의 단계 막대를 함께 둔다 — 어디까지 왔는지와
 * 지금 무엇을 하고 있는지는 다른 질문이다.
 */
export const Milestones = ({ milestones }: MilestonesProps): ReactElement => {
  const done = milestones.filter((item) => item.state === 'done').length;
  const total = milestones.length;
  const ratio = total === 0 ? 0 : done / total;

  return (
    <>
      <div className={styles.progress}>
        <div className={styles.track}>
          <div className={styles.fill} style={{ width: `${String(Math.round(ratio * 100))}%` }} />
        </div>

        <div className={styles.progressMeta}>
          <span>{ratio >= 0.5 ? '절반을 지났다' : '가는 중이다'}</span>
          <span>
            {done} / {total}
          </span>
        </div>
      </div>

      <div className={styles.list}>
        {milestones.map((item, index) => (
          <div className={styles.item} data-state={item.state} key={item.title}>
            <StateMark order={index + 1} state={item.state} />

            <div className={styles.body}>
              {item.steps === undefined ? (
                <div className={styles.title}>{item.title}</div>
              ) : (
                <div className={styles.titleRow}>
                  <div className={styles.title}>{item.title}</div>

                  <span className={styles.stageLabel}>
                    {item.steps.done} / {item.steps.total} 단계
                  </span>
                </div>
              )}

              {item.at !== undefined && <div className={styles.at}>{item.at}</div>}

              {item.steps !== undefined && (
                <>
                  <div className={styles.stages}>
                    {Array.from({ length: item.steps.total }, (_, step) => (
                      <span
                        className={styles.stage}
                        data-done={step < (item.steps?.done ?? 0)}
                        key={step}
                      />
                    ))}
                  </div>

                  <div className={styles.stageNote}>전체 진행과 지금 단계 진행을 함께 본다</div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
