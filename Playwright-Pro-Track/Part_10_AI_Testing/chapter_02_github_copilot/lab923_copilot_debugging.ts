/**
 * Lab 923: Copilot for Test Debugging
 *
 * CONCEPT:
 * Copilot Chat can analyze test failures, suggest fixes, and help identify
 * root causes. Use /fix command for quick fixes or ask detailed questions
 * about why tests might be failing.
 *
 * BULLET POINTS:
 * - Use /fix to automatically fix issues
 * - Ask "Why might this test fail?"
 * - Get suggestions for handling flaky tests
 * - Debug locator issues
 * - Analyze timing and race conditions
 */

import { test, expect, Page } from '@playwright/test';

// Example 1: Common issues Copilot can help debug

// Issue: Element not found
// Ask Copilot: "Why can't Playwright find this element?"
test('debug element not found', async ({ page }) => {
  await page.goto('/dashboard');

  // Copilot suggestion: Wait for element to be attached
  await page.waitForSelector('[data-testid="stats-panel"]', { state: 'attached' });

  // Copilot suggestion: Check if element is in iframe
  // const frame = page.frameLocator('iframe');
  // await frame.locator('[data-testid="stats-panel"]').click();

  await expect(page.locator('[data-testid="stats-panel"]')).toBeVisible();
});

// Issue: Timeout errors
// Ask Copilot: "How do I fix this timeout error?"
test('debug timeout issues', async ({ page }) => {
  await page.goto('/slow-page');

  // Copilot suggestions for timeout issues:

  // 1. Increase timeout for specific action
  await page.click('[data-testid="load-data"]', { timeout: 30000 });

  // 2. Wait for network to be idle
  await page.waitForLoadState('networkidle');

  // 3. Wait for specific response
  await Promise.all([
    page.waitForResponse((resp) => resp.url().includes('/api/data')),
    page.click('[data-testid="load-data"]'),
  ]);

  await expect(page.locator('[data-testid="data-table"]')).toBeVisible();
});

// Issue: Flaky tests
// Ask Copilot: "This test passes sometimes and fails sometimes. How to fix?"
test('debug flaky test', async ({ page }) => {
  await page.goto('/dynamic-content');

  // Copilot suggestions for flaky tests:

  // 1. Use auto-waiting locators instead of page.$
  const button = page.locator('[data-testid="submit"]');

  // 2. Wait for element to be actionable
  await expect(button).toBeEnabled();
  await expect(button).toBeVisible();

  // 3. Use retry logic for assertions
  await expect(async () => {
    await button.click();
    await expect(page.locator('.success')).toBeVisible();
  }).toPass({ timeout: 10000 });
});

// Issue: Race conditions
// Ask Copilot: "How do I handle this race condition?"
test('debug race condition', async ({ page }) => {
  await page.goto('/async-form');

  // Copilot suggestion: Use Promise.all for parallel operations
  await Promise.all([
    page.waitForResponse('/api/validate'),
    page.fill('[data-testid="email"]', 'test@example.com'),
  ]);

  // Copilot suggestion: Wait for loading state to complete
  await page.locator('.loading-spinner').waitFor({ state: 'hidden' });

  await page.click('[data-testid="submit"]');
});

// Example 2: Debugging helper functions
// Ask Copilot to generate debugging utilities

async function debugLocator(page: Page, selector: string): Promise<void> {
  console.log(`Debugging selector: ${selector}`);

  const locator = page.locator(selector);
  const count = await locator.count();
  console.log(`Found ${count} elements`);

  if (count === 0) {
    // Check if element exists in DOM at all
    const exists = await page.$eval(selector, () => true).catch(() => false);
    console.log(`Element in DOM: ${exists}`);

    // Check for similar selectors
    const html = await page.content();
    console.log(`Page contains data-testid: ${html.includes('data-testid')}`);
  }

  for (let i = 0; i < count; i++) {
    const el = locator.nth(i);
    const isVisible = await el.isVisible();
    const isEnabled = await el.isEnabled();
    console.log(`Element ${i}: visible=${isVisible}, enabled=${isEnabled}`);
  }
}

// Example 3: Error analysis prompt
const debugPrompts = {
  elementNotFound: `
    My test fails with "Element not found" for selector: [SELECTOR]
    The element should be on the page. What could be wrong?
  `,
  timeout: `
    Test times out at this line: [CODE]
    What are possible causes and how do I fix it?
  `,
  flaky: `
    This test fails about 20% of the time with error: [ERROR]
    How do I make it stable?
  `,
  assertion: `
    Assertion failed: expected [EXPECTED] but got [ACTUAL]
    Why might this happen and how do I debug it?
  `,
};

/**
 * EXERCISE:
 * 1. Take a failing test and ask Copilot Chat why it might fail
 * 2. Use /fix on a flaky test
 * 3. Create a debugging utility with Copilot's help
 *
 * LEARNING:
 * - Copilot can identify common test failure patterns
 * - /fix command provides quick solutions
 * - Ask specific questions for better answers
 * - Combine Copilot with Playwright's debugging tools
 *
 * ONE LINER:
 * "When tests fail, Copilot is your first line of debugging support."
 */

export { debugLocator, debugPrompts };

