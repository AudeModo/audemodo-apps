import { afterEach, describe, expect, it, vi } from 'vitest';

import { getGithubSnapshot, GITHUB_REPO, readGithubSnapshot } from './github-repository';

/**
 * 커밋된 스냅샷이 스키마를 지나는지 본다.
 *
 * 스냅샷은 **정상 경로**다 — 비인증 호출은 IP당 시간당 60회인데 CI와 배포 빌더는
 * 공유 IP라 그 몫이 자주 비어 있다. 화면을 책임지는 파일이므로 여기서 먼저 잡는다.
 */
describe('GitHub 스냅샷', () => {
  it('커밋된 스냅샷이 스키마를 지난다', async () => {
    const snapshot = await readGithubSnapshot();

    // 파일이 없으면 이 테스트가 아니라 갱신 스크립트를 돌려야 한다
    expect(snapshot).not.toBeNull();
    expect(snapshot?.repo).toBe(GITHUB_REPO);
  });

  it('센 날은 전부 커밋이 하나 이상이다', async () => {
    const snapshot = await readGithubSnapshot();
    const empty = Object.entries(snapshot?.commitDays ?? {}).filter(([, n]) => n < 1);

    // 0인 날을 적어두면 84줄이 매번 커밋에 들어온다
    expect(empty).toEqual([]);
  });

  it('열린 항목이 PR인지 이슈인지 판정되어 있다', async () => {
    const snapshot = await readGithubSnapshot();

    for (const item of snapshot?.openItems ?? []) {
      expect(['pr', 'issue']).toContain(item.kind);
    }
  });
});

/**
 * 실패 분기.
 *
 * 이 갈림이 이 파일의 요점이다 — CI에서는 fetch가 자주 실패하므로 **스냅샷 경로가
 * 정상 경로**다. 정상 경로가 테스트 없이 남아 있으면 안 된다.
 */
describe('받아오지 못하면', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('커밋된 스냅샷을 쓴다', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.resolve(new Response('', { status: 403 }))),
    );

    const snapshot = await getGithubSnapshot(new Date());

    expect(snapshot?.repo).toBe(GITHUB_REPO);

    // 빌드 시각이 아니라 받아둔 시각이다. 목록과 숫자가 같은 시점을 말해야 한다
    const fromFile = await readGithubSnapshot();

    expect(snapshot?.fetchedAt).toBe(fromFile?.fetchedAt);
  });

  it('망이 끊겨도 같다', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.reject(new Error('네트워크'))),
    );

    await expect(getGithubSnapshot(new Date())).resolves.not.toBeNull();
  });
});
