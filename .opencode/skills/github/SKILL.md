---
name: GitHub
description: Work with GitHub repositories, issues, pull requests, reviews, releases, and CI checks using the GitHub MCP tools. Use when the user asks to create or manage issues/PRs, review code, check CI status, tag releases, or make remote-only GitHub edits.
---

# GitHub

Use the `github` MCP server for all GitHub platform work. Its tools are called in Code Mode as `tools.github.<tool>(...)`; discover exact names with `search({ namespace: "github" })` before calling an unfamiliar tool.

## Context

- Default repository: `T-BO0/e-commerce-test` (`git@github.com:T-BO0/e-commerce-test.git`, default branch `main`). Confirm before assuming a different owner/repo.
- Required CI check on PRs: the `test` job of the **Playwright Tests** workflow (`.github/workflows/playwright.yml`). It must be green before merge.
- Call `tools.github.get_me()` first when identity or permissions matter.

## Tool selection

- Use `list_*` for broad retrieval and `search_issues` / `search_pull_requests` for targeted queries. Do not put `sort:`/`order:` inside a search query; use the dedicated parameters.
- Pass `fields` / `minimal_output` to trim large results; paginate (5–10 per page) instead of dumping everything.
- For local file changes prefer git + push. Use `create_or_update_file` / `push_files` only for remote-only edits; `get_file_contents` returns the blob SHA required when updating an existing file.

## Workflows

### Issues

1. Call `list_issue_types` (org repos) and `search_issues` to find duplicates before creating.
2. Create/update with `issue_write({ method: "create" | "update" })`. Use existing labels (`bug`, `enhancement`, `documentation`, `question`); verify with `get_label` or `ui_get({ method: "labels" })`.
3. Always set `state_reason` (`completed`, `not_planned`, `duplicate`) when closing an issue.

### Pull requests

1. Run `npm test -- --project=chromium` locally first; do not open a PR with a known failing check.
2. Search for the PR template with `get_file_contents` on `.github/PULL_REQUEST_TEMPLATE.md` and structure the body with it. Use a short imperative title and link the related issue.
3. Create with `create_pull_request`; verify labels/assignees/reviewers with `ui_get`.
4. Check CI with `pull_request_read({ method: "get_check_runs" })` or `get_status`. Report failures instead of merging past them.

### Reviews

Use the three-step flow when leaving line or file comments:

1. `pull_request_review_write({ method: "create" })` — creates a pending review.
2. `add_comment_to_pending_review` for each comment (`subjectType: "FILE" | "LINE"`).
3. `pull_request_review_write({ method: "submit_pending", event: "APPROVE" | "REQUEST_CHANGES" | "COMMENT" })`.

Use `add_issue_comment` for general PR conversation comments, not line comments.

### Releases / tags

Call `list_tags`, `get_latest_release`, and `get_release_by_tag` before creating anything. Never invent version numbers.

## Rules

- Confirm with the user before **any** remote write: `create_repository`, `fork_repository`, `push_files`, `create_pull_request`, `merge_pull_request`, issue/PR state changes, branch-protection/settings changes, and any write to an organization repository.
- Never read or print `~/.config/opencode/.secrets/github-pat` or any token. If auth fails, report it; do not paste credentials.
- Never invent labels, assignees, reviewers, or issue numbers — verify them first.
- Do not commit directly to `main`: use `feature/<slug>`, `fix/<slug>`, or `test/<slug>` branches and open a PR. `main` is protected by a ruleset requiring the `test` CI check. Never force-push or rewrite `main`.
- No secrets, tokens, or credentials in issues, PR bodies, comments, or commits.
- Tests hit the live `automationexercise.com` site and can be flaky. Report the failing test name and rerun evidence rather than silently bypassing the required check.

## Verification

Before finishing:

1. Read back the issue/PR/review with `issue_read` / `pull_request_read`.
2. For PRs, confirm the `test` check state and report the PR URL.
3. Confirm no tokens or private data were written to GitHub.
