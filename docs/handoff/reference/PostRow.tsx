// 목록 행 — 제목 호버가 이 화면의 핵심 인터랙션이다.
//
// 밑줄은 display:inline이 필수다. 블록이면 컨테이너 폭을 채운다.
// 호버 색은 kind별 기본색, 라벨 색은 kind별 텍스트 단계 — 두 값이 다르다.
// 라벨은 계속 읽히는 정보이고 호버는 스쳐 가는 상태라 요구 수준이 다르다.

// entities/post/ui/PostRow.tsx
import { HStack, VStack, Text, Link } from '@audemodo/design-system';
import styles from './PostRow.module.css';
import type { Post } from '../model/types';

export function PostRow({ post }: { post: Post }) {
  return (
    <HStack gap={5} vAlign="center">
      <VStack gap={1.5} width="100%">
        <HStack gap={2.5} vAlign="center">
          {/* kind 색은 데이터가 아니라 매핑이다 — 값을 문자열로 들고 다니지 않는다 */}
          <span className={styles.kind} data-kind={post.kind}>{post.kind}</span>
          <Text type="supporting" color="secondary">
            <time dateTime={post.isoDate}>{post.date}</time>
          </Text>
        </HStack>

        {/* 2줄 클램프. 제목 앵커에 data-kind를 주고 호버 색은 CSS가 정한다 */}
        <h2 className={styles.titleLine}>
          <Link href={`/posts/${post.slug}`} className={styles.title} data-kind={post.kind}>
            {post.title}
          </Link>
        </h2>

        <Text as="p" color="secondary" className={styles.summary}>
          {post.summary}
        </Text>
      </VStack>

      {/* 없는 항목은 자리 자체를 없앤다. 폴백 이미지를 만들지 않는다 */}
      {post.thumbnail && (
        <img
          className={styles.thumb}
          src={post.thumbnail.src}
          alt=""
          width={239}
          height={134}
          loading="lazy"
        />
      )}
    </HStack>
  );
}
