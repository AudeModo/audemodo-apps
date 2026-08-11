import type { IdeaItem, NowItem, ReadingLink, ShortcutLink, TodoItem } from '../model/types';

import { readFile } from 'fs/promises';
import path from 'path';

import { DASHBOARD_DIR } from '@/shared/config';

import { parseIdeas, parseLinks, parseNow, parseReading, parseTodos } from '../lib/parse-dashboard';

/**
 * 대시보드 정적 JSON을 읽는다.
 *
 * 읽는 것과 따지는 것을 나눠 두었다 — 따지는 쪽(`lib/parse-dashboard`)이 순수 함수라
 * 파일 없이 테스트할 수 있다. 여기서는 파일을 열어 그쪽에 넘기기만 한다.
 *
 * 파일이 다섯이라도 함수도 다섯이다. 한 번에 다 읽는 함수를 두면 바로가기 하나 쓰는
 * 화면이 할 일까지 읽는다.
 */
const readJson = async (file: string): Promise<unknown> => {
  const raw = await readFile(path.join(DASHBOARD_DIR, file), 'utf-8');

  return JSON.parse(raw) as unknown;
};

export const getNow = async (): Promise<NowItem[]> => parseNow(await readJson('now.json'));

export const getTodos = async (): Promise<TodoItem[]> => parseTodos(await readJson('todos.json'));

export const getReading = async (): Promise<ReadingLink[]> =>
  parseReading(await readJson('reading.json'));

export const getIdeas = async (): Promise<IdeaItem[]> => parseIdeas(await readJson('ideas.json'));

export const getLinks = async (): Promise<ShortcutLink[]> =>
  parseLinks(await readJson('links.json'));
