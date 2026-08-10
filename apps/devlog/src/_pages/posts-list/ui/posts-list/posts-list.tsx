import type { ReactElement } from 'react';

import { Heading, HStack, Text, VStack } from '@audemodo/design-system';
import { Suspense } from 'react';

import type { PostSummary } from '@/entities/post';
import { PostColumn } from '@/entities/post';

import { POSTS_PER_PAGE } from '@/shared/config';

import { PostsListView } from '../posts-list-view/posts-list-view';
import styles from './posts-list.module.css';

interface PostsListProps {
  /** 빌드 시점에 라우트가 읽어 넘긴 전체 글 */
  posts: PostSummary[];
}

/**
 * 글 목록 화면.
 *
 * 글은 전부 빌드 시점에 읽어 정적으로 굳힌다. 좁히는 일은 브라우저가 URL을 보고 한다 —
 * 서버에 물어봐야 알 수 있는 것이 없는데 서버로 넘기면, 정적으로 못 하는 일과
 * 안 한 일의 구분이 사라진다.
 *
 * 제목과 총편수는 필터와 무관하므로 경계 바깥에 둔다. 쿼리를 읽기 전에 이미 확정된 값이고,
 * 정적 HTML에 들어 있어야 스크립트 없이도 이 페이지가 무엇인지 읽힌다.
 */
export const PostsList = ({ posts }: PostsListProps): ReactElement => {
  return (
    <main className={styles.page}>
      <VStack gap={6}>
        <VStack gap={2}>
          {/* 래퍼의 vAlign에는 baseline이 없다. 크기가 다른 두 글자를 한 선에 앉힌다 */}
          <HStack gap={3} style={{ alignItems: 'baseline' }}>
            <Heading level={1} style={{ letterSpacing: 'var(--devlog-tracking-title)' }}>
              글
            </Heading>

            <Text color="secondary" hasTabularNumbers type="label">
              {posts.length}편
            </Text>
          </HStack>

          <VStack maxWidth={671}>
            <Text as="p" color="secondary">
              막힌 자리와 풀어낸 방법을 남긴다. 회고 · 트러블슈팅 · 학습 세 갈래.
            </Text>
          </VStack>
        </VStack>

        {/*
          쿼리를 읽는 지점이라 경계가 필요하다. 빌드 시점에는 어떤 필터로 들어올지 알 수
          없으므로 이 안쪽은 브라우저에서 처음 그려진다.

          기다리는 동안 자리표시자 대신 거르지 않은 실제 목록을 둔다. 정적 사이트라
          글은 이미 다 알려져 있고, 아는 것을 감추고 회색 상자를 보여줄 이유가 없다 —
          크롤러와 자바스크립트를 끈 방문자에게는 그 상자가 이 페이지의 전부가 된다.

          대가는 URL에 필터가 있을 때 전체가 잠깐 보였다 걸러지는 것이다. 파라미터 없이
          들어오는 흔한 경로에는 깜빡임이 없다.
        */}
        <Suspense fallback={<PostColumn posts={posts.slice(0, POSTS_PER_PAGE)} />}>
          <PostsListView posts={posts} />
        </Suspense>
      </VStack>
    </main>
  );
};
