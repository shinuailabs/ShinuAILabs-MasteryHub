# Lab 592: Scenario Outline Basics
#
# =====================
# LEARNING CONCEPT:
# =====================
# Understanding Scenario Outline:
#
# - Template scenarios
# - Examples table
# - Parameterization
# - Data-driven testing
#
# =====================
# EXERCISE:
# =====================
# 1. Create scenario outlines
# 2. Use examples tables
# 3. Parameterize tests
#
# =====================
# SOLUTION:
# =====================

Feature: Login Validation
  As a user
  I want to login with valid credentials
  So that I can access my account

  Background:
    Given I am on the login page

  # Solution 1: Basic Scenario Outline
  Scenario Outline: Login with different credentials
    When I enter username "<username>"
    And I enter password "<password>"
    And I click the login button
    Then I should see "<result>"

    Examples:
      | username        | password    | result                |
      | valid@test.com  | ValidPass1  | Welcome, User         |
      | invalid@test.com| WrongPass   | Invalid credentials   |
      | valid@test.com  | wrongpass   | Invalid credentials   |
      |                 | ValidPass1  | Username is required  |
      | valid@test.com  |             | Password is required  |

  # Solution 2: Scenario Outline with Multiple Assertions
  Scenario Outline: User role-based access
    Given I am logged in as "<role>"
    When I navigate to "<page>"
    Then I should see access "<access>"
    And the page title should be "<title>"

    Examples:
      | role    | page       | access  | title           |
      | admin   | /users     | granted | User Management |
      | admin   | /settings  | granted | Settings        |
      | editor  | /content   | granted | Content Editor  |
      | editor  | /users     | denied  | Access Denied   |
      | viewer  | /reports   | granted | Reports         |
      | viewer  | /settings  | denied  | Access Denied   |

  # Solution 3: Scenario Outline for Form Validation
  Scenario Outline: Registration form validation
    When I fill the registration form:
      | Field    | Value       |
      | Email    | <email>     |
      | Password | <password>  |
      | Age      | <age>       |
    And I submit the form
    Then I should see validation message "<message>"

    Examples:
      | email           | password  | age | message                    |
      | test@test.com   | Pass123!  | 25  | Registration successful    |
      | invalid-email   | Pass123!  | 25  | Invalid email format       |
      | test@test.com   | short     | 25  | Password too short         |
      | test@test.com   | Pass123!  | 15  | Must be 18 or older        |
      | test@test.com   | Pass123!  | 150 | Invalid age                |

  # Solution 4: Scenario Outline with Calculations
  Scenario Outline: Shopping cart calculations
    Given I have an empty cart
    When I add <quantity> of "<product>" at $<price> each
    Then the subtotal should be $<subtotal>
    And with <tax>% tax, the total should be $<total>

    Examples:
      | product | quantity | price  | subtotal | tax | total  |
      | Laptop  | 1        | 999.00 | 999.00   | 10  | 1098.90|
      | Mouse   | 2        | 25.00  | 50.00    | 10  | 55.00  |
      | Monitor | 1        | 300.00 | 300.00   | 8   | 324.00 |
      | Keyboard| 3        | 75.00  | 225.00   | 8   | 243.00 |

  # Solution 5: Scenario Outline for Status Transitions
  Scenario Outline: Order status transitions
    Given an order with status "<initial_status>"
    When I perform action "<action>"
    Then the order status should be "<final_status>"

    Examples:
      | initial_status | action   | final_status |
      | pending        | confirm  | confirmed    |
      | confirmed      | ship     | shipped      |
      | shipped        | deliver  | delivered    |
      | pending        | cancel   | cancelled    |
      | confirmed      | cancel   | cancelled    |

