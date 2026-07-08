# Lab 561: Tags
#
# =====================
# LEARNING CONCEPT:
# =====================
# Using tags in Gherkin:
#
# - Tag syntax
# - Feature-level tags
# - Scenario-level tags
# - Tag expressions
#
# =====================
# EXERCISE:
# =====================
# 1. Apply tags to features
# 2. Apply tags to scenarios
# 3. Use tag expressions
#
# =====================
# SOLUTION:
# =====================

# Solution 1: Feature-level Tags
@checkout @e2e
Feature: Checkout Process
  As a customer
  I want to complete checkout
  So that I can purchase my items

  Background:
    Given I am logged in
    And I have items in my cart

  # Solution 2: Multiple Tags on Scenario
  @smoke @critical @payment
  Scenario: Complete checkout with credit card
    When I proceed to checkout
    And I enter shipping information
    And I select "Credit Card" as payment method
    And I enter valid card details
    And I place the order
    Then the order should be confirmed
    And I should receive confirmation email

  # Solution 3: Priority Tags
  @p1 @regression
  Scenario: Checkout with PayPal
    When I proceed to checkout
    And I enter shipping information
    And I select "PayPal" as payment method
    And I complete PayPal authentication
    Then the order should be confirmed

  @p2 @regression
  Scenario: Checkout with gift card
    When I proceed to checkout
    And I apply gift card "GIFT-123"
    And I complete checkout
    Then the gift card balance should be deducted

  # Solution 4: Environment Tags
  @staging-only
  Scenario: Test checkout with test payment gateway
    When I proceed to checkout
    And I use test card "4111111111111111"
    Then the test payment should succeed

  @prod-skip
  Scenario: Checkout with promotional discount
    When I apply promo code "TESTPROMO"
    And I complete checkout
    Then the discount should be applied

  # Solution 5: Work-in-Progress Tags
  @wip
  Scenario: Checkout with cryptocurrency
    When I select "Bitcoin" as payment method
    And I complete crypto payment
    Then the order should be confirmed

  # Solution 6: Flaky Test Tags
  @flaky @retry
  Scenario: Checkout during high traffic
    When I proceed to checkout during sale event
    Then the checkout should complete within 30 seconds

  # Solution 7: Browser-Specific Tags
  @chrome-only
  Scenario: Checkout with Chrome autofill
    When I use Chrome autofill for shipping
    And I complete checkout
    Then the order should be confirmed

  @mobile
  Scenario: Mobile checkout experience
    When I checkout on mobile device
    Then I should see mobile-optimized checkout

  # Solution 8: Data Tags
  @data-cleanup
  Scenario: Checkout creates order record
    When I complete checkout
    Then an order record should be created
    # This scenario requires data cleanup after execution

  # Solution 9: Integration Tags
  @api @integration
  Scenario: Checkout triggers inventory update
    When I complete checkout for "Product A"
    Then the inventory API should be called
    And stock should be decremented

