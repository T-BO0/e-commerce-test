// spec: specs/registration.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Registration', () => {
  test('Account information form enforces required fields and preserves signup identity', async ({ page }) => {
    const uniqueId = Date.now().toString();
    const name = `QA Tester ${uniqueId}`;
    const email = `qa.tester.${uniqueId}@example.com`;
    const password = 'TestPass123!';

    // 1. Starting anonymous, click "Signup / Login", enter a generated unique name and a generated unique unused email in "New User Signup!", and click "Signup" to reach "Enter Account Information".
    await page.goto('/');
    await page.getByRole('link', { name: 'Signup / Login' }).click();
    await page.getByRole('textbox', { name: 'Name' }).fill(name);
    await page.locator('form').filter({ hasText: 'Signup' }).getByPlaceholder('Email Address').fill(email);
    await page.getByRole('button', { name: 'Signup' }).click();
    await expect(page.getByRole('heading', { name: 'Enter Account Information' })).toBeVisible();

    // 2. Leave all mandatory fields blank and click "Create Account".
    await page.getByRole('button', { name: 'Create Account' }).click();
    await expect(page).toHaveURL(/\/signup/);
    await expect(page.getByText('Account Created!')).toHaveCount(0);
    await expect(page.getByRole('heading', { name: 'Enter Account Information' })).toBeVisible();

    // 3. Type a password only and click "Create Account" again.
    await page.getByRole('textbox', { name: 'Password *' }).fill(password);
    await page.getByRole('button', { name: 'Create Account' }).click();
    await expect(page).toHaveURL(/\/signup/);
    await expect(page.getByText('Account Created!')).toHaveCount(0);

    // 4. Inspect the password control.
    const passwordField = page.getByRole('textbox', { name: 'Password *' });
    await expect(passwordField).toHaveAttribute('type', 'password');
    await expect(passwordField).toHaveValue(password);

    // 5. Inspect the "Name *" and "Email *" fields.
    await expect(page.getByRole('textbox', { name: 'Name *', exact: true })).toHaveValue(name);
    await expect(page.getByRole('textbox', { name: 'Email *' })).toHaveValue(email);
    await expect(page.getByRole('textbox', { name: 'Email *' })).toBeDisabled();

    // 6. Confirm the mandatory markers on the address fields.
    await expect(page.getByRole('textbox', { name: 'First name *' })).toHaveJSProperty('required', true);
    await expect(page.getByRole('textbox', { name: 'Last name *' })).toHaveJSProperty('required', true);
    await expect(page.getByRole('textbox', { name: /^Address \*/ })).toHaveJSProperty('required', true);
    await expect(page.getByLabel('Country *')).toHaveJSProperty('required', true);
    await expect(page.getByRole('textbox', { name: 'State *' })).toHaveJSProperty('required', true);
    await expect(page.getByRole('textbox', { name: 'City * Zipcode *' })).toHaveJSProperty('required', true);
    await expect(page.locator('#zipcode')).toHaveJSProperty('required', true);
    await expect(page.getByRole('textbox', { name: 'Mobile Number *' })).toHaveJSProperty('required', true);
    await expect(page.getByRole('textbox', { name: 'Company', exact: true })).toHaveJSProperty('required', false);
    await expect(page.getByRole('textbox', { name: 'Address 2', exact: true })).toHaveJSProperty('required', false);
    await expect(page.getByRole('radio', { name: 'Mr.' })).toHaveJSProperty('required', false);
    await expect(page.locator('#days')).toHaveJSProperty('required', false);
    await expect(page.locator('#months')).toHaveJSProperty('required', false);
    await expect(page.locator('#years')).toHaveJSProperty('required', false);
    await expect(page.getByRole('checkbox', { name: 'Sign up for our newsletter!' })).toHaveJSProperty('required', false);
    await expect(page.getByRole('checkbox', { name: /Receive special offers/ })).toHaveJSProperty('required', false);
  });
});
