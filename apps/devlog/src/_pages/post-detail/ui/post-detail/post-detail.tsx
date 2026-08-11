import type { ReactElement, ReactNode } from 'react';

import { Divider, Heading, Text, VStack } from '@audemodo/design-system';
import Link from 'next/link';

import { MdxContent } from '@/widgets/post-body';
import { Toc } from '@/widgets/post-toc';

import type { PostDetail as PostDetailModel, PostSummary } from '@/entities/post';
import { findAdjacentPosts, formatPostDate } from '@/entities/post';

import { extractHeadings, readingTime } from '@/shared/lib';
import { Callout, ScrollProgress } from '@/shared/ui';

import styles from './post-detail.module.css';

interface PostDetailProps {
  post: PostDetailModel;
  /** 최신순 전체 목록. 이웃 글을 찾는 데 쓴다 */
  posts: PostSummary[];
}

/** 분류 축은 전부 링크다 — 읽기 화면에서 탐색으로 돌아가는 유일한 경로 */
const axisHref = (axis: string, value: string): string =>
  `/posts?${axis}=${encodeURIComponent(value)}`;

const Separator = (): ReactElement => (
  <span aria-hidden className={styles.separator}>
    ·
  </span>
);

const Neighbor = ({
  post,
  label,
  isEnd = false,
}: {
  post: PostSummary;
  label: string;
  isEnd?: boolean;
}): ReactElement => (
  <Link
    className={`${styles.neighbor} ${isEnd ? styles.neighborEnd : ''}`}
    href={`/posts/${post.slug}`}
  >
    <VStack gap={1}>
      <Text color="secondary" type="supporting">
        {label}
      </Text>

      <Text type="label">{post.title}</Text>
    </VStack>
  </Link>
);

/**
 * 글 상세.
 *
 * 화면에 적히는 수는 전부 계산값이다 — 읽는 시간은 본문 글자 수에서, 소제목 번호는
 * 본문에서 뽑은 목록에서 나온다. 손으로 적으면 글이 자라도 그대로 남는다.
 */
export const PostDetail = ({ post, posts }: PostDetailProps): ReactElement => {
  const headings = extractHeadings(post.content);
  const minutes = readingTime(post.content);
  const { previous, next, nextInSeries } = findAdjacentPosts(posts, post.slug);

  const meta: ReactNode[] = [
    <time dateTime={post.createdAt} key="date">
      {formatPostDate(post.createdAt)}
    </time>,
    <Link className={styles.metaLink} href={axisHref('kind', post.kind)} key="kind">
      {post.kind}
    </Link>,
    <Link className={styles.metaLink} href={axisHref('project', post.project)} key="project">
      {post.project}
    </Link>,
    <Link className={styles.metaLink} href={axisHref('track', post.track)} key="track">
      {post.track}
    </Link>,
    <span key="reading">{minutes}분</span>,
  ];

  return (
    <>
      <ScrollProgress />

      <main className={styles.page}>
        <VStack gap={6}>
          <VStack gap={3}>
            <Heading level={1} style={{ letterSpacing: 'var(--devlog-tracking-title)' }}>
              {post.title}
            </Heading>

            <div className={styles.meta}>
              {meta.map((item, index) => (
                <span key={`meta-${String(index)}`}>
                  {index > 0 && <Separator />} {item}
                </span>
              ))}
            </div>
          </VStack>

          <Divider />

          <div className={styles.grid}>
            <article className={styles.body}>
              <VStack gap={5}>
                {/*
                  없으면 공유했을 때 상대가 완성글로 읽는다. URL로 열리는 것과
                  「다 쓴 글이다」는 다른 말이다.
                */}
                {post.draft === true && (
                  <Callout kind="warn">아직 쓰는 중인 글이다. 목록에 나오지 않는다.</Callout>
                )}

                {/* 좁은 화면에서만 보인다. 본문 위에 접힌 채로 앉는다 */}
                <Toc headings={headings} placement="inline" />

                <MdxContent headings={headings} source={post.content} />
              </VStack>
            </article>

            {/* 넓은 화면에서만 보인다. 본문을 따라 붙어 내려간다 */}
            <aside>
              <Toc headings={headings} placement="side" />
            </aside>
          </div>

          <Divider />

          <VStack gap={5}>
            {post.tag.length > 0 && (
              <div className={styles.tags}>
                {post.tag.map((tag) => (
                  <Link className={styles.tag} href={axisHref('tag', tag)} key={tag}>
                    {tag}
                  </Link>
                ))}
              </div>
            )}

            <div className={styles.neighbors}>
              {previous !== null && <Neighbor label="이전 글" post={previous} />}
              {next !== null && <Neighbor isEnd={previous === null} label="다음 글" post={next} />}
            </div>

            {nextInSeries !== null && (
              <Neighbor label={`${post.series ?? ''} 다음 편`} post={nextInSeries} />
            )}
          </VStack>
        </VStack>
      </main>
    </>
  );
};
