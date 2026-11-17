# Test plan — <Feature name>

**Target:** <URL or app area>
**Scope:** <what is covered / explicitly out of scope>
**Starting state:** Fresh browser context, anonymous user (unless stated otherwise)

## Scenario 1: <descriptive title>

**Goal:** <what this proves>

1. Navigate to <page/route>.
2. <action using role-based labels, e.g. select "Guest checkout">.
3. <next action>.

**Expected outcome:**
- <observable result, e.g. the order confirmation heading is visible>
- <secondary assertion, e.g. the cart badge reads "0">

**Failure conditions:**
- <what counts as a failure, e.g. error message shown, redirect to login>

## Scenario 2: <edge case or negative path>

...repeat the structure above.

## Assumptions / notes

- <fixtures, test data, or environment prerequisites>
- <known flaky areas or items deliberately not covered>
