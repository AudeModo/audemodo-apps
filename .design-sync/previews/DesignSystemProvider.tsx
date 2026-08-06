// DesignSystemProvider renders no chrome of its own — it supplies the Astryx
// theme (and optionally a routing component for Link) to everything below it.
// These cards therefore show what it enables: themed components inside it.
import {
  Card,
  DesignSystemProvider,
  Divider,
  Heading,
  Link,
  Text,
  VStack,
} from '@audemodo/design-system';

/**
 * The canonical use, mirroring apps/devlog/app/providers.tsx: wrap the app once
 * at the client boundary and every component below picks up the theme.
 */
export const WrappedApp = () => (
  <DesignSystemProvider>
    <Card padding={4} maxWidth={400}>
      <VStack gap={3}>
        <Heading level={2}>글 목록</Heading>

        <Text as="p" color="secondary">
          이 카드 안의 모든 컴포넌트는 프로바이더가 공급한 테마 토큰으로 렌더된다.
        </Text>

        <Divider />

        <Link href="/posts">글 목록으로 가기</Link>
      </VStack>
    </Card>
  </DesignSystemProvider>
);

/**
 * `linkComponent` injects the host framework's router (next/link in this repo)
 * so Link renders through it instead of a bare <a>. The design system stays
 * framework-agnostic; the app owns routing.
 */
export const WithLinkComponent = () => {
  // Stand-in for next/link — the provider only requires a component that
  // accepts href and children.
  const RouterLink = ({ href, children, ...rest }: React.ComponentProps<'a'>) => (
    <a data-router-link href={href} {...rest}>
      {children}
    </a>
  );

  return (
    <DesignSystemProvider linkComponent={RouterLink}>
      <VStack gap={2} maxWidth={400}>
        <Text as="p" type="label">
          linkComponent가 주입된 트리
        </Text>

        <Text as="p" color="secondary">
          아래 링크는 라우팅 컴포넌트를 통해 렌더된다. 주입하지 않으면 Astryx가 기본 &lt;a&gt;로
          렌더한다.
        </Text>

        <Link href="/posts">글 목록으로 가기</Link>
      </VStack>
    </DesignSystemProvider>
  );
};
