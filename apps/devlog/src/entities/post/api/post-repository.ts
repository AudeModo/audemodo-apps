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

/** 모든 게시글의 식별자(slug)와 메타데이터 배열을 **최신순으로** 반환한다. */
export const getPostSummaries = async (): Promise<PostSummary[]> => {
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

/** 모든 게시글의 식별자(slug) 목록을 반환한다. */
export const getPostSlugs = async (): Promise<string[]> => {
  return readPostSlugs();
};
