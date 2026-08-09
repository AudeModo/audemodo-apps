/**
 * 코드 울타리의 메타를 엘리먼트까지 실어 나른다.
 *
 * ```` ```ts title="a.ts" {4,5} ```` 에서 언어 뒤의 문자열은 파서가 `data.meta`에 담아두고
 * HTML로 옮길 때 버린다. 렌더 쪽에서 읽으려면 속성으로 옮겨야 한다.
 *
 * 트리를 직접 걷는 이유: 방문자 유틸리티는 MDX 도구 사슬의 전이 의존성이라
 * 우리 package.json에 없다. 없는 의존성을 import하면 도구 사슬이 바뀌는 날 조용히 깨진다.
 */

interface HastNode {
  tagName?: string;
  data?: { meta?: string };
  properties?: Record<string, unknown>;
  children?: HastNode[];
}

const carryMeta = (node: HastNode): void => {
  const meta = node.data?.meta;

  if (node.tagName === 'code' && typeof meta === 'string' && meta !== '') {
    node.properties = { ...node.properties, 'data-meta': meta };
  }

  for (const child of node.children ?? []) {
    carryMeta(child);
  }
};

export const rehypeCodeMeta = () => (tree: HastNode) => {
  carryMeta(tree);
};
