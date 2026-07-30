import { readdir, readFile } from 'fs/promises';
import path from 'path';

import { POSTS_DIR } from '@/shared/config';

/** 지정된 식별자(slug)에 해당하는 .mdx 파일의 원문을 반환한다. */
export const readPostSource = (slug: string): Promise<string> => {
  return readFile(path.join(POSTS_DIR, `${slug}.mdx`), 'utf-8');
};

/** 게시글 디렉터리의 모든 .mdx 파일명을 slug 목록으로 반환한다. */
export const readPostSlugs = async (): Promise<string[]> => {
  const files = await readdir(POSTS_DIR);

  return files.filter((file) => file.endsWith('.mdx')).map((file) => file.replace(/\.mdx$/, ''));
};
