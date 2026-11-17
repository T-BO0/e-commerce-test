# Generated spec shape

Use this as the review target for a file produced by `playwright-test-generator`:

```ts
// spec: specs/<feature>.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('<Top-level suite name from the plan>', () => {
  test('<Scenario title from the plan>', async ({ page }) => {
    // 1. <Step text copied from the plan>
    await page.goto('/');
    await expect(page.getByRole('heading', { name: '<expected heading>' })).toBeVisible();

    // 2. <Next step text copied from the plan>
    await page.getByRole('link', { name: '<link name>' }).click();
    await expect(page).toHaveURL(/<route>/);
  });
});
```

## Review checklist

- [ ] Header comments point at the plan and the seed.
- [ ] One test per file; `describe` and test names mirror the plan.
- [ ] Comments reproduce the plan's steps in order, without duplicates.
- [ ] Role-based locators and web-first assertions; no `page.waitForTimeout`.
- [ ] No hard-coded host, no credentials, no shared mutable state.
- [ ] Locally generated test data (e.g. a timestamp-based email) where the scenario needs it.
