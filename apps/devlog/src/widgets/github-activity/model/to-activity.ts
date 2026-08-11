import type { CommitDays, OpenItem, RecentCommit } from '@/entities/github';

/**
 * 오래 열려 있다고 보는 선.
 *
 * 시안이 정한 값이다. 넘으면 코럴이 붙어 「이건 좀 됐다」를 말한다.
 */
const AGED_DAYS = 23;

export interface CommitRow {
  sha: string;
  message: string;
  /** `2026.08.11` */
  day: string;
}

export interface OpenRow {
  number: number;
  title: string;
  kind: OpenItem['kind'];
  elapsedDays: number;
  /** 오래 열려 있는가 */
  isAged: boolean;
}

/*
 * 서울 달력으로 적는다. 빌드 환경의 시간대에 따라 정적 페이지의 날짜가 달라지면 안 된다.
 */
const DAY = new Intl.DateTimeFormat('ko-KR', {
  timeZone: 'Asia/Seoul',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

const formatDay = (iso: string): string =>
  DAY.formatToParts(new Date(iso))
    .filter((part) => part.type !== 'literal')
    .map((part) => part.value)
    .join('.');

/**
 * 최근 커밋.
 *
 * 날짜를 그대로 적는다. 사양은 「상대 표현」이라 했지만 이 저장소는 상대 시간을 쓰지
 * 않기로 했고, 여기서는 그 결정이 더 맞다 — 스냅샷이 낡으면 「3일 전」이 지금부터
 * 3일 전인지 받아둔 때로부터 3일 전인지 읽는 사람이 알 수 없다.
 */
export const toCommitRows = (commits: RecentCommit[]): CommitRow[] =>
  commits.map((commit) => ({
    sha: commit.sha,
    message: commit.message,
    day: formatDay(commit.committedAt),
  }));

/**
 * 열린 PR과 이슈. **오래된 순으로** 놓는다.
 *
 * 경과일을 빌드 시각이 아니라 받아둔 시각에서 잰다 — 목록과 숫자가 같은 시점을 말해야
 * 한다. 사흘 지난 스냅샷에 오늘까지의 날수를 붙이면 이미 닫힌 것이 「26일 지남」으로
 * 나온다.
 */
export const toOpenRows = (items: OpenItem[], fetchedAt: string): OpenRow[] => {
  const at = new Date(fetchedAt).getTime();

  return items
    .map((item) => {
      const elapsedDays = Math.floor((at - new Date(item.createdAt).getTime()) / 86_400_000);

      return {
        number: item.number,
        title: item.title,
        kind: item.kind,
        elapsedDays,
        isAged: elapsedDays >= AGED_DAYS,
      };
    })
    .sort((a, b) => b.elapsedDays - a.elapsedDays);
};

/** 잔디가 그리는 창 */
export const WINDOW_DAYS = 84;

/** 램프 네 단계. 0은 커밋이 없는 날이다 */
export type ContributionLevel = 0 | 1 | 2 | 3;

export interface ContributionCell {
  /** `YYYY-MM-DD` */
  day: string;
  count: number;
  level: ContributionLevel;
}

/**
 * 84칸을 만든다.
 *
 * 창을 화면이 아니라 여기서 편다. `commitDays`에는 커밋이 있는 날만 들어 있고
 * 없는 날은 아예 없다 — 84줄을 매번 커밋에 넣지 않으려고 그렇게 뒀다.
 *
 * 기준 시각은 빌드 시각이 아니라 **받아둔 시각**이다. 사흘 지난 스냅샷에 오늘까지의
 * 칸을 그리면 마지막 사흘이 늘 비어 「최근에 아무것도 안 했다」로 읽힌다.
 *
 * 단계는 그 창의 최대치에 견준다. 절대값으로 자르면 한가한 분기에는 잔디가 통째로
 * 옅어지고 바쁜 분기에는 통째로 진해져서, 그림이 리듬을 말하지 못한다.
 */
export const toContributionCells = (
  commitDays: CommitDays,
  fetchedAt: string,
): ContributionCell[] => {
  const end = new Date(fetchedAt);
  const max = Math.max(0, ...Object.values(commitDays));

  return Array.from({ length: WINDOW_DAYS }, (_unused, index) => {
    const at = new Date(end);

    at.setUTCDate(at.getUTCDate() - (WINDOW_DAYS - 1 - index));

    const day = at.toISOString().slice(0, 10);
    const count = commitDays[day] ?? 0;

    return { day, count, level: levelOf(count, max) };
  });
};

const levelOf = (count: number, max: number): ContributionLevel => {
  if (count === 0 || max === 0) {
    return 0;
  }

  const share = count / max;

  if (share > 0.66) {
    return 3;
  }

  return share > 0.33 ? 2 : 1;
};
