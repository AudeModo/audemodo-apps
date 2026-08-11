import type { PostDetail, PostSummary } from '../model/types';

import { parsePost } from '../lib/parse-post';
import { parsePostFrontmatter } from '../lib/parse-post-frontmatter';
import { readPostSlugs, readPostSource } from '../lib/read-post';
import { sortPosts } from '../lib/sort-posts';

/** 오류에 적히는 자리. 어느 파일인지 없으면 글이 늘수록 찾기 어려워진다 */
const whereOf = (slug: string): string => `content/posts/${slug}.mdx`;

/** 지정된 식별자(slug)에 해당하는 게시글의 본문과 메타데이터를 반환한다. */
export const getPostDetail = async (slug: string): Promise<PostDetail> => {
  const raw = await readPostSource(slug);
  const { frontmatter, content } = parsePost(raw);

  return { slug, ...parsePostFrontmatter(frontmatter, whereOf(slug)), content };
};

/**
 * 모든 글을 읽는다. 초안도 들어 있다.
 *
 * 밖으로 내보내지 않는다 — 부르는 쪽이 초안을 걸러야 한다는 것을 기억해야 하는 구조는
 * 언젠가 한 곳을 빠뜨린다. 기본값이 안전한 쪽이어야 한다.
 */
const readAll = async (): Promise<PostSummary[]> => {
  const slugs = await readPostSlugs();

  const postSummaries = await Promise.all(
    slugs.map(async (slug) => {
      const raw = await readPostSource(slug);
      const { frontmatter } = parsePost(raw);

      return { slug, ...parsePostFrontmatter(frontmatter, whereOf(slug)) };
    }),
  );

  return sortPosts(postSummaries);
};

/**
 * 공개된 글만. **최신순.**
 *
 * 목록도 캐러셀도 세는 곳도 RSS도 전부 이것을 부른다. 한 곳이라도 초안을 세면
 * 화면끼리 어긋난다 — 홈이 「두 편」이라 하고 목록에 한 편만 놓이는 식이다.
 */
export const getPostSummaries = async (): Promise<PostSummary[]> =>
  (await readAll()).filter((post) => post.draft !== true);

/** 초안만. 대시보드의 「초안 · 글감」이 부른다 */
export const getDraftSummaries = async (): Promise<PostSummary[]> =>
  (await readAll()).filter((post) => post.draft === true);

/** 모든 게시글의 식별자(slug) 목록을 반환한다. */
export const getPostSlugs = async (): Promise<string[]> => {
  return readPostSlugs();
};
