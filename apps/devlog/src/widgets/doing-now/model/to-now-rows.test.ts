import { describe, expect, it } from 'vitest';

import type { ProjectSummary } from '@/entities/project';

import { barStyleOf, toNowRows } from './to-now-rows';

const project = (over: Partial<ProjectSummary>): ProjectSummary => ({
  slug: 'devlog',
  name: 'devlog',
  description: '',
  status: '진행 중',
  statusTone: 'active',
  stack: [],
  importance: 1,
  startedAt: '2026-07',
  ...over,
});

const noSeries = (): number => 0;

describe('toNowRows — 진행 수치의 출처가 종류마다 다르다', () => {
  it('프로젝트는 이름을 마일스톤에서 가져오지 않고 프로젝트에서 가져온다', () => {
    const rows = toNowRows([{ kind: 'project', slug: 'devlog' }], [project({})], noSeries);

    expect(rows[0]).toEqual({
      key: 'project:devlog',
      kind: 'project',
      title: 'devlog',
      note: null,
      progress: null,
    });
  });

  it('진행 중인 마일스톤이 있으면 그 단계를 진행으로 쓴다', () => {
    const rows = toNowRows(
      [{ kind: 'project', slug: 'devlog' }],
      [
        project({
          milestones: [
            { title: '끝난 것', state: 'done', at: '2026.07' },
            { title: 'M4 붙이기', state: 'active', steps: { done: 2, total: 5 } },
          ],
        }),
      ],
      noSeries,
    );

    expect(rows[0]?.note).toBe('M4 붙이기');
    expect(rows[0]?.progress).toEqual({ done: 2, total: 5, unit: '단계' });
  });

  it('끝난 마일스톤만 있으면 진행이 없다', () => {
    // 지금 저장소가 이 상태다. 없는 것을 0으로 그리면 「안 했다」로 읽힌다
    const rows = toNowRows(
      [{ kind: 'project', slug: 'devlog' }],
      [project({ milestones: [{ title: '끝난 것', state: 'done', at: '2026.07' }] })],
      noSeries,
    );

    expect(rows[0]?.progress).toBeNull();
  });

  it('없는 프로젝트를 가리키면 던진다', () => {
    expect(() => toNowRows([{ kind: 'project', slug: 'ghost' }], [project({})], noSeries)).toThrow(
      '「ghost」 프로젝트가 없다',
    );
  });

  it('연작은 쓴 편 수를 세어 넣는다', () => {
    const rows = toNowRows([{ kind: 'series', series: 'FSD 실전', total: 6 }], [], () => 2);

    expect(rows[0]?.progress).toEqual({ done: 2, total: 6, unit: '편' });
  });

  it('막대 모양은 개수가 아니라 종류가 정한다', () => {
    // 9단계는 「단계」라서 칸이다. total로 갈랐다면 8을 넘는 순간 연속으로 넘어간다
    expect(barStyleOf('project')).toBe('cells');
    expect(barStyleOf('series')).toBe('cells');
    expect(barStyleOf('learning')).toBe('continuous');
    expect(barStyleOf('reading')).toBe('continuous');
  });

  it('학습과 읽는 중은 적힌 값을 그대로 쓴다', () => {
    const rows = toNowRows(
      [{ kind: 'learning', title: 'Spring', done: 12, total: 34, unit: '장' }],
      [],
      noSeries,
    );

    expect(rows[0]?.progress).toEqual({ done: 12, total: 34, unit: '장' });
  });
});
