import { describe, expect, it } from 'vitest';

import { reviewStatus } from './review-cycle';

/** 오늘을 인자로 받으므로 결과가 빌드 시각에 흔들리지 않는다 */
const TODAY = '2026-08-10T09:00:00+09:00';

describe('reviewStatus', () => {
  it('6개월 주기의 기한을 낸다', () => {
    const status = reviewStatus('2026-07-01T09:30:00+09:00', '6mo', TODAY);

    expect(status?.dueAt).toBe('2027.01.01');
  });

  it('1년 주기의 기한을 낸다', () => {
    const status = reviewStatus('2026-07-01T09:30:00+09:00', '1y', TODAY);

    expect(status?.dueAt).toBe('2027.07.01');
  });

  it('남은 날을 센다', () => {
    // 2026.08.10에서 2027.01.01까지는 144일이다
    expect(reviewStatus('2026-07-01T09:30:00+09:00', '6mo', TODAY)?.remainingDays).toBe(144);
  });

  it('기한이 멀면 여유다', () => {
    expect(reviewStatus('2026-07-01T09:30:00+09:00', '6mo', TODAY)?.level).toBe('ok');
  });

  it('45일 안쪽이면 임박이다', () => {
    // 2026.03.01 + 6개월 = 2026.09.01, 오늘부터 22일
    expect(reviewStatus('2026-03-01T09:00:00+09:00', '6mo', TODAY)?.level).toBe('soon');
  });

  it('45일 경계는 임박에 든다', () => {
    // 2026.03.26 + 6개월 = 2026.09.26, 오늘부터 정확히 47일 → ok
    // 2026.03.24 + 6개월 = 2026.09.24, 45일 → soon
    expect(reviewStatus('2026-03-24T09:00:00+09:00', '6mo', TODAY)?.remainingDays).toBe(45);
    expect(reviewStatus('2026-03-24T09:00:00+09:00', '6mo', TODAY)?.level).toBe('soon');
  });

  it('기한이 지나면 지남이고 남은 날이 음수다', () => {
    const status = reviewStatus('2025-01-01T09:00:00+09:00', '6mo', TODAY);

    expect(status?.level).toBe('overdue');
    expect(status?.remainingDays).toBeLessThan(0);
  });

  it('오늘이 기한이면 아직 지나지 않았다', () => {
    // 2026.02.10 + 6개월 = 2026.08.10 = 오늘
    const status = reviewStatus('2026-02-10T09:00:00+09:00', '6mo', TODAY);

    expect(status?.remainingDays).toBe(0);
    expect(status?.level).toBe('soon');
  });

  it('없는 날이 나오면 그 달의 마지막 날로 당긴다', () => {
    // 8월 31일 + 6개월은 2월 31일이다. 넘기면 기한이 한 달 밀린다
    expect(reviewStatus('2026-08-31T09:00:00+09:00', '6mo', TODAY)?.dueAt).toBe('2027.02.28');
  });

  it('윤년이면 29일까지 간다', () => {
    expect(reviewStatus('2027-08-31T09:00:00+09:00', '6mo', TODAY)?.dueAt).toBe('2028.02.29');
  });

  it('시간대가 달라도 화면의 날짜와 같은 달력에서 센다', () => {
    // 2026-06-30T20:00Z는 서울에서 7월 1일이다
    expect(reviewStatus('2026-06-30T20:00:00Z', '6mo', TODAY)?.dueAt).toBe('2027.01.01');
  });

  it('형식이 어긋나면 null이다', () => {
    expect(reviewStatus('언젠가', '6mo', TODAY)).toBeNull();
  });
});
