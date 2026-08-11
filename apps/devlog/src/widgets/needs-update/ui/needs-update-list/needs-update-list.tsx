import type { NeedsUpdateRow } from '../../model/select-needs-update';
import type { ReactElement } from 'react';

import { Badge } from '@audemodo/design-system';
import Link from 'next/link';

import type { ReviewStatus } from '@/shared/lib';

import styles from './needs-update-list.module.css';

interface NeedsUpdateListProps {
  /** 이미 급한 순으로 세워진 줄. 머리의 개수와 같은 계산에서 나온다 */
  rows: NeedsUpdateRow[];
}

const LABELS = { overdue: '지남', soon: '임박', ok: '여유' } as const;

/** 지남은 지난 날수를, 나머지는 남은 날수를 말한다 */
const badgeText = (status: ReviewStatus): string =>
  status.remainingDays < 0
    ? `${LABELS.overdue} ${String(-status.remainingDays)}일`
    : `${LABELS[status.level]} ${String(status.remainingDays)}일`;

/**
 * 갱신할 때가 된 글.
 *
 * 주기를 적어둔 글만 나온다 — 모든 글이 다시 볼 대상은 아니다.
 * 급한 것이 위로 오도록 남은 날 순으로 세운 뒤 받는다.
 */
export const NeedsUpdateList = ({ rows }: NeedsUpdateListProps): ReactElement => {
  return (
    <div className={styles.list}>
      {rows.map(({ post, status }) => (
        <div className={styles.item} key={post.slug}>
          <Link className={styles.title} href={`/posts/${post.slug}`}>
            {post.title}
          </Link>

          <span className={styles.due}>{status.dueAt}</span>

          <Badge
            className={styles.badge}
            data-level={status.level}
            label={badgeText(status)}
            tone="pale"
          />
        </div>
      ))}
    </div>
  );
};
