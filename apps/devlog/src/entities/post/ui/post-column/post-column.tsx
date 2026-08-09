import type { PostSummary } from '../../model/types';
import type { ReactElement } from 'react';

import { PostRow } from '../post-row/post-row';
import styles from './post-column.module.css';

interface PostColumnProps {
  posts: PostSummary[];
}

/**
 * 글 행을 쌓는 칸.
 *
 * 서버가 그리는 첫 목록과 브라우저가 좁힌 뒤의 목록이 같은 컴포넌트를 쓴다.
 * 둘이 각자 여백을 들고 있으면 언젠가 한쪽만 고쳐지고, 그때 화면이 도착하는 순간
 * 목록 전체가 밀린다.
 *
 * 훅을 쓰지 않아 서버에서도 그려진다.
 */
export const PostColumn = ({ posts }: PostColumnProps): ReactElement => {
  return (
    <div className={styles.column}>
      {posts.map((post) => (
        <PostRow key={post.slug} post={post} />
      ))}
    </div>
  );
};
