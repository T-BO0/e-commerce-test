---
name: Test Plan
description: Create a Markdown test plan for a website from a URL using the Playwright planner agent. Use when the user provides a URL and asks what to test, wants test coverage ideas, or asks for a test plan.
---

# Create a test plan

Turn a URL into a human-readable, reviewable test plan in `specs/`. Do **not** generate test code here — that is the `playwright-test-generator` agent's job, and it runs only after the plan is approved.

## Inputs

- **URL** (required). If missing, ask before doing anything else.
- **Scope** — feature areas or user flows to cover. If absent, explore broadly and group scenarios by area.
- **Auth** — if the app needs a login, ask for test credentials or a seed setup. Never invent credentials or put secrets in the plan.

## Workflow

1. Check that `playwright-test` is connected with `opencode mcp list`. If it is not, stop and report the problem.
2. Prepare `tests/seed.spec.ts` so it navigates to the URL and performs any required setup/login. Keep it to bootstrap only; no assertions beyond confirming the app is reachable.
3. Invoke the `playwright-test-planner` subagent with the URL, scope, and seed file path. It uses `planner_setup_page`, then `browser_*` tools to explore, and saves the result with `planner_save_plan`.
   - CLI equivalent: `opencode run --agent playwright-test-planner "Explore <URL> and write a test plan for <scope>, using tests/seed.spec.ts as the seed."`
4. Review the saved plan against `references/plan-template.md`:
   - One Markdown file per feature area, named `specs/<lowercase-kebab-case>.md`.
   - Scenarios are independent, assume a fresh/blank state, and can run in any order.
   - Each scenario has a descriptive title, numbered steps, expected outcomes, and explicit failure conditions.
   - Coverage includes happy path, edge/boundary cases, and negative/validation paths.
5. Report the file path and a short coverage summary. Ask whether to hand the plan to `playwright-test-generator`; do not generate tests unprompted.

## Rules

- Never write credentials, tokens, or customer data into `specs/`.
- Prefer role-based descriptions ("the **Add to cart** button"), not raw CSS selectors, so the plan stays readable.
- If the site is unreachable, returns a login wall, or behaves inconsistently, stop and report it instead of guessing flows.
- Regenerate the agent definitions after a Playwright upgrade: `npx playwright init-agents --loop=opencode`.

## Verification

Before finishing:

1. `specs/<feature>.md` exists and follows the template.
2. The plan covers at least one happy path and one negative case per feature area.
3. No secrets appear in the file.
