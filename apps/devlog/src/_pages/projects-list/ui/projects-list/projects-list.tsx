import type { ReactElement } from 'react';

import { Heading, HStack, Text, VStack } from '@audemodo/design-system';

import { Timeline } from '@/widgets/project-timeline';

import type { PostSummary } from '@/entities/post';
import type { ProjectSummary } from '@/entities/project';
import { ProjectCard } from '@/entities/project';

import styles from './projects-list.module.css';

interface ProjectsListProps {
  /** 중요도 순으로 넘어온다 */
  projects: ProjectSummary[];
  /** 지표의 글 수를 세는 데 쓴다 */
  posts: PostSummary[];
  /** `YYYY-MM`. 빌드 시점의 달 */
  currentMonth: string;
}

/**
 * 프로젝트 목록.
 *
 * 카드는 중요도 순, 타임라인은 시작 순이다. 정렬이 다른 것이 이 화면의 요점이라
 * 두 목록을 각각 만든다.
 */
export const ProjectsList = ({
  projects,
  posts,
  currentMonth,
}: ProjectsListProps): ReactElement => {
  // 시작 순은 타임라인만의 정렬이다. 카드 순서를 건드리지 않도록 새 배열로 만든다
  const byStart = [...projects].sort((a, b) => a.startedAt.localeCompare(b.startedAt));

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <VStack gap={2}>
          {/* 래퍼의 vAlign에는 baseline이 없다 */}
          <HStack gap={3} style={{ alignItems: 'baseline' }}>
            <Heading level={1} style={{ letterSpacing: 'var(--devlog-tracking-title)' }}>
              프로젝트
            </Heading>

            <Text color="secondary" hasTabularNumbers type="label">
              {projects.length}
            </Text>
          </HStack>

          <VStack maxWidth={671}>
            <Text as="p" color="secondary">
              만든 것들. 같은 목록을 아래 타임라인에서 시작 순으로 다시 본다.
            </Text>
          </VStack>
        </VStack>
      </div>

      {/* 흰 카드가 회색 면 위에 떠야 카드가 주인공으로 읽힌다 */}
      <section className={styles.cardsSection}>
        <div className={styles.container}>
          <div className={styles.cards}>
            {projects.map((project) => (
              <ProjectCard
                key={project.slug}
                postCount={posts.filter((post) => post.project === project.name).length}
                project={project}
              />
            ))}
          </div>
        </div>
      </section>

      <section className={styles.timeline}>
        <div className={styles.container}>
          <VStack gap={2}>
            <HStack gap={3} style={{ alignItems: 'baseline' }}>
              <Heading level={2} style={{ letterSpacing: 'var(--devlog-tracking-title)' }}>
                언제 무엇을 만들었나
              </Heading>

              <Text color="secondary" type="label">
                시작 순
              </Text>
            </HStack>

            <VStack maxWidth={671}>
              <Text as="p" color="secondary">
                위 카드는 중요도 순이고 여기는 시작 순이다. 같은 것을 다른 축으로 보면 무엇이 겹쳤고
                무엇이 이어졌는지가 드러난다.
              </Text>
            </VStack>
          </VStack>

          <div className={styles.timelineBody}>
            <Timeline currentMonth={currentMonth} projects={byStart} />
          </div>
        </div>
      </section>
    </main>
  );
};
