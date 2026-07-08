/**
 * Lab 954: Percy Visual Testing Integration
 *
 * CONCEPT:
 * Percy by BrowserStack provides visual testing with automatic baseline
 * management, cross-browser rendering, and responsive testing. It integrates
 * seamlessly with CI/CD pipelines.
 *
 * BULLET POINTS:
 * - Automatic baseline management
 * - Cross-browser rendering
 * - Responsive breakpoint testing
 * - CI/CD integration
 * - Visual review workflow
 */

import { test, expect, Page } from '@playwright/test';

// Note: In real implementation, install @percy/playwright
// npm install @percy/playwright

// Example 1: Percy configuration
interface PercyConfig {
  token: string;
  projectSlug: string;
  widths: number[];
  minHeight: number;
  enableJavaScript: boolean;
}

const percyConfig: PercyConfig = {
  token: process.env.PERCY_TOKEN || '',
  projectSlug: 'my-project',
  widths: [375, 768, 1280, 1920],
  minHeight: 1024,
  enableJavaScript: true,
};

// Example 2: Simulated Percy snapshot function
async function percySnapshot(
  page: Page,
  name: string,
  options?: {
    widths?: number[];
    minHeight?: number;
    percyCSS?: string;
    scope?: string;
  }
): Promise<void> {
  console.log(`Percy snapshot: ${name}`);
  console.log(`  Widths: ${options?.widths?.join(', ') || 'default'}`);

  // In real implementation:
  // await percySnapshot(page, name, options);

  // Take Playwright screenshot as fallback
  await page.screenshot({ path: `percy-${name.replace(/\s+/g, '-')}.png` });
}

// Example 3: Percy with Playwright tests
test.describe('Percy Visual Tests', () => {
  test('homepage snapshots', async ({ page }) => {
    await page.goto('/');

    // Capture at multiple widths
    await percySnapshot(page, 'Homepage', {
      widths: [375, 768, 1280],
    });
  });

  test('login page snapshots', async ({ page }) => {
    await page.goto('/login');

    await percySnapshot(page, 'Login Page');

    // Capture error state
    await page.fill('[data-testid="email"]', 'invalid');
    await page.click('[data-testid="login-button"]');
    await percySnapshot(page, 'Login Page - Error State');
  });

  test('component snapshots', async ({ page }) => {
    await page.goto('/components');

    // Snapshot specific component
    await percySnapshot(page, 'Button Component', {
      scope: '[data-testid="button-showcase"]',
    });
  });
});

// Example 4: Percy CSS for hiding dynamic content
const percyCSS = `
  /* Hide dynamic content during visual testing */
  [data-testid="timestamp"],
  [data-testid="ad-banner"],
  .dynamic-content {
    visibility: hidden !important;
  }

  /* Disable animations */
  *, *::before, *::after {
    animation-duration: 0s !important;
    transition-duration: 0s !important;
  }
`;

test('snapshot with Percy CSS', async ({ page }) => {
  await page.goto('/dashboard');

  await percySnapshot(page, 'Dashboard', {
    percyCSS,
  });
});

// Example 5: Percy in CI/CD
const percyCIConfig = `
# .percy.yml
version: 2
snapshot:
  widths:
    - 375
    - 768
    - 1280
    - 1920
  min-height: 1024
  percy-css: |
    [data-testid="timestamp"] { visibility: hidden; }
discovery:
  network-idle-timeout: 250
  disable-cache: true
`;

// Example 6: Percy approval workflow
interface PercyBuild {
  id: string;
  status: 'pending' | 'processing' | 'finished';
  totalSnapshots: number;
  totalComparisons: number;
  unreviewed: number;
  approved: number;
  rejected: number;
}

async function getPercyBuildStatus(buildId: string): Promise<PercyBuild> {
  // In real implementation, call Percy API
  return {
    id: buildId,
    status: 'finished',
    totalSnapshots: 10,
    totalComparisons: 40, // 10 snapshots × 4 widths
    unreviewed: 2,
    approved: 38,
    rejected: 0,
  };
}

// Example 7: Responsive testing
test('responsive visual test', async ({ page }) => {
  const breakpoints = [
    { name: 'mobile', width: 375 },
    { name: 'tablet', width: 768 },
    { name: 'desktop', width: 1280 },
    { name: 'wide', width: 1920 },
  ];

  for (const bp of breakpoints) {
    await page.setViewportSize({ width: bp.width, height: 800 });
    await page.goto('/');

    await percySnapshot(page, `Homepage - ${bp.name}`, {
      widths: [bp.width],
    });
  }
});

/**
 * EXERCISE:
 * 1. Set up Percy account
 * 2. Configure Percy token
 * 3. Add snapshots to tests
 * 4. Review visual changes
 *
 * LEARNING:
 * - Percy automates baseline management
 * - Test at multiple breakpoints
 * - Use Percy CSS for dynamic content
 * - Integrate with CI/CD
 *
 * ONE LINER:
 * "Percy catches visual regressions before your users do - automated visual review."
 */

export { percySnapshot, percyConfig, percyCSS, getPercyBuildStatus };

