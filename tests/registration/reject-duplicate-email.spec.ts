// spec: specs/registration.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Registration', () => {
  test('Reject duplicate email address with an existing-account error', async ({ page }) => {
    const uniqueId = Date.now().toString();
    const name = `QA Tester ${uniqueId}`;
    const email = `qa.tester.${uniqueId}@example.com`;
    const duplicateName = `QA Tester Duplicate ${uniqueId}`;
    const signupEmail = page.locator('form').filter({ hasText: 'Signup' }).getByPlaceholder('Email Address');

    // 1. Starting anonymous, complete a minimal successful registration: from the home page click "Signup / Login", enter a generated unique name and a generated unique unused email in "New User Signup!", click "Signup", fill every mandatory field on "Enter Account Information" with generic test data, and click "Create Account"; then click "Continue" on the confirmation page.
    await page.goto('/');
    await page.getByRole('link', { name: 'Signup / Login' }).click();
    await page.getByRole('textbox', { name: 'Name' }).fill(name);
    await signupEmail.fill(email);
    await page.getByRole('button', { name: 'Signup' }).click();
    await page.getByRole('textbox', { name: 'Password *' }).fill('TestPass123!');
    await page.getByRole('textbox', { name: 'First name *' }).fill('QA');
    await page.getByRole('textbox', { name: 'Last name *' }).fill('Tester');
    await page.getByRole('textbox', { name: /^Address \*/ }).fill('123 Test Street');
    await page.getByRole('textbox', { name: 'State *' }).fill('California');
    await page.getByRole('textbox', { name: 'City * Zipcode *' }).fill('Los Angeles');
    await page.locator('#zipcode').fill('90001');
    await page.getByRole('textbox', { name: 'Mobile Number *' }).fill('1234567890');
    await page.getByRole('button', { name: 'Create Account' }).click();
    await page.getByRole('link', { name: 'Continue' }).click();
    await expect(page.getByText(`Logged in as ${name}`)).toBeVisible();

    // 2. Click the "Logout" link in the header to return to an anonymous session on the Signup / Login page.
    await page.getByRole('link', { name: 'Logout' }).click();
    await expect(page.getByRole('heading', { name: 'New User Signup!' })).toBeVisible();

    // 3. In "New User Signup!", type a different generated name in "Name" and re-use the exact email address of the account just created in "Email Address", then click "Signup".
    await page.getByRole('textbox', { name: 'Name' }).fill(duplicateName);
    await signupEmail.fill(email);
    await page.getByRole('button', { name: 'Signup' }).click();
    await expect(page.getByRole('heading', { name: 'Enter Account Information' })).toHaveCount(0);

    // 4. Inspect the signup form for feedback.
    await expect(page.getByText('Email Address already exist!')).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Name' })).toHaveValue(duplicateName);
    await expect(signupEmail).toHaveValue(email);
  });
});
