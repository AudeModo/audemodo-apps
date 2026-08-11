/**
 * 상태 점의 색을 정하는 값.
 *
 * 화면에 적히는 말(`status`)과 따로 두는 이유: 「공개 · v1.2.0」처럼 말은 프로젝트마다
 * 다르지만 색은 몇 갈래뿐이다. 말에서 색을 유추하면 표기가 바뀔 때 색이 조용히 어긋난다.
 */
export const PROJECT_STATUS_TONES = ['active', 'released', 'paused'] as const;

export type ProjectStatusTone = (typeof PROJECT_STATUS_TONES)[number];

/** 마일스톤의 상태 */
export const MILESTONE_STATES = ['done', 'active', 'planned'] as const;

/** 프로젝트 .mdx 파일의 frontmatter */
export interface ProjectFrontmatter {
  /** 화면의 주인공. 로고도 이니셜 마크도 만들지 않는다 */
  name: string;
  /** 카드 설명 한 줄 */
  description: string;
  /** 화면에 적는 상태 문구 */
  status: string;
  /** 상태 점의 색 */
  statusTone: ProjectStatusTone;
  stack: string[];
  /** 카드 정렬 기준. 손으로 정한다 — 계산으로 나오지 않는 값이다 */
  importance: number;
  /** `YYYY-MM` */
  startedAt: string;
  /** `YYYY-MM`. 없으면 진행 중이고 타임라인에서 오른쪽 끝이 열린다 */
  endedAt?: string;
  repoUrl?: string;
  deployUrl?: string;
  /** 「배포」 · 「npm」처럼 어디로 가는지 */
  deployLabel?: string;

  /* ── 상세 화면만 쓰는 것들. 없으면 그 구간을 통째로 생략한다 ── */

  /** 히어로의 긴 요약. 카드의 한 줄(`description`)과 다른 글이다 */
  summary?: string;
  /** 「푼 문제」 문단들 */
  problem?: string[];
  /** 손으로 적는 지표. 글 수와 개월째는 계산해서 앞에 붙는다 */
  metrics?: ProjectMetric[];
  architecture?: ProjectArchitecture;
  decisions?: ProjectDecision[];
  milestones?: ProjectMilestone[];
}

export interface ProjectMetric {
  value: string;
  label: string;
  /** 좁은 칸에 두 정보를 넣지 않는다 — 있으면 좁은 화면에서 이 라벨을 쓴다 */
  shortLabel?: string;
}

/**
 * 의존 방향 도형.
 *
 * 벤더 이름은 여기 적지 않는다 — 래퍼가 내보내는 상수를 화면이 읽는다.
 * 앱에서 벤더로 가는 화살표가 **없다**는 것이 이 도형의 내용이다.
 */
export interface ProjectArchitecture {
  /** 래퍼를 쓰는 쪽. 여럿일 수 있다 */
  consumers: string[];
  /** 경계가 되는 패키지 */
  wrapper: string;
  /** 래퍼 아래 초록 배지 */
  badge: string;
  /** 도형 아래 한 줄 */
  note: string;
}

export interface ProjectDecision {
  /** 무엇을 했나 */
  decision: string;
  /** 왜 그랬나 */
  reason: string;
  /** 어떻게 확인했나 — 초록 배지에 들어가는 말 */
  verification: string;
  /** 배지 아래 한 줄 */
  verificationNote: string;
}

export interface ProjectMilestone {
  title: string;
  state: (typeof MILESTONE_STATES)[number];
  /** `YYYY.MM`. 끝난 것에만 적는다 */
  at?: string;
  /** 진행 중인 것의 안쪽 단계. 전체 진행과 지금 단계를 함께 본다 */
  steps?: { done: number; total: number };
}

/** 프로젝트 요약 ─ frontmatter에 slug를 더한 것 */
export interface ProjectSummary extends ProjectFrontmatter {
  /** 파일명 기반 고유 식별자 */
  slug: string;
}
