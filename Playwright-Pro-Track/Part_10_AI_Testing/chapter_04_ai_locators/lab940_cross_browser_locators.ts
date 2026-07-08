/**
 * Lab 940: Cross-Browser AI Locators
 *
 * CONCEPT:
 * AI locators can adapt to browser-specific differences in DOM rendering,
 * ensuring tests work consistently across Chrome, Firefox, Safari, and Edge.
 *
 * BULLET POINTS:
 * - Handle browser-specific DOM differences
 * - Adapt to rendering variations
 * - Normalize element attributes
 * - Test across multiple browsers
 * - Detect browser-specific issues
 */

import { test, expect, Page, BrowserContext } from '@playwright/test';

// Example 1: Browser-aware locator
class CrossBrowserLocator {
  constructor(
    private page: Page,
    private browserName: string
  ) {}

  async findElement(purpose: string): Promise<string> {
    const strategies: Record<string, Record<string, string>> = {
      'date-picker': {
        chromium: 'input[type="date"]',
        firefox: 'input[type="date"]',
        webkit: 'input[type="date"]', // Safari handles differently
      },
      'file-upload': {
        chromium: 'input[type="file"]',
        firefox: 'input[type="file"]',
        webkit: 'input[type="file"]',
      },
      'color-picker': {
        chromium: 'input[type="color"]',
        firefox: 'input[type="color"]',
        webkit: '[data-testid="color-picker"]', // Safari fallback
      },
    };

    const browserStrategies = strategies[purpose];
    if (!browserStrategies) {
      throw new Error(`Unknown element purpose: ${purpose}`);
    }

    return browserStrategies[this.browserName] || browserStrategies['chromium'];
  }

  async click(purpose: string): Promise<void> {
    const selector = await this.findElement(purpose);
    await this.page.locator(selector).click();
  }
}

// Example 2: Browser-specific test configuration
test.describe('Cross-Browser Locators', () => {
  test('date input works across browsers', async ({ page, browserName }) => {
    await page.goto('/form');

    const locator = new CrossBrowserLocator(page, browserName);

    // Different browsers handle date inputs differently
    if (browserName === 'webkit') {
      // Safari needs special handling
      await page.fill('[data-testid="date-input"]', '2024-01-15');
    } else {
      await page.fill('input[type="date"]', '2024-01-15');
    }

    await expect(page.locator('[data-testid="date-display"]')).toContainText('2024');
  });

  test('file upload works across browsers', async ({ page, browserName }) => {
    await page.goto('/upload');

    // File input handling is consistent but verification differs
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('./test-file.txt');

    // Verify upload - may render differently per browser
    await expect(page.locator('[data-testid="file-name"]')).toBeVisible();
  });
});

// Example 3: Normalize browser differences
interface NormalizedElement {
  visible: boolean;
  enabled: boolean;
  text: string;
  value: string;
}

async function normalizeElement(
  page: Page,
  selector: string
): Promise<NormalizedElement> {
  const locator = page.locator(selector);

  return {
    visible: await locator.isVisible(),
    enabled: await locator.isEnabled(),
    text: (await locator.textContent()) || '',
    value: (await locator.inputValue().catch(() => '')) || '',
  };
}

// Example 4: Browser compatibility checker
interface CompatibilityIssue {
  selector: string;
  browser: string;
  issue: string;
  workaround: string;
}

async function checkBrowserCompatibility(
  page: Page,
  selectors: string[],
  browserName: string
): Promise<CompatibilityIssue[]> {
  const issues: CompatibilityIssue[] = [];

  for (const selector of selectors) {
    const locator = page.locator(selector);
    const count = await locator.count();

    if (count === 0) {
      issues.push({
        selector,
        browser: browserName,
        issue: 'Element not found',
        workaround: 'Use browser-specific selector',
      });
    } else if (count > 1) {
      issues.push({
        selector,
        browser: browserName,
        issue: `Multiple elements found (${count})`,
        workaround: 'Make selector more specific',
      });
    }
  }

  return issues;
}

// Example 5: Cross-browser test matrix
const browserMatrix = ['chromium', 'firefox', 'webkit'] as const;

for (const browser of browserMatrix) {
  test.describe(`Tests on ${browser}`, () => {
    test.use({ browserName: browser });

    test('login works', async ({ page }) => {
      await page.goto('/login');
      await page.fill('[data-testid="email"]', 'test@example.com');
      await page.fill('[data-testid="password"]', 'password123');
      await page.click('[data-testid="login-button"]');
      await expect(page).toHaveURL('/dashboard');
    });
  });
}

/**
 * EXERCISE:
 * 1. Run tests across all browsers
 * 2. Identify browser-specific issues
 * 3. Create browser-aware locators
 * 4. Document compatibility workarounds
 *
 * LEARNING:
 * - Browsers render DOM differently
 * - Use data-testid for consistency
 * - Test on all target browsers
 * - Document browser-specific workarounds
 *
 * ONE LINER:
 * "AI locators adapt to browser quirks - so your tests work everywhere."
 */

export { CrossBrowserLocator, normalizeElement, checkBrowserCompatibility };

