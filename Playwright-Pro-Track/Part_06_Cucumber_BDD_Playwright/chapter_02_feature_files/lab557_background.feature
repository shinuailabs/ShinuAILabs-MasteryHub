# Lab 557: Background
#
# =====================
# LEARNING CONCEPT:
# =====================
# Using Background in features:
#
# - Common preconditions
# - Reducing duplication
# - When to use Background
# - Best practices
#
# =====================
# EXERCISE:
# =====================
# 1. Identify common setup
# 2. Create Background
# 3. Apply best practices
#
# =====================
# SOLUTION:
# =====================

Feature: User Profile Management
  As a registered user
  I want to manage my profile
  So that I can keep my information up to date

  # Solution 1: Background with Authentication
  Background:
    Given I am logged in as "john.doe@test.com"
    And I navigate to my profile page
    And my profile is loaded

  # Solution 2: View Profile
  @profile @view
  Scenario: View profile information
    Then I should see my profile details
    And I should see my name "John Doe"
    And I should see my email "john.doe@test.com"

  # Solution 3: Edit Profile
  @profile @edit
  Scenario: Edit profile name
    When I click the edit button
    And I change my name to "John Smith"
    And I save the changes
    Then I should see success message "Profile updated"
    And my name should be "John Smith"

  # Solution 4: Change Email
  @profile @email
  Scenario: Change email address
    When I click "Change Email"
    And I enter new email "john.smith@test.com"
    And I confirm with my password
    Then I should receive verification email
    And I should see "Verification email sent"

  # Solution 5: Upload Avatar
  @profile @avatar
  Scenario: Upload profile picture
    When I click on my avatar
    And I upload image "avatar.jpg"
    Then my avatar should be updated
    And I should see the new image

  # Solution 6: Privacy Settings
  @profile @privacy
  Scenario: Update privacy settings
    When I go to privacy settings
    And I set profile visibility to "Friends only"
    And I save privacy settings
    Then my profile should be visible only to friends

  # Solution 7: Delete Account
  @profile @delete @critical
  Scenario: Delete account
    When I click "Delete Account"
    And I confirm deletion by typing "DELETE"
    And I enter my password
    Then my account should be deleted
    And I should be logged out
    And I should see "Account deleted successfully"

