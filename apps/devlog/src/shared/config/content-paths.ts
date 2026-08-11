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
