# Part 01: BDD Introduction

## 📚 Overview
Behavior-Driven Development (BDD) bridges the gap between business and technical teams using natural language.

---

## 🎯 Key Concepts

### 1. What is BDD?

```gherkin
# BDD = Behavior-Driven Development
# - Collaboration between business, QA, and developers
# - Uses natural language (Gherkin)
# - Focus on behavior, not implementation
# - Living documentation
# - Executable specifications
```

### 2. Gherkin Syntax

```gherkin
Feature: User Authentication
  As a user
  I want to login to the application
  So that I can access my account

  Scenario: Successful login
    Given I am on the login page
    When I enter valid credentials
    And I click the login button
    Then I should be redirected to the dashboard
    And I should see a welcome message
```

### 3. Gherkin Keywords

```gherkin
# Feature - Describes the feature being tested
Feature: Shopping Cart

# Scenario - A specific test case
Scenario: Add item to cart

# Given - Preconditions/setup
Given I am logged in as a customer

# When - Actions performed
When I add a product to the cart

# Then - Expected outcomes
Then the cart should contain 1 item

# And/But - Additional steps
And the total should be updated
But the checkout button should be disabled

# Background - Common steps for all scenarios
Background:
  Given I am logged in
  And I am on the products page
```

### 4. Scenario Outline

```gherkin
Feature: Login Validation

  Scenario Outline: Login with different credentials
    Given I am on the login page
    When I enter "<email>" and "<password>"
    And I click login
    Then I should see "<message>"

    Examples:
      | email              | password  | message           |
      | valid@example.com  | valid123  | Welcome           |
      | invalid@test.com   | wrong     | Invalid credentials|
      | empty              | empty     | Email is required |
```

### 5. Data Tables

```gherkin
Scenario: Register new user
  Given I am on the registration page
  When I fill in the registration form:
    | field     | value              |
    | name      | John Doe           |
    | email     | john@example.com   |
    | password  | SecurePass123      |
  Then the account should be created

Scenario: Add multiple items to cart
  When I add the following items:
    | product    | quantity | price  |
    | Laptop     | 1        | 999.99 |
    | Mouse      | 2        | 29.99  |
    | Keyboard   | 1        | 79.99  |
  Then the cart total should be $1139.96
```

### 6. Tags

```gherkin
@smoke @login
Feature: User Login

  @positive
  Scenario: Valid login
    Given I am on the login page
    When I enter valid credentials
    Then I should be logged in

  @negative @security
  Scenario: Invalid login
    Given I am on the login page
    When I enter invalid credentials
    Then I should see an error message

  @wip
  Scenario: Password reset
    # Work in progress
```

### 7. Doc Strings

```gherkin
Scenario: Submit feedback
  Given I am on the feedback page
  When I enter the following feedback:
    """
    This is a multi-line
    feedback message that
    spans multiple lines.
    """
  Then the feedback should be submitted

Scenario: Verify JSON response
  Then the API response should be:
    """json
    {
      "status": "success",
      "message": "User created"
    }
    """
```

### 8. BDD Best Practices

```gherkin
# ✅ Good: Business-focused language
Scenario: Customer purchases product
  Given I have added "Laptop" to my cart
  When I complete the checkout process
  Then I should receive an order confirmation

# ❌ Bad: Technical implementation details
Scenario: Click buy button
  Given I navigate to /products/123
  When I click button#add-to-cart
  And I click div.checkout-btn
  Then the database should have a new order record
```

---

## 💻 Practice Exercises

1. Write a feature file for login
2. Create scenario outlines
3. Use data tables
4. Apply tags to scenarios
5. Write business-focused scenarios

---

## ✅ Best Practices

- ✅ Use business language
- ✅ Keep scenarios independent
- ✅ One behavior per scenario
- ✅ Use meaningful tags
- ❌ Don't include technical details
- ❌ Avoid UI-specific language

---

## 📝 Quick Reference

```gherkin
Feature: Feature name
  Background:
    Given common setup

  @tag
  Scenario: Scenario name
    Given precondition
    When action
    Then expected result

  Scenario Outline: With examples
    Given <input>
    Then <output>
    Examples:
      | input | output |
      | a     | b      |
```

