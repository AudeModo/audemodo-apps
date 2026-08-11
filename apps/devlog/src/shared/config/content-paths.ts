import path from 'path';

/** 게시글 .mdx 파일이 위치한 디렉터리 경로 */
export const POSTS_DIR = path.join(process.cwd(), 'content', 'posts');

/** 프로젝트 .mdx 파일이 위치한 디렉터리 경로 */
export const PROJECTS_DIR = path.join(process.cwd(), 'content', 'projects');

/**
 * 대시보드 정적 JSON이 위치한 디렉터리 경로.
 *
 * 파일이 다섯인 이유는 바뀌는 주기가 달라서다 — 자세한 것은 `entities/dashboard`에.
 */
export const DASHBOARD_DIR = path.join(process.cwd(), 'content', 'dashboard');

/**
 * 기계가 받아둔 것.
 *
 * `dashboard`와 층은 같지만 성격이 다르다 — 저쪽은 사람이 선언한 것이고 이쪽은
 * 스크립트가 받아 커밋해둔 것이다. 섞으면 무엇을 손으로 고쳐도 되는지 흐려진다.
 */
export const SNAPSHOT_DIR = path.join(process.cwd(), 'content', 'snapshot');
