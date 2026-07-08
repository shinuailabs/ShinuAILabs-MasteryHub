# Lab 551: First Feature File
#
# =====================
# LEARNING CONCEPT:
# =====================
# Creating your first feature:
#
# - Feature structure
# - Writing scenarios
# - Best practices
# - Common patterns
#
# =====================
# EXERCISE:
# =====================
# 1. Create feature file
# 2. Write scenarios
# 3. Follow best practices
#
# =====================
# SOLUTION:
# =====================

@registration
Feature: User Registration
  As a new visitor
  I want to create an account
  So that I can access member features

  Background:
    Given I am on the registration page

  # Solution 1: Happy Path Scenario
  @smoke @happy-path
  Scenario: Successful registration with valid data
    When I fill in the registration form with:
      | Field           | Value              |
      | First Name      | John               |
      | Last Name       | Doe                |
      | Email           | john.doe@test.com  |
      | Password        | SecurePass123!     |
      | Confirm Password| SecurePass123!     |
    And I accept the terms and conditions
    And I click the Register button
    Then I should see a success message "Registration successful"
    And I should receive a confirmation email
    And I should be redirected to the welcome page

  # Solution 2: Validation Scenarios
  @validation
  Scenario: Registration fails with invalid email
    When I enter "invalid-email" as email
    And I click the Register button
    Then I should see error "Please enter a valid email address"

  @validation
  Scenario: Registration fails with weak password
    When I enter "weak" as password
    And I click the Register button
    Then I should see error "Password must be at least 8 characters"

  @validation
  Scenario: Registration fails with mismatched passwords
    When I enter "SecurePass123!" as password
    And I enter "DifferentPass456!" as confirm password
    And I click the Register button
    Then I should see error "Passwords do not match"

  # Solution 3: Edge Cases
  @edge-case
  Scenario: Registration with existing email
    Given a user with email "existing@test.com" already exists
    When I fill in email with "existing@test.com"
    And I complete the rest of the form
    And I click the Register button
    Then I should see error "Email already registered"

  # Solution 4: Required Fields
  @validation
  Scenario Outline: Required field validation
    When I leave the "<field>" field empty
    And I click the Register button
    Then I should see error "<error_message>"

    Examples:
      | field           | error_message              |
      | First Name      | First name is required     |
      | Last Name       | Last name is required      |
      | Email           | Email is required          |
      | Password        | Password is required       |

  # Solution 5: Terms and Conditions
  @terms
  Scenario: Cannot register without accepting terms
    When I fill in all required fields correctly
    But I do not accept the terms and conditions
    And I click the Register button
    Then I should see error "You must accept the terms and conditions"

