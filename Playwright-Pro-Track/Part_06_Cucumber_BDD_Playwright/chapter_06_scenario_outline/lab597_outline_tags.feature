# Lab 597: Scenario Outline Tags
#
# =====================
# LEARNING CONCEPT:
# =====================
# Using tags with scenario outlines:
#
# - Feature-level tags
# - Outline-level tags
# - Examples-level tags
# - Tag inheritance
#
# =====================
# EXERCISE:
# =====================
# 1. Apply tags at different levels
# 2. Use tag inheritance
# 3. Filter by tags
#
# =====================
# SOLUTION:
# =====================

# Feature-level tag applies to all scenarios
@payments
Feature: Payment Processing
  As a customer
  I want to pay using various methods
  So that I can complete my purchase

  Background:
    Given I have items in my cart totaling $100

  # Solution 1: Outline-level tags
  @smoke @critical
  Scenario Outline: Process payment with different methods
    When I select "<payment_method>" as payment
    And I complete the payment
    Then the payment should be "<result>"

    Examples:
      | payment_method | result     |
      | credit_card    | successful |
      | debit_card     | successful |
      | paypal         | successful |

  # Solution 2: Examples-level tags
  Scenario Outline: Payment validation
    When I attempt payment with "<card_type>" card "<card_number>"
    Then the result should be "<result>"
    And message should be "<message>"

    @valid-cards @smoke
    Examples: Valid Cards
      | card_type  | card_number      | result  | message            |
      | visa       | 4111111111111111 | success | Payment approved   |
      | mastercard | 5500000000000004 | success | Payment approved   |
      | amex       | 340000000000009  | success | Payment approved   |

    @invalid-cards @regression
    Examples: Invalid Cards
      | card_type | card_number      | result | message              |
      | visa      | 4000000000000002 | failed | Card declined        |
      | visa      | 4000000000000069 | failed | Expired card         |
      | visa      | 4000000000000127 | failed | Incorrect CVV        |

    @edge-cases
    Examples: Edge Cases
      | card_type | card_number | result | message              |
      | unknown   | 1234567890  | failed | Invalid card number  |
      | visa      |             | failed | Card number required |

  # Solution 3: Environment-specific tags
  Scenario Outline: Payment gateway integration
    When I process payment through "<gateway>"
    Then the transaction should complete

    @staging-only
    Examples: Staging Gateways
      | gateway        |
      | stripe_test    |
      | paypal_sandbox |
      | braintree_test |

    @production
    Examples: Production Gateways
      | gateway    |
      | stripe     |
      | paypal     |
      | braintree  |

  # Solution 4: Priority tags on examples
  Scenario Outline: Currency conversion
    When I pay <amount> <currency>
    Then the converted amount should be approximately $<usd_amount>

    @p1 @critical
    Examples: Major Currencies
      | amount | currency | usd_amount |
      | 100    | EUR      | 110        |
      | 100    | GBP      | 125        |
      | 100    | JPY      | 0.70       |

    @p2
    Examples: Other Currencies
      | amount | currency | usd_amount |
      | 100    | CAD      | 75         |
      | 100    | AUD      | 65         |
      | 100    | CHF      | 115        |

    @p3 @slow
    Examples: Exotic Currencies
      | amount | currency | usd_amount |
      | 100    | INR      | 1.20       |
      | 100    | BRL      | 20         |
      | 100    | MXN      | 5.50       |

  # Solution 5: Browser-specific tags
  @cross-browser
  Scenario Outline: Payment form rendering
    Given I am using "<browser>" browser
    When I view the payment form
    Then all fields should be properly aligned
    And the submit button should be clickable

    @chrome
    Examples: Chrome
      | browser |
      | chrome  |

    @firefox
    Examples: Firefox
      | browser |
      | firefox |

    @safari @mac-only
    Examples: Safari
      | browser |
      | safari  |

    @mobile
    Examples: Mobile Browsers
      | browser        |
      | chrome-mobile  |
      | safari-mobile  |

  # Solution 6: Data cleanup tags
  @cleanup-required
  Scenario Outline: Create payment record
    When I create a payment of $<amount>
    Then a payment record should be created
    And the record ID should be stored

    @cleanup-payments
    Examples:
      | amount |
      | 50     |
      | 100    |
      | 500    |

