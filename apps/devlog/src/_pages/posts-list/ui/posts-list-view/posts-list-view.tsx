'use client';

import type { ReactElement } from 'react';

import { HStack, VStack } from '@audemodo/design-system';

import { ActiveFilterStrip, AxisFilters, usePostFilters } from '@/widgets/post-filter';

import type { PostSummary } from '@/entities/post';

import { ActionButton, EmptyState } from '@/shared/ui';

import { PostColumn } from '../post-column/post-column';

interface PostsListViewProps {
  /** 빌드 시점에 읽어 넘어온 전체 글 */
  posts: PostSummary[];
}

/** 좁히고 · 보여주는 부분. 화면에 적히는 수는 전부 계산해서 올라온 값이다. */
export const PostsListView = ({ posts }: PostsListViewProps): ReactElement => {
  const {
    results,
    shown,
    hasMore,
    remaining,
    showMore,
    axes,
    chips,
    culprit,
    culpritValues,
    toggleValue,
    clearAxis,
    clearAll,
  } = usePostFilters(posts);

  return (
    <VStack gap={6}>
      <AxisFilters
        axes={axes}
        onClearAll={clearAll}
        onClearAxis={clearAxis}
        onToggleValue={toggleValue}
        resultCount={results.length}
      />

      <ActiveFilterStrip
        chips={chips}
        culprit={culprit}
        onClearAll={clearAll}
        onRemoveChip={toggleValue}
        resultCount={results.length}
      />

      {results.length === 0 ? (
        <EmptyState
          description={`${chips.map((chip) => chip.value).join(' · ')} 를 모두 만족하는 글이 없어.`}
          primaryAction={
            culprit === null
              ? { label: '필터 해제', onClick: clearAll }
              : {
                  label: `${culpritValues.join(' · ')}만 빼기`,
                  onClick: () => {
                    clearAxis(culprit);
                  },
                }
          }
          secondaryAction={culprit === null ? null : { label: '필터 해제', onClick: clearAll }}
          title="이 조합으로는 아직 쓴 글이 없다."
        />
      ) : (
        <>
          <PostColumn posts={shown} />

          {hasMore && (
            <HStack justify="center">
              <ActionButton onClick={showMore} variant="outline">
                더 보기 · {remaining}편 남음
              </ActionButton>
            </HStack>
          )}
        </>
      )}
    </VStack>
  );
};
