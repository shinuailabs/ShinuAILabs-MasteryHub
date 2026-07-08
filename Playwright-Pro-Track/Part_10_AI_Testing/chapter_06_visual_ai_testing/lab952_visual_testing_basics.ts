/**
 * Lab 952: Visual AI Testing Basics
 *
 * CONCEPT:
 * Visual AI testing uses computer vision and machine learning to detect
 * visual differences in UI. Unlike pixel-by-pixel comparison, AI understands
 * layout, content, and visual hierarchy.
 *
 * BULLET POINTS:
 * - AI-powered visual comparison
 * - Ignores irrelevant differences
 * - Detects layout shifts
 * - Cross-browser visual testing
 * - Reduces false positives
 */

import { test, expect, Page } from '@playwright/test';

// Example 1: Basic visual comparison with Playwright
test.describe('Visual Testing Basics', () => {
  test('homepage visual snapshot', async ({ page }) => {
    await page.goto('/');

    // Playwright's built-in screenshot comparison
    await expect(page).toHaveScreenshot('homepage.png', {
      maxDiffPixels: 100, // Allow small differences
    });
  });

  test('component visual snapshot', async ({ page }) => {
    await page.goto('/components');

    const button = page.locator('[data-testid="primary-button"]');
    await expect(button).toHaveScreenshot('primary-button.png');
  });

  test('full page visual snapshot', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveScreenshot('full-page.png', {
      fullPage: true,
    });
  });
});

// Example 2: Visual comparison options
interface VisualComparisonOptions {
  threshold: number; // 0-1, percentage of pixels that can differ
  maxDiffPixels: number; // Maximum number of different pixels
  maxDiffPixelRatio: number; // Maximum ratio of different pixels
  animations: 'disabled' | 'allow';
  mask: { x: number; y: number; width: number; height: number }[];
}

const defaultOptions: VisualComparisonOptions = {
  threshold: 0.2,
  maxDiffPixels: 100,
  maxDiffPixelRatio: 0.01,
  animations: 'disabled',
  mask: [],
};

// Example 3: Masking dynamic content
test('visual test with masked regions', async ({ page }) => {
  await page.goto('/dashboard');

  // Mask dynamic content like timestamps, ads
  await expect(page).toHaveScreenshot('dashboard.png', {
    mask: [
      page.locator('[data-testid="timestamp"]'),
      page.locator('[data-testid="ad-banner"]'),
      page.locator('[data-testid="user-avatar"]'),
    ],
  });
});

// Example 4: Visual regression detection
interface VisualDifference {
  type: 'added' | 'removed' | 'changed' | 'moved';
  element: string;
  severity: 'critical' | 'major' | 'minor';
  description: string;
}

function analyzeVisualDifferences(
  baseline: Buffer,
  current: Buffer
): VisualDifference[] {
  // In real implementation, use image comparison library
  // This is a simulated analysis
  return [
    {
      type: 'changed',
      element: 'header',
      severity: 'minor',
      description: 'Header background color changed slightly',
    },
  ];
}

// Example 5: Cross-browser visual testing
const browsers = ['chromium', 'firefox', 'webkit'] as const;

for (const browserName of browsers) {
  test.describe(`Visual tests on ${browserName}`, () => {
    test.use({ browserName });

    test('consistent rendering', async ({ page }) => {
      await page.goto('/');

      await expect(page).toHaveScreenshot(`homepage-${browserName}.png`, {
        maxDiffPixelRatio: 0.02, // Allow 2% difference for browser variations
      });
    });
  });
}

// Example 6: Responsive visual testing
const viewports = [
  { name: 'mobile', width: 375, height: 667 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1920, height: 1080 },
];

for (const viewport of viewports) {
  test(`visual test at ${viewport.name} size`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto('/');

    await expect(page).toHaveScreenshot(`homepage-${viewport.name}.png`);
  });
}

/**
 * EXERCISE:
 * 1. Create visual snapshots for key pages
 * 2. Mask dynamic content
 * 3. Test across browsers
 * 4. Test responsive layouts
 *
 * LEARNING:
 * - Visual testing catches UI regressions
 * - Mask dynamic content to reduce flakiness
 * - Test across browsers and viewports
 * - Set appropriate thresholds
 *
 * ONE LINER:
 * "Visual AI testing sees your app like users do - catching what code reviews miss."
 */

export { defaultOptions, analyzeVisualDifferences };

