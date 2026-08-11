import type { KIND_VALUES, TRACK_VALUES } from '@/shared/config';
import type { ReviewCycle } from '@/shared/lib';

/** 글의 성격. 목록에서 색으로 인코딩되는 유일한 축이다. */
export type PostKind = (typeof KIND_VALUES)[number];

/** 글이 다루는 직무 */
export type PostTrack = (typeof TRACK_VALUES)[number];

/** 목록 행에 놓이는 썸네일. 레이아웃이 튀지 않도록 원본 크기를 함께 받는다. */
export interface PostThumbnail {
  src: string;
  width: number;
  height: number;
}

/** 게시글 .mdx 파일의 frontmatter */
export interface PostFrontmatter {
  /** 제목 */
  title: string;
  /** 요약 */
  summary: string;
  /** 생성일 (ISO 8601) */
  createdAt: string;
  /** 수정일 (ISO 8601) */
  updatedAt?: string;
  /** 성격 */
  kind: PostKind;
  /** 어느 프로젝트에서 나온 글인가 */
  project: string;
  /** 직무 */
  track: PostTrack;
  /** 기술 스택 */
  stack: string[];
  /** 주제 태그 */
  tag: string[];
  /** 없으면 목록에서 자리 자체가 사라진다. 폴백 이미지를 만들지 않는다. */
  thumbnail?: PostThumbnail;
  /** 묶어 읽히는 연작의 이름 */
  series?: string;
  /** 연작 안의 순서. 1부터 */
  seriesOrder?: number;
  /** 다시 볼 주기. 없으면 갱신 대상이 아니다 */
  needsUpdate?: ReviewCycle;
  /** 마지막으로 검토한 시각 (ISO 8601). 여기에 주기를 더해 기한을 낸다 */
  lastReviewed?: string;
  /**
   * 아직 쓰는 중인가.
   *
   * 「빠진다」가 아니라 **「누가 보는가」**다. 화면마다 뜻이 다르다:
   *
   *   목록 · 캐러셀 · 세는 곳 · RSS   안 나온다
   *   URL 직접                        보인다
   *   대시보드 「초안 · 글감」         나온다
   *
   * 빌드에서 통째로 빼지 않는 이유는 실용이다 — 코드블록이 어떻게 나오는지 목차가
   * 맞는지는 배포된 환경에서 봐야 알고, dev에서만 보이면 그것을 못 본다.
   */
  draft?: boolean;
}

/** 게시글 요약 ─ frontmatter에 slug를 더한 것. */
export interface PostSummary extends PostFrontmatter {
  /** 파일명 기반 고유 식별자 */
  slug: string;
}

/** 게시글 상세 ─ 게시글 요약 정보에 본문을 더한 것. */
export interface PostDetail extends PostSummary {
  /** 본문 (frontmatter를 제거한 MDX 원문) */
  content: string;
}
