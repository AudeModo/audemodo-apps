/**
 * 스냅샷을 갱신한다.
 *
 *   pnpm --filter @audemodo/devlog snapshot:github
 *
 * ── 왜 빌드가 아니라 스크립트인가
 *
 * 빌드가 파일을 고치면 무엇이 커밋될지가 빌드에 달린다. 그리고 비인증 호출은 IP당
 * 시간당 60회인데 CI와 배포 빌더는 공유 IP라 그 몫이 자주 비어 있다 — 실제로 받아지는
 * 곳은 사람의 기계다. 그래서 사람이 진입점이다.
 *
 * ── 단독 커밋으로 둔다
 *
 * diff가 매번 날짜와 sha로 채워져 콘텐츠 변경과 섞이면 리뷰가 안 된다. 그리고 커밋
 * 메시지는 「왜」를 담는데 스냅샷 갱신의 왜는 늘 같아서 다른 변경과 한 메시지에 못 담는다.
 */
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';

import { fetchGithubSnapshot } from '@/entities/github/server';
import { SNAPSHOT_DIR } from '@/shared/config';

const main = async (): Promise<void> => {
  const snapshot = await fetchGithubSnapshot(new Date());
  const days = Object.keys(snapshot.commitDays).length;
  const commits = Object.values(snapshot.commitDays).reduce((sum, n) => sum + n, 0);

  await mkdir(SNAPSHOT_DIR, { recursive: true });
  await writeFile(
    path.join(SNAPSHOT_DIR, 'github.json'),
    `${JSON.stringify(snapshot, null, 2)}\n`,
    'utf-8',
  );

  // 무엇을 받았는지 보이지 않으면 빈 파일을 커밋해도 모른다
  process.stdout.write(
    `${snapshot.repo} · 커밋 ${String(commits)}개 / ${String(days)}일 · ` +
      `열린 항목 ${String(snapshot.openItems.length)}개 · ${snapshot.fetchedAt}\n`,
  );
};

await main();
