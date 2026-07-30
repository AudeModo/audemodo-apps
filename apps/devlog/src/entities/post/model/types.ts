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
