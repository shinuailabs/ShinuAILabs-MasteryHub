# Lab 560: Data Tables
#
# =====================
# LEARNING CONCEPT:
# =====================
# Using Data Tables in Gherkin:
#
# - Table structure
# - Row and column data
# - Key-value pairs
# - Complex data
#
# =====================
# EXERCISE:
# =====================
# 1. Create data tables
# 2. Use different formats
# 3. Handle complex data
#
# =====================
# SOLUTION:
# =====================

Feature: User Management
  As an administrator
  I want to manage users
  So that I can control access to the system

  Background:
    Given I am logged in as an administrator
    And I am on the user management page

  # Solution 1: Simple Data Table
  @users @create
  Scenario: Create new user
    When I create a user with the following details:
      | Field      | Value              |
      | First Name | Jane               |
      | Last Name  | Smith              |
      | Email      | jane.smith@test.com|
      | Role       | Editor             |
    Then the user should be created
    And I should see "Jane Smith" in the user list

  # Solution 2: Multiple Rows Table
  @users @bulk
  Scenario: Create multiple users
    When I bulk create the following users:
      | First Name | Last Name | Email              | Role   |
      | John       | Doe       | john@test.com      | Admin  |
      | Jane       | Smith     | jane@test.com      | Editor |
      | Bob        | Wilson    | bob@test.com       | Viewer |
    Then 3 users should be created
    And all users should appear in the list

  # Solution 3: Verification Table
  @users @verify
  Scenario: Verify user details
    Given user "john@test.com" exists
    When I view user "john@test.com"
    Then I should see the following details:
      | Field      | Expected Value |
      | Name       | John Doe       |
      | Email      | john@test.com  |
      | Role       | Admin          |
      | Status     | Active         |

  # Solution 4: Permissions Table
  @users @permissions
  Scenario: Set user permissions
    Given user "jane@test.com" exists
    When I set the following permissions:
      | Permission     | Granted |
      | View Content   | Yes     |
      | Edit Content   | Yes     |
      | Delete Content | No      |
      | Manage Users   | No      |
    Then the permissions should be saved

  # Solution 5: Filter Table
  @users @filter
  Scenario: Filter users by multiple criteria
    When I apply the following filters:
      | Filter | Value  |
      | Role   | Editor |
      | Status | Active |
    Then I should only see active editors

  # Solution 6: Comparison Table
  @users @compare
  Scenario: Compare user before and after edit
    Given user "bob@test.com" has the following details:
      | Field | Value      |
      | Name  | Bob Wilson |
      | Role  | Viewer     |
    When I update the user with:
      | Field | Value      |
      | Name  | Robert Wilson |
      | Role  | Editor     |
    Then the user should have:
      | Field | Old Value  | New Value     |
      | Name  | Bob Wilson | Robert Wilson |
      | Role  | Viewer     | Editor        |

  # Solution 7: Nested Data Table
  @users @complex
  Scenario: Create user with address
    When I create a user with:
      | Field         | Value              |
      | Name          | Alice Brown        |
      | Email         | alice@test.com     |
      | Street        | 123 Main St        |
      | City          | New York           |
      | State         | NY                 |
      | Zip           | 10001              |
      | Country       | USA                |
    Then the user should be created with full address

