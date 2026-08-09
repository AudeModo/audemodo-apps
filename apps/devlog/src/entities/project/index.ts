/*
 * 파일을 읽는 코드는 여기 없다. 서버에서만 도는 것은 ./server 에 있다 —
 * 표현 하나를 가져다 쓰는 클라이언트 컴포넌트가 파일시스템 모듈까지 끌고 오면
 * 브라우저 번들에서 터진다.
 */

export type { ProjectStatusTone, ProjectSummary } from './model/types';

export { ProjectCard } from './ui/project-card/project-card';
