# Lab 628: Feature File Writing Best Practices
#
# =====================
# LEARNING CONCEPT:
# =====================
# Writing effective feature files:
#
# - Clear descriptions
# - Business language
# - Avoid implementation details
# - Maintainable scenarios
#
# =====================
# EXERCISE:
# =====================
# 1. Write clear features
# 2. Use business language
# 3. Keep scenarios focused
#
# =====================
# SOLUTION:
# =====================

# BAD EXAMPLE - Too technical, implementation details
# Feature: Login API endpoint
#   Scenario: POST /api/login returns 200
#     Given I send POST to "/api/login" with JSON body
#     When the server processes the request
#     Then I receive status code 200

# GOOD EXAMPLE - Business focused
Feature: User Authentication
  As a registered user
  I want to log into my account
  So that I can access my personalized dashboard

  Background:
    Given I am on the login page

  # Best Practice 1: Clear, descriptive scenario names
  Scenario: Successful login with valid credentials
    Given I have a registered account
    When I enter my email and password
    And I click the login button
    Then I should be redirected to my dashboard
    And I should see a welcome message

  # Best Practice 2: Focus on behavior, not implementation
  Scenario: Login fails with incorrect password
    Given I have a registered account
    When I enter my email with an incorrect password
    And I click the login button
    Then I should see an error message "Invalid credentials"
    And I should remain on the login page

  # Best Practice 3: Use meaningful examples
  Scenario Outline: Login validation messages
    When I enter "<email>" as email
    And I enter "<password>" as password
    And I click the login button
    Then I should see the error "<error_message>"

    Examples:
      | email           | password | error_message              |
      |                 | pass123  | Email is required          |
      | invalid-email   | pass123  | Please enter a valid email |
      | user@test.com   |          | Password is required       |

  # Best Practice 4: Keep scenarios independent
  Scenario: User can reset forgotten password
    Given I have a registered account
    When I click "Forgot Password"
    And I enter my email address
    And I click "Send Reset Link"
    Then I should see "Password reset email sent"

  # Best Practice 5: Use tags for organization
  @smoke @critical
  Scenario: Login session persists across page refresh
    Given I am logged in
    When I refresh the page
    Then I should still be logged in

  @security
  Scenario: Account locks after multiple failed attempts
    Given I have a registered account
    When I enter incorrect password 5 times
    Then my account should be temporarily locked
    And I should see "Account locked. Try again in 15 minutes"

