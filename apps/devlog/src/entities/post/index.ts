/*
 * 글 엔티티의 공개 API — 어디서나 쓸 수 있는 것만 둔다.
 *
 * 파일을 읽는 코드는 여기 없다. 이 배럴에 섞으면 표현 하나를 가져다 쓰는 클라이언트
 * 컴포넌트가 파일시스템 모듈까지 함께 끌고 와 브라우저 번들에서 터진다.
 * 서버에서만 도는 것은 ./server 에 있다.
 */

export { findAdjacentPosts } from './lib/find-adjacent-posts';

export { formatPostDate } from './lib/format-post-date';

export type { PostDetail, PostSummary } from './model/types';

export { PostRow } from './ui/post-row/post-row';
