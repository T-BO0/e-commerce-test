---
name: Generate Tests
description: Turn an approved Markdown test plan in specs/ into Playwright spec files using the playwright-test-generator agent. Use when the user asks to generate tests from a plan, implement a checked plan, or write Playwright tests for an approved spec.
---

# Generate tests from an approved plan

Turn a reviewed test plan in `specs/` into Playwright spec files under `tests/`. Do **not** invent a plan here — if there is no approved plan, use the `test-plan` skill first.

## Inputs

- **Plan** (required): path to an approved plan, e.g. `specs/registration.md`. If missing, not readable, or clearly not approved, ask before doing anything else.
- **Scenarios** (optional): which scenarios from the plan to generate. Default: all of them.
- **Seed** — use the seed path declared by the plan (usually `tests/seed.spec.ts`). Keep it bootstrap-only (navigation/login, no assertions beyond reachability).

## Workflow

1. Check that `playwright-test` is connected with `opencode mcp list`. If it is not, stop and report the problem.
2. Read the plan and enumerate its suites, scenario titles, target file paths, and seed path. Confirm each scenario has steps and expected outcomes. If a scenario is too vague to automate, flag it before generating rather than guessing.
3. Invoke the `playwright-test-generator` subagent, passing the plan text (or the relevant suite/scenario), the suite name, the scenario title, the target file path from the plan, and the seed path.
   - It calls `generator_setup_page` with the seed, manually executes each step with `browser_*` tools using the step text as intent, then calls `generator_read_log` and `generator_write_test` to save **one test per file**.
   - CLI equivalent: `opencode run --agent playwright-test-generator "Generate the test for scenario X from specs/<feature>.md using tests/seed.spec.ts as the seed."`
4. Review every generated file against `references/spec-template.md` and the rules in `AGENTS.md`:
   - TypeScript, with `// spec:` and `// seed:` header comments.
   - One test per file; `test.describe` matches the plan's top-level suite; the test title matches the scenario title.
   - A comment with the step text before each step's actions (do not duplicate comments when a step needs several actions).
   - Role-based locators (`getByRole`, `getByLabel`, `getByText`) and web-first assertions (`expect(...)`); avoid CSS/XPath unless unavoidable.
   - No `page.waitForTimeout`; use auto-waiting assertions or `expect.poll`.
   - Tests are independent, generate their own data locally, and use `baseURL` instead of hard-coded full URLs.
   - No credentials, tokens, or customer data in code.
5. Run `npm test -- --project=chromium`. Fix or clearly report failures. If a named test is genuinely broken, hand it to `playwright-test-healer` and review its patch before accepting.
6. Report the generated file paths and the test-run result. Never mark a test `skip`/`fixme` without a short reason.

## Rules

- Never generate tests without a matching approved plan. The only exception is an explicit one-off smoke test requested by the user.
- Keep the seed minimal: navigation/login only.
- Do not invent credentials; use generic, locally generated test data (e.g. a timestamp-based email).
- Regenerate the agent definitions after a Playwright upgrade: `npx playwright init-agents --loop=opencode`.

## Verification

Before finishing:

1. Every generated spec maps to a scenario in `specs/<feature>.md`, and vice versa.
2. `npm test -- --project=chromium` passes (or the failure is clearly reported).
3. No secrets, tokens, or credentials are written into the repo.
