/**
 * Lab 924: GitHub Copilot Best Practices for Testing
 *
 * CONCEPT:
 * Maximize Copilot's effectiveness by following best practices for prompting,
 * code organization, and verification. These practices ensure you get accurate
 * suggestions while maintaining code quality.
 *
 * BULLET POINTS:
 * - Write descriptive comments before code
 * - Use consistent naming conventions
 * - Provide type information for better suggestions
 * - Always review and test generated code
 * - Use Copilot Chat for complex questions
 * - Keep context files open for better suggestions
 */

import { test, expect, Page, Locator } from '@playwright/test';

// Best Practice 1: Descriptive comments drive better suggestions
// ❌ Bad: Vague comment
// test for login

// ✅ Good: Specific comment with context
// Test that a registered user can login with valid email and password
// and is redirected to the dashboard with a welcome message
test('registered user login redirects to dashboard', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[data-testid="email"]', 'user@example.com');
  await page.fill('[data-testid="password"]', 'ValidPass123!');
  await page.click('[data-testid="login-button"]');
  await expect(page).toHaveURL('/dashboard');
  await expect(page.locator('[data-testid="welcome-message"]')).toBeVisible();
});

// Best Practice 2: Consistent naming patterns
// Copilot learns from your patterns - be consistent

// ✅ Good: Consistent Page Object naming
class LoginPageBP {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    // Copilot suggests consistent locator patterns
    this.emailInput = page.locator('[data-testid="email-input"]');
    this.passwordInput = page.locator('[data-testid="password-input"]');
    this.loginButton = page.locator('[data-testid="login-button"]');
    this.errorMessage = page.locator('[data-testid="error-message"]');
  }

  // Copilot suggests methods following the pattern
  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}

// Best Practice 3: Type definitions improve suggestions
interface TestUser {
  email: string;
  password: string;
  role: 'admin' | 'user' | 'guest';
  permissions: string[];
}

// Copilot uses types to suggest appropriate code
function createTestUser(role: TestUser['role']): TestUser {
  const users: Record<string, TestUser> = {
    admin: {
      email: 'admin@test.com',
      password: 'AdminPass123!',
      role: 'admin',
      permissions: ['read', 'write', 'delete', 'admin'],
    },
    user: {
      email: 'user@test.com',
      password: 'UserPass123!',
      role: 'user',
      permissions: ['read', 'write'],
    },
    guest: {
      email: 'guest@test.com',
      password: 'GuestPass123!',
      role: 'guest',
      permissions: ['read'],
    },
  };
  return users[role];
}

// Best Practice 4: Verification checklist for Copilot code
const copilotVerificationChecklist = {
  syntax: [
    'Are all imports correct?',
    'Is async/await used properly?',
    'Are there any TypeScript errors?',
  ],
  playwright: [
    'Are locators using best practices (data-testid, roles)?',
    'Are there proper waits instead of hardcoded timeouts?',
    'Are assertions specific and meaningful?',
  ],
  logic: [
    'Does the test cover the intended scenario?',
    'Are edge cases handled?',
    'Is the test independent and isolated?',
  ],
  security: [
    'Are there any hardcoded credentials?',
    'Is sensitive data properly handled?',
    'Are there any security vulnerabilities?',
  ],
};

// Best Practice 5: Use Copilot Chat for complex scenarios
const complexScenarioPrompts = {
  multiStep: `
    Generate a test for a multi-step wizard with:
    - 4 steps: Personal Info, Address, Payment, Confirmation
    - Validation on each step
    - Back navigation support
    - Progress indicator verification
  `,
  errorHandling: `
    Generate tests for error handling scenarios:
    - Network failure during form submission
    - Server returns 500 error
    - Session timeout during checkout
    - Invalid data from API
  `,
  accessibility: `
    Generate accessibility tests for the login form:
    - Keyboard navigation
    - Screen reader labels
    - Focus management
    - Error announcements
  `,
};

// Best Practice 6: Keep related files open for context
// Copilot uses open files to understand your codebase
// Open: page objects, fixtures, types, existing tests

test.describe('Copilot Best Practices Demo', () => {
  test('demonstrates well-structured test', async ({ page }) => {
    // Arrange
    const loginPage = new LoginPageBP(page);
    const testUser = createTestUser('user');
    await page.goto('/login');

    // Act
    await loginPage.login(testUser.email, testUser.password);

    // Assert
    await expect(page).toHaveURL('/dashboard');
  });
});

/**
 * EXERCISE:
 * 1. Review your recent Copilot-generated code against the checklist
 * 2. Refactor a test to follow naming conventions
 * 3. Add type definitions to improve suggestions
 *
 * LEARNING:
 * - Quality input = quality output
 * - Consistency helps Copilot learn your patterns
 * - Always verify generated code
 * - Use Chat for complex scenarios
 * - Types and comments are your best friends
 *
 * ONE LINER:
 * "Copilot is as good as the context you give it - invest in clear code and comments."
 */

export { LoginPageBP, createTestUser, copilotVerificationChecklist };

