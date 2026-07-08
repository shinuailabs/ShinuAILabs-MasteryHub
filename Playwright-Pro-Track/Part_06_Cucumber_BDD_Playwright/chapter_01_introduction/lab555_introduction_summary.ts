/**
 * Lab 555: Introduction Summary
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Summary of BDD and Cucumber:
 * 
 * - Key concepts
 * - Best practices
 * - Common patterns
 * - Quick reference
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Review all concepts
 * 2. Apply best practices
 * 3. Start your project
 *
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: BDD Key Concepts
/*
 * BEHAVIOR-DRIVEN DEVELOPMENT (BDD)
 * 
 * What: Development approach focusing on behavior
 * Why: Better communication, living documentation
 * How: Gherkin syntax, Given-When-Then
 * 
 * Benefits:
 * - Shared understanding
 * - Executable specifications
 * - Living documentation
 * - Collaboration between roles
 */

// Solution 2: Gherkin Quick Reference
/*
 * GHERKIN KEYWORDS
 * 
 * Feature: Describes the feature being tested
 * Scenario: A specific test case
 * Given: Preconditions/setup
 * When: Actions/events
 * Then: Expected outcomes
 * And/But: Additional steps
 * Background: Common setup for all scenarios
 * Scenario Outline: Parameterized scenarios
 * Examples: Data for scenario outlines
 * @tag: Labels for filtering
 */

// Solution 3: Step Definition Patterns
import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

// Pattern 1: Simple step
Given('I am on the home page', async function () {
    await this.page.goto('/');
});

// Pattern 2: Step with string parameter
When('I click the {string} button', async function (buttonText: string) {
    await this.page.click(`button:has-text("${buttonText}")`);
});

// Pattern 3: Step with number parameter
Then('I should see {int} results', async function (count: number) {
    await expect(this.page.locator('.result')).toHaveCount(count);
});

// Pattern 4: Step with data table
When('I fill in the form:', async function (dataTable: any) {
    const data = dataTable.rowsHash();
    for (const [field, value] of Object.entries(data)) {
        await this.page.fill(`[name="${field}"]`, value as string);
    }
});

// Pattern 5: Step with doc string
When('I enter the following text:', async function (docString: string) {
    await this.page.fill('textarea', docString);
});

// Solution 4: Project Structure
/*
 * RECOMMENDED STRUCTURE
 * 
 * project/
 * ├── features/
 * │   ├── login.feature
 * │   ├── checkout.feature
 * │   └── step_definitions/
 * │       ├── login.steps.ts
 * │       └── common.steps.ts
 * ├── support/
 * │   ├── world.ts
 * │   └── hooks.ts
 * ├── pages/
 * │   ├── login.page.ts
 * │   └── dashboard.page.ts
 * ├── cucumber.js
 * └── package.json
 */

// Solution 5: Common Commands
/*
 * CUCUMBER CLI COMMANDS
 * 
 * npx cucumber-js                    # Run all tests
 * npx cucumber-js --tags @smoke      # Run tagged tests
 * npx cucumber-js --parallel 4       # Parallel execution
 * npx cucumber-js --dry-run          # Validate without running
 * npx cucumber-js --format html:report.html  # Generate report
 */

// Solution 6: Best Practices Checklist
/*
 * ✓ Write scenarios in business language
 * ✓ Keep scenarios independent
 * ✓ Use Background for common setup
 * ✓ Use Scenario Outline for data variations
 * ✓ Tag scenarios appropriately
 * ✓ Keep step definitions simple
 * ✓ Reuse steps across features
 * ✓ Use Page Objects in step definitions
 * ✓ Handle async operations properly
 * ✓ Generate reports for visibility
 */

// Solution 7: Quick Start Template
const quickStartTemplate = `
# features/example.feature
Feature: Example Feature
  As a user
  I want to do something
  So that I achieve a goal

  @smoke
  Scenario: Basic scenario
    Given I am on the home page
    When I click the "Start" button
    Then I should see the welcome message
`;

// Solution 8: Export
export { quickStartTemplate };

