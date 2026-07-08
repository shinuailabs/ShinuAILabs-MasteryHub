# Lab 600: Scenario Outline Best Practices
#
# =====================
# LEARNING CONCEPT:
# =====================
# Best practices for scenario outlines:
#
# - When to use outlines
# - Naming conventions
# - Data organization
# - Maintainability
#
# =====================
# EXERCISE:
# =====================
# 1. Apply best practices
# 2. Organize data effectively
# 3. Improve maintainability
#
# =====================
# SOLUTION:
# =====================

Feature: Scenario Outline Best Practices
  As a test automation engineer
  I want to write effective scenario outlines
  So that my tests are maintainable and readable

  # Best Practice 1: Use Descriptive Outline Names
  # BAD: "Test login"
  # GOOD: "Login validation with various credential combinations"
  
  Scenario Outline: Login validation with various credential combinations
    Given I am on the login page
    When I attempt to login with "<email>" and "<password>"
    Then I should see "<expected_result>"

    Examples:
      | email           | password    | expected_result       |
      | valid@test.com  | ValidPass1! | Welcome dashboard     |
      | invalid@test.com| ValidPass1! | Invalid credentials   |
      | valid@test.com  | wrongpass   | Invalid credentials   |

  # Best Practice 2: Group Related Examples with Names
  Scenario Outline: User registration validation
    When I register with email "<email>" and password "<password>"
    Then registration should "<result>"

    Examples: Valid Registrations
      | email              | password     | result  |
      | new.user@test.com  | StrongPass1! | succeed |
      | another@test.com   | ValidPass2@  | succeed |

    Examples: Invalid Email Formats
      | email          | password     | result |
      | invalid-email  | StrongPass1! | fail   |
      | @nodomain.com  | StrongPass1! | fail   |
      | no@domain      | StrongPass1! | fail   |

    Examples: Weak Passwords
      | email             | password | result |
      | test1@test.com    | short    | fail   |
      | test2@test.com    | nodigits | fail   |
      | test3@test.com    | 12345678 | fail   |

  # Best Practice 3: Keep Examples Tables Focused
  # BAD: Too many columns
  # GOOD: Split into multiple outlines or use data tables
  
  Scenario Outline: Product pricing by category
    Given a "<category>" product priced at $<base_price>
    When I apply the standard discount
    Then the final price should be $<final_price>

    Examples:
      | category    | base_price | final_price |
      | electronics | 100.00     | 90.00       |
      | clothing    | 50.00      | 42.50       |
      | books       | 20.00      | 18.00       |

  # Best Practice 4: Use Meaningful Column Names
  # BAD: | col1 | col2 | col3 |
  # GOOD: | username | password | expected_message |
  
  Scenario Outline: Form field validation messages
    When I submit form with "<field_name>" value "<field_value>"
    Then I should see validation message "<validation_message>"

    Examples:
      | field_name | field_value | validation_message        |
      | email      |             | Email is required         |
      | email      | invalid     | Please enter valid email  |
      | phone      | abc         | Phone must be numeric     |
      | age        | -5          | Age must be positive      |

  # Best Practice 5: Avoid Too Many Examples
  # If you have more than 10-15 examples, consider:
  # - Splitting into multiple outlines
  # - Using external data files
  # - Reviewing if all examples are necessary
  
  Scenario Outline: Critical path checkout - limited examples
    Given I have "<product>" in my cart
    When I checkout with "<payment_method>"
    Then the order should be "<status>"

    # Only essential combinations
    Examples:
      | product | payment_method | status    |
      | Laptop  | credit_card    | confirmed |
      | Phone   | paypal         | confirmed |
      | Tablet  | credit_card    | confirmed |

  # Best Practice 6: Use Tags for Filtering
  @smoke
  Scenario Outline: Smoke test - core functionality
    When I perform "<action>" on the system
    Then the result should be "<expected>"

    @critical
    Examples: Critical Actions
      | action | expected |
      | login  | success  |
      | logout | success  |

    @p2
    Examples: Secondary Actions
      | action         | expected |
      | update_profile | success  |
      | change_password| success  |

  # Best Practice 7: Document Complex Outlines
  # Add comments explaining the purpose and data
  
  # This outline tests the discount calculation engine
  # Discounts are applied based on:
  # - Customer tier (bronze, silver, gold)
  # - Order total threshold
  # - Product category
  Scenario Outline: Discount calculation engine
    Given a "<tier>" customer
    And order total is $<order_total>
    When discount is calculated
    Then discount percentage should be <discount>%

    Examples: Tier-based discounts
      | tier   | order_total | discount |
      | bronze | 100         | 5        |
      | silver | 100         | 10       |
      | gold   | 100         | 15       |

  # Best Practice 8: Keep Outline Steps Simple
  # Complex logic should be in step definitions, not in Gherkin
  
  Scenario Outline: Simple, readable outline
    Given I am a "<user_type>" user
    When I access "<feature>"
    Then access should be "<access_result>"

    Examples:
      | user_type | feature   | access_result |
      | admin     | dashboard | granted       |
      | guest     | dashboard | denied        |

