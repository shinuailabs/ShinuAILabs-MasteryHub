# Lab 609: Tag Best Practices
#
# =====================
# LEARNING CONCEPT:
# =====================
# Best practices for tags:
#
# - Naming conventions
# - Tag governance
# - Documentation
# - Maintenance
#
# =====================
# EXERCISE:
# =====================
# 1. Apply naming conventions
# 2. Document tags
# 3. Maintain tag hygiene
#
# =====================
# SOLUTION:
# =====================

# =====================
# TAG BEST PRACTICES
# =====================
#
# 1. USE CONSISTENT NAMING CONVENTIONS
#    - Use lowercase with hyphens: @smoke-test, @user-login
#    - Use prefixes for categories: @feature:, @priority:, @env:
#    - Avoid spaces and special characters
#
# 2. KEEP TAGS MEANINGFUL
#    - BAD: @test1, @abc, @temp
#    - GOOD: @smoke, @login-flow, @payment-integration
#
# 3. LIMIT TAG COUNT PER SCENARIO
#    - Aim for 2-5 tags per scenario
#    - Too many tags indicate poor organization
#
# 4. DOCUMENT YOUR TAGS
#    - Maintain a tag glossary
#    - Include tag purpose and usage
#
# 5. REVIEW TAGS REGULARLY
#    - Remove unused tags
#    - Consolidate similar tags
#    - Update outdated tags
#
# =====================

# TAG GLOSSARY FOR THIS PROJECT:
#
# Test Types:
#   @smoke - Quick sanity checks (< 5 min total)
#   @regression - Full test suite
#   @e2e - End-to-end user journeys
#
# Priorities:
#   @p1 - Critical, must pass for release
#   @p2 - High priority
#   @p3 - Medium priority
#
# Features:
#   @feature:auth - Authentication features
#   @feature:cart - Shopping cart features
#   @feature:checkout - Checkout features
#
# Status:
#   @wip - Work in progress
#   @skip - Temporarily skipped
#   @flaky - Known flaky test

@feature:auth @regression
Feature: Tag Best Practices Example
  Demonstrates proper tag usage

  # Best Practice 1: Minimal, meaningful tags
  @smoke @p1
  Scenario: User can login with valid credentials
    Given I am on the login page
    When I enter valid credentials
    Then I should be logged in

  # Best Practice 2: Feature-specific tags
  @feature:cart @p2
  Scenario: Add item to cart
    Given I am logged in
    When I add a product to cart
    Then the cart should show 1 item

  # Best Practice 3: Environment-aware tags
  @staging @feature:beta
  Scenario: Test beta feature
    Given I am on staging environment
    When I access the beta feature
    Then I should see the new UI

  # Best Practice 4: Clear skip reason
  @skip @bug:JIRA-1234
  Scenario: Broken feature - pending fix
    # Skipped due to bug JIRA-1234
    # Expected fix date: 2024-02-01
    Given this feature is broken
    When I try to use it
    Then it fails

  # Best Practice 5: Flaky test documentation
  @flaky @needs-investigation
  Scenario: Intermittent failure
    # Known flaky due to timing issues
    # Retry mechanism enabled
    # Investigation ticket: JIRA-5678
    Given the system is under load
    When I perform an action
    Then it should succeed

  # Best Practice 6: Integration test markers
  @integration @requires:database @cleanup-required
  Scenario: Database integration
    Given I have database access
    When I create a record
    Then it should be persisted

  # Best Practice 7: Performance test markers
  @performance @slow @nightly
  Scenario: Load test
    Given I have 1000 concurrent users
    When they all login simultaneously
    Then response time should be under 2 seconds

  # Best Practice 8: Security test markers
  @security @p1 @compliance
  Scenario: SQL injection prevention
    Given I am on the login page
    When I attempt SQL injection
    Then the attack should be blocked

  # Best Practice 9: Accessibility markers
  @accessibility @wcag-aa
  Scenario: Screen reader compatibility
    Given I am using a screen reader
    When I navigate the page
    Then all elements should be announced

  # Best Practice 10: Mobile-specific markers
  @mobile @responsive @viewport:375x667
  Scenario: Mobile layout
    Given I am on a mobile device
    When I view the homepage
    Then the mobile layout should be displayed

  # Anti-patterns to avoid:
  #
  # @test - Too generic
  # @john - Developer name (not meaningful)
  # @temp123 - Temporary tag left behind
  # @smoke @regression @e2e @integration - Too many type tags
  # @SMOKE - Inconsistent casing

