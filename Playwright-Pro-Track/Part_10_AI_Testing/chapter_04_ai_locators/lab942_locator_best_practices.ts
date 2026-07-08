/**
 * Lab 942: AI Locator Best Practices
 *
 * CONCEPT:
 * Following best practices for AI-powered locators ensures stable, maintainable
 * tests. This lab consolidates key principles for effective locator strategies.
 *
 * BULLET POINTS:
 * - Prioritize stable locator strategies
 * - Use semantic locators when possible
 * - Implement fallback mechanisms
 * - Track and maintain locator health
 * - Document locator decisions
 */

import { test, expect, Page, Locator } from '@playwright/test';

// Best Practice 1: Locator priority hierarchy
const locatorPriority = [
  { type: 'data-testid', stability: 95, example: '[data-testid="login-btn"]' },
  { type: 'role', stability: 90, example: 'getByRole("button", { name: "Login" })' },
  { type: 'label', stability: 85, example: 'getByLabel("Email")' },
  { type: 'placeholder', stability: 75, example: 'getByPlaceholder("Enter email")' },
  { type: 'text', stability: 70, example: 'getByText("Submit")' },
  { type: 'css-id', stability: 65, example: '#login-button' },
  { type: 'css-class', stability: 40, example: '.btn-primary' },
  { type: 'xpath', stability: 30, example: '//button[@type="submit"]' },
];

// Best Practice 2: Locator factory with best practices
class LocatorFactory {
  constructor(private page: Page) {}

  // Always prefer data-testid
  byTestId(testId: string): Locator {
    return this.page.locator(`[data-testid="${testId}"]`);
  }

  // Use role for semantic elements
  byRole(role: string, options?: { name?: string | RegExp }): Locator {
    return this.page.getByRole(role as any, options);
  }

  // Use label for form inputs
  byLabel(label: string | RegExp): Locator {
    return this.page.getByLabel(label);
  }

  // Combine strategies for resilience
  resilient(
    primary: () => Locator,
    fallbacks: (() => Locator)[]
  ): () => Promise<Locator> {
    return async () => {
      const primaryLocator = primary();
      if ((await primaryLocator.count()) > 0) {
        return primaryLocator;
      }

      for (const fallback of fallbacks) {
        const loc = fallback();
        if ((await loc.count()) > 0) {
          console.warn('Using fallback locator');
          return loc;
        }
      }

      return primaryLocator; // Return primary for error message
    };
  }
}

// Best Practice 3: Locator documentation
interface DocumentedLocator {
  name: string;
  selector: string;
  purpose: string;
  stability: 'high' | 'medium' | 'low';
  alternatives: string[];
  notes?: string;
}

const loginPageLocators: DocumentedLocator[] = [
  {
    name: 'emailInput',
    selector: '[data-testid="email-input"]',
    purpose: 'Email input field for login',
    stability: 'high',
    alternatives: ['#email', 'input[type="email"]'],
    notes: 'Primary locator, data-testid added in v2.0',
  },
  {
    name: 'passwordInput',
    selector: '[data-testid="password-input"]',
    purpose: 'Password input field for login',
    stability: 'high',
    alternatives: ['#password', 'input[type="password"]'],
  },
  {
    name: 'loginButton',
    selector: '[data-testid="login-button"]',
    purpose: 'Submit button for login form',
    stability: 'high',
    alternatives: ['button[type="submit"]', '.login-btn'],
  },
];

// Best Practice 4: Locator validation
async function validateLocators(
  page: Page,
  locators: DocumentedLocator[]
): Promise<{ valid: string[]; invalid: string[] }> {
  const valid: string[] = [];
  const invalid: string[] = [];

  for (const loc of locators) {
    const count = await page.locator(loc.selector).count();
    if (count === 1) {
      valid.push(loc.name);
    } else {
      invalid.push(`${loc.name}: found ${count} elements`);
    }
  }

  return { valid, invalid };
}

// Best Practice 5: Example tests following best practices
test.describe('Locator Best Practices', () => {
  test('use data-testid as primary strategy', async ({ page }) => {
    await page.goto('/login');

    const factory = new LocatorFactory(page);

    // Best: data-testid
    await factory.byTestId('email-input').fill('test@example.com');
    await factory.byTestId('password-input').fill('password123');
    await factory.byTestId('login-button').click();
  });

  test('use semantic locators for accessibility', async ({ page }) => {
    await page.goto('/login');

    // Good: Role-based locators
    await page.getByRole('textbox', { name: 'Email' }).fill('test@example.com');
    await page.getByRole('button', { name: 'Log in' }).click();
  });

  test('validate page locators', async ({ page }) => {
    await page.goto('/login');

    const result = await validateLocators(page, loginPageLocators);

    console.log('Valid locators:', result.valid);
    console.log('Invalid locators:', result.invalid);

    expect(result.invalid).toHaveLength(0);
  });
});

/**
 * EXERCISE:
 * 1. Audit your locators against the priority list
 * 2. Document your locator decisions
 * 3. Implement a locator factory
 * 4. Add locator validation to CI
 *
 * LEARNING:
 * - Follow the locator priority hierarchy
 * - Document locator decisions
 * - Validate locators regularly
 * - Use factories for consistency
 *
 * ONE LINER:
 * "The best locator is one that never breaks - prioritize stability over convenience."
 */

export { locatorPriority, LocatorFactory, loginPageLocators, validateLocators };

