import type { PostFrontmatter } from '../model/types';

import { getFrontmatter } from 'next-mdx-remote-client/utils';

/** MDX 원문을 frontmatter와 본문으로 분리한 결과 */
export interface ParsedPost {
  frontmatter: PostFrontmatter;
  content: string;
}

/** MDX 원문에서 frontmatter와 본문을 분리한다. */
export const parsePost = (raw: string): ParsedPost => {
  const { frontmatter, strippedSource } = getFrontmatter<PostFrontmatter & Record<string, unknown>>(
    raw,
  );

  return { frontmatter, content: strippedSource };
};
