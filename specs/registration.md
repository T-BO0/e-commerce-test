# Registration Test Plan

## Application Overview

**Target:** https://automationexercise.com/ — Automation Exercise, a full-fledged practice e-commerce website used for QA/Automation training.

**Scope:** The registration (new account sign-up) feature area only. This covers the "New User Signup!" form on the **Signup / Login** page, the follow-on **Enter Account Information** form, and the immediate outcomes of registration — the **Account Created!** confirmation and the resulting logged-in header state. Login itself is included only where it is a natural follow-on check of registration (verifying the newly created session); dedicated login testing is out of scope.

**Starting state:** Every scenario assumes a fresh browser context and an anonymous visitor on the site home page with no active session. All test data (names, email addresses, addresses, passwords) is generated locally within each scenario so scenarios are independent and can be run in any order.

## Test Scenarios

### 1. Registration

**Seed:** `tests/seed.spec.ts`

#### 1.1. Successfully register a new account and reach the logged-in state

**Goal:** Verify that a brand-new visitor can create an account end to end and is immediately signed in, with the identity entered at sign-up carried through the flow.

**File:** `tests/registration/successfully-register-new-account.spec.ts`

**Steps:**
1. From the site home page, click the "Signup / Login" link in the header.
   - expect: The Signup / Login page opens (URL `/login`) with a "Login to your account" section and a "New User Signup!" section.
2. In the "New User Signup!" section, type a generated unique full name into the "Name" textbox and a generated unique, unused email address into the "Email Address" textbox.
   - expect: Both textboxes display the entered values.
3. Click the "Signup" button.
   - expect: The "Enter Account Information" page opens (URL `/signup`), headed "Enter Account Information".
4. On the "Enter Account Information" page, observe the "Name *" and "Email *" fields.
   - expect: "Name *" is pre-filled with the name entered in step 2.
   - expect: "Email *" is pre-filled with the same email address and is disabled/read-only so it cannot be changed.
5. Select the "Mr." title radio button, type a non-empty password into the "Password *" textbox, and choose valid values in the Day, Month and Year Date of Birth dropdowns.
   - expect: The title is selected, the password is accepted and masked, and the three DOB dropdowns show the selected values.
6. Fill the mandatory address fields: "First name *", "Last name *", "Address *", "State *", "City *", "Zipcode *" and "Mobile Number *"; leave the "Country *" dropdown at its default value; tick the optional "Sign up for our newsletter!" and "Receive special offers from our partners!" checkboxes.
   - expect: All mandatory address fields contain values, Country shows a selected value, and both optional checkboxes are checked.
7. Click the "Create Account" button.
   - expect: The "Account Created!" confirmation page opens (URL `/account_created`) showing "Congratulations! Your new account has been successfully created!" and a "Continue" link.
8. Click the "Continue" link.
   - expect: The browser returns to the home page.
   - expect: The header shows "Logged in as <the registered name>" and displays "Logout" and "Delete Account" links instead of "Signup / Login".
9. Confirm that no validation or duplicate-account error was shown at any step.
   - expect: No "Email Address already exist!" message or other error text is displayed anywhere in the flow.

**Expected outcome:** A new account is created, the confirmation page appears, and the user is authenticated with the correct name shown in the header.

**Failure conditions:** The flow fails if the "Enter Account Information" page does not open after Signup, if any validation/duplicate error blocks submission, if the "Account Created!" page is not shown, or if "Logged in as <name>" does not appear after Continue.

#### 1.2. Reject duplicate email address with an existing-account error

**Goal:** Verify that signing up with an email address that is already registered is rejected with a clear error and does not create a second account.

**File:** `tests/registration/reject-duplicate-email.spec.ts`

**Steps:**
1. Starting anonymous, complete a minimal successful registration: from the home page click "Signup / Login", enter a generated unique name and a generated unique unused email in "New User Signup!", click "Signup", fill every mandatory field on "Enter Account Information" with generic test data, and click "Create Account"; then click "Continue" on the confirmation page.
   - expect: The first account is created and the header shows "Logged in as <name>".
2. Click the "Logout" link in the header to return to an anonymous session on the Signup / Login page.
   - expect: The "New User Signup!" section is available again.
3. In "New User Signup!", type a different generated name in "Name" and re-use the exact email address of the account just created in "Email Address", then click "Signup".
   - expect: The application does not open the "Enter Account Information" page for a duplicate account.
4. Inspect the signup form for feedback.
   - expect: The message "Email Address already exist!" is displayed next to the signup form.
   - expect: The "Name" and "Email Address" textboxes still hold the entered values.

**Expected outcome:** The duplicate sign-up is blocked in place and an explicit "Email Address already exist!" error is shown; no new account is created.

**Failure conditions:** The flow fails if a second "Enter Account Information" page opens for the duplicate email, if no error message is displayed, if the error text differs from "Email Address already exist!", or if the first account is modified/overwritten.

#### 1.3. Blank required fields on the signup form block registration

**Goal:** Verify that the "New User Signup!" form cannot be submitted when the mandatory Name and/or Email Address fields are empty.

**File:** `tests/registration/blank-signup-fields.spec.ts`

**Steps:**
1. From the home page, click "Signup / Login".
   - expect: The Signup / Login page with the "New User Signup!" form is displayed.
2. Leave both "Name" and "Email Address" empty and click the "Signup" button.
   - expect: The form is not submitted; the browser stays on the Signup / Login page and the "Enter Account Information" page does not open.
3. Type a generated unique name in "Name" but leave "Email Address" empty, then click "Signup".
   - expect: Submission is still blocked; no account information page opens.
