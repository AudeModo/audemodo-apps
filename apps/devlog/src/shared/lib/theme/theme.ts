/**
 * 라이트 · 다크 전환.
 *
 * 다크로 가는 경로는 플로팅 도구의 버튼 하나뿐이다. OS 설정을 따라가지 않는다 —
 * 브랜드 색은 `data-theme`이 갈라놓고, 그 속성을 바꾸는 곳을 하나로 묶어야
 * 「지금 어느 쪽인가」의 답이 언제나 한 군데에 있다.
 */

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'devlog-theme';

/**
 * 하이드레이션 전에 실행되는 스크립트.
 *
 * 번들을 기다렸다 칠하면 다크를 고른 사람이 흰 화면을 한 번 보게 된다. 저장된 선택을
 * 첫 페인트 전에 심어 그 깜빡임을 없앤다. 번들보다 먼저 도는 코드라 import를 쓸 수 없어
 * 저장소 키가 이 문자열 안에 한 번 더 나온다 — 아래 상수와 같이 고쳐야 한다.
 *
 * 저장된 값이 없거나 깨졌으면 서버가 심어둔 light를 그대로 둔다.
 */
export const THEME_INIT_SCRIPT = `try{var t=localStorage.getItem('${STORAGE_KEY}');if(t==='dark'||t==='light'){document.documentElement.setAttribute('data-theme',t)}}catch(e){}`;

/*
 * 지금 어느 쪽인가는 React 바깥(문서의 속성)에 산다. 상태를 복제해 두면 스크립트가
 * 먼저 심어둔 값과 어긋날 수 있으므로, 문서를 진실로 두고 구독해서 읽는다.
 */

const listeners = new Set<() => void>();

/** 문서가 칠해진 쪽. 저장소는 그 사본일 뿐이다. */
const currentTheme = (): Theme =>
  document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';

export const subscribeTheme = (listener: () => void): (() => void) => {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
};

export const getThemeSnapshot = (): Theme => currentTheme();

/**
 * 서버가 아는 값. 레이아웃이 심어두는 기본값과 같아야 한다 —
 * 다르면 하이드레이션이 어긋난 자리를 지우면서 화면이 한 번 튄다.
 */
export const getServerThemeSnapshot = (): Theme => 'light';

/** 문서를 칠하고 선택을 저장한다. 저장에 실패해도 이번 방문은 바뀐 채로 둔다. */
export const writeTheme = (theme: Theme): void => {
  document.documentElement.setAttribute('data-theme', theme);

  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // 사생활 보호 모드 등으로 저장이 막힌 경우. 다음 방문에 기본값으로 돌아간다.
  }

  for (const listener of listeners) {
    listener();
  }
};
