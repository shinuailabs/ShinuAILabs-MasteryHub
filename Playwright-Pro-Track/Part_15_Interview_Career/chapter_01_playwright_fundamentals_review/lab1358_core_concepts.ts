/**
 * Lab 1358: Playwright Core Concepts - Interview Review
 *
 * CONCEPT:
 * This lab reviews the fundamental Playwright concepts commonly asked in
 * SDET/QA interviews. Master these to ace your technical interviews.
 *
 * BULLET POINTS:
 * - Playwright architecture: Browser → Context → Page
 * - Auto-waiting: Playwright waits for elements automatically
 * - Locator strategies: Role-based > Test ID > CSS > XPath
 * - Assertions: Web-first assertions with auto-retry
 * - Parallel execution: Tests run in isolation by default
 *
 * INTERVIEW FREQUENCY: ⭐⭐⭐⭐⭐ (Very Common)
 */

import { test, expect, Page, Locator } from '@playwright/test';

// ============================================
// INTERVIEW QUESTION 1: Playwright Architecture
// ============================================

/**
 * Q: Explain Playwright's architecture.
 *
 * A: Playwright has a hierarchical structure:
 *    Browser → BrowserContext → Page
 *
 *    - Browser: Chrome, Firefox, or WebKit instance
 *    - BrowserContext: Isolated session (like incognito)
 *    - Page: Single tab within a context
 *
 *    Each test gets a fresh context, ensuring isolation.
 */

test('demonstrate browser hierarchy', async ({ browser }) => {
  // Create isolated context
  const context = await browser.newContext();

  // Create page in context
  const page = await context.newPage();

  await page.goto('https://example.com');

  // Clean up
  await context.close();
});

// ============================================
// INTERVIEW QUESTION 2: Locator Strategies
// ============================================

/**
 * Q: What are the recommended locator strategies in Playwright?
 *
 * A: Priority order (best to worst):
 *    1. getByRole() - Accessible, resilient
 *    2. getByTestId() - Explicit, stable
 *    3. getByText() - User-visible
 *    4. getByLabel() - Form elements
 *    5. CSS selectors - When needed
 *    6. XPath - Last resort
 */

test('demonstrate locator strategies', async ({ page }) => {
  await page.goto('https://example.com/login');

  // ✅ BEST: Role-based (accessible)
  const submitButton = page.getByRole('button', { name: 'Submit' });

  // ✅ GOOD: Test ID (stable)
  const emailInput = page.getByTestId('email-input');

  // ✅ GOOD: Label (forms)
  const passwordInput = page.getByLabel('Password');

  // ⚠️ OK: CSS (when needed)
  const header = page.locator('.header-title');

  // ❌ AVOID: Fragile selectors
  // page.locator('div > div > span.text')
});

// ============================================
// INTERVIEW QUESTION 3: Auto-Waiting
// ============================================

/**
 * Q: How does Playwright handle waiting?
 *
 * A: Playwright has built-in auto-waiting:
 *    - Actions wait for element to be actionable
 *    - Assertions retry until condition is met
 *    - No need for explicit waits in most cases
 *
 *    Default timeout: 30 seconds (configurable)
 */

test('demonstrate auto-waiting', async ({ page }) => {
  await page.goto('https://example.com');

  // Auto-waits for button to be visible and enabled
  await page.getByRole('button', { name: 'Load Data' }).click();

  // Auto-retries until text appears (up to timeout)
  await expect(page.getByText('Data loaded')).toBeVisible();

  // Explicit wait (rarely needed)
  await page.waitForSelector('.dynamic-content');
});

// ============================================
// INTERVIEW QUESTION 4: Assertions
// ============================================

/**
 * Q: What types of assertions does Playwright support?
 *
 * A: Two types:
 *    1. Web-first assertions (recommended) - Auto-retry
 *       expect(locator).toBeVisible()
 *
 *    2. Generic assertions - No retry
 *       expect(value).toBe(expected)
 */

test('demonstrate assertions', async ({ page }) => {
  await page.goto('https://example.com');

  // Web-first assertions (auto-retry)
  await expect(page).toHaveTitle(/Example/);
  await expect(page).toHaveURL(/example\.com/);
  await expect(page.getByRole('heading')).toBeVisible();
  await expect(page.getByRole('heading')).toHaveText('Example Domain');

  // Soft assertions (don't stop test)
  await expect.soft(page.locator('.optional')).toBeVisible();

  // Generic assertions (no retry)
  const title = await page.title();
  expect(title).toContain('Example');
});

// ============================================
// INTERVIEW QUESTION 5: Page Object Model
// ============================================

/**
 * Q: How do you implement Page Object Model in Playwright?
 *
 * A: Create classes that encapsulate page elements and actions.
 */

class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByLabel('Email');
    this.passwordInput = page.getByLabel('Password');
    this.submitButton = page.getByRole('button', { name: 'Sign In' });
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}

test('demonstrate POM usage', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('user@example.com', 'password123');
});

/**
 * COMMON INTERVIEW QUESTIONS:
 *
 * Q1: What makes Playwright different from Selenium?
 * A1: Auto-waiting, multiple browser support, faster execution,
 *     built-in assertions, API testing, better debugging.
 *
 * Q2: How do you handle authentication in Playwright?
 * A2: Use storageState to save/restore cookies and localStorage.
 *
 * Q3: How do you run tests in parallel?
 * A3: Playwright runs tests in parallel by default. Configure
 *     workers in playwright.config.ts.
 *
 * Q4: How do you debug failing tests?
 * A4: Use --debug flag, Playwright Inspector, trace viewer,
 *     or VS Code extension.
 */

/**
 * EXERCISE:
 * 1. Write a test using all locator strategies
 * 2. Create a Page Object for a signup form
 * 3. Implement a test with soft assertions
 * 4. Debug a failing test using trace viewer
 */

/**
 * LEARNING:
 * - Master the Browser → Context → Page hierarchy
 * - Always prefer role-based locators
 * - Trust auto-waiting, avoid explicit waits
 * - Use web-first assertions for reliability
 *
 * ONE LINER:
 * "Playwright: Auto-waiting, role-based locators, and web-first assertions."
 */

export { LoginPage };
