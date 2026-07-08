/**
 * Lab 925: AI Test Generation from Requirements
 *
 * CONCEPT:
 * AI can transform user requirements, user stories, and acceptance criteria
 * into executable test cases. This bridges the gap between business requirements
 * and technical implementation.
 *
 * BULLET POINTS:
 * - Convert user stories to test scenarios
 * - Generate tests from acceptance criteria
 * - Create test cases from PRDs
 * - Identify edge cases from requirements
 * - Maintain traceability to requirements
 */

import { test, expect, Page } from '@playwright/test';

// Example 1: User Story to Test
/*
USER STORY:
As a registered user
I want to reset my password
So that I can regain access to my account

ACCEPTANCE CRITERIA:
1. User can request password reset from login page
2. User receives email with reset link
3. Reset link expires after 24 hours
4. User can set new password meeting complexity requirements
5. User is logged in after successful reset
*/

// AI-Generated Tests from User Story:
test.describe('Password Reset - US-123', () => {
  test('AC1: User can request password reset from login page', async ({ page }) => {
    await page.goto('/login');
    await page.click('[data-testid="forgot-password-link"]');
    await expect(page).toHaveURL('/forgot-password');
    await page.fill('[data-testid="email-input"]', 'user@example.com');
    await page.click('[data-testid="send-reset-link"]');
    await expect(page.locator('[data-testid="success-message"]')).toContainText(
      'Reset link sent'
    );
  });

  test('AC4: New password must meet complexity requirements', async ({ page }) => {
    await page.goto('/reset-password?token=valid-token');

    // Test weak password rejection
    await page.fill('[data-testid="new-password"]', 'weak');
    await page.fill('[data-testid="confirm-password"]', 'weak');
    await page.click('[data-testid="reset-button"]');
    await expect(page.locator('[data-testid="password-error"]')).toBeVisible();

    // Test valid password acceptance
    await page.fill('[data-testid="new-password"]', 'StrongPass123!');
    await page.fill('[data-testid="confirm-password"]', 'StrongPass123!');
    await page.click('[data-testid="reset-button"]');
    await expect(page).toHaveURL('/dashboard');
  });

  test('AC5: User is logged in after successful reset', async ({ page }) => {
    await page.goto('/reset-password?token=valid-token');
    await page.fill('[data-testid="new-password"]', 'NewSecurePass123!');
    await page.fill('[data-testid="confirm-password"]', 'NewSecurePass123!');
    await page.click('[data-testid="reset-button"]');
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
  });
});

// Example 2: Prompt template for requirement-to-test conversion
const requirementToTestPrompt = `
Convert the following requirement into Playwright test cases:

REQUIREMENT:
{{requirement}}

CONTEXT:
- Application URL: {{baseUrl}}
- Use data-testid attributes for locators
- Follow AAA pattern (Arrange, Act, Assert)
- Include positive and negative test cases
- Add appropriate assertions

Generate TypeScript Playwright tests with:
1. Descriptive test names referencing requirement ID
2. Clear comments explaining each step
3. Proper error handling
4. Test data setup
`;

// Example 3: AI-generated edge cases from requirements
interface RequirementAnalysis {
  requirement: string;
  happyPath: string[];
  edgeCases: string[];
  negativeTests: string[];
  boundaryTests: string[];
}

const passwordResetAnalysis: RequirementAnalysis = {
  requirement: 'User can reset password with valid email',
  happyPath: ['Valid email receives reset link', 'New password is accepted'],
  edgeCases: [
    'Email with special characters',
    'Email at maximum length',
    'Multiple reset requests',
    'Reset during active session',
  ],
  negativeTests: [
    'Invalid email format',
    'Non-existent email',
    'Expired reset token',
    'Already used reset token',
  ],
  boundaryTests: [
    'Password at minimum length (8 chars)',
    'Password at maximum length (128 chars)',
    'Token expiry at exactly 24 hours',
  ],
};

// Generate tests from analysis
test.describe('Password Reset - Edge Cases', () => {
  for (const edgeCase of passwordResetAnalysis.edgeCases) {
    test(`Edge case: ${edgeCase}`, async ({ page }) => {
      // Test implementation based on edge case
      await page.goto('/forgot-password');
      // Specific test logic for each edge case
    });
  }
});

/**
 * EXERCISE:
 * 1. Take a user story from your project
 * 2. Use AI to generate test cases
 * 3. Review and refine the generated tests
 * 4. Add missing edge cases
 *
 * LEARNING:
 * - AI helps identify test scenarios from requirements
 * - Always review AI-generated tests for completeness
 * - Add domain-specific edge cases manually
 * - Maintain traceability with requirement IDs
 *
 * ONE LINER:
 * "AI transforms requirements into tests - you ensure they're complete and correct."
 */

export { requirementToTestPrompt, passwordResetAnalysis };

