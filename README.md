# audemodo-apps

Audemodo 생태계의 프론트엔드 앱 모노레포.
내부 사이트(앱)들과 그들이 공유하는 패키지를 함께 담고, 함께 진화시킨다.

## 구조

```
audemodo-apps/
├── apps/         배포 대상 (내부 사이트들)
│   └── devlog/   개발 블로그 — 1단계, 첫 앱
└── packages/     공유 (내 앱들만 소비) — 추출로 생성 예정
```

의존은 `apps/ → packages/` 단방향으로만 흐른다.

## 기술 스택

- Next.js 16 (App Router, Turbopack)
- React 19.2
- TypeScript (strict 전면 + 추가 엄격 옵션)
- pnpm workspace + Turborepo
- 배포: Vercel

## 개발

```bash
pnpm install        # 의존성 설치 (Node 20+ 필요)
pnpm dev            # 전체 개발 서버
pnpm build          # 전체 빌드
pnpm typecheck      # 타입 검사
pnpm lint           # 린트
pnpm format         # 포맷
```

devlog만 실행하려면:

```bash
pnpm --filter @audemodo/devlog dev
```
