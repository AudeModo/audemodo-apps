import type { KIND_VALUES, TRACK_VALUES } from '@/shared/config';

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
