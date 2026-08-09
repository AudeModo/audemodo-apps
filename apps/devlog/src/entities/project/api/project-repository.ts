import type { ProjectFrontmatter, ProjectSummary } from '../model/types';

import { readdir, readFile } from 'fs/promises';
import { getFrontmatter } from 'next-mdx-remote-client/utils';
import path from 'path';

import { PROJECTS_DIR } from '@/shared/config';

/**
 * 모든 프로젝트를 **중요도 순으로** 반환한다.
 *
 * 카드는 중요도 순, 타임라인은 시작 순이다. 같은 여섯을 다른 축으로 보면 무엇이
 * 겹쳤고 무엇이 이어졌는지가 드러난다 — 그래서 정렬을 하나로 고정하지 않는다.
 */
export const getProjectSummaries = async (): Promise<ProjectSummary[]> => {
  const files = await readdir(PROJECTS_DIR);
  const slugs = files
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => file.replace(/\.mdx$/, ''));

  const projects = await Promise.all(
    slugs.map(async (slug) => {
      const raw = await readFile(path.join(PROJECTS_DIR, `${slug}.mdx`), 'utf-8');
      const { frontmatter } = getFrontmatter<ProjectFrontmatter & Record<string, unknown>>(raw);

      return { slug, ...frontmatter };
    }),
  );

  // 중요도가 같으면 이름순으로 고정한다. 파일 읽는 순서에 화면이 흔들리지 않게 한다
  return projects.sort((a, b) =>
    a.importance === b.importance ? a.name.localeCompare(b.name) : a.importance - b.importance,
  );
};
