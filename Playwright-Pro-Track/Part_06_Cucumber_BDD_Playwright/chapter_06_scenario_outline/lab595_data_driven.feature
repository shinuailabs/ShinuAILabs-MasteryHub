# Lab 595: Data-Driven Testing
#
# =====================
# LEARNING CONCEPT:
# =====================
# Data-driven testing with outlines:
#
# - External data sources
# - Large datasets
# - Boundary testing
# - Combinatorial testing
#
# =====================
# EXERCISE:
# =====================
# 1. Create data-driven tests
# 2. Test boundaries
# 3. Use combinations
#
# =====================
# SOLUTION:
# =====================

Feature: Data-Driven Testing
  As a QA engineer
  I want to test with various data combinations
  So that I can ensure comprehensive coverage

  # Solution 1: Boundary Value Testing
  Scenario Outline: Password length validation
    When I enter a password of length <length>
    Then the validation result should be "<result>"
    And the message should be "<message>"

    Examples: Below Minimum (Boundary)
      | length | result  | message                          |
      | 0      | invalid | Password is required             |
      | 1      | invalid | Password must be at least 8 chars|
      | 7      | invalid | Password must be at least 8 chars|

    Examples: At Minimum Boundary
      | length | result | message |
      | 8      | valid  | OK      |
      | 9      | valid  | OK      |

    Examples: Normal Range
      | length | result | message |
      | 12     | valid  | OK      |
      | 20     | valid  | OK      |

    Examples: At Maximum Boundary
      | length | result | message |
      | 63     | valid  | OK      |
      | 64     | valid  | OK      |

    Examples: Above Maximum (Boundary)
      | length | result  | message                           |
      | 65     | invalid | Password must be at most 64 chars |
      | 100    | invalid | Password must be at most 64 chars |

  # Solution 2: Equivalence Partitioning
  Scenario Outline: Age group classification
    When I enter age <age>
    Then the age group should be "<group>"

    Examples: Children (0-12)
      | age | group    |
      | 0   | infant   |
      | 5   | child    |
      | 12  | child    |

    Examples: Teenagers (13-19)
      | age | group    |
      | 13  | teenager |
      | 16  | teenager |
      | 19  | teenager |

    Examples: Adults (20-64)
      | age | group |
      | 20  | adult |
      | 35  | adult |
      | 64  | adult |

    Examples: Seniors (65+)
      | age | group  |
      | 65  | senior |
      | 80  | senior |
      | 100 | senior |

  # Solution 3: Combinatorial Testing
  Scenario Outline: Shipping options
    Given I am shipping to "<country>"
    And the package weight is <weight> kg
    And I select "<speed>" shipping
    Then the shipping cost should be $<cost>
    And delivery time should be <days> days

    Examples: US Domestic
      | country | weight | speed    | cost  | days |
      | US      | 1      | standard | 5.99  | 5    |
      | US      | 1      | express  | 12.99 | 2    |
      | US      | 5      | standard | 9.99  | 5    |
      | US      | 5      | express  | 19.99 | 2    |
      | US      | 10     | standard | 14.99 | 5    |
      | US      | 10     | express  | 29.99 | 2    |

    Examples: International
      | country | weight | speed    | cost  | days |
      | UK      | 1      | standard | 15.99 | 10   |
      | UK      | 1      | express  | 35.99 | 3    |
      | Canada  | 1      | standard | 12.99 | 7    |
      | Canada  | 1      | express  | 25.99 | 3    |

  # Solution 4: Error Condition Testing
  Scenario Outline: Input validation errors
    When I submit form with "<field>" value "<value>"
    Then I should see error code "<error_code>"
    And error message should be "<error_message>"

    Examples: Email Validation
      | field | value           | error_code | error_message          |
      | email | invalid         | E001       | Invalid email format   |
      | email | @nodomain.com   | E001       | Invalid email format   |
      | email | no@domain       | E001       | Invalid email format   |
      | email | spaces in@email | E001       | Invalid email format   |

    Examples: Phone Validation
      | field | value      | error_code | error_message          |
      | phone | 123        | E002       | Invalid phone number   |
      | phone | abcdefghij | E002       | Invalid phone number   |
      | phone | 123-456    | E002       | Invalid phone number   |

  # Solution 5: Cross-Browser Testing Data
  Scenario Outline: Cross-browser compatibility
    Given I am using "<browser>" browser
    And viewport is <width>x<height>
    When I load the homepage
    Then the layout should be "<layout>"
    And all elements should be visible

    Examples:
      | browser | width | height | layout     |
      | chrome  | 1920  | 1080   | desktop    |
      | chrome  | 1366  | 768    | desktop    |
      | chrome  | 768   | 1024   | tablet     |
      | chrome  | 375   | 667    | mobile     |
      | firefox | 1920  | 1080   | desktop    |
      | firefox | 375   | 667    | mobile     |
      | safari  | 1440  | 900    | desktop    |
      | safari  | 375   | 812    | mobile     |

