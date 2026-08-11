/*
 * GitHub 활동.
 *
 * 잔디 · 최근 커밋 · 열린 PR과 이슈가 한 슬라이스다. 셋이 스냅샷 **하나**를 그린다.
 *
 * 잔디를 따로 둘 이유는 「홈과 공유」였는데 그 소비자가 아직 없다. 없는 소비자를 위해
 * 가르면 위젯 층만 늘어난다 — 실제로 21슬라이스가 되어 검사기가 임계를 짚었다.
 * 홈이 잔디를 쓰게 되면 그때 가른다.
 */

export { toCommitRows, toContributionCells, toOpenRows } from './model/to-activity';

export { ContributionGrid } from './ui/contribution-grid/contribution-grid';

export { OpenItems } from './ui/open-items/open-items';

export { RecentCommits } from './ui/recent-commits/recent-commits';
