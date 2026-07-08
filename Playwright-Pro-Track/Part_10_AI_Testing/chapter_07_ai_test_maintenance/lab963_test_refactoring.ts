/**
 * Lab 963: AI-Assisted Test Refactoring
 *
 * CONCEPT:
 * AI can analyze test code and suggest refactoring improvements such as
 * extracting common patterns, improving readability, and applying best
 * practices automatically.
 *
 * BULLET POINTS:
 * - Identify code duplication
 * - Extract reusable functions
 * - Improve test readability
 * - Apply best practices
 * - Maintain test quality
 */

import { test, expect, Page } from '@playwright/test';

// Example 1: Before refactoring - duplicated code
const beforeRefactoring = `
test('login with valid credentials', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[data-testid="email"]', 'user@example.com');
  await page.fill('[data-testid="password"]', 'password123');
  await page.click('[data-testid="login-button"]');
  await expect(page).toHaveURL('/dashboard');
});

test('login with invalid credentials', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[data-testid="email"]', 'wrong@example.com');
  await page.fill('[data-testid="password"]', 'wrongpassword');
  await page.click('[data-testid="login-button"]');
  await expect(page.locator('[data-testid="error"]')).toBeVisible();
});
`;

// Example 2: After refactoring - extracted helper
class LoginPage {
  constructor(private page: Page) {}

  async goto(): Promise<void> {
    await this.page.goto('/login');
  }

  async login(email: string, password: string): Promise<void> {
    await this.page.fill('[data-testid="email"]', email);
    await this.page.fill('[data-testid="password"]', password);
    await this.page.click('[data-testid="login-button"]');
  }

  async expectSuccess(): Promise<void> {
    await expect(this.page).toHaveURL('/dashboard');
  }

  async expectError(message?: string): Promise<void> {
    const error = this.page.locator('[data-testid="error"]');
    await expect(error).toBeVisible();
    if (message) {
      await expect(error).toContainText(message);
    }
  }
}

test.describe('Login Tests (Refactored)', () => {
  test('login with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('user@example.com', 'password123');
    await loginPage.expectSuccess();
  });

  test('login with invalid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('wrong@example.com', 'wrongpassword');
    await loginPage.expectError();
  });
});

// Example 3: AI refactoring suggestions
interface RefactoringSuggestion {
  type: 'extract-function' | 'extract-class' | 'parameterize' | 'simplify';
  description: string;
  before: string;
  after: string;
  impact: 'high' | 'medium' | 'low';
}

function analyzeTestForRefactoring(testCode: string): RefactoringSuggestion[] {
  const suggestions: RefactoringSuggestion[] = [];

  // Check for duplicated selectors
  const selectorPattern = /\[data-testid="([^"]+)"\]/g;
  const selectors = testCode.match(selectorPattern) || [];
  const duplicates = selectors.filter((s, i) => selectors.indexOf(s) !== i);

  if (duplicates.length > 0) {
    suggestions.push({
      type: 'extract-class',
      description: 'Extract Page Object for repeated selectors',
      before: 'page.locator(\'[data-testid="email"]\').fill(...)',
      after: 'loginPage.emailInput.fill(...)',
      impact: 'high',
    });
  }

  // Check for repeated navigation
  if ((testCode.match(/page\.goto/g) || []).length > 2) {
    suggestions.push({
      type: 'extract-function',
      description: 'Extract navigation to beforeEach hook',
      before: 'await page.goto("/login")',
      after: 'test.beforeEach(async ({ page }) => { await page.goto("/login"); })',
      impact: 'medium',
    });
  }

  // Check for magic strings
  if (testCode.includes('user@example.com') || testCode.includes('password123')) {
    suggestions.push({
      type: 'parameterize',
      description: 'Extract test data to constants or fixtures',
      before: '"user@example.com"',
      after: 'testData.validUser.email',
      impact: 'medium',
    });
  }

  return suggestions;
}

// Example 4: Automated refactoring
function applyRefactoring(code: string, suggestion: RefactoringSuggestion): string {
  // In real implementation, use AST manipulation
  return code.replace(suggestion.before, suggestion.after);
}

// Example 5: Test quality metrics
interface TestQualityMetrics {
  linesOfCode: number;
  cyclomaticComplexity: number;
  duplicationPercentage: number;
  assertionCount: number;
  readabilityScore: number;
}

function analyzeTestQuality(testCode: string): TestQualityMetrics {
  const lines = testCode.split('\n').filter((l) => l.trim().length > 0);
  const assertions = (testCode.match(/expect\(/g) || []).length;

  return {
    linesOfCode: lines.length,
    cyclomaticComplexity: (testCode.match(/if|for|while|switch/g) || []).length + 1,
    duplicationPercentage: 0.15, // Simulated
    assertionCount: assertions,
    readabilityScore: 0.8, // Simulated
  };
}

/**
 * EXERCISE:
 * 1. Analyze your tests for refactoring opportunities
 * 2. Extract Page Objects
 * 3. Parameterize test data
 * 4. Measure test quality
 *
 * LEARNING:
 * - Refactoring improves maintainability
 * - Page Objects reduce duplication
 * - Parameterization enables data-driven tests
 * - AI can suggest improvements
 *
 * ONE LINER:
 * "AI refactors your tests to be cleaner, faster, and easier to maintain."
 */

export { LoginPage, analyzeTestForRefactoring, analyzeTestQuality };

