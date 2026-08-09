/*
 * 프로젝트 엔티티의 서버 전용 공개 API.
 *
 * 파일시스템을 읽으므로 서버 컴포넌트에서만 부른다. 공개 API를 둘로 가르는 기준은
 * 레이어가 아니라 실행 환경이다.
 */

export { getProjectSummaries } from './api/project-repository';
