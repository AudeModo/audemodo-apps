import type { ReactElement } from 'react';

import { HStack, VStack } from '@audemodo/design-system';

import { Skeleton } from '@/shared/ui';

import styles from './post-row-skeleton.module.css';

/**
 * 목록 행이 도착하기 전의 자리.
 *
 * 행과 같은 파일 옆에 두는 이유: 행의 타이포가 바뀌면 이 자리의 높이도 함께
 * 바뀌어야 하는데, 멀리 떨어져 있으면 한쪽만 고쳐진다.
 */
export const PostRowSkeleton = (): ReactElement => {
  return (
    <HStack gap={5} vAlign="center">
      <VStack gap={2} style={{ flex: '1 1 0', minWidth: 0 }}>
        {/* 분류 라벨 · 날짜 */}
        <HStack gap={2} vAlign="center">
          <Skeleton height={18} width={44} />
          <Skeleton height={18} width={64} />
        </HStack>

        {/* 제목 두 줄 */}
        <VStack gap={2}>
          <Skeleton height={28} width="92%" />
          <Skeleton height={28} width="64%" />
        </VStack>

        {/* 요약 두 줄 */}
        <VStack gap={1}>
          <Skeleton height={20} />
          <Skeleton height={20} width="78%" />
        </VStack>
      </VStack>

      <span className={styles.thumbnail}>
        <Skeleton height={134} radius="element" width={239} />
      </span>
    </HStack>
  );
};
