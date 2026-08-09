/**
 * 사이트 전역에서 쓰는 상수.
 *
 * 네비와 푸터가 같은 목록을 봐야 두 곳이 어긋나지 않는다. 링크를 추가할 곳도 여기 하나다.
 */

export const SITE = {
  name: 'devlog',
  tagline: '만들고 기록하는 사람의 작업실',
  githubUrl: 'https://github.com/AudeModo/audemodo-apps',
  email: 'cerezo00@naver.com',
  /** 글 구독 — 피드를 아직 만들지 않았다 */
  feedPath: '/rss.xml',
} as const;

/** 네비의 링크. 순서가 화면의 순서다. */
export const NAV_LINKS = [
  { href: '/posts', label: '글' },
  { href: '/projects', label: '프로젝트' },
  { href: '/about', label: '소개' },
  { href: '/dashboard', label: '대시보드' },
] as const;
