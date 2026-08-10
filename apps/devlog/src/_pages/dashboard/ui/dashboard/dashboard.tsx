import type { ReactElement } from 'react';

import { Heading } from '@audemodo/design-system';

import { NeedsUpdateList, selectNeedsUpdate } from '@/widgets/needs-update';
import { ReviewTable } from '@/widgets/review-table';

import type { PostSummary } from '@/entities/post';

import { formatBuildTime } from '@/shared/lib';

import styles from './dashboard.module.css';

interface DashboardProps {
  posts: PostSummary[];
  /** 빌드가 돌아간 시각 */
  builtAt: Date;
}

/**
 * 대시보드.
 *
 * 블로그를 만들면서 내가 보는 화면이다. 공개되지만 중심은 글 관리다.
 *
 * **위젯 안에 조작 요소를 두지 않는다.** 데이터가 빌드 시점에 굳으므로 나도 남도
 * 똑같이 못 누르고, 누를 수 있게 생긴 것을 두면 고장난 것으로 읽힌다.
 * 전역 크롬(네비 · 플로팅)은 이 규칙 밖이다 — 그건 위젯 내용이 아니다.
 */
export const Dashboard = ({ posts, builtAt }: DashboardProps): ReactElement => {
  // 머리의 개수와 목록이 어긋나지 않도록 한 번만 센다
  const needsUpdate = selectNeedsUpdate(posts, builtAt.toISOString());

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <div className={styles.head}>
          <Heading level={1} style={{ letterSpacing: 'var(--devlog-tracking-title)' }}>
            대시보드
          </Heading>

          <span className={styles.builtAt}>{formatBuildTime(builtAt)} 빌드</span>
        </div>

        <div className={styles.grid}>
          <section className={`${styles.widget} ${styles.wide}`}>
            <div className={styles.widgetHead}>
              <h2 className={styles.widgetTitle}>손봐야 할 글</h2>
              <span className={styles.widgetCount}>{posts.length}편</span>
            </div>

            <ReviewTable posts={posts} />
          </section>

          <section className={styles.widget}>
            <div className={styles.widgetHead}>
              <h2 className={styles.widgetTitle}>갱신할 때가 된 글</h2>
              <span className={styles.widgetCount}>{needsUpdate.length}편</span>
            </div>

            <NeedsUpdateList rows={needsUpdate} />
          </section>
        </div>
      </div>
    </main>
  );
};
