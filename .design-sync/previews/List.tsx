import { Link, List, ListItem, Text } from '@audemodo/design-system';

/** Ported from apps/devlog posts-list-page — the canonical composition. */
export const PostList = () => (
  <List hasDividers>
    <ListItem
      description="날짜만 저장하던 필드를 시각까지 담도록 바꾸면서 정렬과 표시를 맞췄다."
      label={<Link href="/posts/created-at-to-datetime">createdAt을 시각 단위로 바꾸다</Link>}
    />

    <ListItem
      description="벤더 컴포넌트를 그대로 노출하지 않고 경계를 두면 무엇이 좋아지는가."
      label={<Link href="/posts/design-system-boundary">디자인 시스템의 경계 설계</Link>}
    />

    <ListItem
      description="FSD 레이어 규칙을 steiger로 강제하며 겪은 시행착오."
      label={<Link href="/posts/fsd-with-steiger">FSD를 도구로 강제하기</Link>}
    />
  </List>
);

/** Spacing density — the primary layout axis. */
export const Density = () => (
  <>
    {(['compact', 'balanced', 'spacious'] as const).map((density) => (
      <List
        key={density}
        density={density}
        hasDividers
        header={<Text type="label">{density}</Text>}
      >
        <ListItem label="첫 번째 항목" />
        <ListItem label="두 번째 항목" />
        <ListItem label="세 번째 항목" />
      </List>
    ))}
  </>
);

/** Marker styles — 'decimal' switches the root element to <ol>. */
export const ListStyles = () => (
  <>
    <List listStyle="disc">
      <ListItem label="disc 마커" />
      <ListItem label="두 번째 항목" />
    </List>

    <List listStyle="circle">
      <ListItem label="circle 마커" />
      <ListItem label="두 번째 항목" />
    </List>

    <List listStyle="decimal" start={1}>
      <ListItem label="decimal — ol로 렌더된다" />
      <ListItem label="두 번째 항목" />
    </List>
  </>
);

/** Item slots and states: leading/trailing content, selected, disabled. */
export const ItemStates = () => (
  <List hasDividers>
    <ListItem
      description="startContent와 endContent로 앞뒤를 채운다"
      endContent={<Text color="secondary">12</Text>}
      label="기본 항목"
      startContent={
        <Text color="secondary" hasTabularNumbers type="label">
          01
        </Text>
      }
    />

    <ListItem isSelected description="isSelected가 켜진 항목" label="선택된 항목" />

    <ListItem isDisabled description="isDisabled가 켜진 항목" label="비활성 항목" />

    <ListItem
      description="href가 있으면 hover·press 스타일이 켜진다"
      href="/posts"
      label="링크 항목"
    />
  </List>
);
