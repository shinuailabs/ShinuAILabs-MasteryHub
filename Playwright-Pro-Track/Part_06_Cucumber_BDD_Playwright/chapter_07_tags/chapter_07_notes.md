# Part 07: Tags

## 📚 Overview
Tags organize and filter scenarios, enabling selective test execution and categorization.

---

## 🎯 Key Concepts

### 1. Basic Tags

```gherkin
@smoke
Feature: User Authentication

  @login @positive
  Scenario: Successful login
    Given I am on the login page
    When I enter valid credentials
    Then I should be logged in

  @login @negative
  Scenario: Failed login
    Given I am on the login page
    When I enter invalid credentials
    Then I should see an error

  @registration @wip
  Scenario: User registration
    # Work in progress
```

### 2. Tag Inheritance

```gherkin
@authentication
Feature: Authentication Tests
  # All scenarios inherit @authentication

  @smoke
  Scenario: Quick login test
    # Has both @authentication and @smoke

  @regression
  Scenario: Full login flow
    # Has both @authentication and @regression
```

### 3. Running Tagged Tests

```bash
# Run scenarios with specific tag
npx cucumber-js --tags "@smoke"

# Run scenarios with multiple tags (AND)
npx cucumber-js --tags "@smoke and @login"

# Run scenarios with either tag (OR)
npx cucumber-js --tags "@smoke or @regression"

# Exclude tags (NOT)
npx cucumber-js --tags "not @wip"

# Complex expressions
npx cucumber-js --tags "@smoke and not @slow"
npx cucumber-js --tags "(@smoke or @critical) and not @wip"
```

### 4. Common Tag Categories

```gherkin
# Test Type Tags
@smoke           # Quick sanity tests
@regression      # Full regression suite
@integration     # Integration tests
@e2e             # End-to-end tests

# Priority Tags
@critical        # Must-pass tests
@high            # High priority
@medium          # Medium priority
@low             # Low priority

# Status Tags
@wip             # Work in progress
@skip            # Skip this test
@flaky           # Known flaky test
@manual          # Manual test reference

# Feature Tags
@login           # Login feature
@checkout        # Checkout feature
@search          # Search feature

# Environment Tags
@dev             # Development only
@staging         # Staging only
@prod            # Production safe
```

### 5. Tagged Hooks

```typescript
// support/hooks.ts
import { Before, After } from '@cucumber/cucumber';

// Run only for @authenticated scenarios
Before({ tags: '@authenticated' }, async function(this: CustomWorld) {
  await this.loginAsUser();
});

// Run only for @admin scenarios
Before({ tags: '@admin' }, async function(this: CustomWorld) {
  await this.loginAsAdmin();
});

// Skip @wip scenarios
Before({ tags: '@wip' }, async function() {
  return 'skipped';
});

// Cleanup for @creates-data scenarios
After({ tags: '@creates-data' }, async function(this: CustomWorld) {
  await this.cleanupTestData();
});

// Complex tag expressions
Before({ tags: '@api and not @slow' }, async function(this: CustomWorld) {
  this.apiClient = new FastAPIClient();
});
```

### 6. Package.json Scripts

```json
{
  "scripts": {
    "test": "cucumber-js",
    "test:smoke": "cucumber-js --tags '@smoke'",
    "test:regression": "cucumber-js --tags '@regression'",
    "test:critical": "cucumber-js --tags '@critical'",
    "test:no-wip": "cucumber-js --tags 'not @wip'",
    "test:login": "cucumber-js --tags '@login'",
    "test:checkout": "cucumber-js --tags '@checkout'",
    "test:fast": "cucumber-js --tags '@smoke and not @slow'",
    "test:ci": "cucumber-js --tags '@smoke or @critical' --tags 'not @flaky'"
  }
}
```

### 7. Tag Expressions

```bash
# AND - both tags required
--tags "@smoke and @login"

# OR - either tag
--tags "@smoke or @regression"

# NOT - exclude tag
--tags "not @wip"

# Parentheses for grouping
--tags "(@smoke or @critical) and not @slow"

# Multiple --tags (AND between them)
--tags "@smoke" --tags "not @wip"
# Same as: @smoke and not @wip
```

### 8. Organizing with Tags

```gherkin
# features/checkout.feature
@checkout @e2e
Feature: Checkout Process

  Background:
    Given I am logged in
    And I have items in my cart

  @smoke @critical
  Scenario: Complete checkout with credit card
    When I proceed to checkout
    And I enter shipping information
    And I pay with credit card
    Then I should see order confirmation

  @regression
  Scenario: Checkout with PayPal
    When I proceed to checkout
    And I select PayPal payment
    Then I should be redirected to PayPal

  @regression @slow
  Scenario: Checkout with multiple addresses
    When I proceed to checkout
    And I add multiple shipping addresses
    And I split the order
    Then each item should have correct address

  @negative
  Scenario: Checkout with expired card
    When I proceed to checkout
    And I enter expired card details
    Then I should see payment error
```

### 9. CI/CD Tag Strategy

```yaml
# .github/workflows/test.yml
jobs:
  smoke-tests:
    runs-on: ubuntu-latest
    steps:
      - run: npm run test:smoke

  regression-tests:
    runs-on: ubuntu-latest
    needs: smoke-tests
    steps:
      - run: npm run test:regression

  nightly-full:
    runs-on: ubuntu-latest
    schedule:
      - cron: '0 0 * * *'
    steps:
      - run: npm run test -- --tags "not @wip and not @manual"
```

---

## 💻 Practice Exercises

1. Add tags to feature files
2. Create tagged hooks
3. Set up npm scripts for tags
4. Use complex tag expressions
5. Implement CI tag strategy

---

## ✅ Best Practices

- ✅ Use consistent tag naming
- ✅ Document tag meanings
- ✅ Keep tags simple
- ✅ Use tags for CI filtering
- ❌ Don't over-tag scenarios
- ❌ Avoid redundant tags

---

## 📝 Quick Reference

```bash
# Tag expressions
--tags "@tag"                    # Has tag
--tags "not @tag"                # Doesn't have tag
--tags "@tag1 and @tag2"         # Has both
--tags "@tag1 or @tag2"          # Has either
--tags "(@a or @b) and not @c"   # Complex

# Common tags
@smoke @regression @wip @skip
@critical @high @medium @low
@positive @negative
@slow @fast
```

```typescript
// Tagged hooks
Before({ tags: '@tag' }, async () => { })
After({ tags: '@tag and not @skip' }, async () => { })
```

