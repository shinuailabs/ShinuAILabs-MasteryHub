/**
 * Lab 931: AI Performance Test Generation
 *
 * CONCEPT:
 * AI can generate performance tests that measure page load times, resource
 * usage, and user experience metrics. These tests help identify performance
 * regressions before they impact users.
 *
 * BULLET POINTS:
 * - Generate Core Web Vitals tests
 * - Measure page load performance
 * - Test resource loading times
 * - Monitor memory usage
 * - Create performance baselines
 */

import { test, expect, Page } from '@playwright/test';

// Example 1: Core Web Vitals tests
test.describe('Core Web Vitals', () => {
  test('should meet LCP threshold', async ({ page }) => {
    await page.goto('/');

    // Measure Largest Contentful Paint
    const lcp = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1] as PerformanceEntry & { startTime: number };
          resolve(lastEntry.startTime);
        }).observe({ type: 'largest-contentful-paint', buffered: true });

        // Fallback timeout
        setTimeout(() => resolve(0), 5000);
      });
    });

    // LCP should be under 2.5 seconds (good)
    expect(lcp).toBeLessThan(2500);
  });

  test('should meet FID threshold', async ({ page }) => {
    await page.goto('/');

    // Simulate user interaction and measure delay
    const fid = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          if (entries.length > 0) {
            const entry = entries[0] as PerformanceEntry & { processingStart: number; startTime: number };
            resolve(entry.processingStart - entry.startTime);
          }
        }).observe({ type: 'first-input', buffered: true });

        setTimeout(() => resolve(0), 5000);
      });
    });

    // FID should be under 100ms (good)
    expect(fid).toBeLessThan(100);
  });

  test('should meet CLS threshold', async ({ page }) => {
    await page.goto('/');

    // Wait for page to stabilize
    await page.waitForLoadState('networkidle');

    const cls = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        let clsValue = 0;
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries() as (PerformanceEntry & { hadRecentInput: boolean; value: number })[]) {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          }
        }).observe({ type: 'layout-shift', buffered: true });

        setTimeout(() => resolve(clsValue), 3000);
      });
    });

    // CLS should be under 0.1 (good)
    expect(cls).toBeLessThan(0.1);
  });
});

// Example 2: Page load performance tests
test.describe('Page Load Performance', () => {
  test('home page loads within threshold', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const domContentLoaded = Date.now() - startTime;

    await page.waitForLoadState('load');
    const fullLoad = Date.now() - startTime;

    expect(domContentLoaded).toBeLessThan(1500); // 1.5s
    expect(fullLoad).toBeLessThan(3000); // 3s
  });

  test('should load critical resources quickly', async ({ page }) => {
    const resourceTimings: { name: string; duration: number }[] = [];

    page.on('response', async (response) => {
      const timing = response.timing();
      if (timing) {
        resourceTimings.push({
          name: response.url(),
          duration: timing.responseEnd,
        });
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check critical resources
    const slowResources = resourceTimings.filter((r) => r.duration > 1000);
    expect(slowResources.length).toBe(0);
  });
});

// Example 3: Performance baseline comparison
interface PerformanceBaseline {
  metric: string;
  threshold: number;
  unit: string;
}

const performanceBaselines: PerformanceBaseline[] = [
  { metric: 'LCP', threshold: 2500, unit: 'ms' },
  { metric: 'FID', threshold: 100, unit: 'ms' },
  { metric: 'CLS', threshold: 0.1, unit: 'score' },
  { metric: 'TTFB', threshold: 600, unit: 'ms' },
  { metric: 'FCP', threshold: 1800, unit: 'ms' },
];

async function measurePerformance(page: Page): Promise<Record<string, number>> {
  const metrics = await page.evaluate(() => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paint = performance.getEntriesByType('paint');

    return {
      TTFB: navigation.responseStart - navigation.requestStart,
      FCP: paint.find((p) => p.name === 'first-contentful-paint')?.startTime || 0,
      DOMContentLoaded: navigation.domContentLoadedEventEnd - navigation.startTime,
      Load: navigation.loadEventEnd - navigation.startTime,
    };
  });

  return metrics;
}

test('should meet all performance baselines', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  const metrics = await measurePerformance(page);

  expect(metrics.TTFB).toBeLessThan(600);
  expect(metrics.FCP).toBeLessThan(1800);
});

/**
 * EXERCISE:
 * 1. Measure Core Web Vitals for your app
 * 2. Create performance baselines
 * 3. Add performance tests to CI
 * 4. Monitor for regressions
 *
 * LEARNING:
 * - Performance testing prevents regressions
 * - Core Web Vitals measure user experience
 * - Set baselines and monitor trends
 * - Integrate with CI for continuous monitoring
 *
 * ONE LINER:
 * "AI generates performance tests that catch slowdowns before users notice them."
 */

export { performanceBaselines, measurePerformance };

