// spec: specs/registration.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Registration', () => {
  test('Successfully register a new account and reach the logged-in state', async ({ page }) => {
    const uniqueId = Date.now().toString();
    const name = `QA Tester ${uniqueId}`;
    const email = `qa.tester.${uniqueId}@example.com`;
    const password = 'TestPass123!';

    // 1. From the site home page, click the "Signup / Login" link in the header.
    await page.goto('/');
    await page.getByRole('link', { name: 'Signup / Login' }).click();
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByRole('heading', { name: 'Login to your account' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'New User Signup!' })).toBeVisible();

    // 2. In the "New User Signup!" section, type a generated unique full name into the "Name" textbox and a generated unique, unused email address into the "Email Address" textbox.
    const signupEmail = page.locator('form').filter({ hasText: 'Signup' }).getByPlaceholder('Email Address');
    await page.getByRole('textbox', { name: 'Name' }).fill(name);
    await signupEmail.fill(email);
    await expect(page.getByRole('textbox', { name: 'Name' })).toHaveValue(name);
    await expect(signupEmail).toHaveValue(email);

    // 3. Click the "Signup" button.
    await page.getByRole('button', { name: 'Signup' }).click();
    await expect(page).toHaveURL(/\/signup/);
    await expect(page.getByRole('heading', { name: 'Enter Account Information' })).toBeVisible();

    // 4. On the "Enter Account Information" page, observe the "Name *" and "Email *" fields.
    await expect(page.getByRole('textbox', { name: 'Name *', exact: true })).toHaveValue(name);
    await expect(page.getByRole('textbox', { name: 'Email *' })).toHaveValue(email);
    await expect(page.getByRole('textbox', { name: 'Email *' })).toBeDisabled();

    // 5. Select the "Mr." title radio button, type a non-empty password into the "Password *" textbox, and choose valid values in the Day, Month and Year Date of Birth dropdowns.
    await page.getByRole('radio', { name: 'Mr.' }).click();
    await page.getByRole('textbox', { name: 'Password *' }).fill(password);
    await page.locator('#days').selectOption('15');
    await page.locator('#months').selectOption('June');
    await page.locator('#years').selectOption('1990');
    await expect(page.getByRole('radio', { name: 'Mr.' })).toBeChecked();
    await expect(page.getByRole('textbox', { name: 'Password *' })).toHaveAttribute('type', 'password');
    await expect(page.getByRole('textbox', { name: 'Password *' })).toHaveValue(password);
    await expect(page.locator('#days')).toHaveValue('15');
    await expect(page.locator('#months')).toHaveValue('6');
    await expect(page.locator('#years')).toHaveValue('1990');

    // 6. Fill the mandatory address fields: "First name *", "Last name *", "Address *", "State *", "City *", "Zipcode *" and "Mobile Number *"; leave the "Country *" dropdown at its default value; tick the optional "Sign up for our newsletter!" and "Receive special offers from our partners!" checkboxes.
    await page.getByRole('textbox', { name: 'First name *' }).fill('QA');
    await page.getByRole('textbox', { name: 'Last name *' }).fill('Tester');
    await page.getByRole('textbox', { name: /^Address \*/ }).fill('123 Test Street');
    await page.getByRole('textbox', { name: 'State *' }).fill('California');
    await page.getByRole('textbox', { name: 'City * Zipcode *' }).fill('Los Angeles');
    await page.locator('#zipcode').fill('90001');
    await page.getByRole('textbox', { name: 'Mobile Number *' }).fill('1234567890');
    await expect(page.getByLabel('Country *')).not.toHaveValue('');
    const newsletter = page.getByRole('checkbox', { name: 'Sign up for our newsletter!' });
    const specialOffers = page.getByRole('checkbox', { name: /Receive special offers/ });
    await newsletter.click();
    await specialOffers.click();
    await expect(newsletter).toBeChecked();
    await expect(specialOffers).toBeChecked();

    // 7. Click the "Create Account" button.
    await page.getByRole('button', { name: 'Create Account' }).click();
    await expect(page).toHaveURL(/\/account_created/);
    await expect(page.getByRole('heading', { name: 'Account Created!' })).toBeVisible();
    await expect(page.getByText('Congratulations! Your new account has been successfully created!')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Continue' })).toBeVisible();

    // 8. Click the "Continue" link.
    await page.getByRole('link', { name: 'Continue' }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByText(`Logged in as ${name}`)).toBeVisible();
    await expect(page.getByRole('link', { name: 'Logout' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Delete Account' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Signup / Login' })).toHaveCount(0);

    // 9. Confirm that no validation or duplicate-account error was shown at any step.
    await expect(page.getByText('Email Address already exist!')).toHaveCount(0);
  });
});
