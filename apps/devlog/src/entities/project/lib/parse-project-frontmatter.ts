import type {
  ProjectArchitecture,
  ProjectDecision,
  ProjectFrontmatter,
  ProjectMetric,
  ProjectMilestone,
} from '../model/types';

import {
  asRecord,
  count,
  fail,
  maybe,
  oneOf,
  optionalRecordList,
  optionalText,
  optionalTextList,
  optionalYearMonth,
  text,
  textList,
  yearMonth,
} from '@/shared/lib';

import { MILESTONE_STATES, PROJECT_STATUS_TONES } from '../model/types';

/**
 * 프로젝트 frontmatter를 따진다.
 *
 * 어휘 정합(이름 · 스택)과 중요도 겹침은 이미 콘텐츠 검사가 본다. 여기서는 모양만 본다 —
 * 두 곳에서 같은 것을 보면 어휘를 늘릴 때 두 곳을 고쳐야 한다.
 */

/** 마일스톤의 `at`은 화면에 그대로 적히는 말이라 점을 쓴다. `startedAt`과 다르다 */
const DOTTED_MONTH = /^\d{4}\.(?:0[1-9]|1[0-2])$/;

const metricsOf = (record: Record<string, unknown>, where: string): ProjectMetric[] | undefined =>
  optionalRecordList(record, 'metrics', where)?.map(({ value, where: at }) => ({
    value: text(value, 'value', at),
    label: text(value, 'label', at),
    ...maybe('shortLabel', optionalText(value, 'shortLabel', at)),
  }));

const decisionsOf = (
  record: Record<string, unknown>,
  where: string,
): ProjectDecision[] | undefined =>
  optionalRecordList(record, 'decisions', where)?.map(({ value, where: at }) => ({
    decision: text(value, 'decision', at),
    reason: text(value, 'reason', at),
    verification: text(value, 'verification', at),
    verificationNote: text(value, 'verificationNote', at),
  }));

const architectureOf = (
  record: Record<string, unknown>,
  where: string,
): ProjectArchitecture | undefined => {
  if (record.architecture === undefined) {
    return undefined;
  }

  const at = `${where} architecture`;
  const shape = asRecord(record.architecture, at);
  const consumers = textList(shape, 'consumers', at);

  // 쓰는 쪽이 없으면 도형이 화살표만 남는다
  if (consumers.length === 0) {
    fail(at, 'consumers가 비어 있다');
  }

  return {
    consumers,
    wrapper: text(shape, 'wrapper', at),
    badge: text(shape, 'badge', at),
    note: text(shape, 'note', at),
  };
};

const milestonesOf = (
  record: Record<string, unknown>,
  where: string,
): ProjectMilestone[] | undefined =>
  optionalRecordList(record, 'milestones', where)?.map(({ value, where: at }) => {
    const state = oneOf(value, 'state', at, MILESTONE_STATES);
    const rawAt = optionalText(value, 'at', at);

    if (rawAt !== undefined && !DOTTED_MONTH.test(rawAt)) {
      fail(at, `at이 YYYY.MM이 아니다: ${rawAt}`);
    }

    // 끝난 것에만 날짜가 붙는다. 계획에 날짜가 붙으면 이미 한 것으로 읽힌다
    if (state !== 'done' && rawAt !== undefined) {
      fail(at, `at은 done에만 적는다. 지금 state는 ${state}다`);
    }

    if (state === 'done' && rawAt === undefined) {
      fail(at, 'done이면 at을 적는다');
    }

    const steps = value.steps === undefined ? undefined : asRecord(value.steps, `${at} steps`);

    if (steps === undefined) {
      return { title: text(value, 'title', at), state, ...maybe('at', rawAt) };
    }

    // 안쪽 단계는 「지금 어디까지」를 말한다. 끝났거나 시작 전이면 말할 것이 없다
    if (state !== 'active') {
      fail(at, `steps는 active에만 적는다. 지금 state는 ${state}다`);
    }

    const total = count(steps, 'total', `${at} steps`);
    const done = count(steps, 'done', `${at} steps`);

    if (total < 1) {
      fail(`${at} steps`, 'total이 1보다 작다');
    }

    if (done > total) {
      fail(`${at} steps`, `done(${String(done)})이 total(${String(total)})보다 크다`);
    }

    return {
      title: text(value, 'title', at),
      state,
      ...maybe('at', rawAt),
      steps: { done, total },
    };
  });

export const parseProjectFrontmatter = (value: unknown, where: string): ProjectFrontmatter => {
  const record = asRecord(value, where);

  const startedAt = yearMonth(record, 'startedAt', where);
  const endedAt = optionalYearMonth(record, 'endedAt', where);
  const importance = count(record, 'importance', where);
  const deployUrl = optionalText(record, 'deployUrl', where);
  const deployLabel = optionalText(record, 'deployLabel', where);

  if (endedAt !== undefined && endedAt < startedAt) {
    fail(where, `endedAt(${endedAt})이 startedAt(${startedAt})보다 앞이다`);
  }

  if (importance < 1) {
    fail(where, 'importance는 1부터다');
  }

  // 라벨이 「어디로 가는지」를 말한다. 주소만 있으면 무엇인지 모르는 단추가 된다
  if ((deployUrl === undefined) !== (deployLabel === undefined)) {
    fail(where, 'deployUrl과 deployLabel은 함께 적거나 함께 뺀다');
  }

  return {
    name: text(record, 'name', where),
    description: text(record, 'description', where),
    status: text(record, 'status', where),
    statusTone: oneOf(record, 'statusTone', where, PROJECT_STATUS_TONES),
    stack: textList(record, 'stack', where),
    importance,
    startedAt,
    ...maybe('endedAt', endedAt),
    ...maybe('repoUrl', optionalText(record, 'repoUrl', where)),
    ...maybe('deployUrl', deployUrl),
    ...maybe('deployLabel', deployLabel),
    ...maybe('summary', optionalText(record, 'summary', where)),
    ...maybe('problem', optionalTextList(record, 'problem', where)),
    ...maybe('metrics', metricsOf(record, where)),
    ...maybe('architecture', architectureOf(record, where)),
    ...maybe('decisions', decisionsOf(record, where)),
    ...maybe('milestones', milestonesOf(record, where)),
  };
};
