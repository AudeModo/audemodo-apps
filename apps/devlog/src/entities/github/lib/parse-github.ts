import type { CommitDays, GithubSnapshot, OpenItem, RecentCommit } from '../model/types';

import { asRecord, count, fail, instant, oneOf, recordList, text } from '@/shared/lib';

/**
 * 스냅샷을 따진다.
 *
 * 기계가 받아둔 값이라도 파일은 손으로 고칠 수 있고, 스크립트가 바뀌면 모양도 바뀐다.
 * 대시보드 JSON에 붙인 것과 같은 이유로 읽는 자리에서 던진다.
 */

const DAY = /^\d{4}-\d{2}-\d{2}$/;

const commitDaysOf = (record: Record<string, unknown>, where: string): CommitDays => {
  const value = asRecord(record.commitDays, `${where} commitDays`);
  const days: Record<string, number> = {};

  for (const [day, amount] of Object.entries(value)) {
    if (!DAY.test(day)) {
      fail(`${where} commitDays`, `날짜가 YYYY-MM-DD가 아니다 — ${day}`);
    }

    if (typeof amount !== 'number' || !Number.isInteger(amount) || amount < 1) {
      fail(`${where} commitDays`, `${day}: 1 이상 정수여야 한다`);
    }

    days[day] = amount as number;
  }

  return days;
};

export const parseGithubSnapshot = (value: unknown, where: string): GithubSnapshot => {
  const record = asRecord(value, where);

  const recentCommits: RecentCommit[] = recordList(record, 'recentCommits', where).map(
    ({ value: item, where: at }) => ({
      sha: text(item, 'sha', at),
      message: text(item, 'message', at),
      committedAt: instant(item, 'committedAt', at),
    }),
  );

  const openItems: OpenItem[] = recordList(record, 'openItems', where).map(
    ({ value: item, where: at }) => ({
      number: count(item, 'number', at),
      title: text(item, 'title', at),
      kind: oneOf(item, 'kind', at, ['pr', 'issue'] as const),
      createdAt: instant(item, 'createdAt', at),
    }),
  );

  return {
    fetchedAt: instant(record, 'fetchedAt', where),
    repo: text(record, 'repo', where),
    commitDays: commitDaysOf(record, where),
    recentCommits,
    openItems,
  };
};
