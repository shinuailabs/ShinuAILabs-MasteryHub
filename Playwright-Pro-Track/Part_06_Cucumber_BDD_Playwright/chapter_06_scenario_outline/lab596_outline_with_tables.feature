# Lab 596: Scenario Outline with Data Tables
#
# =====================
# LEARNING CONCEPT:
# =====================
# Combining outlines with data tables:
#
# - Nested data
# - Complex scenarios
# - Dynamic tables
# - Flexible testing
#
# =====================
# EXERCISE:
# =====================
# 1. Combine outlines and tables
# 2. Handle complex data
# 3. Create flexible tests
#
# =====================
# SOLUTION:
# =====================

Feature: Complex Order Processing
  As an e-commerce system
  I want to process various order types
  So that customers can complete purchases

  # Solution 1: Outline with Static Data Table
  Scenario Outline: Process order with standard items
    Given I am logged in as "<customer_type>" customer
    When I add the following items to my order:
      | Product | Quantity |
      | Laptop  | 1        |
      | Mouse   | 2        |
    And I select "<shipping>" shipping
    Then the order total should include <discount>% discount
    And shipping cost should be $<shipping_cost>

    Examples:
      | customer_type | shipping | discount | shipping_cost |
      | regular       | standard | 0        | 9.99          |
      | regular       | express  | 0        | 19.99         |
      | premium       | standard | 10       | 0.00          |
      | premium       | express  | 10       | 9.99          |
      | vip           | standard | 20       | 0.00          |
      | vip           | express  | 20       | 0.00          |

  # Solution 2: Outline with Parameterized Table Values
  Scenario Outline: Create user with role permissions
    Given I create a user with role "<role>"
    Then the user should have permissions:
      | Permission     | Allowed   |
      | view_dashboard | <view>    |
      | edit_content   | <edit>    |
      | delete_content | <delete>  |
      | manage_users   | <manage>  |

    Examples:
      | role   | view | edit | delete | manage |
      | admin  | Yes  | Yes  | Yes    | Yes    |
      | editor | Yes  | Yes  | No     | No     |
      | viewer | Yes  | No   | No     | No     |
      | guest  | No   | No   | No     | No     |

  # Solution 3: Outline with Verification Table
  Scenario Outline: Verify order summary
    Given I have an order with:
      | Field    | Value         |
      | Customer | <customer>    |
      | Product  | <product>     |
      | Quantity | <quantity>    |
    When I view the order summary
    Then I should see:
      | Label    | Value         |
      | Customer | <customer>    |
      | Product  | <product>     |
      | Quantity | <quantity>    |
      | Status   | <status>      |

    Examples:
      | customer   | product | quantity | status    |
      | John Doe   | Laptop  | 1        | Pending   |
      | Jane Smith | Phone   | 2        | Confirmed |
      | Bob Wilson | Tablet  | 3        | Shipped   |

  # Solution 4: Outline with Multiple Tables
  Scenario Outline: Configure notification settings
    Given I am a "<user_type>" user
    When I configure notifications:
      | Channel | Enabled |
      | Email   | Yes     |
      | SMS     | <sms>   |
      | Push    | <push>  |
    Then I should receive notifications via:
      | Channel | Expected |
      | Email   | Yes      |
      | SMS     | <sms>    |
      | Push    | <push>   |

    Examples:
      | user_type | sms | push |
      | basic     | No  | No   |
      | standard  | Yes | No   |
      | premium   | Yes | Yes  |

  # Solution 5: Outline with Doc String
  Scenario Outline: Send templated email
    Given I have email template "<template>"
    When I send email with content:
      """
      Dear <recipient>,
      
      Your order #<order_id> has been <status>.
      
      Thank you for your business!
      """
    Then the email should be sent successfully
    And the recipient should be "<recipient>"

    Examples:
      | template     | recipient        | order_id | status    |
      | confirmation | john@test.com    | 12345    | confirmed |
      | shipping     | jane@test.com    | 12346    | shipped   |
      | delivery     | bob@test.com     | 12347    | delivered |

  # Solution 6: Outline for API Testing with Body
  Scenario Outline: API endpoint validation
    When I send a <method> request to "<endpoint>" with:
      | Header       | Value            |
      | Content-Type | application/json |
      | Authorization| Bearer <token>   |
    Then the response status should be <status>
    And response should contain "<message>"

    Examples:
      | method | endpoint   | token       | status | message           |
      | GET    | /users     | valid_token | 200    | success           |
      | GET    | /users     | invalid     | 401    | unauthorized      |
      | POST   | /users     | valid_token | 201    | created           |
      | DELETE | /users/1   | valid_token | 200    | deleted           |
      | DELETE | /users/1   | readonly    | 403    | forbidden         |

