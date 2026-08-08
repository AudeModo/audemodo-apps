/*
 * 글 엔티티의 서버 전용 공개 API.
 *
 * 파일시스템을 읽으므로 서버 컴포넌트에서만 부른다. 공개 API를 둘로 가르는 이유는
 * 경계가 레이어가 아니라 실행 환경이기 때문이다 — 같은 엔티티라도 브라우저로 갈 수 있는
 * 것과 없는 것이 있고, 그 구분은 타입으로 표현되지 않아 배럴로 표현한다.
 */

export { getPostDetail, getPostSlugs, getPostSummaries } from './api/post-repository';
