import { describe, expect, it } from 'vitest';

import { parseProjectFrontmatter } from './parse-project-frontmatter';

const WHERE = 'content/projects/x.mdx';

const base = {
  name: 'devlog',
  description: '설명',
  status: '진행 중',
  statusTone: 'active',
  stack: ['TypeScript'],
  importance: 1,
  startedAt: '2026-07',
};

const parse = (over: Record<string, unknown> = {}): ReturnType<typeof parseProjectFrontmatter> =>
  parseProjectFrontmatter({ ...base, ...over }, WHERE);

describe('parseProjectFrontmatter — 모양', () => {
  it('있어야 하는 것만 있으면 그대로 나온다', () => {
    expect(parse()).toStrictEqual(base);
  });

  it('statusTone이 어휘에 없으면 던진다', () => {
    expect(() => parse({ statusTone: '보류' })).toThrow('statusTone:');
  });

  it('startedAt이 YYYY-MM이 아니면 던진다', () => {
    expect(() => parse({ startedAt: '2026-7' })).toThrow('YYYY-MM이어야 한다');
  });

  it('importance가 0이면 던진다', () => {
    expect(() => parse({ importance: 0 })).toThrow('importance는 1부터다');
  });
});

describe('parseProjectFrontmatter — 필드 사이의 약속', () => {
  it('끝난 달이 시작한 달보다 앞이면 던진다', () => {
    // 타임라인이 뒤집힌다
    expect(() => parse({ endedAt: '2026-06' })).toThrow('보다 앞이다');
  });

  it('배포 주소만 적으면 던진다', () => {
    // 라벨이 「어디로 가는지」를 말한다. 주소만 있으면 무엇인지 모르는 단추가 된다
    expect(() => parse({ deployUrl: 'https://example.com' })).toThrow('함께 적거나 함께 뺀다');
  });
});

describe('parseProjectFrontmatter — 마일스톤', () => {
  const withMilestones = (...milestones: unknown[]): ReturnType<typeof parseProjectFrontmatter> =>
    parse({ milestones });

  it('끝난 것에 달을 적는다', () => {
    expect(withMilestones({ title: '골격', state: 'done', at: '2026.07' }).milestones).toEqual([
      { title: '골격', state: 'done', at: '2026.07' },
    ]);
  });

  it('끝났는데 달이 없으면 던진다', () => {
    expect(() => withMilestones({ title: '골격', state: 'done' })).toThrow('done이면 at을 적는다');
  });

  it('계획에 달을 적으면 던진다', () => {
    // 이미 한 것으로 읽힌다
    expect(() => withMilestones({ title: '배포', state: 'planned', at: '2026.09' })).toThrow(
      'at은 done에만 적는다',
    );
  });

  it('달의 표기가 점이 아니면 던진다', () => {
    expect(() => withMilestones({ title: '골격', state: 'done', at: '2026-07' })).toThrow(
      'YYYY.MM이 아니다',
    );
  });

  it('진행 중인 것에만 안쪽 단계를 적는다', () => {
    expect(
      withMilestones({ title: '화면', state: 'active', steps: { done: 4, total: 9 } }).milestones,
    ).toEqual([{ title: '화면', state: 'active', steps: { done: 4, total: 9 } }]);
  });

  it('끝난 것에 단계를 적으면 던진다', () => {
    expect(() =>
      withMilestones({ title: '골격', state: 'done', at: '2026.07', steps: { done: 1, total: 2 } }),
    ).toThrow('steps는 active에만 적는다');
  });

  it('한 단계가 전체보다 크면 던진다', () => {
    // 대시보드의 칸 막대가 칸 밖으로 나간다
    expect(() =>
      withMilestones({ title: '화면', state: 'active', steps: { done: 10, total: 9 } }),
    ).toThrow('done(10)이 total(9)보다 크다');
  });

  it('모르는 상태는 던진다', () => {
    expect(() => withMilestones({ title: '화면', state: 'paused' })).toThrow('state:');
  });
});
