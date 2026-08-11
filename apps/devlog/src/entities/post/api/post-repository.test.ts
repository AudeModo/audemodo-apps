import { describe, expect, it } from 'vitest';

import { AXIS_VALUES } from '@/shared/config';

import { getPostSummaries } from './post-repository';

/**
 * 실제 글이 검증을 지나는지 본다.
 *
 * 검증이 도는가(파서 테스트)와 지금 저장소에 든 글이 그것을 지나는가는 다른 질문이다.
 * 뒤쪽은 빌드가 잡아주지만, 빌드는 글을 다 쓴 뒤에나 돈다.
 */
describe('글 콘텐츠', () => {
  it('모든 글이 frontmatter 검증을 지난다', async () => {
    const posts = await getPostSummaries();

    expect(posts.length).toBeGreaterThan(0);
  });

  /*
   * 축 어휘 정합은 프로젝트 쪽에만 검사가 있었다(`project-repository.test.ts`).
   * 글은 없었다 — 겹치는 것이 아니라 빠져 있던 자리를 채운다.
   *
   * 파서가 보지 않는 이유는 따로 있다. `kind`와 `track`은 타입이 리터럴 유니온이라
   * 파서가 좁혀야 하지만, `project` · `stack` · `tag`는 타입이 열려 있다.
   * 열린 축의 어휘는 콘텐츠 문제이지 모양 문제가 아니다.
   */
  it('글의 프로젝트가 축 어휘에 있다', async () => {
    const posts = await getPostSummaries();

    for (const post of posts) {
      expect(AXIS_VALUES.project, `${post.slug}의 project ${post.project}`).toContain(post.project);
    }
  });

  it('글의 스택이 전부 축 어휘에 있다', async () => {
    const posts = await getPostSummaries();

    for (const post of posts) {
      for (const item of post.stack) {
        expect(AXIS_VALUES.stack, `${post.slug}의 스택 ${item}`).toContain(item);
      }
    }
  });

  it('글의 태그가 전부 축 어휘에 있다', async () => {
    const posts = await getPostSummaries();

    for (const post of posts) {
      for (const item of post.tag) {
        expect(AXIS_VALUES.tag, `${post.slug}의 태그 ${item}`).toContain(item);
      }
    }
  });
});
