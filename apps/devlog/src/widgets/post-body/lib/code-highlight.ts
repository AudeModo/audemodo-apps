import type { ThemedToken } from '@shikijs/types';

import bash from '@shikijs/langs/bash';
import css from '@shikijs/langs/css';
import diff from '@shikijs/langs/diff';
import html from '@shikijs/langs/html';
import json from '@shikijs/langs/json';
import markdown from '@shikijs/langs/markdown';
import tsx from '@shikijs/langs/tsx';
import typescript from '@shikijs/langs/typescript';
import yaml from '@shikijs/langs/yaml';
import darkPlus from '@shikijs/themes/dark-plus';
import lightPlus from '@shikijs/themes/light-plus';
import { createHighlighterCoreSync } from 'shiki/core';
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';

import type { CodeToken } from '@/shared/ui';

/**
 * 신택스 하이라이팅.
 *
 * 빌드 때 한 번 돌고 결과만 HTML에 실린다. 브라우저는 하이라이터를 내려받지 않는다.
 * `server-only`를 물린 이유가 그것이다 — 클라이언트 모듈이 이 파일에 닿으면
 * 조용히 번들에 섞이는 대신 빌드가 실패한다.
 *
 * ── HTML이 아니라 토큰을 받는다
 *
 * `codeToHtml`은 테마의 배경색까지 실어 보낸다. 그러면 우리 면 위에 테마의 면이
 * 겹치고, 그것을 걷어내려고 `!important` 싸움이 시작된다. 토큰만 받으면 배경이
 * 애초에 나오지 않는다. 우리 값을 쓰는 것이 규칙이 아니라 구조가 된다.
 *
 * ── 색은 CSS 커스텀 속성으로 온다
 *
 * `defaultColor: false`면 토큰이 `color` 없이 `--shiki-light`와 `--shiki-dark`만
 * 가진다. 두 테마가 한 번의 렌더에 함께 실리고, 어느 쪽을 쓸지는 CSS가 정한다.
 * 테마를 바꿔도 다시 그리지 않는다.
 *
 * ── 색을 넷 밀었다
 *
 * light-plus · dark-plus는 흰 면(#fff)과 #1E1E1E를 가정하고 만든 테마인데 우리 면은
 * #F1F4F7 · #1F1F22다. 그만큼 대비가 깎여 넷이 4.5:1 아래로 내려간다. 코드가 13.5px라
 * 굵은 글자 예외에 들지 않으므로 4.5:1이 기준이다.
 *
 * 색상은 두고 명도만 옮겼다. 옮긴 폭이 2%p 이하라 눈에는 같은 색이고 표는 통과한다.
 */
import 'server-only';

/** 대비가 4.5:1에 못 미쳐 명도만 옮긴 색. 왼쪽이 테마의 값이다 */
const COLOR_FIX_LIGHT: Record<string, string> = {
  '#267F99': '#247992', // 4.16 → 4.50  타입 이름
  '#098658': '#098054', // 4.17 → 4.50  숫자
  '#E50000': '#E10000', // 4.39 → 4.53  속성 이름
};

const COLOR_FIX_DARK: Record<string, string> = {
  '#808080': '#868686', // 4.16 → 4.52  태그 꺾쇠
};

/**
 * 울타리에 적힌 언어 이름을 문법에 잇는다.
 *
 * 모르는 이름은 평문으로 떨어진다 — 문법이 없다고 코드가 사라지면 안 된다.
 */
const LANGS = {
  bash,
  css,
  diff,
  html,
  json,
  markdown,
  tsx,
  typescript,
  yaml,
} as const;

/** 울타리에 적히는 이름 → 문법. 별칭도 여기서 받는다 */
const ALIASES: Record<string, keyof typeof LANGS> = {
  bash: 'bash',
  css: 'css',
  diff: 'diff',
  html: 'html',
  js: 'typescript',
  json: 'json',
  jsonc: 'json',
  jsx: 'tsx',
  markdown: 'markdown',
  md: 'markdown',
  mjs: 'typescript',
  sh: 'bash',
  shell: 'bash',
  ts: 'typescript',
  tsx: 'tsx',
  typescript: 'typescript',
  yaml: 'yaml',
  yml: 'yaml',
};

const highlighter = createHighlighterCoreSync({
  themes: [lightPlus, darkPlus],
  langs: Object.values(LANGS),
  engine: createJavaScriptRegexEngine(),
});

const resolveLang = (name: string): keyof typeof LANGS | null => ALIASES[name] ?? null;

/** 하이라이팅 없이 줄만 나눈다. 모르는 언어와 평문이 지나는 길이다 */
const plainLines = (code: string): CodeToken[][] =>
  code.split('\n').map((line) => [{ content: line, light: '', dark: '' }]);

const pick = (token: ThemedToken, key: string, fixes: Record<string, string>): string => {
  const color = token.htmlStyle?.[key] ?? '';

  return fixes[color.toUpperCase()] ?? color;
};

/**
 * 코드를 줄 × 토큰으로 나눈다.
 *
 * 끝의 개행 하나는 울타리가 남긴 것이라 빈 줄로 세지 않는다.
 */
export const highlightCode = (code: string, lang: string): CodeToken[][] => {
  const body = code.replace(/\n$/, '');
  const resolved = resolveLang(lang);

  if (resolved === null) {
    return plainLines(body);
  }

  const { tokens } = highlighter.codeToTokens(body, {
    lang: resolved,
    themes: { light: 'light-plus', dark: 'dark-plus' },
    defaultColor: false,
  });

  return tokens.map((line) =>
    line.map((token) => ({
      content: token.content,
      light: pick(token, '--shiki-light', COLOR_FIX_LIGHT),
      dark: pick(token, '--shiki-dark', COLOR_FIX_DARK),
    })),
  );
};
