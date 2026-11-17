---
description: Generate Playwright tests from an approved spec in specs/
---

Use the `test-generate` skill ("Generate Tests") for: $ARGUMENTS

Follow the skill end to end: only generate from an approved plan in `specs/`, keep one test per file with the required `// spec:` and `// seed:` headers, then run `npm test -- --project=chromium` and report the result.
