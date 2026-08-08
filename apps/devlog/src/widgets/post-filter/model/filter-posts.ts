import type { PostSummary } from '@/entities/post';

import type { AxisSelection } from '@/shared/config';
import { AXIS_KEYS } from '@/shared/config';
import { filterBySelection } from '@/shared/lib';

/**
 * 선택을 모두 만족하는 글만 남긴다.
 *
 * 서버와 브라우저가 같이 쓴다. 무엇이 남는가를 두 곳에서 따로 정의하면 언젠가 갈라진다.
 */
export const filterPosts = (posts: PostSummary[], selection: AxisSelection): PostSummary[] =>
  filterBySelection(posts, AXIS_KEYS, selection);
