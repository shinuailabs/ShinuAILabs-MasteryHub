# Lab 563: Rules (Gherkin 6)
#
# =====================
# LEARNING CONCEPT:
# =====================
# Using Rules in Gherkin 6:
#
# - Rule keyword
# - Grouping scenarios
# - Business rules
# - Example keyword
#
# =====================
# EXERCISE:
# =====================
# 1. Use Rule keyword
# 2. Group related scenarios
# 3. Document business rules
#
# =====================
# SOLUTION:
# =====================

@loyalty
Feature: Loyalty Program
  As a loyalty program member
  I want to earn and redeem points
  So that I can get rewards for my purchases

  Background:
    Given I am a loyalty program member

  # Solution 1: Rule for Earning Points
  Rule: Members earn points on purchases
    # Business rule: 1 point per dollar spent
    
    Example: Earn points on regular purchase
      Given I have 0 points in my account
      When I make a purchase of $50.00
      Then I should earn 50 points
      And my total points should be 50

    Example: Earn bonus points on birthday
      Given today is my birthday
      And I have 100 points
      When I make a purchase of $50.00
      Then I should earn 100 points  # Double points on birthday
      And my total points should be 200

    Example: No points on discounted items
      Given I purchase a clearance item for $30.00
      Then I should earn 0 points
      And I should see "Points not earned on clearance items"

  # Solution 2: Rule for Point Tiers
  Rule: Members have tier levels based on annual spending
    # Tiers: Bronze (0-499), Silver (500-999), Gold (1000+)
    
    Example: Bronze tier member
      Given I have spent $200 this year
      Then my tier should be "Bronze"
      And I should earn 1x points on purchases

    Example: Silver tier member
      Given I have spent $750 this year
      Then my tier should be "Silver"
      And I should earn 1.5x points on purchases

    Example: Gold tier member
      Given I have spent $1500 this year
      Then my tier should be "Gold"
      And I should earn 2x points on purchases

  # Solution 3: Rule for Redeeming Points
  Rule: Members can redeem points for rewards
    # 100 points = $1 discount
    
    Example: Redeem points for discount
      Given I have 500 points
      When I redeem 200 points at checkout
      Then I should get $2.00 discount
      And my remaining points should be 300

    Example: Cannot redeem more points than available
      Given I have 100 points
      When I try to redeem 200 points
      Then I should see "Insufficient points"
      And no discount should be applied

    Example: Minimum redemption requirement
      Given I have 50 points
      When I try to redeem points
      Then I should see "Minimum 100 points required"

  # Solution 4: Rule for Point Expiration
  Rule: Points expire after 12 months of inactivity
    
    Example: Points remain active with purchase
      Given I have 500 points earned 11 months ago
      When I make a purchase today
      Then my points should not expire
      And expiration should reset to 12 months

    Example: Points expire after inactivity
      Given I have 500 points earned 13 months ago
      And I have made no purchases since then
      Then my points should be expired
      And my balance should be 0

