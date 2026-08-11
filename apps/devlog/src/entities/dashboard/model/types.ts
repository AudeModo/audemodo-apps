/**
 * 대시보드가 정적 JSON에서 읽는 것들.
 *
 * 파일을 다섯으로 나눈 기준은 **바뀌는 주기**다. `todos`는 날마다 바뀌고 `links`는
 * 거의 안 바뀐다 — 한 파일이면 무엇을 고쳐도 전체가 다시 커밋된다.
 *
 * 글감(`ideas`)과 읽을거리(`reading`)는 지금 필드가 닮았지만 합치지 않는다.
 * 합치면 `kind`가 정하는 것이 항목의 성격이 아니라 **어느 위젯이 그리는가**가 된다 —
 * 오타 하나로 항목이 조용히 다른 위젯으로 넘어간다. 수명도 다르다. 글감은 글이 되면
 * 지워지고 읽을거리는 쌓인다.
 */

/* ── 지금 하는 것 ─────────────────────────────────────
 *
 * 진행 수치를 **어디서 얻는지**가 종류마다 다르다. 이미 다른 곳에 있는 값은 여기 적지
 * 않는다 — 베껴 적으면 두 곳이 어긋날 수 있는 두 번째 진실이 생긴다.
 */

/** 프로젝트. 진행은 그 프로젝트의 `active` 마일스톤과 그 `steps`에서 계산한다 */
export interface NowProject {
  kind: 'project';
  /** `content/projects/<slug>.mdx` */
  slug: string;
}

/**
 * 연작.
 *
 * 쓴 편 수는 그 시리즈 글을 세면 나오지만 **계획한 편 수는 어디에도 없다.**
 * 그래서 `total`만 선언한다. 「마지막 글 이후 N일」도 글에서 계산한다.
 */
export interface NowSeries {
  kind: 'series';
  /** 글 frontmatter의 `series`와 같은 문자열 */
  series: string;
  total: number;
}

/** 학습. 출처가 없어 둘 다 선언한다 */
export interface NowLearning {
  kind: 'learning';
  title: string;
  done: number;
  total: number;
  /** 「장」 · 「강」처럼 무엇을 세는지 */
  unit: string;
}

/** 읽는 중. 읽을거리(`ReadingLink`)와 다르다 — 이쪽은 진행이 있다 */
export interface NowReading {
  kind: 'reading';
  title: string;
  done: number;
  total: number;
  unit: string;
  url?: string;
}

export type NowItem = NowProject | NowSeries | NowLearning | NowReading;

/* ── 나머지 넷 ──────────────────────────────────────── */

/** 할 일. 조작 요소가 없으므로 상태는 이 둘이 전부다 */
export interface TodoItem {
  text: string;
  done: boolean;
}

/** 읽을거리. 남이 쓴 것으로 가는 링크다 */
export interface ReadingLink {
  title: string;
  /** 외부 주소만 받는다 */
  url: string;
  note?: string;
  /** 보통 비운다 — URL 호스트에서 뽑는다. 호스트가 쓸모없을 때만 적는다 */
  source?: string;
}

/** 글감. 아직 글이 아닌 것 */
export interface IdeaItem {
  title: string;
  note?: string;
}

/** 바로가기. `isExternal`을 두지 않는다 — `https?://`인지로 가른다 */
export interface ShortcutLink {
  label: string;
  url: string;
  note?: string;
}
