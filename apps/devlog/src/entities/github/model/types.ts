/**
 * GitHub에서 받아둔 것.
 *
 * ── 스냅샷이 정상 경로다
 *
 * 비인증 호출은 IP당 시간당 60회인데, CI와 배포 빌더는 공유 IP라 그 몫이 이미 비어
 * 있는 경우가 흔하다. 그래서 빌드 타임 fetch는 **되면 좋은 갱신**이고, 화면을
 * 책임지는 것은 저장소에 커밋된 스냅샷이다.
 *
 * ── 언제 것인지를 값이 들고 다닌다
 *
 * 낡은 값은 지어낸 값이 아니다. 다만 낡음을 감추면 지어낸 것과 같아지므로
 * `fetchedAt`이 값에 붙어 다니고 화면이 그것을 적는다.
 */

/** 하루치 커밋 수. 0인 날은 아예 없다 — 적어두면 84줄이 매번 커밋에 들어온다 */
export type CommitDays = Readonly<Record<string, number>>;

export interface RecentCommit {
  /** 짧은 sha */
  sha: string;
  /** 첫 줄만 */
  message: string;
  /** ISO 8601 */
  committedAt: string;
}

/**
 * 열린 PR과 이슈.
 *
 * REST의 `/issues`는 PR도 함께 주고 `pull_request` 필드 유무로만 갈린다.
 * 그 판정을 여기서 끝내 적어둔다 — 화면이 매번 판정하면 API의 모양이 화면까지 샌다.
 */
export interface OpenItem {
  number: number;
  title: string;
  kind: 'pr' | 'issue';
  /** ISO 8601 */
  createdAt: string;
}

export interface GithubSnapshot {
  /**
   * 이 값을 받아온 시각. ISO 8601.
   *
   * 경과일을 이 시각 기준으로 잰다 — 빌드 시각으로 재면 사흘 지난 목록에 오늘까지의
   * 날수가 붙어 두 시계가 섞인다. 이미 닫힌 PR이 「26일 지남」으로 나온다.
   */
  fetchedAt: string;
  /** `owner/name`. 어느 저장소를 센 것인지 화면이 이 값을 적는다 */
  repo: string;
  commitDays: CommitDays;
  recentCommits: RecentCommit[];
  openItems: OpenItem[];
}
