# Lab 562: Comments and Documentation
#
# =====================
# LEARNING CONCEPT:
# =====================
# Adding comments to features:
#
# - Comment syntax
# - Documentation best practices
# - Explaining complex scenarios
# - Maintaining readability
#
# =====================
# EXERCISE:
# =====================
# 1. Add meaningful comments
# 2. Document complex logic
# 3. Maintain readability
#
# =====================
# SOLUTION:
# =====================

# ============================================
# Feature: Payment Processing
# Author: QA Team
# Created: 2024-01-15
# Last Updated: 2024-01-20
# 
# This feature covers all payment-related
# scenarios including credit cards, digital
# wallets, and bank transfers.
# ============================================

@payments
Feature: Payment Processing
  As a customer
  I want to pay for my orders using various methods
  So that I can complete my purchase conveniently

  # Common setup for all payment scenarios
  # Ensures user is authenticated and has items to purchase
  Background:
    Given I am logged in as a customer
    And I have items totaling "$100.00" in my cart
    And I am on the payment page

  # ----------------------------------------
  # Credit Card Payment Scenarios
  # ----------------------------------------
  
  # Happy path for credit card payments
  # Tests the most common payment flow
  @credit-card @smoke
  Scenario: Successful credit card payment
    # Enter valid card details
    When I select "Credit Card" as payment method
    And I enter card number "4111111111111111"
    And I enter expiry date "12/25"
    And I enter CVV "123"
    And I click "Pay Now"
    # Verify successful payment
    Then the payment should be processed
    And I should see "Payment Successful" message

  # Tests 3D Secure authentication flow
  # Required for cards enrolled in 3DS
  @credit-card @3ds
  Scenario: Credit card with 3D Secure
    When I pay with 3DS enrolled card
    # User is redirected to bank's 3DS page
    And I complete 3D Secure authentication
    Then the payment should be authorized

  # ----------------------------------------
  # Digital Wallet Scenarios
  # ----------------------------------------

  # PayPal integration test
  # Note: Requires PayPal sandbox credentials
  @paypal @integration
  Scenario: PayPal payment
    When I select "PayPal" as payment method
    # Opens PayPal popup/redirect
    And I log in to PayPal
    And I confirm PayPal payment
    Then the payment should be completed via PayPal

  # Apple Pay - only works on Safari/iOS
  # Skip on other browsers
  @apple-pay @safari-only
  Scenario: Apple Pay payment
    When I select "Apple Pay" as payment method
    And I authenticate with Touch ID
    Then the payment should be completed

  # ----------------------------------------
  # Error Handling Scenarios
  # ----------------------------------------

  # Tests declined card handling
  # Uses test card number that always declines
  @credit-card @negative
  Scenario: Declined credit card
    When I pay with card "4000000000000002"  # Test decline card
    Then I should see "Card Declined" error
    And I should be able to try another card

  # Tests expired card validation
  @credit-card @validation
  Scenario: Expired credit card
    When I enter expiry date "01/20"  # Past date
    Then I should see "Card has expired" error
    # Form should not submit with invalid date

  # ----------------------------------------
  # Edge Cases
  # ----------------------------------------

  # Tests payment timeout handling
  # Simulates slow network conditions
  @timeout @edge-case
  Scenario: Payment timeout
    Given the payment gateway is slow
    When I submit payment
    And the request times out after 30 seconds
    Then I should see "Payment timed out" message
    And I should be able to retry

# End of feature file
# For questions, contact: qa-team@company.com

