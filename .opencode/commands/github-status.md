---
description: Show open PRs and the state of the required test check
---

Using the `github` skill and the `github` MCP tools for `T-BO0/e-commerce-test`:

1. List open pull requests targeting `main` with number, title, author, and draft state.
2. For each PR, read the `test` check run state with `pull_request_read({ method: "get_check_runs" })`.
3. Summarize which PRs are merge-ready (CI green) and which are blocked, with links.
4. If a PR number was provided, focus on it and include check details: $ARGUMENTS
