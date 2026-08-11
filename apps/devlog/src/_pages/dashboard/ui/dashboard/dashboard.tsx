import type { ReactElement } from 'react';

import { Card, Heading } from '@audemodo/design-system';

import { ContributionGrid, toContributionCells } from '@/widgets/contribution-grid';
import { DoingNow, toNowRows } from '@/widgets/doing-now';
import { IdeaList } from '@/widgets/idea-list';
import { NeedsUpdateList, selectNeedsUpdate } from '@/widgets/needs-update';
import { ReadingList } from '@/widgets/reading-list';
import { ReviewTable } from '@/widgets/review-table';
import { ShortcutLinks } from '@/widgets/shortcut-links';
import { TodoList } from '@/widgets/todo-list';

import type { IdeaItem, NowItem, ReadingLink, ShortcutLink, TodoItem } from '@/entities/dashboard';
import type { GithubSnapshot } from '@/entities/github';
import type { PostSummary } from '@/entities/post';
import type { ProjectSummary } from '@/entities/project';

import { formatBuildTime } from '@/shared/lib';

import styles from './dashboard.module.css';

interface DashboardProps {
  posts: PostSummary[];
  /** 「지금 하는 것」의 프로젝트 줄이 진행을 여기서 가져온다 */
  projects: ProjectSummary[];
  now: NowItem[];
  todos: TodoItem[];
  reading: ReadingLink[];
  ideas: IdeaItem[];
  links: ShortcutLink[];
  /** 못 받아왔고 받아둔 것도 없으면 null이다 — 그때는 잔디를 그리지 않는다 */
  github: GithubSnapshot | null;
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
export const Dashboard = ({
  posts,
  projects,
  now,
  todos,
  reading,
  ideas,
  links,
  github,
  builtAt,
}: DashboardProps): ReactElement => {
  // 머리의 개수와 목록이 어긋나지 않도록 한 번만 센다
  const needsUpdate = selectNeedsUpdate(posts, builtAt.toISOString());

  // 연작의 「쓴 편 수」는 글에서 센다. JSON에는 계획한 편 수만 있다
  const nowRows = toNowRows(
    now,
    projects,
    (series) => posts.filter((post) => post.series === series).length,
  );

  const remaining = todos.filter((todo) => !todo.done).length;

  /*
   * 없으면 그리지 않는다. 0으로 그리면 「활동이 없었다」로 읽히는데 그것은 사실이
   * 아니라 받아오지 못했다는 뜻이다.
   */
  const grid =
    github === null
      ? null
      : {
          cells: toContributionCells(github.commitDays, github.fetchedAt),
          repo: github.repo,
          fetchedAtLabel: formatBuildTime(new Date(github.fetchedAt)),
        };

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
          <Card as="section" className={`${styles.widget} ${styles.wide}`}>
            <div className={styles.widgetHead}>
              <h2 className={styles.widgetTitle}>손봐야 할 글</h2>
              <span className={styles.widgetCount}>{posts.length}편</span>
            </div>

            <ReviewTable posts={posts} />
          </Card>

          <Card as="section" className={styles.widget}>
            <div className={styles.widgetHead}>
              <h2 className={styles.widgetTitle}>갱신할 때가 된 글</h2>
              <span className={styles.widgetCount}>{needsUpdate.length}편</span>
            </div>

            <NeedsUpdateList rows={needsUpdate} />
          </Card>

          <Card as="section" className={`${styles.widget} ${styles.wide}`}>
            <div className={styles.widgetHead}>
              <h2 className={styles.widgetTitle}>지금 하는 것</h2>
              <span className={styles.widgetCount}>{nowRows.length}개</span>
            </div>

            <DoingNow rows={nowRows} />
          </Card>

          <Card as="section" className={styles.widget}>
            <div className={styles.widgetHead}>
              <h2 className={styles.widgetTitle}>할 일</h2>
              {/* 남은 것을 센다. 전체를 세면 다 끝내도 숫자가 그대로다 */}
              <span className={styles.widgetCount}>{remaining}개 남음</span>
            </div>

            <TodoList items={todos} />
          </Card>

          <Card as="section" className={styles.widget}>
            <div className={styles.widgetHead}>
              <h2 className={styles.widgetTitle}>글감</h2>
              <span className={styles.widgetCount}>{ideas.length}개</span>
            </div>

            <IdeaList items={ideas} />
          </Card>

          <Card as="section" className={styles.widget}>
            <div className={styles.widgetHead}>
              <h2 className={styles.widgetTitle}>읽을거리</h2>
              <span className={styles.widgetCount}>{reading.length}개</span>
            </div>

            <ReadingList items={reading} />
          </Card>

          {grid !== null && (
            <Card as="section" className={`${styles.widget} ${styles.wide}`}>
              <div className={styles.widgetHead}>
                <h2 className={styles.widgetTitle}>최근 커밋</h2>
              </div>

              <ContributionGrid
                cells={grid.cells}
                fetchedAtLabel={grid.fetchedAtLabel}
                repo={grid.repo}
              />
            </Card>
          )}

          <Card as="section" className={styles.widget}>
            <div className={styles.widgetHead}>
              <h2 className={styles.widgetTitle}>바로가기</h2>
              <span className={styles.widgetCount}>{links.length}개</span>
            </div>

            <ShortcutLinks items={links} />
          </Card>
        </div>
      </div>
    </main>
  );
};
