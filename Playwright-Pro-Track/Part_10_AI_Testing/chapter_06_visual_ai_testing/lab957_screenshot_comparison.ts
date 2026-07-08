/**
 * Lab 957: AI Screenshot Comparison
 *
 * CONCEPT:
 * AI-powered screenshot comparison goes beyond pixel matching to understand
 * visual content. It can ignore anti-aliasing, font rendering differences,
 * and focus on meaningful visual changes.
 *
 * BULLET POINTS:
 * - Intelligent pixel comparison
 * - Ignore rendering differences
 * - Focus on meaningful changes
 * - Generate visual diff reports
 * - Support multiple comparison modes
 */

import { test, expect, Page } from '@playwright/test';

// Example 1: Comparison modes
type ComparisonMode = 'strict' | 'layout' | 'content' | 'ai';

interface ComparisonResult {
  match: boolean;
  similarity: number;
  diffPixels: number;
  diffPercentage: number;
  diffImage?: Buffer;
  changes: { type: string; description: string }[];
}

// Example 2: Screenshot comparator
class ScreenshotComparator {
  constructor(private mode: ComparisonMode = 'ai') {}

  async compare(
    baseline: Buffer,
    current: Buffer,
    options?: { threshold?: number; ignoreRegions?: { x: number; y: number; width: number; height: number }[] }
  ): Promise<ComparisonResult> {
    const threshold = options?.threshold ?? 0.1;

    // In real implementation, use image comparison library
    // This is a simulated comparison
    const diffPixels = Math.floor(Math.random() * 100);
    const totalPixels = 1920 * 1080;
    const diffPercentage = diffPixels / totalPixels;

    return {
      match: diffPercentage <= threshold,
      similarity: 1 - diffPercentage,
      diffPixels,
      diffPercentage,
      changes: this.analyzeChanges(diffPercentage),
    };
  }

  private analyzeChanges(diffPercentage: number): { type: string; description: string }[] {
    if (diffPercentage === 0) return [];

    // AI would analyze the actual differences
    return [
      { type: 'color', description: 'Minor color variation detected' },
    ];
  }
}

// Example 3: Playwright screenshot comparison
test.describe('Screenshot Comparison', () => {
  test('compare with baseline', async ({ page }) => {
    await page.goto('/');

    // Playwright's built-in comparison
    await expect(page).toHaveScreenshot('homepage.png', {
      maxDiffPixels: 100,
      threshold: 0.2,
    });
  });

  test('compare specific element', async ({ page }) => {
    await page.goto('/');

    const header = page.locator('[data-testid="header"]');
    await expect(header).toHaveScreenshot('header.png');
  });

  test('compare with animations disabled', async ({ page }) => {
    await page.goto('/');

    // Disable animations for consistent screenshots
    await page.addStyleTag({
      content: `
        *, *::before, *::after {
          animation-duration: 0s !important;
          transition-duration: 0s !important;
        }
      `,
    });

    await expect(page).toHaveScreenshot('homepage-no-animations.png');
  });
});

// Example 4: Custom comparison with masking
async function compareWithMask(
  page: Page,
  name: string,
  maskSelectors: string[]
): Promise<void> {
  const masks = maskSelectors.map((s) => page.locator(s));

  await expect(page).toHaveScreenshot(`${name}.png`, {
    mask: masks,
    maxDiffPixelRatio: 0.01,
  });
}

test('compare with masked dynamic content', async ({ page }) => {
  await page.goto('/dashboard');

  await compareWithMask(page, 'dashboard', [
    '[data-testid="timestamp"]',
    '[data-testid="user-avatar"]',
    '[data-testid="notification-count"]',
  ]);
});

// Example 5: Visual diff report
interface DiffReport {
  testName: string;
  timestamp: Date;
  baseline: string;
  current: string;
  diff: string;
  result: ComparisonResult;
}

function generateDiffReport(
  testName: string,
  result: ComparisonResult
): DiffReport {
  return {
    testName,
    timestamp: new Date(),
    baseline: `baselines/${testName}.png`,
    current: `current/${testName}.png`,
    diff: `diffs/${testName}-diff.png`,
    result,
  };
}

// Example 6: Batch comparison
async function batchCompare(
  page: Page,
  pages: { url: string; name: string }[]
): Promise<DiffReport[]> {
  const comparator = new ScreenshotComparator('ai');
  const reports: DiffReport[] = [];

  for (const p of pages) {
    await page.goto(p.url);
    const screenshot = await page.screenshot();

    // In real implementation, load baseline and compare
    const result = await comparator.compare(screenshot, screenshot);
    reports.push(generateDiffReport(p.name, result));
  }

  return reports;
}

/**
 * EXERCISE:
 * 1. Set up screenshot comparison
 * 2. Create baseline images
 * 3. Compare with different modes
 * 4. Generate diff reports
 *
 * LEARNING:
 * - AI comparison reduces false positives
 * - Mask dynamic content
 * - Disable animations for consistency
 * - Generate visual diff reports
 *
 * ONE LINER:
 * "AI screenshot comparison sees the forest, not just the pixels - meaningful visual testing."
 */

export { ScreenshotComparator, compareWithMask, generateDiffReport, batchCompare };