4. Clear "Name", type a generated unique unused email in "Email Address" but leave "Name" empty, then click "Signup".
   - expect: Submission is still blocked; no account information page opens.
5. Confirm the required state of both signup inputs.
   - expect: Both "Name" and "Email Address" are marked as required by the browser, so an empty value cannot progress the flow.

**Expected outcome:** Every attempt with one or both mandatory signup fields empty is blocked by client-side validation and the user never reaches the account information page.

**Failure conditions:** The flow fails if the browser navigates to "Enter Account Information" with an empty Name or Email, or if either field is not enforced as required.

#### 1.4. Malformed email address is rejected by signup validation

**Goal:** Verify that the email field rejects values that are not valid email addresses, so malformed input cannot reach the account information step.

**File:** `tests/registration/malformed-email.spec.ts`

**Steps:**
1. From the home page, click "Signup / Login".
   - expect: The Signup / Login page with the "New User Signup!" form is displayed.
2. Type a generated unique name in "Name" and a malformed email address such as `not-an-email` (no @ symbol) in "Email Address", then click "Signup".
   - expect: The form is not submitted and the "Enter Account Information" page does not open.
3. Observe the "Email Address" field state.
   - expect: The email textbox is flagged invalid by the browser because the value is not in a valid email format.
4. Replace the value with a second malformed address such as `user@` and click "Signup" again.
   - expect: Submission remains blocked and no account information page opens.

**Expected outcome:** Malformed email values are rejected by the browser's email-format validation and no account information page is reached.

**Failure conditions:** The flow fails if a malformed email is accepted and advances to "Enter Account Information", or if the email field is not validated as an email-format input.

#### 1.5. Account information form enforces required fields and preserves signup identity

**Goal:** Verify that the "Enter Account Information" form blocks submission until all mandatory fields are supplied, masks the password, and carries the sign-up identity forward as read-only data.

**File:** `tests/registration/account-form-validation.spec.ts`

**Steps:**
1. Starting anonymous, click "Signup / Login", enter a generated unique name and a generated unique unused email in "New User Signup!", and click "Signup" to reach "Enter Account Information".
   - expect: The "Enter Account Information" page is displayed.
2. Leave all mandatory fields blank and click "Create Account".
   - expect: The form is not submitted; no "Account Created!" page is shown and the user remains on "Enter Account Information".
3. Type a password only and click "Create Account" again.
   - expect: Submission is still blocked because the other mandatory fields are empty.
4. Inspect the password control.
   - expect: The password control is a password-type textbox whose characters are masked.
5. Inspect the "Name *" and "Email *" fields.
   - expect: "Name *" is pre-filled with the name from sign-up and "Email *" is pre-filled with the sign-up email and is disabled so it cannot be edited.
6. Confirm the mandatory markers on the address fields.
   - expect: "First name *", "Last name *", "Address *", "Country *", "State *", "City *", "Zipcode *" and "Mobile Number *" are marked as required, while Company, Address 2, title, Date of Birth and the two checkboxes are not.

**Expected outcome:** Incomplete submissions are blocked, the password is masked, the sign-up identity is preserved and non-editable, and required vs. optional fields are clearly distinguished.

**Failure conditions:** The flow fails if "Create Account" succeeds with empty mandatory fields, if the password is shown in plain text, if the email can be altered, or if the required-field markers do not match the stated set.

#### 1.6. Create account with only mandatory fields (optional fields omitted)

**Goal:** Verify that all optional fields are genuinely optional — an account can be created when only the mandatory fields are supplied.

**File:** `tests/registration/optional-fields-omitted.spec.ts`

**Steps:**
1. Starting anonymous, click "Signup / Login", enter a generated unique name and a generated unique unused email in "New User Signup!", and click "Signup".
   - expect: The "Enter Account Information" page is displayed.
2. Leave the title radios, all three Date of Birth dropdowns, both newsletter/partner checkboxes, Company and Address 2 untouched.
   - expect: These optional controls remain in their default/unselected state.
3. Fill only the mandatory fields: "Password *", "First name *", "Last name *", "Address *", "State *", "City *", "Zipcode *" and "Mobile Number *", keeping the default "Country *" value, then click "Create Account".
   - expect: The "Account Created!" confirmation page is shown.
4. Click "Continue" on the confirmation page.
   - expect: The home page loads with "Logged in as <the registered name>" in the header, confirming the account was created even with all optional fields omitted.

**Expected outcome:** The account is created successfully with no errors despite every optional field being left blank, and the user is logged in.

**Failure conditions:** The flow fails if any optional control is treated as required, if submission is blocked, or if the confirmation/logged-in state is not reached.

## Assumptions / Notes

- All scenarios start from a fresh browser context with no active session; each one generates its own unique, unused email address and generic display name locally (for example with a timestamp). No real user credentials, tokens, or customer data are used anywhere in this plan.
- The duplicate-email scenario (1.2) creates its own account first and then reuses that email, so it does not depend on any pre-existing user or on test execution order.
- Both forms use browser-native HTML5 validation: `required` on the mandatory inputs and `type="email"` on the email inputs. Consequently, empty or malformed values are rejected by the browser itself (a validation tooltip), not by an application-rendered error message; verifying "blocked / did not navigate" is the appropriate assertion for those cases.
- The password field has no client-side complexity or minimum-length rule in the current UI — only that it is non-empty. Testing a specific password-strength policy is therefore out of scope; only requiredness and masking are asserted.
- The exact registered name is referenced generically as `<the registered name>` / `<name>`; the actual value is the unique name generated by the scenario.
- "Logged in as …", "Logout" and "Delete Account" in the header are the observable signals that registration produced an authenticated session; these immediate follow-on checks are included but deeper account/cart behavior is not part of this scope.
