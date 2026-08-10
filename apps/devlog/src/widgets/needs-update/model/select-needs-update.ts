import type { PostSummary } from '@/entities/post';

import type { ReviewStatus } from '@/shared/lib';
import { reviewStatus } from '@/shared/lib';

export interface NeedsUpdateRow {
  post: PostSummary;
  status: ReviewStatus;
}

/**
 * 갱신 대상 글을 급한 순으로.
 *
 * 목록과 머리의 개수가 같은 계산에서 나와야 한다. 따로 세면 주기를 적어뒀지만
 * 날짜가 어긋난 글에서 「2편」 밑에 한 줄만 놓이는 일이 생긴다.
 */
export const selectNeedsUpdate = (posts: PostSummary[], today: string): NeedsUpdateRow[] =>
  posts
    .flatMap((post) => {
      if (post.needsUpdate === undefined || post.lastReviewed === undefined) {
        return [];
      }

      const status = reviewStatus(post.lastReviewed, post.needsUpdate, today);

      return status === null ? [] : [{ post, status }];
    })
    .sort((a, b) => a.status.remainingDays - b.status.remainingDays);
