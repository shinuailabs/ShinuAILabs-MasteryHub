# Part 10: BDD Best Practices

## 📚 Overview
Following BDD best practices ensures maintainable, readable, and effective test automation.

---

## 🎯 Key Concepts

### 1. Write Business-Focused Scenarios

```gherkin
# ✅ Good: Business language
Scenario: Customer completes purchase
  Given I am a logged-in customer
  And I have added "Laptop" to my cart
  When I complete the checkout process
  Then I should receive an order confirmation email

# ❌ Bad: Technical implementation
Scenario: Click checkout button
  Given I navigate to /products/123
  When I click button#add-to-cart
  And I click div.checkout-btn
  And I fill input#card with "4242424242424242"
  Then the database should have a new order
```

### 2. Keep Scenarios Independent

```gherkin
# ✅ Good: Self-contained scenario
Scenario: View order history
  Given I am logged in as "john@example.com"
  And I have placed an order for "Laptop"
  When I view my order history
  Then I should see the "Laptop" order

# ❌ Bad: Depends on previous scenario
Scenario: Place order
  When I add "Laptop" to cart
  And I checkout
  Then order is placed

Scenario: View order  # Depends on above!
  When I view order history
  Then I see the order
```

### 3. One Behavior Per Scenario

```gherkin
# ✅ Good: Single behavior
Scenario: Login with valid credentials
  Given I am on the login page
  When I enter valid credentials
  Then I should be logged in

Scenario: Login shows error for invalid password
  Given I am on the login page
  When I enter invalid password
  Then I should see "Invalid password" error

# ❌ Bad: Multiple behaviors
Scenario: Login functionality
  Given I am on the login page
  When I enter valid credentials
  Then I should be logged in
  When I logout
  And I enter invalid credentials
  Then I should see an error
```

### 4. Use Background Wisely

```gherkin
# ✅ Good: Common setup
Feature: Shopping Cart

  Background:
    Given I am logged in as a customer
    And I am on the products page

  Scenario: Add item to cart
    When I add "Laptop" to my cart
    Then my cart should contain "Laptop"

  Scenario: Remove item from cart
    Given I have "Laptop" in my cart
    When I remove "Laptop" from my cart
    Then my cart should be empty

# ❌ Bad: Too much in background
Background:
  Given I am logged in
  And I have items in cart
  And I am on checkout
  And I have entered shipping
  # Too specific for all scenarios
```

### 5. Meaningful Step Names

```gherkin
# ✅ Good: Clear and descriptive
Given I am logged in as an administrator
When I create a new user with email "test@example.com"
Then the user should appear in the user list

# ❌ Bad: Vague and unclear
Given I am ready
When I do the thing
Then it should work
```

### 6. Reusable Step Definitions

```typescript
// ✅ Good: Parameterized and reusable
Given('I am logged in as {word}', async function(role: string) {
  const credentials = users[role];
  await this.loginPage.login(credentials.email, credentials.password);
});

When('I navigate to the {string} page', async function(pageName: string) {
  await this.page.goto(pages[pageName]);
});

Then('I should see {string} message', async function(message: string) {
  await expect(this.page.locator('.message')).toContainText(message);
});

// ❌ Bad: Hardcoded and specific
Given('I am logged in as admin with email admin@test.com', async function() {
  await this.page.fill('#email', 'admin@test.com');
  await this.page.fill('#password', 'admin123');
  await this.page.click('#login');
});
```

### 7. Organize Feature Files

```
features/
├── authentication/
│   ├── login.feature
│   ├── logout.feature
│   └── password-reset.feature
├── shopping/
│   ├── cart.feature
│   ├── checkout.feature
│   └── products.feature
├── user-management/
│   ├── profile.feature
│   └── settings.feature
└── support/
    ├── hooks.ts
    ├── world.ts
    └── pages/
```

### 8. Tag Strategy

```gherkin
# Consistent tagging
@smoke @critical
Feature: User Authentication

  @positive
  Scenario: Successful login
    ...

  @negative @security
  Scenario: Brute force protection
    ...

  @wip
  Scenario: Two-factor authentication
    ...
```

### 9. Data Management

```gherkin
# ✅ Good: Use examples for data variations
Scenario Outline: Login validation
  When I login with "<email>" and "<password>"
  Then I should see "<result>"

  Examples:
    | email           | password | result  |
    | valid@test.com  | correct  | Welcome |
    | invalid@test.com| wrong    | Error   |

# ✅ Good: Use data tables for structured data
When I fill the form:
  | field    | value           |
  | Name     | John Doe        |
  | Email    | john@test.com   |
```

### 10. Documentation

```gherkin
Feature: Shopping Cart Management
  As a customer
  I want to manage items in my shopping cart
  So that I can purchase products I'm interested in

  # Business rules:
  # - Cart persists across sessions for logged-in users
  # - Maximum 99 of same item
  # - Cart expires after 30 days of inactivity

  @smoke
  Scenario: Add item to empty cart
    Given I am a logged-in customer
    And my cart is empty
    When I add "Wireless Mouse" to my cart
    Then my cart should contain 1 item
    And the cart total should be $29.99
```

---

## 💻 Practice Exercises

1. Refactor scenarios to business language
2. Make scenarios independent
3. Implement reusable steps
4. Organize feature files
5. Create tag strategy

---

## ✅ Best Practices Summary

- ✅ Use business language
- ✅ Keep scenarios independent
- ✅ One behavior per scenario
- ✅ Use Background for common setup
- ✅ Create reusable steps
- ✅ Organize files logically
- ✅ Use consistent tags
- ❌ Don't use technical details
- ❌ Avoid scenario dependencies
- ❌ Don't test multiple behaviors

---

## 📝 Quick Reference

```gherkin
# Good scenario structure
Feature: Feature name
  As a [role]
  I want [feature]
  So that [benefit]

  Background:
    Given common setup

  @tag
  Scenario: Clear description
    Given precondition
    When action
    Then expected result
```

```typescript
// Reusable step
Given('I am logged in as {word}', async (role) => { });
When('I {word} the {string}', async (action, item) => { });
Then('I should see {string}', async (text) => { });
```

