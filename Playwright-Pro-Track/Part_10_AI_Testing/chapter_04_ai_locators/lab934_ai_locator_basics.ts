/**
 * Lab 934: AI Locator Basics
 *
 * CONCEPT:
 * AI-powered locators use machine learning to identify elements more reliably
 * than traditional CSS or XPath selectors. They can adapt to UI changes and
 * find elements based on visual or semantic properties.
 *
 * BULLET POINTS:
 * - AI locators are more resilient to UI changes
 * - Use visual recognition to find elements
 * - Semantic understanding of element purpose
 * - Self-healing capabilities
 * - Reduce test maintenance
 */

import { test, expect, Page, Locator } from '@playwright/test';

// Example 1: Traditional vs AI-powered locator strategies
test.describe('Locator Strategies Comparison', () => {
  // Traditional: Fragile CSS selector
  test('traditional CSS selector (fragile)', async ({ page }) => {
    await page.goto('/login');
    // This breaks if class names change
    await page.locator('.btn.btn-primary.login-btn').click();
  });

  // Better: data-testid (stable but requires dev cooperation)
  test('data-testid selector (stable)', async ({ page }) => {
    await page.goto('/login');
    await page.locator('[data-testid="login-button"]').click();
  });

  // Best: Semantic/Role-based (AI-friendly)
  test('role-based selector (semantic)', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('button', { name: 'Log in' }).click();
  });
});

// Example 2: AI-assisted locator generation
interface AILocatorSuggestion {
  selector: string;
  confidence: number;
  type: 'css' | 'xpath' | 'role' | 'text' | 'testid';
  reasoning: string;
}

function generateAILocators(elementDescription: string): AILocatorSuggestion[] {
  // Simulated AI locator suggestions
  return [
    {
      selector: '[data-testid="login-button"]',
      confidence: 95,
      type: 'testid',
      reasoning: 'Test ID is most stable and recommended',
    },
    {
      selector: "button:has-text('Log in')",
      confidence: 85,
      type: 'text',
      reasoning: 'Text-based locator, stable if text unchanged',
    },
    {
      selector: "role=button[name='Log in']",
      confidence: 90,
      type: 'role',
      reasoning: 'Semantic locator, good for accessibility',
    },
  ];
}

// Example 3: Smart locator with fallbacks
class SmartLocator {
  private strategies: (() => Locator)[];

  constructor(private page: Page, strategies: (() => Locator)[]) {
    this.strategies = strategies;
  }

  async find(): Promise<Locator> {
    for (const strategy of this.strategies) {
      const locator = strategy();
      if ((await locator.count()) > 0) {
        return locator;
      }
    }
    throw new Error('Element not found with any strategy');
  }
}

// Usage
test('smart locator with fallbacks', async ({ page }) => {
  await page.goto('/login');

  const loginButton = new SmartLocator(page, [
    () => page.locator('[data-testid="login-button"]'),
    () => page.getByRole('button', { name: 'Log in' }),
    () => page.locator('button[type="submit"]'),
    () => page.locator('.login-btn'),
  ]);

  const button = await loginButton.find();
  await button.click();
});

// Example 4: Playwright's built-in AI-friendly locators
test.describe('Playwright Semantic Locators', () => {
  test('getByRole - finds by ARIA role', async ({ page }) => {
    await page.goto('/form');
    await page.getByRole('textbox', { name: 'Email' }).fill('test@example.com');
    await page.getByRole('button', { name: 'Submit' }).click();
  });

  test('getByLabel - finds by label text', async ({ page }) => {
    await page.goto('/form');
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Password').fill('password123');
  });

  test('getByPlaceholder - finds by placeholder', async ({ page }) => {
    await page.goto('/search');
    await page.getByPlaceholder('Search...').fill('test query');
  });

  test('getByText - finds by text content', async ({ page }) => {
    await page.goto('/');
    await page.getByText('Welcome').click();
  });
});

/**
 * EXERCISE:
 * 1. Identify fragile locators in your tests
 * 2. Replace with semantic locators
 * 3. Implement fallback strategies
 * 4. Measure locator stability
 *
 * LEARNING:
 * - Semantic locators are more stable
 * - Use data-testid as primary strategy
 * - Implement fallbacks for resilience
 * - AI can suggest optimal locators
 *
 * ONE LINER:
 * "AI locators find elements like humans do - by understanding what they are, not just where they are."
 */

export { generateAILocators, SmartLocator };

