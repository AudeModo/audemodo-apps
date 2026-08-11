/*
 * GitHub 데이터의 서버 전용 공개 API.
 *
 * 망과 파일시스템을 쓰므로 서버 컴포넌트와 갱신 스크립트에서만 부른다.
 */

export { fetchGithubSnapshot, getGithubSnapshot } from './api/github-repository';
