/**
 * 상태 점의 색을 정하는 값.
 *
 * 화면에 적히는 말(`status`)과 따로 두는 이유: 「공개 · v1.2.0」처럼 말은 프로젝트마다
 * 다르지만 색은 몇 갈래뿐이다. 말에서 색을 유추하면 표기가 바뀔 때 색이 조용히 어긋난다.
 */
export type ProjectStatusTone = 'active' | 'released' | 'paused';

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
}

/** 프로젝트 요약 ─ frontmatter에 slug를 더한 것 */
export interface ProjectSummary extends ProjectFrontmatter {
  /** 파일명 기반 고유 식별자 */
  slug: string;
}
