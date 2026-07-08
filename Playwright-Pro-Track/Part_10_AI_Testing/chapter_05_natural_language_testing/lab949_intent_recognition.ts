/**
 * Lab 949: Intent Recognition for Testing
 *
 * CONCEPT:
 * Intent recognition identifies what a user wants to test from natural language
 * input. AI classifies the testing intent and extracts relevant parameters
 * to generate appropriate test code.
 *
 * BULLET POINTS:
 * - Classify testing intents
 * - Extract test parameters
 * - Map intents to test patterns
 * - Handle ambiguous inputs
 * - Learn from user corrections
 */

import { test, expect, Page } from '@playwright/test';

// Example 1: Intent classification
type TestIntent =
  | 'login'
  | 'registration'
  | 'search'
  | 'checkout'
  | 'navigation'
  | 'form_submission'
  | 'data_validation'
  | 'error_handling'
  | 'unknown';

interface IntentResult {
  intent: TestIntent;
  confidence: number;
  parameters: Record<string, string>;
}

function classifyIntent(input: string): IntentResult {
  const inputLower = input.toLowerCase();

  const intentPatterns: { intent: TestIntent; patterns: RegExp[]; paramExtractor?: (input: string) => Record<string, string> }[] = [
    {
      intent: 'login',
      patterns: [/log\s*in/i, /sign\s*in/i, /authenticate/i],
      paramExtractor: (i) => ({
        email: i.match(/email[:\s]+["']?([^"'\s]+)/i)?.[1] || '',
        password: i.match(/password[:\s]+["']?([^"'\s]+)/i)?.[1] || '',
      }),
    },
    {
      intent: 'registration',
      patterns: [/register/i, /sign\s*up/i, /create\s+account/i],
    },
    {
      intent: 'search',
      patterns: [/search/i, /find/i, /look\s+for/i],
      paramExtractor: (i) => ({
        query: i.match(/(?:search|find|look for)\s+["']?([^"']+)["']?/i)?.[1] || '',
      }),
    },
    {
      intent: 'checkout',
      patterns: [/checkout/i, /purchase/i, /buy/i, /order/i],
    },
    {
      intent: 'navigation',
      patterns: [/navigate/i, /go\s+to/i, /visit/i, /open/i],
      paramExtractor: (i) => ({
        destination: i.match(/(?:navigate to|go to|visit|open)\s+["']?([^"']+)["']?/i)?.[1] || '',
      }),
    },
    {
      intent: 'form_submission',
      patterns: [/submit/i, /fill\s+(?:out|in)/i, /complete\s+form/i],
    },
    {
      intent: 'data_validation',
      patterns: [/validate/i, /verify\s+data/i, /check\s+(?:if|that)/i],
    },
    {
      intent: 'error_handling',
      patterns: [/error/i, /invalid/i, /fail/i, /wrong/i],
    },
  ];

  for (const { intent, patterns, paramExtractor } of intentPatterns) {
    for (const pattern of patterns) {
      if (pattern.test(inputLower)) {
        return {
          intent,
          confidence: 0.85,
          parameters: paramExtractor ? paramExtractor(input) : {},
        };
      }
    }
  }

  return { intent: 'unknown', confidence: 0, parameters: {} };
}

// Example 2: Intent to test template mapping
const intentTemplates: Record<TestIntent, string> = {
  login: `
test('user login', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[data-testid="email"]', '{{email}}');
  await page.fill('[data-testid="password"]', '{{password}}');
  await page.click('[data-testid="login-button"]');
  await expect(page).toHaveURL('/dashboard');
});`,
  registration: `
test('user registration', async ({ page }) => {
  await page.goto('/register');
  // Fill registration form
  await page.click('[data-testid="register-button"]');
  await expect(page.locator('[data-testid="success"]')).toBeVisible();
});`,
  search: `
test('search functionality', async ({ page }) => {
  await page.goto('/');
  await page.fill('[data-testid="search-input"]', '{{query}}');
  await page.click('[data-testid="search-button"]');
  await expect(page.locator('[data-testid="results"]')).toBeVisible();
});`,
  checkout: `
test('checkout process', async ({ page }) => {
  await page.goto('/cart');
  await page.click('[data-testid="checkout-button"]');
  // Complete checkout steps
  await expect(page.locator('[data-testid="confirmation"]')).toBeVisible();
});`,
  navigation: `
test('navigation to {{destination}}', async ({ page }) => {
  await page.goto('/{{destination}}');
  await expect(page).toHaveURL('/{{destination}}');
});`,
  form_submission: `
test('form submission', async ({ page }) => {
  await page.goto('/form');
  // Fill form fields
  await page.click('[data-testid="submit"]');
  await expect(page.locator('[data-testid="success"]')).toBeVisible();
});`,
  data_validation: `
test('data validation', async ({ page }) => {
  await page.goto('/form');
  // Enter invalid data
  await page.click('[data-testid="submit"]');
  await expect(page.locator('[data-testid="error"]')).toBeVisible();
});`,
  error_handling: `
test('error handling', async ({ page }) => {
  await page.goto('/');
  // Trigger error condition
  await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
});`,
  unknown: `// Could not determine test intent. Please provide more details.`,
};

// Example 3: Generate test from intent
function generateTestFromIntent(input: string): string {
  const result = classifyIntent(input);
  let template = intentTemplates[result.intent];

  // Replace parameters
  for (const [key, value] of Object.entries(result.parameters)) {
    template = template.replace(new RegExp(`{{${key}}}`, 'g'), value || `[${key}]`);
  }

  return template;
}

// Example 4: Usage
const testInputs = [
  'Test login with email user@test.com and password secret123',
  'Search for laptop computers',
  'Navigate to the profile page',
  'Verify error message for invalid email',
];

testInputs.forEach((input) => {
  console.log(`Input: ${input}`);
  console.log(`Generated:\n${generateTestFromIntent(input)}\n`);
});

/**
 * EXERCISE:
 * 1. Classify intents from natural language
 * 2. Extract parameters from input
 * 3. Generate tests from intents
 * 4. Handle ambiguous inputs
 *
 * LEARNING:
 * - Intent recognition enables natural input
 * - Parameters customize generated tests
 * - Templates ensure consistent output
 * - Handle unknown intents gracefully
 *
 * ONE LINER:
 * "AI understands what you want to test - even when you don't say it perfectly."
 */

export { classifyIntent, generateTestFromIntent, intentTemplates };

