import { describe, expect, it } from 'vitest';

import { parsePostFrontmatter } from './parse-post-frontmatter';

/**
 * 캐스팅을 걷어낸 자리를 지킨다.
 *
 * 값진 것은 필드 하나하나보다 **필드 사이의 약속**이다 — 혼자서는 말이 되는데 둘을
 * 나란히 놓으면 앞뒤가 안 맞는 경우를 화면이 아니라 여기서 잡는다.
 */

const WHERE = 'content/posts/x.mdx';

/** 있어야 하는 것만 채운 최소 글 */
const base = {
  title: '제목',
  summary: '요약',
  createdAt: '2026-07-10T21:15:00+09:00',
  kind: '회고',
  project: 'devlog',
  track: 'FE',
  stack: ['TypeScript'],
  tag: ['FSD'],
};

const parse = (over: Record<string, unknown> = {}): ReturnType<typeof parsePostFrontmatter> =>
  parsePostFrontmatter({ ...base, ...over }, WHERE);

describe('parsePostFrontmatter — 모양', () => {
  it('있어야 하는 것만 있으면 그대로 나온다', () => {
    // 안 적은 키는 결과에도 없다. `undefined`로 채우면 원본과 모양이 달라진다
    expect(parse()).toStrictEqual(base);
  });

  it('어느 파일 어느 필드인지 말한다', () => {
    expect(() => parsePostFrontmatter({ ...base, title: undefined }, WHERE)).toThrow(
      'content/posts/x.mdx — title',
    );
  });

  it('kind가 어휘에 없으면 던진다', () => {
    expect(() => parse({ kind: '에세이' })).toThrow('kind:');
  });

  it('track이 어휘에 없으면 던진다', () => {
    expect(() => parse({ track: '기획' })).toThrow('track:');
  });

  it('stack에 빈 값이 섞이면 던진다', () => {
    expect(() => parse({ stack: ['TypeScript', ''] })).toThrow('stack[1]');
  });
});

describe('parsePostFrontmatter — 시각', () => {
  it('오프셋이 없으면 던진다', () => {
    // 오프셋이 없으면 빌드가 도는 기계의 시간대가 날짜를 정한다
    expect(() => parse({ createdAt: '2026-07-10' })).toThrow('오프셋까지 적힌 ISO 8601');
  });

  it('실재하지 않는 날짜는 던진다', () => {
    expect(() => parse({ createdAt: '2026-02-30T00:00:00+09:00' })).toThrow('달력에 없는 날');
  });

  it('고친 날이 쓴 날보다 앞이면 던진다', () => {
    expect(() => parse({ updatedAt: '2026-07-09T00:00:00+09:00' })).toThrow('보다 앞이다');
  });
});

describe('parsePostFrontmatter — 필드 사이의 약속', () => {
  it('series만 적으면 던진다', () => {
    // 순서가 없으면 연작에서 이 글의 자리를 알 수 없다
    expect(() => parse({ series: 'FSD 실전' })).toThrow('함께 적거나 함께 뺀다');
  });

  it('seriesOrder만 적어도 던진다', () => {
    expect(() => parse({ seriesOrder: 2 })).toThrow('함께 적거나 함께 뺀다');
  });

  it('needsUpdate만 적으면 던진다', () => {
    /*
     * 이것이 이 파일에서 가장 값진 검사다. 지금까지는 통과했고, 대시보드의
     * `selectNeedsUpdate`가 둘 다 있어야 세기 때문에 그 글이 조용히 빠졌다.
     * 화면에 「빠졌다」고 나오지 않는다.
     */
    expect(() => parse({ needsUpdate: '6mo' })).toThrow('lastReviewed도 적는다');
  });

  it('둘 다 적으면 통과한다', () => {
    const parsed = parse({ needsUpdate: '6mo', lastReviewed: '2026-07-10T21:15:00+09:00' });

    expect(parsed.needsUpdate).toBe('6mo');
  });

  it('모르는 주기는 던진다', () => {
    expect(() => parse({ needsUpdate: '3mo', lastReviewed: base.createdAt })).toThrow(
      'needsUpdate:',
    );
  });
});

describe('parsePostFrontmatter — 썸네일', () => {
  it('크기가 0이면 던진다', () => {
    // 자리를 잡지 못해 목록이 밀린다. 크기를 함께 받는 이유가 그것이다
    expect(() => parse({ thumbnail: { src: '/a.png', width: 0, height: 10 } })).toThrow(
      '1보다 작다',
    );
  });

  it('셋이 다 있으면 통과한다', () => {
    expect(parse({ thumbnail: { src: '/a.png', width: 320, height: 180 } }).thumbnail).toEqual({
      src: '/a.png',
      width: 320,
      height: 180,
    });
  });
});
