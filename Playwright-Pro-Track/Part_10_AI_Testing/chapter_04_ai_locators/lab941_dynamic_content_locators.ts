/**
 * Lab 941: AI Locators for Dynamic Content
 *
 * CONCEPT:
 * Dynamic content like lazy-loaded elements, infinite scroll, and real-time
 * updates require special locator strategies. AI can help identify stable
 * patterns in dynamic UIs.
 *
 * BULLET POINTS:
 * - Handle lazy-loaded content
 * - Work with infinite scroll
 * - Manage real-time updates
 * - Wait for dynamic elements
 * - Identify stable anchors
 */

import { test, expect, Page, Locator } from '@playwright/test';

// Example 1: Lazy-loaded content locator
async function waitForLazyContent(
  page: Page,
  selector: string,
  options: { timeout?: number; scrollIntoView?: boolean } = {}
): Promise<Locator> {
  const { timeout = 10000, scrollIntoView = true } = options;

  const locator = page.locator(selector);

  if (scrollIntoView) {
    // Scroll to trigger lazy loading
    await page.evaluate((sel) => {
      const element = document.querySelector(sel);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, selector);
  }

  await locator.waitFor({ state: 'visible', timeout });
  return locator;
}

// Example 2: Infinite scroll handler
async function scrollToLoadMore(
  page: Page,
  itemSelector: string,
  targetCount: number,
  maxScrolls: number = 10
): Promise<number> {
  let currentCount = 0;
  let scrollCount = 0;

  while (currentCount < targetCount && scrollCount < maxScrolls) {
    currentCount = await page.locator(itemSelector).count();

    if (currentCount >= targetCount) break;

    // Scroll to bottom
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });

    // Wait for new content
    await page.waitForTimeout(1000);
    scrollCount++;
  }

  return await page.locator(itemSelector).count();
}

// Example 3: Real-time content locator
class RealTimeLocator {
  private lastValue: string | null = null;

  constructor(
    private page: Page,
    private selector: string
  ) {}

  async waitForChange(timeout: number = 5000): Promise<string> {
    const startTime = Date.now();
    const locator = this.page.locator(this.selector);

    while (Date.now() - startTime < timeout) {
      const currentValue = await locator.textContent();

      if (currentValue !== this.lastValue) {
        this.lastValue = currentValue;
        return currentValue || '';
      }

      await this.page.waitForTimeout(100);
    }

    throw new Error(`Content did not change within ${timeout}ms`);
  }

  async waitForValue(expectedValue: string, timeout: number = 5000): Promise<void> {
    await expect(this.page.locator(this.selector)).toHaveText(expectedValue, {
      timeout,
    });
  }
}

// Example 4: Dynamic list item locator
async function findInDynamicList(
  page: Page,
  listSelector: string,
  itemText: string,
  options: { scroll?: boolean; maxAttempts?: number } = {}
): Promise<Locator | null> {
  const { scroll = true, maxAttempts = 5 } = options;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const items = page.locator(`${listSelector} > *`);
    const count = await items.count();

    for (let i = 0; i < count; i++) {
      const item = items.nth(i);
      const text = await item.textContent();

      if (text?.includes(itemText)) {
        return item;
      }
    }

    if (scroll) {
      await page.evaluate(() => {
        window.scrollBy(0, 500);
      });
      await page.waitForTimeout(500);
    }
  }

  return null;
}

// Example 5: Tests with dynamic content
test.describe('Dynamic Content Locators', () => {
  test('handle lazy-loaded images', async ({ page }) => {
    await page.goto('/gallery');

    // Scroll to trigger lazy loading
    const image = await waitForLazyContent(page, '[data-testid="image-10"]', {
      scrollIntoView: true,
    });

    await expect(image).toBeVisible();
  });

  test('infinite scroll loads more items', async ({ page }) => {
    await page.goto('/feed');

    const initialCount = await page.locator('[data-testid="feed-item"]').count();

    const finalCount = await scrollToLoadMore(
      page,
      '[data-testid="feed-item"]',
      20
    );

    expect(finalCount).toBeGreaterThan(initialCount);
  });

  test('real-time updates are captured', async ({ page }) => {
    await page.goto('/live-data');

    const priceLocator = new RealTimeLocator(page, '[data-testid="stock-price"]');

    // Wait for price to change
    const newPrice = await priceLocator.waitForChange(10000);
    expect(newPrice).toBeTruthy();
  });

  test('find item in dynamic list', async ({ page }) => {
    await page.goto('/search-results');

    const item = await findInDynamicList(
      page,
      '[data-testid="results-list"]',
      'Specific Product',
      { scroll: true }
    );

    expect(item).not.toBeNull();
    await item?.click();
  });
});

/**
 * EXERCISE:
 * 1. Handle lazy-loaded content in your app
 * 2. Implement infinite scroll testing
 * 3. Test real-time updates
 * 4. Find items in dynamic lists
 *
 * LEARNING:
 * - Dynamic content needs special handling
 * - Scroll to trigger lazy loading
 * - Wait for content changes
 * - Use stable anchors when possible
 *
 * ONE LINER:
 * "AI locators find elements even when they're still loading - patience is built in."
 */

export { waitForLazyContent, scrollToLoadMore, RealTimeLocator, findInDynamicList };

