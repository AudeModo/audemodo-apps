import type { ReactElement } from 'react';

import type { ProjectSummary } from '@/entities/project';

import { buildTimeline } from '@/shared/lib';

import styles from './timeline.module.css';

/** 막대 색이 도는 칸 수 */
const TONES = 6;

interface TimelineProps {
  /** 시작 순으로 정렬해서 넘긴다 */
  projects: ProjectSummary[];
  /** `YYYY-MM`. 진행 중인 막대의 오른쪽 끝이 여기까지 뻗는다 */
  currentMonth: string;
}

/** `2026-03` → `03` */
const monthLabel = (month: string): string => month.slice(5);

/** 좁은 화면의 기간 표기. 끝나지 않았으면 `05~` */
const periodLabel = (project: ProjectSummary): string =>
  project.endedAt === undefined
    ? `${monthLabel(project.startedAt)}~`
    : `${monthLabel(project.startedAt)}~${monthLabel(project.endedAt)}`;

/**
 * 언제 무엇을 만들었나.
 *
 * 축 범위를 손으로 적지 않는다 — 프로젝트가 늘거나 달이 바뀌면 축이 따라 움직인다.
 * 넓은 화면과 좁은 화면을 둘 다 그려두고 CSS가 고른다.
 */
export const Timeline = ({ projects, currentMonth }: TimelineProps): ReactElement | null => {
  const { months, rows } = buildTimeline(projects, currentMonth);

  if (months.length === 0) {
    return null;
  }

  const columns = { gridTemplateColumns: `repeat(${String(months.length)}, minmax(0, 1fr))` };

  return (
    <div>
      <div className={styles.axis} style={columns}>
        {months.map((month) => (
          <div className={styles.axisMonth} key={month}>
            {monthLabel(month)}월
          </div>
        ))}
      </div>

      <div className={styles.rows}>
        {projects.map((project, index) => {
          const row = rows[index];

          return row === undefined ? null : (
            <div
              className={styles.row}
              data-tone={index % TONES}
              key={project.slug}
              style={columns}
            >
              <div
                className={styles.bar}
                data-open={row.isOpen}
                style={{ gridColumn: `${String(row.startColumn)} / ${String(row.endColumn)}` }}
              >
                {project.name}
              </div>
            </div>
          );
        })}
      </div>

      {/* 좁은 화면 — 이름이 왼쪽 열로 나가고 막대에는 글자가 없다 */}
      <div className={styles.mobile}>
        {projects.map((project, index) => {
          const row = rows[index];

          return row === undefined ? null : (
            <div className={styles.mobileRow} data-tone={index % TONES} key={project.slug}>
              <div className={styles.mobileName}>{project.name}</div>

              <div className={styles.mobileTrack} style={columns}>
                <div
                  className={styles.mobileBar}
                  data-open={row.isOpen}
                  style={{ gridColumn: `${String(row.startColumn)} / ${String(row.endColumn)}` }}
                />
              </div>

              <div className={styles.mobilePeriod}>{periodLabel(project)}</div>
            </div>
          );
        })}
      </div>

      <div className={styles.legend}>
        <span className={styles.legendItem}>
          <span aria-hidden className={styles.legendBar} />
          오른쪽이 열린 막대는 진행 중
        </span>

        <span>막대 색은 구분이 목적이고 의미는 없다</span>
      </div>
    </div>
  );
};
