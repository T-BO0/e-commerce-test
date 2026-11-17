# Project instructions — e-commerce-test

Playwright end-to-end test project written in TypeScript. Goal: reliable, readable browser tests with a human-readable plan for each suite.

## Layout

- `playwright.config.ts` — single source of truth for projects, `baseURL`, reporter, retries, `webServer`.
- `tests/` — Playwright specs (`*.spec.ts`).
- `tests/seed.spec.ts` — environment bootstrap used by the planner agent; keep it minimal (navigation/login only).
- `specs/` — Markdown test plans, one file per feature area (e.g. `specs/guest-checkout.md`).
- `.opencode/prompts/` — prompts for the three Playwright subagents.
- `.opencode/commands/` — project OpenCode commands (`/ci`, `/pr`, `/test-plan`, `/generate-tests`, `/github-status`).
- `.opencode/skills/github/` — skill for GitHub MCP workflows (issues, PRs, reviews, releases).
- `.github/` — CI workflow, PR/issue templates, and CODEOWNERS.
- `opencode.json` — project MCP servers and agent definitions.
- `playwright-report/`, `test-results/`, `blob-report/`, `playwright/.cache/`, `playwright/.auth/` — generated; never edit or commit.

## Commands

Run from the project root:

- `npm test` — all configured browsers.
- `npm test -- --project=chromium` — fast local check (use this before finishing a change).
- `npm run test:ui` — interactive UI mode.
- `npm run test:headed` / `npm run test:debug` — visible / debugger run.
- `npm run report` — open the last HTML report.
- `npm run codegen` — record actions into a new spec.

Do not hand-edit `package-lock.json`; use `npm install`.

## Authoring rules

- Write TypeScript. Prefer Playwright's web-first assertions (`expect(...)`) and role-based locators (`getByRole`, `getByLabel`, `getByText`) over CSS/XPath.
- Never use `page.waitForTimeout`; use auto-waiting assertions or `expect.poll`.
- Each test must be independent and runnable in any order: no shared mutable state, no reliance on test execution order.
- Assume a fresh browser context. Put login/setup in a fixture or the seed test, not in individual tests.
- Keep one behavior per test and give it a descriptive name.
- If a test needs data, define it locally in the spec or a fixture; do not depend on external services unless the spec states it.
- Set `baseURL` in `playwright.config.ts` once a target app is chosen; avoid hard-coded full URLs in specs.
- Only mark a test `skip`/`fixme` with a short reason explaining what is broken.

## Test-plan workflow (Playwright agents)

1. Use `playwright-test-planner` to explore the app and write `specs/<feature>.md`.
2. Use the `test-generate` skill (which invokes `playwright-test-generator`) to turn an approved plan into `tests/<feature>/*.spec.ts`.
3. Use `playwright-test-healer` on a named failing test; review its patch before accepting.

Do not generate tests without a matching spec unless the user asks for a one-off smoke test. Regenerate the agent definitions with `npx playwright init-agents --loop=opencode` after a Playwright upgrade.

## Verification

Before reporting work as done:

1. `npm test -- --project=chromium` passes (or clearly report the failure).
2. New tests have a corresponding entry in `specs/`.
3. No secrets, tokens, or credentials are written into the repo.

## MCP / tools

Available MCP servers: `github` (global, PAT-backed), `playwright` (standalone browser tools), `playwright-test` (agents' browser + plan tools). Access their tools through `tools.github.*` / `tools.playwright.*` in Code Mode. Call `tools.github.get_me()` first when identity or permissions matter.

### GitHub

- Remote: `git@github.com:T-BO0/e-commerce-test.git` (owner `T-BO0`, repo `e-commerce-test`, default branch `main`). For any GitHub task — issues, PRs, reviews, releases, CI checks, remote file edits — follow `.opencode/skills/github/SKILL.md`.
- Confirm with the user before **any** remote write: `create_repository`, `fork_repository`, `push_files`, `create_pull_request`, `merge_pull_request`, issue/PR state changes, branch-protection/settings changes, and any write to an org repository.
- Never read or print `~/.config/opencode/.secrets/github-pat` or any token. If auth fails, report it; do not paste credentials.
- Never invent labels, assignees, reviewers, or issue numbers — verify them with `get_label` / `ui_get` / `search_issues` first.
- Do not commit directly to `main`: work on a `feature/<slug>`, `fix/<slug>`, or `test/<slug>` branch and open a PR. `main` is protected by a ruleset requiring the `test` check from the Playwright Tests workflow. Never force-push or rewrite `main`.
- Before opening a PR, run `npm test -- --project=chromium` and use `.github/PULL_REQUEST_TEMPLATE.md` as the body. Check `pull_request_read({ method: "get_check_runs" })` and report failures instead of merging past them.
- For line/file review comments use the three-step flow: `pull_request_review_write({ method: "create" })` → `add_comment_to_pending_review` → `pull_request_review_write({ method: "submit_pending" })`. Use `add_issue_comment` for general PR conversation.
- No secrets, tokens, or credentials in issues, PRs, comments, or commits.
