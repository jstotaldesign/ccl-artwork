# Third-Party Notices

NextPolyglot includes third-party open source libraries. Each retains its own
license; nothing in our Commercial License modifies them. Required attributions
and license texts follow.

## Runtime dependencies

| Package | Version | License | Author / URL |
|---|---|---|---|
| next | 16.2.6 | MIT | Vercel · https://nextjs.org |
| react | 19.2.4 | MIT | Meta · https://react.dev |
| react-dom | 19.2.4 | MIT | Meta · https://react.dev |
| @prisma/client | 6.19.3 | Apache-2.0 | Prisma Data, Inc. · https://prisma.io |
| prisma | 6.19.3 | Apache-2.0 | Prisma Data, Inc. · https://prisma.io |
| stripe | 22.1.1 | MIT | Stripe, Inc. · https://stripe.com |
| next-intl | 4.11.2 | MIT | Jan Amann · https://next-intl.dev |
| lucide-react | 1.14.0 | ISC | Lucide Contributors · https://lucide.dev |
| bcryptjs | 3.0.3 | MIT | Daniel Wirtz · https://github.com/dcodeIO/bcrypt.js |
| date-fns | 4.1.0 | MIT | date-fns Contributors · https://date-fns.org |
| nanoid | 5.1.11 | MIT | Andrey Sitnik · https://github.com/ai/nanoid |
| zod | 4.4.3 | MIT | Colin McDonnell · https://zod.dev |
| dotenv | 17.4.2 | BSD-2-Clause | Scott Motte · https://github.com/motdotla/dotenv |

## Build / dev dependencies

| Package | Version | License | URL |
|---|---|---|---|
| typescript | 5.x | Apache-2.0 | https://typescriptlang.org |
| tailwindcss | 4.x | MIT | https://tailwindcss.com |
| @tailwindcss/postcss | 4.x | MIT | https://tailwindcss.com |
| eslint | 9.x | MIT | https://eslint.org |
| eslint-config-next | 16.2.6 | MIT | https://nextjs.org |
| tsx | 4.21.0 | MIT | https://github.com/privatenumber/tsx |
| @types/* | — | MIT | https://github.com/DefinitelyTyped/DefinitelyTyped |

## Fonts

### Geist Sans / Geist Mono

Licensed under the SIL Open Font License v1.1.
Copyright © 2023 Vercel, Inc.

Required notice: This Font Software is distributed under the SIL Open Font
License, Version 1.1. The full license is available at:
https://scripts.sil.org/OFL

Source: https://vercel.com/font

### Noto Sans Thai

Licensed under the SIL Open Font License v1.1.
Copyright © Google LLC, 2015-2025.

Required notice: This Font Software is distributed under the SIL Open Font
License, Version 1.1. The full license is available at:
https://scripts.sil.org/OFL

Source: https://fonts.google.com/noto/specimen/Noto+Sans+Thai

## License summaries

### MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND.

### Apache License 2.0 — summary

You may use, modify, and distribute the software, including commercially.
Modifications must be marked. NOTICE files must be preserved. Patent grant
terminates if you sue for patent infringement. Full text at:
https://www.apache.org/licenses/LICENSE-2.0

### ISC License — summary

Functionally identical to MIT. Permission to use, copy, modify, and distribute
for any purpose, with or without fee, granted under the same disclaimer.

### BSD-2-Clause — summary

Redistribution permitted in source or binary form with retained copyright
notice + disclaimer. No endorsement clause.

### SIL Open Font License 1.1 — summary

Fonts may be embedded, modified, and redistributed FREELY when bundled with
software, provided:
1. The font is not sold by itself,
2. The original copyright and license are preserved,
3. The reserved font name (if any) is not used by derivative fonts.

Full text: https://scripts.sil.org/OFL

## How to update this file

When adding a new dependency, run:

```bash
npm ls --depth=0 --json | jq '.dependencies | to_entries[] | { name: .key, version: .value.version }'
```

…and look up its license via `npm view <pkg> license`.

Last updated: 2026-01-12
