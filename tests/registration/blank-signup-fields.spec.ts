// spec: specs/registration.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Registration', () => {
  test('Blank required fields on the signup form block registration', async ({ page }) => {
    const uniqueId = Date.now().toString();
    const name = `QA Tester ${uniqueId}`;
    const email = `qa.tester.${uniqueId}@example.com`;
    const signupName = page.getByRole('textbox', { name: 'Name' });
    const signupEmail = page.locator('form').filter({ hasText: 'Signup' }).getByPlaceholder('Email Address');
    const signupButton = page.getByRole('button', { name: 'Signup' });

    // 1. From the home page, click "Signup / Login".
    await page.goto('/');
    await page.getByRole('link', { name: 'Signup / Login' }).click();
    await expect(page.getByRole('heading', { name: 'New User Signup!' })).toBeVisible();

    // 2. Leave both "Name" and "Email Address" empty and click the "Signup" button.
    await signupButton.click();
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByRole('heading', { name: 'Enter Account Information' })).toHaveCount(0);

    // 3. Type a generated unique name in "Name" but leave "Email Address" empty, then click "Signup".
    await signupName.fill(name);
    await signupButton.click();
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByRole('heading', { name: 'Enter Account Information' })).toHaveCount(0);

    // 4. Clear "Name", type a generated unique unused email in "Email Address" but leave "Name" empty, then click "Signup".
    await signupName.fill('');
    await signupEmail.fill(email);
    await signupButton.click();
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByRole('heading', { name: 'Enter Account Information' })).toHaveCount(0);

    // 5. Confirm the required state of both signup inputs.
    await expect(signupName).toHaveJSProperty('required', true);
    await expect(signupEmail).toHaveJSProperty('required', true);
  });
});
