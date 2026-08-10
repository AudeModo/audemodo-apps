import type { ReactElement } from 'react';

import { Heading, Text } from '@audemodo/design-system';
import { IconArrowRight, IconBooks, IconStack, IconUser } from '@tabler/icons-react';
import Link from 'next/link';

import { ArchiveChart } from '@/widgets/archive-chart';
import type { KindShare } from '@/widgets/kind-distribution';
import { KindDistribution } from '@/widgets/kind-distribution';
import { PostCarousel } from '@/widgets/post-carousel';
import { TagCloud } from '@/widgets/tag-cloud';

import type { PostSummary } from '@/entities/post';
import type { ProjectSummary } from '@/entities/project';
import { ProjectCard } from '@/entities/project';

import { AXIS_VALUES, KIND_VALUES, TRACK_VALUES } from '@/shared/config';
import { toFrequency, toKoreanCount, toMonthlyBuckets, toShares } from '@/shared/lib';

import styles from './home.module.css';

/** 캐러셀에 몇 편까지 */
const CAROUSEL_SIZE = 6;

interface HomeProps {
  posts: PostSummary[];
  projects: ProjectSummary[];
}

interface Category {
  name: string;
  count: number;
  href: string;
}

/**
 * 홈.
 *
 * 히어로의 수는 전부 코퍼스에서 나온다. 문장 안이라 한글 수사로 적고, 지표·메타는
 * 아라비아로 적는다 — 같은 수라도 자리에 따라 표기가 다르다.
 *
 * 지표 4카드는 두지 않는다. 히어로 문장이 이미 같은 수를 말하고 있어 중복이고,
 * 되풀이하면 「양 자랑」에 가까워진다.
 */
export const Home = ({ posts, projects }: HomeProps): ReactElement => {
  const troubleCount = posts.filter((post) => post.kind === '트러블슈팅').length;

  const kindCounts = KIND_VALUES.map((kind) => posts.filter((post) => post.kind === kind).length);
  const shares: KindShare[] = toShares(kindCounts).map((share, index) => ({
    ...share,
    kind: KIND_VALUES[index] ?? '',
  }));

  const tags = toFrequency(posts.map((post) => [...post.tag, ...post.stack]));

  // 성격 셋 + 직무 넷 + 가장 자주 쓴 태그 하나
  const categories: Category[] = [
    ...KIND_VALUES.map((kind) => ({
      name: kind,
      count: posts.filter((post) => post.kind === kind).length,
      href: `/posts?kind=${encodeURIComponent(kind)}`,
    })),
    ...TRACK_VALUES.map((track) => ({
      name: track,
      count: posts.filter((post) => post.track === track).length,
      href: `/posts?track=${encodeURIComponent(track)}`,
    })),
    ...(tags[0] === undefined
      ? []
      : [
          {
            name: tags[0].value,
            count: tags[0].count,
            href: `/posts?tag=${encodeURIComponent(tags[0].value)}`,
          },
        ]),
  ];

  return (
    <main>
      <section className={styles.hero}>
        <div className={styles.container}>
          <h1 className={styles.headline}>
            지금까지 <span className={styles.count}>{toKoreanCount(projects.length)} 개</span>를
            만들었고, <span className={styles.count}>{toKoreanCount(posts.length)} 편</span>을 썼다.
          </h1>

          {/* 막혔던 이야기가 아직 없으면 그 문장도 없다 */}
          {troubleCount > 0 && (
            <p className={styles.sub}>
              그중 <span className={styles.subCount}>{toKoreanCount(troubleCount)} 편</span>은
              막혔던 이야기다.
            </p>
          )}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <Heading level={2} style={{ letterSpacing: 'var(--devlog-tracking-title)' }}>
              최신 글
            </Heading>

            <Link className={styles.viewAll} href="/posts">
              전체 보기
              <IconArrowRight aria-hidden size={16} />
            </Link>
          </div>

          <div className={styles.body}>
            <PostCarousel posts={posts.slice(0, CAROUSEL_SIZE)} />
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.muted}`}>
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <Heading level={2} style={{ letterSpacing: 'var(--devlog-tracking-title)' }}>
              만들고 있는 것
            </Heading>

            <Link className={styles.viewAll} href="/projects">
              전체 보기
              <IconArrowRight aria-hidden size={16} />
            </Link>
          </div>

          <div className={styles.projects}>
            {projects.slice(0, 3).map((project) => (
              <ProjectCard
                key={project.slug}
                postCount={posts.filter((post) => post.project === project.name).length}
                project={project}
              />
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <Heading level={2} style={{ letterSpacing: 'var(--devlog-tracking-title)' }}>
            세 갈래로 쌓인다
          </Heading>

          <p className={styles.sectionNote}>
            회고는 돌아본 것, 트러블슈팅은 막혔던 것, 학습은 새로 배운 것이다.
          </p>

          <div className={styles.body}>
            <KindDistribution shares={shares} />
          </div>

          <div className={styles.categories}>
            {categories.map((category) =>
              category.count === 0 ? (
                <div
                  className={`${styles.category} ${styles.categoryEmpty}`}
                  key={category.name}
                  title="아직 쓴 글이 없다"
                >
                  <div className={styles.categoryCount}>0</div>
                  <div className={styles.categoryName}>{category.name}</div>
                </div>
              ) : (
                <Link className={styles.category} href={category.href} key={category.name}>
                  <div className={styles.categoryCount}>{category.count}</div>
                  <div className={styles.categoryName}>{category.name}</div>
                </Link>
              ),
            )}
          </div>
        </div>
      </section>

      {tags.length > 0 && (
        <section className={styles.section}>
          <div className={styles.container}>
            <Heading level={2} style={{ letterSpacing: 'var(--devlog-tracking-title)' }}>
              자주 쓴 것
            </Heading>

            <p className={styles.sectionNote}>크기가 곧 횟수다. 태그와 스택을 함께 센다.</p>

            <div className={styles.body}>
              <TagCloud
                axisOf={(value) => (AXIS_VALUES.stack.includes(value) ? 'stack' : 'tag')}
                items={tags}
              />
            </div>
          </div>
        </section>
      )}

      <section className={`${styles.section} ${styles.muted}`}>
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <Heading level={2} style={{ letterSpacing: 'var(--devlog-tracking-title)' }}>
              쌓인 것
            </Heading>

            <Text color="secondary" hasTabularNumbers type="label">
              {posts.length}편
            </Text>
          </div>

          <p className={styles.sectionNote}>쓰지 않은 달도 자리를 지킨다.</p>

          <div className={styles.body}>
            <ArchiveChart buckets={toMonthlyBuckets(posts.map((post) => post.createdAt))} />
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.cards}>
            <Link className={styles.card} href="/posts">
              <span className={styles.cardTitle}>
                <IconBooks aria-hidden size={20} />글
              </span>
              <p className={styles.cardNote}>다섯 축으로 좁혀 읽는다.</p>
            </Link>

            <Link className={styles.card} href="/projects">
              <span className={styles.cardTitle}>
                <IconStack aria-hidden size={20} />
                프로젝트
              </span>
              <p className={styles.cardNote}>만든 것과 그때의 결정.</p>
            </Link>

            <Link className={styles.card} href="/about">
              <span className={styles.cardTitle}>
                <IconUser aria-hidden size={20} />
                소개
              </span>
              <p className={styles.cardNote}>어떻게 일하는지 미리 답해 둔다.</p>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};
