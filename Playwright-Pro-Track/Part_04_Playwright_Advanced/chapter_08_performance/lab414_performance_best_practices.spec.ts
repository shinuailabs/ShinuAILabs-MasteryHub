/**
 * Lab 414: Performance Best Practices
 *
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Best practices for performance testing:
 *
 * - Measurement strategies
 * - Optimization techniques
 * - Monitoring approaches
 * - CI/CD integration
 *
 * =====================
 * EXERCISE:
 * =====================
 * 1. Apply performance best practices
 * 2. Set up monitoring
 * 3. Integrate with CI/CD
 *
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Consistent Test Environment
test('consistent test environment', async ({ page }) => {
    // Use fixed viewport
    await page.setViewportSize({ width: 1280, height: 720 });

    // Clear cache
    await page.context().clearCookies();

    // Measure with clean state
    const start = Date.now();
    await page.goto('https://playwright.dev');
    const loadTime = Date.now() - start;

    console.log('Clean load time:', loadTime, 'ms');
});

// Solution 2: Multiple Measurements
test('multiple measurements', async ({ page }) => {
    const measurements: number[] = [];
    const iterations = 3;

    for (let i = 0; i < iterations; i++) {
        const start = Date.now();
        await page.goto('https://playwright.dev');
        measurements.push(Date.now() - start);

        // Clear for next iteration
        await page.context().clearCookies();
    }

    const avg = measurements.reduce((a, b) => a + b, 0) / measurements.length;
    const min = Math.min(...measurements);
    const max = Math.max(...measurements);

    console.log(`Avg: ${avg}ms, Min: ${min}ms, Max: ${max}ms`);
});

// Solution 3: Warm-up Run
test('warm up run', async ({ page }) => {
    // Warm-up (not measured)
    await page.goto('https://playwright.dev');

    // Actual measurement
    const start = Date.now();
    await page.goto('https://playwright.dev');
    const loadTime = Date.now() - start;

    console.log('Warmed-up load time:', loadTime, 'ms');
});

// Solution 4: Network Idle Wait
test('network idle wait', async ({ page }) => {
    const start = Date.now();

    await page.goto('https://playwright.dev');
    await page.waitForLoadState('networkidle');

    const fullyLoaded = Date.now() - start;

    console.log('Fully loaded time:', fullyLoaded, 'ms');
});

// Solution 5: User-Centric Metrics
test('user centric metrics', async ({ page }) => {
    await page.goto('https://playwright.dev');

    const metrics = await page.evaluate(() => {
        const fcp = performance.getEntriesByName('first-contentful-paint')[0];
        const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

        return {
            TTFB: nav.responseStart - nav.requestStart,
            FCP: fcp ? fcp.startTime : null,
            DOMInteractive: nav.domInteractive - nav.startTime,
            DOMComplete: nav.domComplete - nav.startTime,
        };
    });

    console.log('User-centric metrics:', metrics);
});

// Solution 6: Resource Monitoring
test('resource monitoring', async ({ page }) => {
    const resources = { js: 0, css: 0, images: 0, other: 0 };

    page.on('response', async response => {
        const type = response.headers()['content-type'] || '';
        if (type.includes('javascript')) resources.js++;
        else if (type.includes('css')) resources.css++;
        else if (type.includes('image')) resources.images++;
        else resources.other++;
    });

    await page.goto('https://playwright.dev');

    console.log('Resource breakdown:', resources);
});

// Solution 7: Error Tracking
test('error tracking', async ({ page }) => {
    const errors: string[] = [];

    page.on('pageerror', error => {
        errors.push(error.message);
    });

    page.on('console', msg => {
        if (msg.type() === 'error') {
            errors.push(msg.text());
        }
    });

    await page.goto('https://playwright.dev');

    console.log('Errors found:', errors.length);
    expect(errors.length).toBe(0);
});

// Solution 8: Performance Report
test('performance report', async ({ page }) => {
    const report: any = {
        timestamp: new Date().toISOString(),
        url: 'https://playwright.dev',
    };

    let resourceCount = 0;
    let totalSize = 0;

    page.on('response', async response => {
        resourceCount++;
        try {
            const body = await response.body();
            totalSize += body.length;
        } catch {}
    });

    const start = Date.now();
    await page.goto('https://playwright.dev');
    report.loadTime = Date.now() - start;

    report.resourceCount = resourceCount;
    report.totalSize = `${(totalSize / 1024).toFixed(2)} KB`;

    console.log('Performance Report:', JSON.stringify(report, null, 2));
});

// Solution 9: Threshold Assertions
test('threshold assertions', async ({ page }) => {
    const thresholds = {
        loadTime: 5000,
        resourceCount: 100,
    };

    let resourceCount = 0;
    page.on('request', () => resourceCount++);

    const start = Date.now();
    await page.goto('https://playwright.dev');
    const loadTime = Date.now() - start;

    expect(loadTime).toBeLessThan(thresholds.loadTime);
    expect(resourceCount).toBeLessThan(thresholds.resourceCount);
});

// Solution 10: Performance Best Practices Summary
test('performance best practices summary', async ({ page }) => {
    /*
     * Performance Testing Best Practices:
     *
     * Measurement:
     * - Use consistent environment
     * - Take multiple measurements
     * - Include warm-up runs
     * - Wait for network idle
     *
     * Metrics:
     * - Focus on user-centric metrics
     * - Track Core Web Vitals
     * - Monitor resource usage
     * - Set performance budgets
     *
     * CI/CD:
     * - Run performance tests regularly
     * - Track trends over time
     * - Alert on regressions
     * - Include in PR checks
     *
     * Optimization:
     * - Minimize resource count
     * - Optimize resource sizes
     * - Use caching effectively
     * - Reduce third-party impact
     */

    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});
