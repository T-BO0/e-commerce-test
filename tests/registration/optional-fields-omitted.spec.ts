// spec: specs/registration.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Registration', () => {
  test('Create account with only mandatory fields (optional fields omitted)', async ({ page }) => {
    const uniqueId = Date.now().toString();
    const name = `QA Tester ${uniqueId}`;
    const email = `qa.tester.${uniqueId}@example.com`;

    // 1. Starting anonymous, click "Signup / Login", enter a generated unique name and a generated unique unused email in "New User Signup!", and click "Signup".
    await page.goto('/');
    await page.getByRole('link', { name: 'Signup / Login' }).click();
    await page.getByRole('textbox', { name: 'Name' }).fill(name);
    await page.locator('form').filter({ hasText: 'Signup' }).getByPlaceholder('Email Address').fill(email);
    await page.getByRole('button', { name: 'Signup' }).click();
    await expect(page.getByRole('heading', { name: 'Enter Account Information' })).toBeVisible();

    // 2. Leave the title radios, all three Date of Birth dropdowns, both newsletter/partner checkboxes, Company and Address 2 untouched.
    await expect(page.getByRole('radio', { name: 'Mr.' })).not.toBeChecked();
    await expect(page.getByRole('radio', { name: 'Mrs.' })).not.toBeChecked();
    await expect(page.locator('#days')).toHaveValue('');
    await expect(page.locator('#months')).toHaveValue('');
    await expect(page.locator('#years')).toHaveValue('');
    await expect(page.getByRole('checkbox', { name: 'Sign up for our newsletter!' })).not.toBeChecked();
    await expect(page.getByRole('checkbox', { name: /Receive special offers/ })).not.toBeChecked();
    await expect(page.getByRole('textbox', { name: 'Company', exact: true })).toHaveValue('');
    await expect(page.getByRole('textbox', { name: 'Address 2', exact: true })).toHaveValue('');

    // 3. Fill only the mandatory fields: "Password *", "First name *", "Last name *", "Address *", "State *", "City *", "Zipcode *" and "Mobile Number *", keeping the default "Country *" value, then click "Create Account".
    await page.getByRole('textbox', { name: 'Password *' }).fill('TestPass123!');
    await page.getByRole('textbox', { name: 'First name *' }).fill('QA');
    await page.getByRole('textbox', { name: 'Last name *' }).fill('Tester');
    await page.getByRole('textbox', { name: /^Address \*/ }).fill('123 Test Street');
    await page.getByRole('textbox', { name: 'State *' }).fill('California');
    await page.getByRole('textbox', { name: 'City * Zipcode *' }).fill('Los Angeles');
    await page.locator('#zipcode').fill('90001');
    await page.getByRole('textbox', { name: 'Mobile Number *' }).fill('1234567890');
    await expect(page.getByLabel('Country *')).not.toHaveValue('');
    await page.getByRole('button', { name: 'Create Account' }).click();
    await expect(page.getByRole('heading', { name: 'Account Created!' })).toBeVisible();

    // 4. Click "Continue" on the confirmation page.
    await page.getByRole('link', { name: 'Continue' }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByText(`Logged in as ${name}`)).toBeVisible();
  });
});
