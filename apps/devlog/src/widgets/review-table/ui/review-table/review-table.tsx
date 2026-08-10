import type { ReactElement } from 'react';

import { IconCircleCheck, IconCircleX } from '@tabler/icons-react';
import Link from 'next/link';

import type { PostSummary } from '@/entities/post';

import styles from './review-table.module.css';

/** 표의 네 칸. 순서가 곧 화면의 열 순서다 */
const FIELDS = ['요약', '분류', '태그', '썸네일'] as const;

type FieldState = 'filled' | 'missing';

interface ReviewTableProps {
  posts: PostSummary[];
}

/**
 * 글마다 네 칸이 채워졌는가.
 *
 * 프론트매터에서 직접 본다 — 손으로 적은 목록은 글이 늘면 먼저 낡는다.
 */
const stateOf = (post: PostSummary): FieldState[] => [
  post.summary.trim() === '' ? 'missing' : 'filled',
  'filled', // kind는 필수 필드라 없을 수 없다
  post.tag.length === 0 ? 'missing' : 'filled',
  post.thumbnail === undefined ? 'missing' : 'filled',
];

const Mark = ({ state }: { state: FieldState }): ReactElement =>
  state === 'filled' ? (
    <IconCircleCheck aria-hidden size={16} />
  ) : (
    <IconCircleX aria-hidden size={16} />
  );

/**
 * 손봐야 할 글.
 *
 * 조작 요소가 없다. 데이터가 빌드 시점에 굳어 눌러도 아무 일이 일어나지 않으므로,
 * 누를 수 있게 생긴 것을 두면 고장난 것으로 읽힌다. 상태는 글리프로만 말한다.
 */
export const ReviewTable = ({ posts }: ReviewTableProps): ReactElement => {
  return (
    <>
      <div className={styles.table}>
        <div className={`${styles.row} ${styles.head}`}>
          <span className={`${styles.headCell} ${styles.headTitle}`}>글</span>
          {FIELDS.map((field) => (
            <span className={styles.headCell} key={field}>
              {field}
            </span>
          ))}
        </div>

        {posts.map((post) => (
          <div className={styles.row} key={post.slug}>
            <Link className={styles.title} href={`/posts/${post.slug}`}>
              {post.title}
            </Link>

            {stateOf(post).map((state, index) => (
              <span
                className={styles.mark}
                data-state={state}
                key={FIELDS[index]}
                title={`${FIELDS[index] ?? ''} ${state === 'filled' ? '채워짐' : '빠짐'}`}
              >
                <Mark state={state} />
              </span>
            ))}
          </div>
        ))}

        <div className={styles.legend}>
          <span className={styles.legendItem}>
            <span className={styles.mark} data-state="filled">
              <Mark state="filled" />
            </span>
            채워짐
          </span>

          <span className={styles.legendItem}>
            <span className={styles.mark} data-state="missing">
              <Mark state="missing" />
            </span>
            빠짐
          </span>
        </div>
      </div>

      {/* 좁은 화면 — 표가 안 들어가므로 글마다 라벨 붙은 배지를 나열한다 */}
      <div className={styles.cards}>
        {posts.map((post) => (
          <div className={styles.card} key={post.slug}>
            <Link className={styles.title} href={`/posts/${post.slug}`}>
              {post.title}
            </Link>

            <div className={styles.badges}>
              {stateOf(post).map((state, index) => (
                <span className={styles.badge} data-state={state} key={FIELDS[index]}>
                  <Mark state={state} />
                  {FIELDS[index]}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
