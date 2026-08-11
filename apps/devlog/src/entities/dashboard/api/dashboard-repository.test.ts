import { readdir } from 'fs/promises';
import { describe, expect, it } from 'vitest';

import { PROJECTS_DIR } from '@/shared/config';

import { getIdeas, getLinks, getNow, getReading, getTodos } from './dashboard-repository';

/**
 * 실제 `content/dashboard/*.json` 다섯을 읽는다.
 *
 * 위의 파서 테스트는 「검증이 도는가」를 보고 이것은 「지금 저장소에 든 내용이
 * 그 검증을 통과하는가」를 본다. 둘은 다른 질문이다 — 내용에 오타가 나면 빌드가
 * 실패하지만, 빌드는 내용을 채운 다음에나 돌린다. 여기서 먼저 잡는다.
 */

describe('대시보드 JSON 다섯', () => {
  it.each([
    ['now.json', getNow],
    ['todos.json', getTodos],
    ['reading.json', getReading],
    ['ideas.json', getIdeas],
    ['links.json', getLinks],
  ])('%s이 스키마를 통과한다', async (_file, read) => {
    await expect(read()).resolves.toBeInstanceOf(Array);
  });
});

/**
 * 스키마를 통과하지만 아무것도 가리키지 않는 값이 있다.
 *
 * `slug`가 문자열이기만 하면 파서는 통과시킨다. 그런데 그 파일이 없으면 위젯은
 * 조용히 빈 줄을 그린다 — 화면에 「무엇이 없다」고 나오지 않는다. 형식이 아니라
 * **가리키는 곳**을 보는 검사라 파서가 아니라 여기에 둔다(파서는 파일을 읽지 않는다).
 */
describe('now.json의 프로젝트가 실제로 있다', () => {
  it('slug마다 content/projects에 파일이 있다', async () => {
    const slugs = (await getNow())
      .filter((item) => item.kind === 'project')
      .map((item) => item.slug);

    const files = await readdir(PROJECTS_DIR);
    const known = new Set(
      files.filter((file) => file.endsWith('.mdx')).map((file) => file.replace(/\.mdx$/, '')),
    );

    expect(slugs.filter((slug) => !known.has(slug))).toEqual([]);
  });
});
