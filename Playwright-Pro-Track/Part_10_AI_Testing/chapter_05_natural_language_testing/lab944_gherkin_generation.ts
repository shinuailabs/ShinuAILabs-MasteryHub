/**
 * Lab 944: AI Gherkin Generation
 *
 * CONCEPT:
 * AI can generate Gherkin scenarios from requirements, user stories, or
 * plain descriptions. This accelerates BDD adoption and ensures consistent
 * scenario structure.
 *
 * BULLET POINTS:
 * - Generate Given/When/Then from requirements
 * - Create comprehensive scenarios
 * - Include edge cases automatically
 * - Maintain consistent style
 * - Generate step definitions
 */

// Example 1: AI-generated Gherkin from requirement
const requirement = `
Users should be able to reset their password by:
1. Clicking "Forgot Password" on login page
2. Entering their email address
3. Receiving a reset link via email
4. Setting a new password
`;

// AI-Generated Gherkin:
const generatedGherkin = `
Feature: Password Reset
  As a registered user
  I want to reset my password
  So that I can regain access to my account

  Background:
    Given I am on the login page

  Scenario: Request password reset with valid email
    When I click on "Forgot Password"
    And I enter "user@example.com" in the email field
    And I click "Send Reset Link"
    Then I should see "Reset link sent to your email"

  Scenario: Request password reset with invalid email
    When I click on "Forgot Password"
    And I enter "invalid-email" in the email field
    And I click "Send Reset Link"
    Then I should see "Please enter a valid email address"

  Scenario: Request password reset with unregistered email
    When I click on "Forgot Password"
    And I enter "unknown@example.com" in the email field
    And I click "Send Reset Link"
    Then I should see "Reset link sent to your email"
    # Note: Same message for security reasons

  Scenario: Reset password with valid token
    Given I have a valid password reset token
    When I navigate to the reset password page
    And I enter "NewSecurePass123!" as my new password
    And I confirm "NewSecurePass123!" as my password
    And I click "Reset Password"
    Then I should be logged in
    And I should see "Password successfully reset"

  Scenario: Reset password with expired token
    Given I have an expired password reset token
    When I navigate to the reset password page
    Then I should see "This reset link has expired"
    And I should see a link to request a new reset

  Scenario Outline: Password complexity validation
    Given I have a valid password reset token
    When I navigate to the reset password page
    And I enter "<password>" as my new password
    Then I should see "<error_message>"

    Examples:
      | password    | error_message                          |
      | short       | Password must be at least 8 characters |
      | nouppercas1 | Password must contain uppercase letter |
      | NOLOWERCASE1| Password must contain lowercase letter |
      | NoNumbers!  | Password must contain a number         |
`;

// Example 2: Gherkin generator function
interface GherkinScenario {
  name: string;
  given: string[];
  when: string[];
  then: string[];
}

function generateGherkinFromSteps(scenario: GherkinScenario): string {
  let gherkin = `  Scenario: ${scenario.name}\n`;

  scenario.given.forEach((step, i) => {
    gherkin += `    ${i === 0 ? 'Given' : 'And'} ${step}\n`;
  });

  scenario.when.forEach((step, i) => {
    gherkin += `    ${i === 0 ? 'When' : 'And'} ${step}\n`;
  });

  scenario.then.forEach((step, i) => {
    gherkin += `    ${i === 0 ? 'Then' : 'And'} ${step}\n`;
  });

  return gherkin;
}

// Example 3: Generate step definitions
function generateStepDefinitions(gherkin: string): string {
  const steps = gherkin.match(/(?:Given|When|Then|And)\s+(.+)/g) || [];
  const uniqueSteps = [...new Set(steps)];

  let definitions = `import { Given, When, Then } from '@cucumber/cucumber';\n\n`;

  uniqueSteps.forEach((step) => {
    const keyword = step.split(' ')[0];
    const pattern = step.replace(/^(Given|When|Then|And)\s+/, '');
    const regex = pattern.replace(/"[^"]+"/g, '"([^"]*)"');

    definitions += `${keyword}('${regex}', async function(`;
    const params = (pattern.match(/"[^"]+"/g) || []).map((_, i) => `param${i + 1}`);
    definitions += `${params.join(', ')}) {\n`;
    definitions += `  // TODO: Implement step\n`;
    definitions += `});\n\n`;
  });

  return definitions;
}

// Example 4: AI prompt for Gherkin generation
const gherkinPrompt = `
Generate Gherkin scenarios for the following feature:

Feature: {{featureName}}
Description: {{description}}

Requirements:
{{requirements}}

Generate:
1. Feature header with user story format
2. Background if common setup needed
3. Happy path scenarios
4. Error/edge case scenarios
5. Scenario outlines for data variations

Use clear, consistent step language.
`;

/**
 * EXERCISE:
 * 1. Take a requirement from your project
 * 2. Generate Gherkin scenarios with AI
 * 3. Generate step definitions
 * 4. Implement the steps
 *
 * LEARNING:
 * - AI generates comprehensive Gherkin
 * - Include happy and error paths
 * - Use Scenario Outlines for variations
 * - Generate step definitions automatically
 *
 * ONE LINER:
 * "AI writes your Gherkin scenarios - you focus on implementing the steps."
 */

export { generateGherkinFromSteps, generateStepDefinitions, gherkinPrompt };

