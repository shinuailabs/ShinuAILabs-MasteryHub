/**
 * Lab 933: AI Test Generation Best Practices
 *
 * CONCEPT:
 * Maximize the effectiveness of AI-generated tests by following best practices
 * for prompting, validation, and integration. These practices ensure high-quality
 * tests that provide real value.
 *
 * BULLET POINTS:
 * - Provide clear, detailed prompts
 * - Always review and validate generated tests
 * - Maintain consistent patterns
 * - Integrate with existing test infrastructure
 * - Track and improve generation quality
 */

import { test, expect, Page } from '@playwright/test';

// Best Practice 1: Structured prompts for better results
const testGenerationPrompt = `
Generate Playwright tests for the following feature:

FEATURE: {{featureName}}
DESCRIPTION: {{description}}

REQUIREMENTS:
{{requirements}}

CONSTRAINTS:
- Use data-testid attributes for locators
- Follow AAA pattern (Arrange, Act, Assert)
- Include setup and teardown
- Cover positive and negative cases
- Add meaningful assertions

OUTPUT FORMAT:
- TypeScript with Playwright
- Include JSDoc comments
- Use Page Object Model if complex
`;

// Best Practice 2: Validation checklist for generated tests
interface TestValidation {
  category: string;
  checks: string[];
  passed: boolean;
}

function validateGeneratedTest(testCode: string): TestValidation[] {
  return [
    {
      category: 'Syntax',
      checks: [
        'Has valid TypeScript syntax',
        'Imports are correct',
        'Async/await used properly',
      ],
      passed: testCode.includes('async') && testCode.includes('await'),
    },
    {
      category: 'Structure',
      checks: [
        'Uses test.describe for grouping',
        'Has meaningful test names',
        'Follows AAA pattern',
      ],
      passed: testCode.includes('test.describe') || testCode.includes('test('),
    },
    {
      category: 'Locators',
      checks: [
        'Uses data-testid or semantic locators',
        'Avoids fragile selectors',
        'Locators are specific',
      ],
      passed: testCode.includes('data-testid') || testCode.includes('getByRole'),
    },
    {
      category: 'Assertions',
      checks: [
        'Has meaningful assertions',
        'Uses appropriate matchers',
        'Covers expected outcomes',
      ],
      passed: testCode.includes('expect('),
    },
  ];
}

// Best Practice 3: Test quality metrics
interface TestQualityMetrics {
  coverage: number;
  maintainability: number;
  reliability: number;
  readability: number;
}

function assessTestQuality(testCode: string): TestQualityMetrics {
  return {
    coverage: assessCoverage(testCode),
    maintainability: assessMaintainability(testCode),
    reliability: assessReliability(testCode),
    readability: assessReadability(testCode),
  };
}

function assessCoverage(code: string): number {
  let score = 50;
  if (code.includes('positive') || code.includes('success')) score += 15;
  if (code.includes('negative') || code.includes('error')) score += 15;
  if (code.includes('edge') || code.includes('boundary')) score += 20;
  return Math.min(100, score);
}

function assessMaintainability(code: string): number {
  let score = 50;
  if (code.includes('Page') && code.includes('class')) score += 20; // POM
  if (code.includes('beforeEach')) score += 15;
  if (code.includes('const') || code.includes('interface')) score += 15;
  return Math.min(100, score);
}

function assessReliability(code: string): number {
  let score = 70;
  if (code.includes('waitForTimeout')) score -= 20;
  if (code.includes('data-testid')) score += 15;
  if (code.includes('toBeVisible')) score += 15;
  return Math.min(100, Math.max(0, score));
}

function assessReadability(code: string): number {
  let score = 60;
  if (code.includes('//') || code.includes('/*')) score += 20; // Comments
  if (code.includes('describe(')) score += 10;
  if (code.length < 5000) score += 10; // Not too long
  return Math.min(100, score);
}

// Best Practice 4: Iterative improvement
test.describe('AI Test Generation Best Practices', () => {
  test('example of well-structured generated test', async ({ page }) => {
    // Arrange: Setup test data and navigate
    const testUser = {
      email: 'test@example.com',
      password: 'SecurePass123!',
    };
    await page.goto('/login');

    // Act: Perform the action being tested
    await page.fill('[data-testid="email-input"]', testUser.email);
    await page.fill('[data-testid="password-input"]', testUser.password);
    await page.click('[data-testid="login-button"]');

    // Assert: Verify expected outcomes
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('[data-testid="welcome-message"]')).toBeVisible();
  });
});

// Best Practice 5: Feedback loop for improvement
interface GenerationFeedback {
  testId: string;
  wasUsed: boolean;
  modifications: 'none' | 'minor' | 'major' | 'rewritten';
  issues: string[];
  suggestions: string[];
}

const feedbackLog: GenerationFeedback[] = [];

function recordFeedback(feedback: GenerationFeedback): void {
  feedbackLog.push(feedback);
}

function analyzeGenerationQuality(): { usageRate: number; avgModifications: string } {
  const used = feedbackLog.filter((f) => f.wasUsed).length;
  const usageRate = (used / feedbackLog.length) * 100;

  const modCounts = { none: 0, minor: 0, major: 0, rewritten: 0 };
  feedbackLog.forEach((f) => modCounts[f.modifications]++);

  const avgModifications = Object.entries(modCounts)
    .sort((a, b) => b[1] - a[1])[0][0];

  return { usageRate, avgModifications };
}

/**
 * EXERCISE:
 * 1. Create a prompt template for your domain
 * 2. Generate tests and validate them
 * 3. Track quality metrics over time
 * 4. Iterate on prompts based on feedback
 *
 * LEARNING:
 * - Good prompts = good tests
 * - Always validate generated code
 * - Track metrics to improve over time
 * - Use feedback to refine prompts
 *
 * ONE LINER:
 * "AI test generation is a skill - practice prompting, validate results, and iterate."
 */

export {
  testGenerationPrompt,
  validateGeneratedTest,
  assessTestQuality,
  recordFeedback,
  analyzeGenerationQuality,
};