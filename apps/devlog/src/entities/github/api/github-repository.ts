import type { CommitDays, GithubSnapshot, OpenItem, RecentCommit } from '../model/types';

import { readFile } from 'fs/promises';
import path from 'path';

import { SNAPSHOT_DIR } from '@/shared/config';

import { parseGithubSnapshot } from '../lib/parse-github';

/**
 * GitHub에서 받아오거나, 못 받으면 받아뒀던 것을 쓴다.
 *
 * ── 스냅샷이 정상 경로다
 *
 * 비인증 호출은 IP당 시간당 60회다. CI와 배포 빌더는 공유 IP라 그 몫이 이미 비어
 * 있는 경우가 흔해 403이 자주 온다. 그러니 fetch는 되면 좋은 갱신이고, 화면을
 * 책임지는 것은 커밋된 스냅샷이다.
 *
 * ── 부분 성공을 섞지 않는다
 *
 * 잔디만 새 값이고 PR은 스냅샷이면 화면에 시각이 둘이 되고, 그러면 화면이 한 가지
 * 정직한 말을 못 한다. 하나라도 실패하면 전부 스냅샷이다.
 */

/** 어느 저장소를 세는가. 비공개 저장소는 비인증으로 안 보이므로 여기 적지 않는다 */
export const GITHUB_REPO = 'AudeModo/audemodo-apps';

/** 잔디가 그리는 창. 위젯이 생기면 내보낸다 */
const WINDOW_DAYS = 84;

/** 느린 응답이 빌드를 붙잡지 않게 한다 */
const TIMEOUT_MS = 5000;

const SNAPSHOT_FILE = 'github.json';

const api = async (endpoint: string): Promise<unknown> => {
  const response = await fetch(`https://api.github.com/repos/${GITHUB_REPO}${endpoint}`, {
    headers: { Accept: 'application/vnd.github+json' },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error(`GitHub ${endpoint} — ${String(response.status)}`);
  }

  return response.json();
};

/** `YYYY-MM-DD`. 서울 달력으로 센다 — 잔디의 하루가 보는 사람의 하루여야 한다 */
const seoulDay = (iso: string): string =>
  new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(iso));

interface RawCommit {
  sha: string;
  commit: { message: string; committer: { date: string } };
}

interface RawIssue {
  number: number;
  title: string;
  created_at: string;
  pull_request?: unknown;
}

/**
 * 창 안의 커밋을 전부 받는다.
 *
 * 84일이면 한 장(100개)을 넘는다 — 실제로 129개였다. 장을 세 장으로 막는다:
 * 그보다 많으면 잔디가 아니라 다른 문제이고, 레이트를 다 쓰는 것이 더 나쁘다.
 */
const fetchCommits = async (since: string): Promise<RawCommit[]> => {
  const all: RawCommit[] = [];

  for (let page = 1; page <= 3; page += 1) {
    const rows = (await api(
      `/commits?since=${since}&per_page=100&page=${String(page)}`,
    )) as RawCommit[];

    all.push(...rows);

    if (rows.length < 100) {
      break;
    }
  }

  return all;
};

/** 지금 GitHub이 말하는 것. 실패하면 던진다 */
export const fetchGithubSnapshot = async (now: Date): Promise<GithubSnapshot> => {
  const from = new Date(now);

  from.setUTCDate(from.getUTCDate() - (WINDOW_DAYS - 1));

  const commits = await fetchCommits(`${from.toISOString().slice(0, 10)}T00:00:00Z`);
  const issues = (await api('/issues?state=open&per_page=100')) as RawIssue[];

  const commitDays: Record<string, number> = {};

  for (const commit of commits) {
    const day = seoulDay(commit.commit.committer.date);

    commitDays[day] = (commitDays[day] ?? 0) + 1;
  }

  const recentCommits: RecentCommit[] = commits.slice(0, 3).map((commit) => ({
    sha: commit.sha.slice(0, 7),
    message: commit.commit.message.split('\n')[0] ?? '',
    committedAt: commit.commit.committer.date,
  }));

  const openItems: OpenItem[] = issues.map((issue) => ({
    number: issue.number,
    title: issue.title,
    kind: issue.pull_request === undefined ? 'issue' : 'pr',
    createdAt: issue.created_at,
  }));

  return {
    fetchedAt: now.toISOString(),
    repo: GITHUB_REPO,
    commitDays: commitDays satisfies CommitDays,
    recentCommits,
    openItems,
  };
};

/** 커밋해둔 것. 없으면 null이다 */
export const readGithubSnapshot = async (): Promise<GithubSnapshot | null> => {
  try {
    const raw = await readFile(path.join(SNAPSHOT_DIR, SNAPSHOT_FILE), 'utf-8');

    return parseGithubSnapshot(JSON.parse(raw), `content/snapshot/${SNAPSHOT_FILE}`);
  } catch (error) {
    // 파일이 없는 것과 모양이 틀린 것은 다르다. 틀린 것은 조용히 넘기지 않는다
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      return null;
    }

    throw error;
  }
};

/**
 * 화면이 부르는 것.
 *
 * 받아지면 받은 것을, 안 되면 받아뒀던 것을, 그것도 없으면 `null`을 준다.
 * `null`이면 위젯을 그리지 않는다 — 없는 것을 0으로 그리면 「활동이 없었다」로 읽힌다.
 */
export const getGithubSnapshot = async (now: Date): Promise<GithubSnapshot | null> => {
  try {
    return await fetchGithubSnapshot(now);
  } catch {
    return readGithubSnapshot();
  }
};
