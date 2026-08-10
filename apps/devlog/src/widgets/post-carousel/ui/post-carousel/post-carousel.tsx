import type { ReactElement } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import type { PostSummary } from '@/entities/post';
import { formatPostDate, KindLabel } from '@/entities/post';

import styles from './post-carousel.module.css';

interface PostCarouselProps {
  posts: PostSummary[];
}

/**
 * 최신 글을 옆으로 넘겨 본다.
 *
 * 좁은 화면에서도 그대로 둔다 — 스와이프가 이 형태의 원래 동작이라 세로로 바꾸면
 * 아래 섹션들과 형태가 겹친다.
 */
export const PostCarousel = ({ posts }: PostCarouselProps): ReactElement => {
  return (
    <div className={styles.track}>
      {posts.map((post) => (
        <Link className={styles.card} href={`/posts/${post.slug}`} key={post.slug}>
          {post.thumbnail !== undefined && (
            <Image
              alt=""
              className={styles.thumb}
              height={post.thumbnail.height}
              src={post.thumbnail.src}
              width={post.thumbnail.width}
            />
          )}

          <div className={styles.meta}>
            <KindLabel kind={post.kind} />
            <time className={styles.date} dateTime={post.createdAt}>
              {formatPostDate(post.createdAt)}
            </time>
          </div>

          <div className={styles.title}>{post.title}</div>
        </Link>
      ))}
    </div>
  );
};
