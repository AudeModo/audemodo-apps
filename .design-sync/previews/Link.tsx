import { Link, Text, VStack } from '@audemodo/design-system';

/** Ported from apps/devlog not-found.tsx — a standalone navigation link. */
export const Standalone = () => (
  <VStack gap={2} maxWidth={300}>
    <Text as="p" color="secondary">
      주소가 바뀌었거나 삭제된 글일 수 있습니다.
    </Text>

    <Link href="/posts">글 목록으로 가기</Link>
  </VStack>
);

/** A link inside running text — the inline case. */
export const Inline = () => (
  <Text as="p" style={{ maxWidth: 300 }}>
    이 프로젝트의 레이어 규칙은 <Link href="/posts/fsd-with-steiger">FSD 문서</Link>에 정리해
    두었고, 위반은 steiger가 CI에서 잡는다.
  </Text>
);

export const Underline = () => (
  <VStack gap={2}>
    <Link href="/posts">기본 — hover할 때만 밑줄이 생긴다</Link>

    <Link hasUnderline href="/posts">
      hasUnderline — 항상 밑줄
    </Link>
  </VStack>
);

/** External links get target=_blank, rel=noopener noreferrer and a trailing icon. */
export const External = () => (
  <VStack gap={2}>
    <Link isExternalLink href="https://github.com/facebook/astryx">
      Astryx 저장소
    </Link>

    <Link isExternalLink href="https://react.dev">
      React 공식 문서
    </Link>
  </VStack>
);

export const States = () => (
  <VStack gap={2}>
    <Link href="/posts">기본 링크</Link>

    <Link isDisabled href="/posts">
      비활성 링크 — href 없이 렌더된다
    </Link>

    <Link isStandalone href="/posts">
      isStandalone — 문장 안이 아닌 단독 링크
    </Link>
  </VStack>
);
