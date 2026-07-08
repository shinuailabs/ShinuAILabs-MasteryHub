# Lab 601: Tag Basics
#
# =====================
# LEARNING CONCEPT:
# =====================
# Understanding Cucumber tags:
#
# - Tag syntax
# - Tag placement
# - Tag inheritance
# - Common tag patterns
#
# =====================
# EXERCISE:
# =====================
# 1. Apply tags to features
# 2. Apply tags to scenarios
# 3. Understand inheritance
#
# =====================
# SOLUTION:
# =====================

# Solution 1: Feature-level tag (applies to all scenarios)
@user-management
Feature: User Management
  As an administrator
  I want to manage users
  So that I can control system access

  # Solution 2: Scenario-level tags
  @smoke @critical
  Scenario: Create new user
    Given I am logged in as admin
    When I create a new user with email "test@example.com"
    Then the user should be created successfully

  @regression
  Scenario: Update user details
    Given I am logged in as admin
    And a user exists with email "existing@example.com"
    When I update the user's name to "John Doe"
    Then the user's name should be updated

  # Solution 3: Multiple tags on one scenario
  @smoke @security @critical @p1
  Scenario: Delete user
    Given I am logged in as admin
    And a user exists with email "delete@example.com"
    When I delete the user
    Then the user should be removed from the system

  # Solution 4: Environment tags
  @staging-only
  Scenario: Test staging-specific feature
    Given I am on the staging environment
    When I access the beta feature
    Then I should see the beta dashboard

  @production
  Scenario: Verify production configuration
    Given I am on the production environment
    When I check the system status
    Then all services should be healthy

  # Solution 5: Priority tags
  @p1
  Scenario: Critical user authentication
    Given I am on the login page
    When I enter valid credentials
    Then I should be logged in

  @p2
  Scenario: User profile update
    Given I am logged in
    When I update my profile picture
    Then the new picture should be displayed

  @p3
  Scenario: User preferences
    Given I am logged in
    When I change my notification preferences
    Then the preferences should be saved

  # Solution 6: Test type tags
  @unit
  Scenario: Validate email format
    When I validate email "test@example.com"
    Then it should be valid

  @integration
  Scenario: User creation with email notification
    When I create a user
    Then an email should be sent to the user

  @e2e
  Scenario: Complete user registration flow
    Given I am on the registration page
    When I complete the registration form
    And I verify my email
    Then I should be able to login

  # Solution 7: Feature flag tags
  @feature:dark-mode
  Scenario: Dark mode toggle
    Given dark mode feature is enabled
    When I toggle dark mode
    Then the UI should switch to dark theme

  # Solution 8: Skip/WIP tags
  @skip
  Scenario: Incomplete feature
    Given this feature is not yet implemented
    When I try to use it
    Then it should fail gracefully

  @wip
  Scenario: Work in progress
    Given I am working on this scenario
    When it is complete
    Then it will be tagged differently

