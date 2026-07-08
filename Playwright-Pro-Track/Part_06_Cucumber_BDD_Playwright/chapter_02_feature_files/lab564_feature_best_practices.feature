# Lab 564: Feature File Best Practices
#
# =====================
# LEARNING CONCEPT:
# =====================
# Best practices for feature files:
#
# - Naming conventions
# - Organization
# - Readability
# - Maintainability
#
# =====================
# EXERCISE:
# =====================
# 1. Apply naming conventions
# 2. Organize features
# 3. Ensure readability
#
# =====================
# SOLUTION:
# =====================

# Best Practice 1: Clear, descriptive feature name
# Best Practice 2: User story format for description
@inventory @admin
Feature: Inventory Management
  As a warehouse manager
  I want to manage product inventory
  So that I can ensure stock availability

  # Best Practice 3: Minimal, focused Background
  Background:
    Given I am logged in as a warehouse manager
    And I am on the inventory dashboard

  # Best Practice 4: Descriptive scenario names (behavior, not implementation)
  # GOOD: "Low stock alert is triggered"
  # BAD: "Test low stock notification"
  @alerts @smoke
  Scenario: Low stock alert is triggered when inventory falls below threshold
    Given product "Widget A" has 10 units in stock
    And the low stock threshold is 15 units
    When I view the inventory dashboard
    Then I should see a low stock alert for "Widget A"
    And the alert should show "5 units below threshold"

  # Best Practice 5: One behavior per scenario
  @stock @update
  Scenario: Update stock quantity manually
    Given product "Widget A" has 50 units in stock
    When I update the stock to 75 units
    And I add note "Received new shipment"
    Then the stock should be 75 units
    And the stock history should show the update

  # Best Practice 6: Use concrete examples, not abstract
  # GOOD: specific product names, quantities
  # BAD: "some product", "a few items"
  @reorder
  Scenario: Automatic reorder is triggered
    Given product "Widget B" has 5 units in stock
    And automatic reorder is enabled at 10 units
    And the reorder quantity is 50 units
    When the daily inventory check runs
    Then a purchase order for 50 units should be created
    And the supplier should be notified

  # Best Practice 7: Avoid UI-specific language in scenarios
  # GOOD: "I search for product"
  # BAD: "I type in the search textbox and click the search button"
  @search
  Scenario: Search for product by SKU
    When I search for product with SKU "WGT-001"
    Then I should see product "Widget A" in results
    And the product details should be displayed

  # Best Practice 8: Use Scenario Outline for data variations
  @stock @validation
  Scenario Outline: Stock quantity validation
    When I try to set stock for "Widget A" to <quantity>
    Then I should see "<message>"

    Examples:
      | quantity | message                        |
      | -5       | Stock cannot be negative       |
      | 0        | Stock updated successfully     |
      | 1000001  | Stock exceeds maximum allowed  |

  # Best Practice 9: Keep scenarios independent
  # Each scenario should be able to run in isolation
  @transfer
  Scenario: Transfer stock between warehouses
    Given "Warehouse A" has 100 units of "Widget A"
    And "Warehouse B" has 20 units of "Widget A"
    When I transfer 30 units from "Warehouse A" to "Warehouse B"
    Then "Warehouse A" should have 70 units
    And "Warehouse B" should have 50 units

  # Best Practice 10: Use tags strategically
  @audit @compliance @monthly
  Scenario: Generate inventory audit report
    When I generate the monthly audit report
    Then the report should include all products
    And the report should show stock movements
    And the report should be downloadable as PDF

