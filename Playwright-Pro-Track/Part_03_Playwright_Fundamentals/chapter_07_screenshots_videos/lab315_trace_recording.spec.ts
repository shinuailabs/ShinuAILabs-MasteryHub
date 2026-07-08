/**
 * Lab 315: Trace Recording
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Recording test traces:
 * 
 * - Trace configuration
 * - Trace viewer
 * - Trace contents
 * - Debugging with traces
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Configure trace recording
 * 2. View traces
 * 3. Debug with traces
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Trace Configuration
test('trace configuration', async ({ page }) => {
    /*
     * Configure in playwright.config.ts:
     * 
     * use: {
     *   trace: 'on', // 'on', 'off', 'on-first-retry', 'retain-on-failure'
     * }
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 2: Trace On First Retry
test('trace on first retry', async ({ page }) => {
    /*
     * Configure in playwright.config.ts:
     * 
     * use: {
     *   trace: 'on-first-retry',
     * }
     * 
     * Records trace only when test is retried
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 3: Trace Retain On Failure
test('trace retain on failure', async ({ page }) => {
    /*
     * Configure in playwright.config.ts:
     * 
     * use: {
     *   trace: 'retain-on-failure',
     * }
     * 
     * Keeps trace only for failed tests
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 4: Manual Trace Start/Stop
test('manual trace start stop', async ({ page, context }) => {
    // Start tracing
    await context.tracing.start({
        screenshots: true,
        snapshots: true,
        sources: true,
    });
    
    await page.goto('https://playwright.dev');
    await page.getByRole('link', { name: 'Get started' }).click();
    
    // Stop and save trace
    await context.tracing.stop({
        path: 'traces/manual-trace.zip',
    });
});

// Solution 5: Trace with Screenshots
test('trace with screenshots', async ({ page, context }) => {
    await context.tracing.start({
        screenshots: true, // Include screenshots
        snapshots: true,
    });
    
    await page.goto('https://playwright.dev');
    
    await context.tracing.stop({
        path: 'traces/with-screenshots.zip',
    });
});

// Solution 6: Trace with Snapshots
test('trace with snapshots', async ({ page, context }) => {
    await context.tracing.start({
        snapshots: true, // Include DOM snapshots
    });
    
    await page.goto('https://playwright.dev');
    
    await context.tracing.stop({
        path: 'traces/with-snapshots.zip',
    });
});

// Solution 7: Trace with Sources
test('trace with sources', async ({ page, context }) => {
    await context.tracing.start({
        sources: true, // Include source code
    });
    
    await page.goto('https://playwright.dev');
    
    await context.tracing.stop({
        path: 'traces/with-sources.zip',
    });
});

// Solution 8: View Trace
test('view trace', async ({ page }) => {
    /*
     * View trace with:
     * npx playwright show-trace traces/trace.zip
     * 
     * Or open trace viewer:
     * npx playwright show-trace
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 9: Trace Contents
test('trace contents', async ({ page }) => {
    /*
     * Trace includes:
     * - Actions timeline
     * - Screenshots at each step
     * - DOM snapshots
     * - Network requests
     * - Console logs
     * - Source code
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 10: Trace Chunk
test('trace chunk', async ({ page, context }) => {
    await context.tracing.start({
        screenshots: true,
        snapshots: true,
    });
    
    await page.goto('https://playwright.dev');
    
    // Save chunk and continue
    await context.tracing.startChunk();
    await page.getByRole('link', { name: 'Get started' }).click();
    await context.tracing.stopChunk({ path: 'traces/chunk1.zip' });
    
    await context.tracing.stop();
});

// Solution 11: Trace Best Practices
test('trace best practices', async ({ page }) => {
    /*
     * Best Practices:
     * 1. Use 'retain-on-failure' for CI
     * 2. Include screenshots and snapshots
     * 3. Use trace viewer for debugging
     * 4. Clean up old traces
     * 5. Attach traces to test reports
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

