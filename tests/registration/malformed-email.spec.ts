// spec: specs/registration.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Registration', () => {
  test('Malformed email address is rejected by signup validation', async ({ page }) => {
    const uniqueId = Date.now().toString();
    const name = `QA Tester ${uniqueId}`;
    const signupEmail = page.locator('form').filter({ hasText: 'Signup' }).getByPlaceholder('Email Address');
    const signupButton = page.getByRole('button', { name: 'Signup' });

    // 1. From the home page, click "Signup / Login".
    await page.goto('/');
    await page.getByRole('link', { name: 'Signup / Login' }).click();
    await expect(page.getByRole('heading', { name: 'New User Signup!' })).toBeVisible();

    // 2. Type a generated unique name in "Name" and a malformed email address such as `not-an-email` (no @ symbol) in "Email Address", then click "Signup".
    await page.getByRole('textbox', { name: 'Name' }).fill(name);
    await signupEmail.fill('not-an-email');
    await signupButton.click();
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByRole('heading', { name: 'Enter Account Information' })).toHaveCount(0);

    // 3. Observe the "Email Address" field state.
    await expect(signupEmail).toHaveAttribute('type', 'email');
    await expect(signupEmail).toHaveJSProperty('validity.valid', false);

    // 4. Replace the value with a second malformed address such as `user@` and click "Signup" again.
    await signupEmail.fill('user@');
    await signupButton.click();
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByRole('heading', { name: 'Enter Account Information' })).toHaveCount(0);
    await expect(signupEmail).toHaveJSProperty('validity.valid', false);
  });
});
