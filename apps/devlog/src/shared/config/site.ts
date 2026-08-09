/**
 * 사이트 전역에서 쓰는 상수.
 *
 * 네비와 푸터가 같은 목록을 봐야 두 곳이 어긋나지 않는다. 링크를 추가할 곳도 여기 하나다.
 *
 * 메일 주소는 아직 없다. 개인 주소를 모든 페이지에 mailto로 거는 것과 커밋 이력에
 * 남아 있는 것은 성격이 다르다 — 도메인이 정해지면 별칭 주소를 여기 넣는다.
 */

export const SITE = {
  name: 'devlog',
  tagline: '만들고 기록하는 사람의 작업실',
  githubUrl: 'https://github.com/AudeModo/audemodo-apps',
  /**
   * 절대 URL의 기준.
   *
   * 피드의 링크는 상대 경로로 둘 수 없다 — 구독자의 리더는 이 글이 어느 사이트의
   * 것인지 모른다. 도메인이 정해지기 전까지는 배포 환경에서 넣는다.
   */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  feedPath: '/feed.xml',
} as const;

/** 네비의 링크. 순서가 화면의 순서다. */
export const NAV_LINKS = [
  { href: '/posts', label: '글' },
  { href: '/projects', label: '프로젝트' },
  { href: '/about', label: '소개' },
  { href: '/dashboard', label: '대시보드' },
] as const;
