# Lab 547: BDD Overview
#
# =====================
# LEARNING CONCEPT:
# =====================
# Behavior-Driven Development (BDD):
#
# - What is BDD?
# - Gherkin syntax
# - Given-When-Then
# - Benefits of BDD
#
# =====================
# EXERCISE:
# =====================
# 1. Understand BDD concepts
# 2. Write first feature
# 3. Use Gherkin syntax
#
# =====================
# SOLUTION:
# =====================

Feature: User Authentication
  As a user
  I want to be able to log in to the application
  So that I can access my account

  Background:
    Given the application is running
    And I am on the login page

  # Solution 1: Basic Scenario
  Scenario: Successful login with valid credentials
    Given I have a valid user account
    When I enter my username "testuser"
    And I enter my password "password123"
    And I click the login button
    Then I should be redirected to the dashboard
    And I should see a welcome message

  # Solution 2: Negative Scenario
  Scenario: Failed login with invalid credentials
    When I enter my username "invaliduser"
    And I enter my password "wrongpassword"
    And I click the login button
    Then I should see an error message "Invalid credentials"
    And I should remain on the login page

  # Solution 3: Edge Case Scenario
  Scenario: Login with empty credentials
    When I click the login button without entering credentials
    Then I should see validation errors
    And the username field should show "Username is required"
    And the password field should show "Password is required"

  # Solution 4: Remember Me Feature
  Scenario: Login with remember me option
    Given I have a valid user account
    When I enter my username "testuser"
    And I enter my password "password123"
    And I check the "Remember me" checkbox
    And I click the login button
    Then I should be logged in
    And my session should persist after closing the browser

