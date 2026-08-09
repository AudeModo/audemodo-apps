import type { ReactElement } from 'react';

import { VStack } from '@audemodo/design-system';

import { PostRowSkeleton } from '@/entities/post';

import { AXIS_KEYS, AXIS_VALUES } from '@/shared/config';
import { Skeleton } from '@/shared/ui';

import styles from './posts-list-skeleton.module.css';

/** 첫 화면에 채워질 편수. 목록의 초기 노출 편수와 같다 */
const PAGE = 10;

/**
 * 어휘가 있는 축만 버튼이 된다 — 자리도 같은 수만 잡아야 한다.
 * 어휘를 채우거나 비우면 이 수가 따라 움직인다.
 */
const axisCount = AXIS_KEYS.filter((key) => AXIS_VALUES[key].length > 0).length;

interface PostsListSkeletonProps {
  /** 실제로 그려질 행 수. 글이 적으면 자리도 적게 잡는다 */
  rowCount: number;
}

/**
 * 좁히는 부분이 도착하기 전의 자리.
 *
 * 제목과 총편수는 이 경계 바깥에서 이미 그려져 있으므로 여기 없다.
 */
export const PostsListSkeleton = ({ rowCount }: PostsListSkeletonProps): ReactElement => {
  const rows = Math.min(rowCount, PAGE);

  return (
    <VStack gap={6}>
      <div className={styles.axes}>
        {Array.from({ length: axisCount }, (_, index) => (
          <Skeleton height={35} key={index} radius="element" width={78} />
        ))}
      </div>

      <div className={styles.strip}>
        <Skeleton height={16} width={104} />

        <span className={styles.stripResult}>
          <Skeleton height={16} width={88} />
        </span>
      </div>

      <div className={styles.list}>
        {Array.from({ length: rows }, (_, index) => (
          <PostRowSkeleton key={index} />
        ))}
      </div>
    </VStack>
  );
};
