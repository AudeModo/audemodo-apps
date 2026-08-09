import { describe, expect, it } from 'vitest';

import { extractHeadings } from './headings';

describe('extractHeadings', () => {
  it('h2를 순서대로 뽑는다', () => {
    const source = ['# 제목', '', '## 첫 소제목', '본문', '', '## 둘째 소제목'].join('\n');

    expect(extractHeadings(source).map((h) => [h.order, h.text])).toEqual([
      [1, '첫 소제목'],
      [2, '둘째 소제목'],
    ]);
  });

  it('h1과 h3은 세지 않는다', () => {
    const source = ['# 제목', '### 더 작은 것', '## 소제목'].join('\n');

    expect(extractHeadings(source).map((h) => h.text)).toEqual(['소제목']);
  });

  it('한글을 슬러그에 살린다', () => {
    // 한글을 버리면 제목마다 빈 슬러그가 되어 앵커가 서로 겹친다
    expect(extractHeadings('## 경계를 기계에 맡기기')[0]?.id).toBe('경계를-기계에-맡기기');
  });

  it('문장부호를 털고 공백을 이음표로 바꾼다', () => {
    expect(extractHeadings('## 규율은, 언젠가 무너진다!')[0]?.id).toBe('규율은-언젠가-무너진다');
  });

  it('같은 제목이 두 번 나오면 뒤엣것에 번호를 붙인다', () => {
    const source = ['## 배운 것', '## 배운 것', '## 배운 것'].join('\n');

    expect(extractHeadings(source).map((h) => h.id)).toEqual(['배운-것', '배운-것-2', '배운-것-3']);
  });

  it('코드블록 안의 ##은 소제목이 아니다', () => {
    // 울타리 안을 세면 목차에 코드 조각이 올라온다
    const source = [
      '## 진짜 소제목',
      '',
      '```sh',
      '## 주석처럼 생긴 줄',
      '```',
      '',
      '## 다음',
    ].join('\n');

    expect(extractHeadings(source).map((h) => h.text)).toEqual(['진짜 소제목', '다음']);
  });

  it('물결 울타리도 같게 다룬다', () => {
    const source = ['~~~', '## 안쪽', '~~~', '## 바깥'].join('\n');

    expect(extractHeadings(source).map((h) => h.text)).toEqual(['바깥']);
  });

  it('슬러그가 비면 자리 번호로 대신한다', () => {
    expect(extractHeadings('## ***')[0]?.id).toBe('section-1');
  });

  it('소제목이 없으면 빈 목록이다', () => {
    expect(extractHeadings('본문만 있는 글')).toEqual([]);
  });
});
