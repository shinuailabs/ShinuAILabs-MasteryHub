# Lab 604: Tag Organization
#
# =====================
# LEARNING CONCEPT:
# =====================
# Organizing tags effectively:
#
# - Tag naming conventions
# - Tag categories
# - Tag documentation
# - Tag governance
#
# =====================
# EXERCISE:
# =====================
# 1. Create tag categories
# 2. Apply naming conventions
# 3. Document tags
#
# =====================
# SOLUTION:
# =====================

# =====================
# TAG CATEGORIES
# =====================
#
# 1. Test Type Tags:
#    @smoke - Quick sanity tests
#    @regression - Full regression suite
#    @e2e - End-to-end tests
#    @integration - Integration tests
#    @unit - Unit-level tests
#
# 2. Priority Tags:
#    @p1 / @critical - Must pass for release
#    @p2 / @high - Important but not blocking
#    @p3 / @medium - Nice to have
#    @p4 / @low - Can be deferred
#
# 3. Environment Tags:
#    @local - Local development only
#    @staging - Staging environment
#    @production - Production environment
#    @ci - CI/CD pipeline
#
# 4. Feature Tags:
#    @feature:login - Login feature
#    @feature:checkout - Checkout feature
#    @feature:search - Search feature
#
# 5. Status Tags:
#    @wip - Work in progress
#    @skip - Skip execution
#    @flaky - Known flaky test
#    @manual - Requires manual verification
#
# 6. Browser Tags:
#    @chrome - Chrome specific
#    @firefox - Firefox specific
#    @safari - Safari specific
#    @mobile - Mobile browsers
#
# =====================

@feature:user-management @regression
Feature: User Management - Tag Organization Example
  Demonstrates proper tag organization

  # Solution 1: Smoke + Critical combination
  @smoke @p1 @authentication
  Scenario: User login - critical path
    Given I am on the login page
    When I login with valid credentials
    Then I should see the dashboard

  # Solution 2: Feature-specific with priority
  @feature:profile @p2
  Scenario: Update user profile
    Given I am logged in
    When I update my profile information
    Then the changes should be saved

  # Solution 3: Environment-specific test
  @staging @feature:beta
  Scenario: Test beta feature on staging
    Given I am on the staging environment
    When I access the beta feature
    Then I should see the new UI

  # Solution 4: Browser-specific test
  @chrome @visual
  Scenario: Visual regression - Chrome
    Given I am using Chrome browser
    When I load the homepage
    Then the layout should match the baseline

  # Solution 5: Integration test with cleanup
  @integration @cleanup-required @database
  Scenario: Create and verify user in database
    Given I have database access
    When I create a new user via API
    Then the user should exist in the database

  # Solution 6: Flaky test marker
  @regression @flaky @needs-investigation
  Scenario: Intermittent network test
    Given the network is unstable
    When I make an API call
    Then it should eventually succeed

  # Solution 7: Work in progress
  @wip @feature:new-checkout
  Scenario: New checkout flow
    Given I have items in cart
    When I proceed to new checkout
    Then I should see the redesigned flow

  # Solution 8: Manual verification required
  @manual @visual @accessibility
  Scenario: Accessibility compliance check
    Given I am on the homepage
    When I run accessibility audit
    Then there should be no critical violations

  # Solution 9: Performance test
  @performance @p2 @ci
  Scenario: Page load performance
    Given I am measuring performance
    When I load the homepage
    Then it should load within 3 seconds

  # Solution 10: Security test
  @security @p1 @authentication
  Scenario: SQL injection prevention
    Given I am on the login page
    When I attempt SQL injection in username field
    Then the attack should be blocked

  # Solution 11: Mobile-specific
  @mobile @responsive @p2
  Scenario: Mobile navigation menu
    Given I am on a mobile device
    When I tap the hamburger menu
    Then the navigation should slide in

  # Solution 12: API test
  @api @integration @p1
  Scenario: API health check
    When I call the health endpoint
    Then the response should be 200 OK

