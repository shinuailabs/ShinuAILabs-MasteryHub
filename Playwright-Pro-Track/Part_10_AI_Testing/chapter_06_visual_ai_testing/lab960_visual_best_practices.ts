/**
 * Lab 960: Visual AI Testing Best Practices
 *
 * CONCEPT:
 * Following best practices for visual AI testing ensures reliable, maintainable
 * visual tests. This lab consolidates key principles for effective visual
 * testing strategies.
 *
 * BULLET POINTS:
 * - Establish consistent baselines
 * - Handle dynamic content properly
 * - Set appropriate thresholds
 * - Organize visual tests effectively
 * - Integrate with CI/CD
 */

import { test, expect, Page } from '@playwright/test';

// Best Practice 1: Consistent test environment
const visualTestConfig = {
  // Disable animations for consistent screenshots
  disableAnimations: true,
  // Wait for network idle
  waitForNetworkIdle: true,
  // Use consistent viewport
  viewport: { width: 1920, height: 1080 },
  // Disable GPU for consistent rendering
  disableGPU: true,
};

async function prepareForVisualTest(page: Page): Promise<void> {
  // Disable animations
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        transition-duration: 0s !important;
        transition-delay: 0s !important;
      }
    `,
  });

  // Wait for fonts to load
  await page.evaluate(() => document.fonts.ready);

  // Wait for images to load
  await page.waitForLoadState('networkidle');
}

// Best Practice 2: Organize visual tests
const visualTestStructure = {
  // Group by feature
  features: ['login', 'dashboard', 'profile', 'settings'],
  // Test at multiple viewports
  viewports: ['mobile', 'tablet', 'desktop'],
  // Test key states
  states: ['default', 'hover', 'focus', 'error', 'loading', 'empty'],
};

// Best Practice 3: Handle dynamic content
const dynamicContentStrategies = {
  // Mask dynamic elements
  mask: ['[data-testid="timestamp"]', '[data-testid="avatar"]'],
  // Hide completely
  hide: ['[data-testid="ad-banner"]', '[data-testid="chat-widget"]'],
  // Replace with placeholder
  replace: ['[data-testid="user-name"]'],
};

async function handleDynamicContent(page: Page): Promise<void> {
  // Hide dynamic elements
  await page.addStyleTag({
    content: `
      [data-testid="timestamp"],
      [data-testid="ad-banner"],
      [data-dynamic="true"] {
        visibility: hidden !important;
      }
    `,
  });

  // Replace user-specific content
  await page.evaluate(() => {
    document.querySelectorAll('[data-testid="user-name"]').forEach((el) => {
      el.textContent = 'Test User';
    });
  });
}

// Best Practice 4: Set appropriate thresholds
const thresholdGuidelines = {
  // Strict: pixel-perfect components
  strict: { maxDiffPixelRatio: 0.001 },
  // Normal: most UI elements
  normal: { maxDiffPixelRatio: 0.01 },
  // Relaxed: complex pages with some variation
  relaxed: { maxDiffPixelRatio: 0.02 },
  // Cross-browser: account for rendering differences
  crossBrowser: { maxDiffPixelRatio: 0.05 },
};

// Best Practice 5: Visual test template
test.describe('Visual Tests - Best Practices', () => {
  test.beforeEach(async ({ page }) => {
    await prepareForVisualTest(page);
  });

  test('homepage visual test', async ({ page }) => {
    await page.goto('/');
    await handleDynamicContent(page);

    // Full page screenshot
    await expect(page).toHaveScreenshot('homepage-full.png', {
      fullPage: true,
      ...thresholdGuidelines.normal,
    });
  });

  test('component visual test', async ({ page }) => {
    await page.goto('/components');

    // Test specific component
    const button = page.locator('[data-testid="primary-button"]');
    await expect(button).toHaveScreenshot('button-default.png', thresholdGuidelines.strict);

    // Test hover state
    await button.hover();
    await expect(button).toHaveScreenshot('button-hover.png', thresholdGuidelines.strict);
  });
});

// Best Practice 6: CI/CD integration
const ciConfig = {
  // Update baselines only on main branch
  updateBaselines: process.env.CI && process.env.BRANCH === 'main',
  // Fail fast in CI
  failFast: process.env.CI === 'true',
  // Generate reports
  generateReport: true,
  // Retry flaky visual tests
  retries: process.env.CI ? 2 : 0,
};

// Best Practice 7: Baseline management
const baselineManagement = {
  // Store baselines in version control
  storageLocation: './visual-baselines',
  // Naming convention
  namingConvention: '{feature}-{viewport}-{state}.png',
  // Review process
  reviewRequired: true,
  // Approval workflow
  approvalWorkflow: 'pull-request',
};

// Best Practice 8: Visual test checklist
const visualTestChecklist = [
  '✓ Disable animations and transitions',
  '✓ Wait for fonts and images to load',
  '✓ Handle dynamic content (mask/hide/replace)',
  '✓ Use consistent viewport sizes',
  '✓ Set appropriate diff thresholds',
  '✓ Test multiple states (default, hover, focus, error)',
  '✓ Test responsive breakpoints',
  '✓ Include in CI/CD pipeline',
  '✓ Review baseline changes in PRs',
  '✓ Document expected visual differences',
];

/**
 * EXERCISE:
 * 1. Set up consistent test environment
 * 2. Handle dynamic content properly
 * 3. Organize visual tests by feature
 * 4. Integrate with CI/CD
 *
 * LEARNING:
 * - Consistency is key for visual tests
 * - Handle dynamic content carefully
 * - Set appropriate thresholds
 * - Review baselines in PRs
 *
 * ONE LINER:
 * "Good visual tests are consistent, maintainable, and catch real bugs - not noise."
 */

export {
  prepareForVisualTest,
  handleDynamicContent,
  thresholdGuidelines,
  visualTestChecklist,
};

