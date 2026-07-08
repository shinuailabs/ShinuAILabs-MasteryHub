# Lab 549: Gherkin Syntax
#
# =====================
# LEARNING CONCEPT:
# =====================
# Gherkin language syntax:
#
# - Keywords
# - Feature structure
# - Scenarios
# - Steps
#
# =====================
# EXERCISE:
# =====================
# 1. Learn Gherkin keywords
# 2. Write proper features
# 3. Use all step types
#
# =====================
# SOLUTION:
# =====================

# Solution 1: Feature with Description
Feature: Shopping Cart Management
  As an online shopper
  I want to manage items in my shopping cart
  So that I can purchase the products I need

  # Solution 2: Background (runs before each scenario)
  Background:
    Given I am logged in as a customer
    And I have an empty shopping cart

  # Solution 3: Basic Scenario
  Scenario: Add single item to cart
    Given I am viewing product "Laptop"
    When I click "Add to Cart"
    Then the cart should contain 1 item
    And the cart total should be "$999.99"

  # Solution 4: Scenario with And/But
  Scenario: Add multiple items to cart
    Given I am viewing product "Laptop"
    When I click "Add to Cart"
    And I navigate to product "Mouse"
    And I click "Add to Cart"
    Then the cart should contain 2 items
    But the shipping should still be free

  # Solution 5: Scenario with Doc String
  Scenario: Add item with special instructions
    Given I am viewing product "Custom T-Shirt"
    When I add special instructions:
      """
      Please print the following text:
      "Hello World"
      Size: Large
      Color: Blue
      """
    And I click "Add to Cart"
    Then the item should have special instructions

  # Solution 6: Scenario with Data Table
  Scenario: Add multiple products at once
    When I add the following products to cart:
      | Product    | Quantity | Price   |
      | Laptop     | 1        | $999.99 |
      | Mouse      | 2        | $29.99  |
      | Keyboard   | 1        | $79.99  |
    Then the cart should contain 4 items
    And the cart total should be "$1139.96"

  # Solution 7: Scenario with Examples (Scenario Outline)
  Scenario Outline: Apply discount codes
    Given I have items worth "<total>" in my cart
    When I apply discount code "<code>"
    Then I should see discount of "<discount>"
    And the final total should be "<final>"

    Examples:
      | total   | code     | discount | final   |
      | $100.00 | SAVE10   | $10.00   | $90.00  |
      | $200.00 | SAVE20   | $40.00   | $160.00 |
      | $50.00  | FREESHIP | $0.00    | $50.00  |

  # Solution 8: Tagged Scenario
  @smoke @critical
  Scenario: Remove item from cart
    Given I have "Laptop" in my cart
    When I click remove on "Laptop"
    Then the cart should be empty

  @wip
  Scenario: Save cart for later
    Given I have items in my cart
    When I click "Save for Later"
    Then my cart should be saved
    And I should see a confirmation message

