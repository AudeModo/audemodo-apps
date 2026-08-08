import type { PostSummary } from '../../model/types';
import type { ReactElement } from 'react';

import { HStack, Link, Text, VStack } from '@audemodo/design-system';
import Image from 'next/image';

import { formatPostDate } from '../../lib/format-post-date';
import { KindLabel } from '../kind-label/kind-label';
import styles from './post-row.module.css';

interface PostRowProps {
  post: PostSummary;
}

/**
 * 글 목록의 한 행.
 *
 * 제목 호버가 이 행의 핵심 상호작용이라 제목은 앱이 소유한 엘리먼트로 둔다.
 * 래퍼의 `Heading`은 자기 크기를 강제하고 자손 호버를 표현할 방법이 없다.
 * 대신 글자 자체는 `type="inherit"`으로 래퍼를 통과시킨다.
 */
export const PostRow = ({ post }: PostRowProps): ReactElement => {
  return (
    <HStack as="article" gap={5} vAlign="center">
      {/*
        텍스트 열은 썸네일 옆에서 줄어들 수 있어야 클램프가 동작한다.
        래퍼에 이 두 값을 표현하는 프롭이 없어 style로 준다 — 클래스는 쓰지 않는다.
      */}
      <VStack gap={2} style={{ flex: '1 1 0', minWidth: 0 }}>
        <HStack gap={2} vAlign="center">
          <KindLabel kind={post.kind} />

          <Text color="secondary" hasTabularNumbers type="supporting">
            <time dateTime={post.createdAt}>{formatPostDate(post.createdAt)}</time>
          </Text>
        </HStack>

        <h2 className={styles.title} data-kind={post.kind}>
          <Link color="inherit" href={`/posts/${post.slug}`} type="inherit">
            {post.title}
          </Link>
        </h2>

        <Text as="p" color="secondary" hasTruncateTooltip={false} maxLines={2}>
          {post.summary}
        </Text>
      </VStack>

      {/* 없는 항목은 자리 자체를 없앤다. 폴백 이미지를 만들지 않는다 */}
      {post.thumbnail !== undefined && (
        <Image
          alt=""
          className={styles.thumbnail}
          height={post.thumbnail.height}
          src={post.thumbnail.src}
          width={post.thumbnail.width}
        />
      )}
    </HStack>
  );
};
