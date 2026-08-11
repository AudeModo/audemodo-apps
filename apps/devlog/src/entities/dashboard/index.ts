/*
 * 대시보드 데이터의 공개 API — 어디서나 쓸 수 있는 것만 둔다.
 *
 * 파일을 읽는 코드는 여기 없다. 이 배럴에 섞으면 타입 하나를 가져다 쓰는 클라이언트
 * 위젯이 파일시스템 모듈까지 함께 끌고 온다. 서버에서만 도는 것은 ./server 에 있다.
 */

export type {
  IdeaItem,
  NowItem,
  NowLearning,
  NowProject,
  NowReading,
  NowSeries,
  ReadingLink,
  ShortcutLink,
  TodoItem,
} from './model/types';
