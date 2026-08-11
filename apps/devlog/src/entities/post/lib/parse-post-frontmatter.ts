import type { PostFrontmatter, PostThumbnail } from '../model/types';

import { KIND_VALUES, TRACK_VALUES } from '@/shared/config';
import {
  asRecord,
  count,
  fail,
  instant,
  maybe,
  oneOf,
  optionalInstant,
  optionalOneOf,
  optionalText,
  REVIEW_CYCLES,
  text,
  textList,
} from '@/shared/lib';

/**
 * 글 frontmatter를 따진다.
 *
 * 지금까지는 캐스팅만 하고 믿었다. 캐스팅은 「그럴 것이다」라고 적어두는 것이지
 * 확인이 아니다 — 필드 하나를 빠뜨리면 화면의 그 자리만 조용히 빈다.
 *
 * ── 어휘 정합은 여기서 보지 않는다
 *
 * `kind`와 `track`만 어휘를 확인한다. 그 둘은 타입이 리터럴 유니온이라 여기서
 * 좁히지 않으면 캐스팅이 되돌아온다. `project` · `stack` · `tag`는 타입이 열려 있고
 * 어휘 정합은 콘텐츠 검사가 보는 일이다 — 두 곳에서 같은 것을 보면 어휘를 늘릴 때
 * 두 곳을 고쳐야 한다.
 */
const thumbnailOf = (record: Record<string, unknown>, where: string): PostThumbnail | undefined => {
  const value = record.thumbnail;

  if (value === undefined) {
    return undefined;
  }

  const shape = asRecord(value, `${where} thumbnail`);
  const width = count(shape, 'width', `${where} thumbnail`);
  const height = count(shape, 'height', `${where} thumbnail`);

  // 0이면 자리를 잡지 못해 목록이 밀린다. 크기를 함께 받는 이유가 그것이다
  if (width < 1 || height < 1) {
    fail(`${where} thumbnail`, '너비와 높이가 1보다 작다');
  }

  return { src: text(shape, 'src', `${where} thumbnail`), width, height };
};

export const parsePostFrontmatter = (value: unknown, where: string): PostFrontmatter => {
  const record = asRecord(value, where);

  const createdAt = instant(record, 'createdAt', where);
  const updatedAt = optionalInstant(record, 'updatedAt', where);
  const series = optionalText(record, 'series', where);
  const seriesOrder =
    record.seriesOrder === undefined ? undefined : count(record, 'seriesOrder', where);
  const needsUpdate = optionalOneOf(record, 'needsUpdate', where, REVIEW_CYCLES);
  const lastReviewed = optionalInstant(record, 'lastReviewed', where);

  // 고친 날이 쓴 날보다 앞이면 「수정됨」이 거짓말이 된다
  if (updatedAt !== undefined && Date.parse(updatedAt) < Date.parse(createdAt)) {
    fail(where, `updatedAt(${updatedAt})이 createdAt(${createdAt})보다 앞이다`);
  }

  // 하나만 있으면 연작에서 이 글의 자리를 알 수 없다
  if ((series === undefined) !== (seriesOrder === undefined)) {
    fail(where, 'series와 seriesOrder는 함께 적거나 함께 뺀다');
  }

  if (seriesOrder !== undefined && seriesOrder < 1) {
    fail(where, 'seriesOrder는 1부터다');
  }

  /*
   * 주기만 적고 마지막 검토일을 빼면 대시보드가 그 글을 **조용히 버린다**
   * (`selectNeedsUpdate`가 둘 다 있어야 센다). 화면에 「빠졌다」고 나오지 않는다.
   */
  if (needsUpdate !== undefined && lastReviewed === undefined) {
    fail(where, 'needsUpdate를 적었으면 lastReviewed도 적는다');
  }

  if (lastReviewed !== undefined && Date.parse(lastReviewed) < Date.parse(createdAt)) {
    fail(where, `lastReviewed(${lastReviewed})가 createdAt(${createdAt})보다 앞이다`);
  }

  return {
    title: text(record, 'title', where),
    summary: text(record, 'summary', where),
    createdAt,
    kind: oneOf(record, 'kind', where, KIND_VALUES),
    project: text(record, 'project', where),
    track: oneOf(record, 'track', where, TRACK_VALUES),
    stack: textList(record, 'stack', where),
    tag: textList(record, 'tag', where),
    ...maybe('updatedAt', updatedAt),
    ...maybe('thumbnail', thumbnailOf(record, where)),
    ...maybe('series', series),
    ...maybe('seriesOrder', seriesOrder),
    ...maybe('needsUpdate', needsUpdate),
    ...maybe('lastReviewed', lastReviewed),
  };
};
