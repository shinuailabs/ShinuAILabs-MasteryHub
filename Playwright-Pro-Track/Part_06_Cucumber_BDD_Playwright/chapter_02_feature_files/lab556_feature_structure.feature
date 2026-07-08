# Lab 556: Feature Structure
#
# =====================
# LEARNING CONCEPT:
# =====================
# Proper feature file structure:
#
# - Feature declaration
# - User story format
# - Scenario organization
# - Comments and documentation
#
# =====================
# EXERCISE:
# =====================
# 1. Structure features properly
# 2. Write user stories
# 3. Organize scenarios
#
# =====================
# SOLUTION:
# =====================

# Solution 1: Feature with User Story
Feature: Product Search
  As an online shopper
  I want to search for products
  So that I can find items I want to purchase

  # Solution 2: Background for Common Setup
  Background:
    Given I am on the home page
    And the product catalog is loaded

  # Solution 3: Basic Search Scenario
  @search @smoke
  Scenario: Search by product name
    When I enter "laptop" in the search box
    And I click the search button
    Then I should see search results
    And all results should contain "laptop"

  # Solution 4: Advanced Search Scenario
  @search @advanced
  Scenario: Search with filters
    When I enter "laptop" in the search box
    And I click the search button
    And I apply the following filters:
      | Filter   | Value      |
      | Brand    | Dell       |
      | Price    | $500-$1000 |
      | Rating   | 4+ stars   |
    Then I should see filtered results
    And all results should match the filters

  # Solution 5: Empty Results Scenario
  @search @edge-case
  Scenario: Search with no results
    When I search for "xyznonexistent123"
    Then I should see "No results found" message
    And I should see search suggestions

  # Solution 6: Search Suggestions
  @search @autocomplete
  Scenario: Search autocomplete suggestions
    When I type "lap" in the search box
    Then I should see autocomplete suggestions
    And suggestions should include "laptop"
    And suggestions should include "laptop bag"

  # Solution 7: Recent Searches
  @search @history
  Scenario: View recent searches
    Given I have previously searched for "laptop"
    And I have previously searched for "mouse"
    When I click on the search box
    Then I should see my recent searches
    And "laptop" should be in recent searches
    And "mouse" should be in recent searches

