/**
 * Lab 958: Cross-Browser Visual Testing
 *
 * CONCEPT:
 * Cross-browser visual testing ensures your UI looks consistent across
 * different browsers. AI can account for expected rendering differences
 * while catching actual visual bugs.
 *
 * BULLET POINTS:
 * - Test across Chrome, Firefox, Safari, Edge
 * - Account for browser rendering differences
 * - Detect cross-browser visual bugs
 * - Parallel browser testing
 * - Browser-specific baselines
 */

import { test, expect, Page, Browser, chromium, firefox, webkit } from '@playwright/test';

// Example 1: Browser configuration
interface BrowserConfig {
  name: string;
  launcher: typeof chromium | typeof firefox | typeof webkit;
  expectedDifferences: string[];
}

const browserConfigs: BrowserConfig[] = [
  {
    name: 'chromium',
    launcher: chromium,
    expectedDifferences: [],
  },
  {
    name: 'firefox',
    launcher: firefox,
    expectedDifferences: ['font-smoothing', 'scrollbar-width'],
  },
  {
    name: 'webkit',
    launcher: webkit,
    expectedDifferences: ['font-rendering', 'form-controls'],
  },
];

// Example 2: Cross-browser visual test
test.describe('Cross-Browser Visual Tests', () => {
  for (const config of browserConfigs) {
    test.describe(`Visual tests on ${config.name}`, () => {
      test.use({ browserName: config.name as 'chromium' | 'firefox' | 'webkit' });

      test('homepage renders correctly', async ({ page, browserName }) => {
        await page.goto('/');

        // Use browser-specific baseline
        await expect(page).toHaveScreenshot(`homepage-${browserName}.png`, {
          maxDiffPixelRatio: 0.02, // Allow 2% for browser differences
        });
      });

      test('form controls render correctly', async ({ page, browserName }) => {
        await page.goto('/form');

        // Form controls vary significantly between browsers
        await expect(page).toHaveScreenshot(`form-${browserName}.png`, {
          maxDiffPixelRatio: 0.05, // Higher tolerance for form controls
        });
      });
    });
  }
});

// Example 3: Browser difference analyzer
interface BrowserDifference {
  element: string;
  property: string;
  chromium: string;
  firefox: string;
  webkit: string;
  isExpected: boolean;
}

async function analyzeBrowserDifferences(
  url: string
): Promise<BrowserDifference[]> {
  const differences: BrowserDifference[] = [];

  // In real implementation, launch all browsers and compare
  // This is a simulated analysis
  differences.push({
    element: 'input[type="date"]',
    property: 'appearance',
    chromium: 'native date picker',
    firefox: 'native date picker',
    webkit: 'text input with format hint',
    isExpected: true,
  });

  return differences;
}

// Example 4: Unified baseline with tolerance
async function compareAcrossBrowsers(
  page: Page,
  name: string,
  browserName: string
): Promise<{ passed: boolean; tolerance: number }> {
  // Different browsers need different tolerances
  const tolerances: Record<string, number> = {
    chromium: 0.01,
    firefox: 0.03,
    webkit: 0.05,
  };

  const tolerance = tolerances[browserName] || 0.02;

  try {
    await expect(page).toHaveScreenshot(`${name}.png`, {
      maxDiffPixelRatio: tolerance,
    });
    return { passed: true, tolerance };
  } catch {
    return { passed: false, tolerance };
  }
}

// Example 5: Parallel browser testing
async function runParallelBrowserTests(url: string): Promise<void> {
  const browsers = await Promise.all([
    chromium.launch(),
    firefox.launch(),
    webkit.launch(),
  ]);

  const pages = await Promise.all(
    browsers.map(async (browser) => {
      const context = await browser.newContext();
      return context.newPage();
    })
  );

  // Navigate all browsers in parallel
  await Promise.all(pages.map((page) => page.goto(url)));

  // Take screenshots in parallel
  const screenshots = await Promise.all(
    pages.map((page, i) =>
      page.screenshot({ path: `screenshot-${['chromium', 'firefox', 'webkit'][i]}.png` })
    )
  );

  // Cleanup
  await Promise.all(browsers.map((browser) => browser.close()));

  console.log(`Captured ${screenshots.length} browser screenshots`);
}

// Example 6: Browser compatibility report
interface CompatibilityReport {
  url: string;
  timestamp: Date;
  browsers: {
    name: string;
    passed: boolean;
    issues: string[];
  }[];
  overallCompatibility: number;
}

function generateCompatibilityReport(
  url: string,
  results: { browser: string; passed: boolean; issues: string[] }[]
): CompatibilityReport {
  const passedCount = results.filter((r) => r.passed).length;

  return {
    url,
    timestamp: new Date(),
    browsers: results.map((r) => ({
      name: r.browser,
      passed: r.passed,
      issues: r.issues,
    })),
    overallCompatibility: passedCount / results.length,
  };
}

/**
 * EXERCISE:
 * 1. Run visual tests across browsers
 * 2. Analyze browser differences
 * 3. Set appropriate tolerances
 * 4. Generate compatibility report
 *
 * LEARNING:
 * - Browsers render differently
 * - Use browser-specific baselines
 * - Set appropriate tolerances
 * - Document expected differences
 *
 * ONE LINER:
 * "Cross-browser visual testing ensures your UI looks great everywhere - not just in Chrome."
 */

export {
  browserConfigs,
  analyzeBrowserDifferences,
  compareAcrossBrowsers,
  generateCompatibilityReport,
};

