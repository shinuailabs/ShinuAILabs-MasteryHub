# Lab 593: Examples Table
#
# =====================
# LEARNING CONCEPT:
# =====================
# Working with Examples tables:
#
# - Multiple examples
# - Named examples
# - Tagged examples
# - Complex data
#
# =====================
# EXERCISE:
# =====================
# 1. Create examples tables
# 2. Use named examples
# 3. Tag examples
#
# =====================
# SOLUTION:
# =====================

Feature: Product Search
  As a customer
  I want to search for products
  So that I can find what I need

  # Solution 1: Multiple Named Examples Tables
  Scenario Outline: Search products by category
    When I search for "<product>" in "<category>"
    Then I should see <count> results
    And results should be sorted by "<sort>"

    @electronics
    Examples: Electronics
      | product    | category    | count | sort       |
      | laptop     | Electronics | 50    | relevance  |
      | smartphone | Electronics | 100   | relevance  |
      | tablet     | Electronics | 30    | price      |

    @clothing
    Examples: Clothing
      | product | category | count | sort      |
      | shirt   | Clothing | 200   | relevance |
      | pants   | Clothing | 150   | price     |
      | shoes   | Clothing | 80    | rating    |

    @home
    Examples: Home & Garden
      | product   | category      | count | sort      |
      | furniture | Home & Garden | 75    | relevance |
      | plants    | Home & Garden | 40    | price     |

  # Solution 2: Tagged Examples for Different Environments
  Scenario Outline: API response times
    When I call the "<endpoint>" API
    Then the response time should be less than <max_time> ms

    @staging
    Examples: Staging Environment
      | endpoint    | max_time |
      | /users      | 500      |
      | /products   | 800      |
      | /orders     | 1000     |

    @production
    Examples: Production Environment
      | endpoint    | max_time |
      | /users      | 200      |
      | /products   | 300      |
      | /orders     | 400      |

  # Solution 3: Examples with Special Characters
  Scenario Outline: Search with special characters
    When I search for "<query>"
    Then I should see results containing "<expected>"

    Examples:
      | query           | expected        |
      | C++             | C++             |
      | C#              | C#              |
      | Node.js         | Node.js         |
      | "exact phrase"  | exact phrase    |
      | price < $100    | price < $100    |
      | 50% off         | 50% off         |

  # Solution 4: Examples with Empty/Null Values
  Scenario Outline: Form submission with optional fields
    When I submit the form with:
      | Name  | <name>  |
      | Email | <email> |
      | Phone | <phone> |
    Then the submission should be "<result>"

    Examples:
      | name | email          | phone      | result  |
      | John | john@test.com  | 555-1234   | success |
      | Jane | jane@test.com  |            | success |
      | Bob  |                | 555-5678   | error   |
      |      | test@test.com  | 555-9999   | error   |

  # Solution 5: Examples with Boolean Values
  Scenario Outline: Feature flag testing
    Given feature "<feature>" is <enabled>
    When I access the feature
    Then I should <see_feature> the feature

    Examples:
      | feature        | enabled  | see_feature |
      | dark_mode      | enabled  | see         |
      | dark_mode      | disabled | not see     |
      | beta_dashboard | enabled  | see         |
      | beta_dashboard | disabled | not see     |
      | new_checkout   | enabled  | see         |

  # Solution 6: Examples with Date Values
  Scenario Outline: Date-based filtering
    Given today is "<today>"
    When I filter orders from "<start_date>" to "<end_date>"
    Then I should see <count> orders

    Examples:
      | today      | start_date | end_date   | count |
      | 2024-01-15 | 2024-01-01 | 2024-01-15 | 45    |
      | 2024-01-15 | 2024-01-10 | 2024-01-15 | 15    |
      | 2024-01-15 | 2024-01-15 | 2024-01-15 | 5     |

