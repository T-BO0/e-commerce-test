# e-commerce-test

Playwright end-to-end test project written in TypeScript, configured with Playwright MCP for OpenCode.

## Setup

Dependencies and the Chromium browser are already installed. To re-install from scratch:

```sh
npm install
npx playwright install chromium
```

## Running tests

```sh
npm test                       # all browsers (chromium, firefox, webkit)
npm test -- --project=chromium # chromium only
npm run test:ui                # interactive UI mode
npm run test:headed            # headed mode
npm run test:debug             # debug mode
npm run report                 # open the last HTML report
npm run codegen                # record tests interactively
```

Tests live in `tests/`. Configuration is in `playwright.config.ts` (set `baseURL`, projects, `webServer`, etc. there).

## Playwright MCP (OpenCode, project-local)

Configured in `opencode.json` at the project root:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "servers": {
      "playwright": {
        "type": "local",
        "command": ["npx", "-y", "@playwright/mcp@latest"]
      }
    }
  }
}
```

Verify the MCP server with `opencode mcp list` — it should report `playwright  connected`. The global OpenCode config (`~/.config/opencode/opencode.json`) also has a Playwright MCP entry; the project-local one takes precedence when working in this directory.
