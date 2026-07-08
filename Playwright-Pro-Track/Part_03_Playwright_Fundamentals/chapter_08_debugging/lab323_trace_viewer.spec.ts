/**
 * Lab 323: Trace Viewer
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Using Playwright Trace Viewer:
 * 
 * - Recording traces
 * - Viewing traces
 * - Trace features
 * - Debugging with traces
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Record traces
 * 2. Open trace viewer
 * 3. Analyze test execution
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Record Trace
test('record trace', async ({ page, context }) => {
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
        path: 'traces/test-trace.zip',
    });
});

// Solution 2: View Trace
test('view trace', async ({ page }) => {
    /*
     * View trace with:
     * npx playwright show-trace traces/test-trace.zip
     * 
     * Or open trace viewer:
     * npx playwright show-trace
     * Then drag and drop trace file
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 3: Trace Timeline
test('trace timeline', async ({ page }) => {
    /*
     * Trace Timeline shows:
     * - Actions in order
     * - Duration of each action
     * - Screenshots at each step
     * - Network requests
     */
    
    await page.goto('https://playwright.dev');
    await page.getByRole('link', { name: 'Get started' }).click();
    await expect(page).toHaveURL(/.*intro/);
});

// Solution 4: Trace Actions
test('trace actions', async ({ page }) => {
    /*
     * Actions panel shows:
     * - Action type (click, fill, etc.)
     * - Selector used
     * - Duration
     * - Result (success/failure)
     */
    
    await page.goto('https://playwright.dev');
    await page.getByRole('link', { name: 'Get started' }).click();
    await expect(page).toHaveURL(/.*intro/);
});

// Solution 5: Trace Screenshots
test('trace screenshots', async ({ page }) => {
    /*
     * Screenshots panel shows:
     * - Before/after each action
     * - Full page screenshots
     * - Element highlights
     */
    
    await page.goto('https://playwright.dev');
    await page.getByRole('link', { name: 'Get started' }).click();
    await expect(page).toHaveURL(/.*intro/);
});

// Solution 6: Trace DOM Snapshots
test('trace DOM snapshots', async ({ page }) => {
    /*
     * DOM Snapshots show:
     * - Full DOM at each step
     * - Element inspection
     * - CSS styles
     * - Computed properties
     */
    
    await page.goto('https://playwright.dev');
    await page.getByRole('link', { name: 'Get started' }).click();
    await expect(page).toHaveURL(/.*intro/);
});

// Solution 7: Trace Network
test('trace network', async ({ page }) => {
    /*
     * Network panel shows:
     * - All HTTP requests
     * - Request/response headers
     * - Response body
     * - Timing information
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 8: Trace Console
test('trace console', async ({ page }) => {
    /*
     * Console panel shows:
     * - Browser console messages
     * - Errors and warnings
     * - Log messages
     */
    
    await page.goto('https://playwright.dev');
    
    await page.evaluate(() => {
        console.log('Test message');
    });
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 9: Trace Source
test('trace source', async ({ page }) => {
    /*
     * Source panel shows:
     * - Test source code
     * - Current line highlighted
     * - Call stack
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 10: Trace Metadata
test('trace metadata', async ({ page }) => {
    /*
     * Metadata includes:
     * - Browser info
     * - Viewport size
     * - Test name
     * - Duration
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 11: Trace Debugging Workflow
test('trace debugging workflow', async ({ page }) => {
    /*
     * Debugging Workflow:
     * 1. Run test with trace: 'on'
     * 2. Open trace viewer
     * 3. Find failing action
     * 4. Check screenshot before/after
     * 5. Inspect DOM snapshot
     * 6. Check network requests
     * 7. Review console logs
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 12: Trace Best Practices
test('trace best practices', async ({ page }) => {
    /*
     * Best Practices:
     * 1. Use 'retain-on-failure' in CI
     * 2. Include screenshots and snapshots
     * 3. Include source code
     * 4. Use trace viewer for debugging
     * 5. Share traces for collaboration
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

