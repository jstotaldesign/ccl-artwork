# ccl-artwork

Built on the NextPolyglot SaaS template.

## Quick start

```bash
npm install
cp .env.example .env
# Edit .env — at minimum set SESSION_SECRET and DATABASE_URL
npm run db:migrate
npm run db:seed
npm run dev
```

Sign in with: **demo@example.com** / **demo1234**

## What's included

- Multi-tenant auth (password + magic-link)
- RBAC with audit log
- Stripe billing (set keys in .env to enable)
- 7 locale support (en/th/zh/vi/km/lo/my)
- 45+ UI components in `src/components/ui/`
- Light/dark mode + sidebar collapse + ⌘K palette

## Project structure

```
src/
├── app/
│   ├── (app)/         ← your authed app (start here)
│   ├── api/auth/      ← auth APIs (don't touch unless needed)
│   ├── auth/          ← sign-in / sign-up pages
│   └── layout.tsx     ← root layout + i18n + theme
├── components/
│   ├── ui/            ← component library
│   ├── AppShell.tsx   ← sidebar + topbar wrapper
│   └── Sidebar.tsx    ← edit nav items here
├── lib/               ← prisma, auth, formatters, etc.
└── i18n/              ← locale config
```

## Common tasks

| What | Where |
|---|---|
| Add a sidebar link | `src/components/Sidebar.tsx` |
| Add a model | `prisma/schema.prisma` then `npm run db:migrate` |
| Add a permission | `src/lib/permissions.ts` |
| Add a translation key | `messages/*.json` |
| Add a new page | `src/app/(app)/your-feature/page.tsx` |
| Add an API route | `src/app/api/your-resource/route.ts` |

## License

See `LICENSE` (NextPolyglot Commercial License).
