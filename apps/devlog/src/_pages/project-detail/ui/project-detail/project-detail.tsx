import type { ReactElement } from 'react';

import { Heading, Text } from '@audemodo/design-system';
import { IconArrowLeft, IconArrowRight, IconExternalLink } from '@tabler/icons-react';
import Link from 'next/link';

import { ArchitectureDiagram } from '@/widgets/architecture-diagram';
import { DecisionTable } from '@/widgets/decision-table';
import { Milestones } from '@/widgets/milestones';

import type { PostSummary } from '@/entities/post';
import { PostColumn } from '@/entities/post';
import type { ProjectSummary } from '@/entities/project';
import { StatusDot } from '@/entities/project';

import { monthsSince } from '@/shared/lib';

import styles from './project-detail.module.css';

/** 글 구간에 몇 편까지 보일까 */
const POSTS_SHOWN = 3;

interface ProjectDetailProps {
  project: ProjectSummary;
  /** 이 프로젝트로 쓴 글. 최신순으로 넘어온다 */
  posts: PostSummary[];
  /** `YYYY-MM`. 개월째를 세는 기준 */
  currentMonth: string;
}

/**
 * 프로젝트 상세.
 *
 * 경계 강제 · 벤더 격리 · CI 게이트 같은 자산은 다른 화면에서 보이지 않는다.
 * 이 화면이 그것을 보여주는 자리라 표 · 막대 · 배지를 쓴다.
 *
 * 구간은 있으면 렌더하고 없으면 통째로 생략한다.
 */
export const ProjectDetail = ({
  project,
  posts,
  currentMonth,
}: ProjectDetailProps): ReactElement => {
  // 화면에 적히는 수는 전부 계산값이다
  const metrics = [
    { value: String(posts.length), label: '이 프로젝트로 쓴 글', shortLabel: undefined },
    {
      value: String(monthsSince(project.startedAt, currentMonth)),
      label: `개월째 · ${project.startedAt.replace('-', '.')} 시작`,
      shortLabel: '개월째',
    },
    ...(project.metrics ?? []).map((metric) => ({ shortLabel: undefined, ...metric })),
  ];

  const doneCount = (project.milestones ?? []).filter((item) => item.state === 'done').length;

  return (
    <main>
      <section className={styles.hero}>
        <div className={styles.container}>
          <Link className={styles.back} href="/projects">
            <IconArrowLeft aria-hidden size={16} />
            프로젝트
          </Link>

          <div className={styles.head}>
            <div className={styles.headMain}>
              <div className={styles.titleRow}>
                <Heading level={1} style={{ letterSpacing: 'var(--devlog-tracking-title)' }}>
                  {project.name}
                </Heading>

                <span className={styles.status}>
                  <StatusDot tone={project.statusTone} />
                  {project.status}
                </span>
              </div>

              <p className={styles.summary}>{project.summary ?? project.description}</p>

              <div className={styles.chips}>
                {project.stack.map((item) => (
                  <span className={styles.chip} key={item}>
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className={styles.actions}>
              {project.deployUrl !== undefined && (
                <a
                  className={`${styles.action} ${styles.actionPrimary}`}
                  href={project.deployUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {project.deployLabel ?? '배포'} 보기
                  <IconExternalLink aria-hidden size={16} />
                </a>
              )}

              {project.repoUrl !== undefined && (
                <a
                  className={`${styles.action} ${styles.actionSecondary}`}
                  href={project.repoUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  저장소
                  <IconExternalLink aria-hidden size={16} />
                </a>
              )}
            </div>
          </div>

          <div className={styles.metrics}>
            {metrics.map((metric) => (
              <div className={styles.metric} key={metric.label}>
                <div className={styles.metricValue}>{metric.value}</div>

                <div className={`${styles.metricLabel} ${styles.metricLabelFull}`}>
                  {metric.label}
                </div>

                {/* 좁은 칸에 두 정보를 넣지 않는다 */}
                {metric.shortLabel !== undefined && (
                  <div className={`${styles.metricLabel} ${styles.metricLabelShort}`}>
                    {metric.shortLabel}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {(project.problem !== undefined || project.architecture !== undefined) && (
        <section className={`${styles.section} ${styles.muted}`}>
          <div className={styles.container}>
            <Heading level={2} style={{ letterSpacing: 'var(--devlog-tracking-title)' }}>
              푼 문제
            </Heading>

            {(project.problem ?? []).map((paragraph) => (
              <p className={styles.problem} key={paragraph}>
                {paragraph}
              </p>
            ))}

            {project.architecture !== undefined && (
              <ArchitectureDiagram architecture={project.architecture} />
            )}
          </div>
        </section>
      )}

      {project.decisions !== undefined && (
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.sectionHead}>
              <Heading level={2} style={{ letterSpacing: 'var(--devlog-tracking-title)' }}>
                핵심 결정
              </Heading>

              <Text color="secondary" hasTabularNumbers type="label">
                {project.decisions.length}
              </Text>
            </div>

            <p className={styles.sectionNote}>
              무엇을 했는지만 적으면 절반이다. 어떻게 확인했는지가 오른쪽 칸에 있다.
            </p>

            <DecisionTable decisions={project.decisions} />
          </div>
        </section>
      )}

      {project.milestones !== undefined && (
        <section className={`${styles.section} ${styles.muted}`}>
          <div className={styles.container}>
            <div className={styles.sectionHead}>
              <Heading level={2} style={{ letterSpacing: 'var(--devlog-tracking-title)' }}>
                마일스톤
              </Heading>

              <Text color="secondary" hasTabularNumbers type="label">
                {`${String(doneCount)} / ${String(project.milestones.length)}`}
              </Text>
            </div>

            <Milestones milestones={project.milestones} />
          </div>
        </section>
      )}

      {posts.length > 0 && (
        <section className={styles.sectionLast}>
          <div className={styles.container}>
            <div className={styles.sectionHead}>
              <Heading level={2} style={{ letterSpacing: 'var(--devlog-tracking-title)' }}>
                이 프로젝트로 쓴 글
              </Heading>

              <Text color="secondary" hasTabularNumbers type="label">
                {posts.length}
              </Text>

              <Link
                className={styles.viewAll}
                href={`/posts?project=${encodeURIComponent(project.name)}`}
              >
                전체 보기
                <IconArrowRight aria-hidden size={16} />
              </Link>
            </div>

            <div className={styles.posts}>
              <PostColumn posts={posts.slice(0, POSTS_SHOWN)} />
            </div>
          </div>
        </section>
      )}
    </main>
  );
};
