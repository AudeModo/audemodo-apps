import type { PostDetail, PostSummary } from '../model/types';

import { parsePost } from '../lib/parse-post';
import { readPostSlugs, readPostSource } from '../lib/read-post';

/** 지정된 식별자(slug)에 해당하는 게시글의 본문과 메타데이터를 반환한다. */
export const getPostDetail = async (slug: string): Promise<PostDetail> => {
  const raw = await readPostSource(slug);
  const { frontmatter, content } = parsePost(raw);

  return { slug, ...frontmatter, content };
};

/** 모든 게시글의 식별자(slug)와 메타데이터 배열을 반환한다. */
export const getPostSummaries = async (): Promise<PostSummary[]> => {
  const slugs = await readPostSlugs();

  return Promise.all(
    slugs.map(async (slug) => {
      const raw = await readPostSource(slug);
      const { frontmatter } = parsePost(raw);

      return { slug, ...frontmatter };
    }),
  );
};

/** 모든 게시글의 식별자(slug) 목록을 반환한다. */
export const getPostSlugs = async (): Promise<string[]> => {
  return readPostSlugs();
};
