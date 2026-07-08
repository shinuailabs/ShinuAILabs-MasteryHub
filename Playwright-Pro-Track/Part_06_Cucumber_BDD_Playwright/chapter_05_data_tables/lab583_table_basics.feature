# Lab 583: Data Table Basics
#
# =====================
# LEARNING CONCEPT:
# =====================
# Understanding data tables in Gherkin:
#
# - Table syntax
# - Rows and columns
# - Headers
# - Basic usage
#
# =====================
# EXERCISE:
# =====================
# 1. Create basic tables
# 2. Use headers
# 3. Access table data
#
# =====================
# SOLUTION:
# =====================

Feature: Data Table Basics
  As a test automation engineer
  I want to use data tables
  So that I can pass structured data to steps

  # Solution 1: Simple Table Without Headers
  Scenario: Add items to shopping list
    When I add the following items to my list:
      | Milk    |
      | Bread   |
      | Eggs    |
      | Butter  |
    Then my list should have 4 items

  # Solution 2: Table With Headers
  Scenario: Create user account
    When I create a user with details:
      | Field     | Value              |
      | Name      | John Doe           |
      | Email     | john@example.com   |
      | Password  | SecurePass123!     |
    Then the user should be created

  # Solution 3: Multi-Column Table
  Scenario: Add products to cart
    When I add the following products:
      | Product    | Quantity | Price  |
      | Laptop     | 1        | $999   |
      | Mouse      | 2        | $25    |
      | Keyboard   | 1        | $75    |
    Then my cart total should be $1124

  # Solution 4: Table for Verification
  Scenario: Verify user profile
    Given I am logged in as "john@example.com"
    Then I should see the following profile details:
      | Field    | Value            |
      | Name     | John Doe         |
      | Email    | john@example.com |
      | Role     | Customer         |
      | Status   | Active           |

  # Solution 5: Table for Form Filling
  Scenario: Fill registration form
    When I fill the registration form:
      | First Name     | Jane              |
      | Last Name      | Smith             |
      | Email          | jane@example.com  |
      | Phone          | 555-1234          |
      | Address        | 123 Main St       |
      | City           | New York          |
      | Zip Code       | 10001             |
    And I submit the form
    Then registration should be successful

  # Solution 6: Table for Multiple Records
  Scenario: Bulk create users
    When I create the following users:
      | Name        | Email              | Role    |
      | Alice Brown | alice@example.com  | Admin   |
      | Bob Wilson  | bob@example.com    | Editor  |
      | Carol Davis | carol@example.com  | Viewer  |
    Then 3 users should be created

  # Solution 7: Table for Comparison
  Scenario: Compare prices
    Given the following products exist:
      | Product | Original Price | Sale Price |
      | Shirt   | $50            | $35        |
      | Pants   | $80            | $60        |
      | Shoes   | $120           | $90        |
    Then all products should have discounts applied

