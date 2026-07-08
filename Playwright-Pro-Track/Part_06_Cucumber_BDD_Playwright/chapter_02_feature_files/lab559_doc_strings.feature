# Lab 559: Doc Strings
#
# =====================
# LEARNING CONCEPT:
# =====================
# Using Doc Strings in Gherkin:
#
# - Multi-line text
# - JSON data
# - Code snippets
# - Formatted content
#
# =====================
# EXERCISE:
# =====================
# 1. Use doc strings for text
# 2. Pass JSON data
# 3. Handle formatted content
#
# =====================
# SOLUTION:
# =====================

Feature: Content Management
  As a content editor
  I want to create and edit content
  So that I can publish articles and posts

  Background:
    Given I am logged in as an editor
    And I am on the content management page

  # Solution 1: Multi-line Text Content
  @content @create
  Scenario: Create article with body text
    When I create a new article with title "Welcome Post"
    And I enter the following body:
      """
      Welcome to our website!
      
      We are excited to have you here. In this article,
      we will introduce you to our services and features.
      
      Stay tuned for more updates!
      """
    And I publish the article
    Then the article should be published
    And the body should preserve formatting

  # Solution 2: JSON Data
  @content @api
  Scenario: Create content via API payload
    When I send a POST request with the following JSON:
      """
      {
        "title": "API Created Post",
        "content": "This post was created via API",
        "author": "system",
        "tags": ["api", "automated"],
        "published": true
      }
      """
    Then the response status should be 201
    And the content should be created

  # Solution 3: HTML Content
  @content @html
  Scenario: Create article with HTML formatting
    When I create a new article
    And I enter the following HTML content:
      """
      <h1>Featured Article</h1>
      <p>This is a <strong>featured</strong> article with:</p>
      <ul>
        <li>Bullet point 1</li>
        <li>Bullet point 2</li>
        <li>Bullet point 3</li>
      </ul>
      <p>Thank you for reading!</p>
      """
    Then the HTML should be rendered correctly

  # Solution 4: Code Snippet
  @content @code
  Scenario: Create technical article with code
    When I create a technical article
    And I add the following code snippet:
      """
      function greet(name) {
        console.log(`Hello, ${name}!`);
        return `Welcome, ${name}`;
      }
      
      greet('World');
      """
    Then the code should be syntax highlighted

  # Solution 5: Email Template
  @content @email
  Scenario: Create email template
    When I create an email template "Welcome Email"
    And I set the email body to:
      """
      Dear {{customer_name}},
      
      Welcome to our platform!
      
      Your account has been created successfully.
      Username: {{username}}
      
      Best regards,
      The Team
      """
    Then the template should be saved
    And placeholders should be recognized

  # Solution 6: Error Message Validation
  @content @validation
  Scenario: Validate error message format
    When I submit invalid content
    Then I should see the following error:
      """
      Validation Error:
      - Title is required
      - Content must be at least 100 characters
      - Category must be selected
      """

  # Solution 7: Markdown Content
  @content @markdown
  Scenario: Create markdown article
    When I create a markdown article with:
      """
      # Main Heading
      
      ## Introduction
      
      This is a **bold** statement and this is *italic*.
      
      ### Features
      
      1. First feature
      2. Second feature
      3. Third feature
      
      > This is a quote
      
      [Link text](https://example.com)
      """
    Then the markdown should be parsed correctly

