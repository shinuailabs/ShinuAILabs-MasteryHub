# Lab 558: Scenarios
#
# =====================
# LEARNING CONCEPT:
# =====================
# Writing effective scenarios:
#
# - Scenario structure
# - Single behavior focus
# - Clear naming
# - Independence
#
# =====================
# EXERCISE:
# =====================
# 1. Write focused scenarios
# 2. Name clearly
# 3. Ensure independence
#
# =====================
# SOLUTION:
# =====================

Feature: Order Management
  As a customer
  I want to manage my orders
  So that I can track and modify my purchases

  Background:
    Given I am logged in as a customer
    And I have placed orders in the past

  # Solution 1: Clear, Focused Scenario
  @orders @view
  Scenario: View order history
    When I navigate to "My Orders"
    Then I should see a list of my orders
    And orders should be sorted by date descending

  # Solution 2: Specific Action Scenario
  @orders @details
  Scenario: View order details
    Given I have an order with ID "ORD-12345"
    When I click on order "ORD-12345"
    Then I should see order details
    And I should see the items ordered
    And I should see the shipping address
    And I should see the payment method

  # Solution 3: Status-Based Scenario
  @orders @tracking
  Scenario: Track shipped order
    Given I have a shipped order "ORD-12345"
    When I click "Track Order"
    Then I should see tracking information
    And I should see the carrier name
    And I should see the tracking number
    And I should see estimated delivery date

  # Solution 4: Action Scenario
  @orders @cancel
  Scenario: Cancel pending order
    Given I have a pending order "ORD-12346"
    When I click "Cancel Order"
    And I select cancellation reason "Changed my mind"
    And I confirm cancellation
    Then the order should be cancelled
    And I should receive cancellation confirmation email

  # Solution 5: Conditional Scenario
  @orders @return
  Scenario: Request return for delivered order
    Given I have a delivered order "ORD-12347"
    And the order is within return window
    When I click "Request Return"
    And I select items to return
    And I select return reason "Defective product"
    And I submit return request
    Then I should see return confirmation
    And I should receive return shipping label

  # Solution 6: Negative Scenario
  @orders @cancel @negative
  Scenario: Cannot cancel shipped order
    Given I have a shipped order "ORD-12348"
    When I try to cancel the order
    Then I should see message "Cannot cancel shipped orders"
    And the cancel button should be disabled

  # Solution 7: Filter Scenario
  @orders @filter
  Scenario: Filter orders by status
    When I filter orders by status "Delivered"
    Then I should only see delivered orders
    And the filter should show "Delivered" as selected

