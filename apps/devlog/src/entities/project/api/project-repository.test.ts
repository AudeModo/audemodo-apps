import { describe, expect, it } from 'vitest';

import { AXIS_VALUES } from '@/shared/config';

import { getProjectSummaries } from './project-repository';

/**
 * 프로젝트가 실제 콘텐츠와 축 어휘 사이에서 어긋나지 않는지 본다.
 *
 * 글과 프로젝트가 같은 어휘를 써야 나중에 프로젝트 쪽에 필터를 붙일 때 두 목록이
 * 맞물린다. 지금 갈려 있으면 그때 가서 알게 되고, 그때는 콘텐츠가 늘어나 있다.
 *
 * 기억으로 지키면 언젠가 어긋나므로 검사기에 맡긴다.
 */
describe('프로젝트 콘텐츠와 축 어휘', () => {
  it('프로젝트 이름이 전부 프로젝트 축 어휘에 있다', async () => {
    const projects = await getProjectSummaries();
    const vocabulary = AXIS_VALUES.project;

    expect(projects.length).toBeGreaterThan(0);

    for (const project of projects) {
      expect(vocabulary, `${project.name}이(가) 축 어휘에 없다`).toContain(project.name);
    }
  });

  it('프로젝트 스택이 전부 스택 축 어휘에 있다', async () => {
    const projects = await getProjectSummaries();
    const vocabulary = AXIS_VALUES.stack;

    for (const project of projects) {
      for (const item of project.stack) {
        expect(vocabulary, `${project.name}의 스택 ${item}이(가) 축 어휘에 없다`).toContain(item);
      }
    }
  });

  it('중요도가 겹치지 않는다', async () => {
    // 겹치면 순서가 이름순 폴백으로 갈려 카드 순서가 주장을 잃는다
    const projects = await getProjectSummaries();
    const ranks = projects.map((project) => project.importance);

    expect(new Set(ranks).size).toBe(ranks.length);
  });
});
