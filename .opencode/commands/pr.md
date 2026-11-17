---
description: Run local checks and open a pull request using the project template
---

Prepare a pull request for the current branch:

1. Check `git status --short` and `git diff main...HEAD --stat`. If there are no changes, report that and stop.
2. Run the CI-equivalent check: `CI=1 npm test -- --project=chromium`. Report the result. If it fails, stop and do not open a PR.
3. Read `.github/PULL_REQUEST_TEMPLATE.md` and fill it in from the diff and the test result. Keep it factual; do not claim checks you did not run.
4. **Ask for my confirmation before any remote write.** If I approve, use the `github` skill and `tools.github.create_pull_request` with base `main` and the current branch as head.
5. After creation, check the `test` check run with `pull_request_read({ method: "get_check_runs" })` and report the PR URL and check state.

Additional instructions: $ARGUMENTS
