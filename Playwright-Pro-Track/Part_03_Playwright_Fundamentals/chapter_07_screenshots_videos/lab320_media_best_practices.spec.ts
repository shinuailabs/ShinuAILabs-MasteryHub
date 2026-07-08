/**
 * Lab 320: Media Best Practices
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Best practices for media:
 * 
 * - Screenshot strategies
 * - Video strategies
 * - Trace strategies
 * - CI/CD considerations
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Apply media best practices
 * 2. Configure for CI/CD
 * 3. Optimize storage
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Screenshot Strategy
test('screenshot strategy', async ({ page }) => {
    /*
     * Screenshot Strategies:
     * 
     * Development: 'on' - Always capture
     * CI: 'only-on-failure' - Save storage
     * Debugging: 'on' with fullPage
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 2: Video Strategy
test('video strategy', async ({ page }) => {
    /*
     * Video Strategies:
     * 
     * Development: 'on' - Always record
     * CI: 'retain-on-failure' - Save storage
     * Debugging: 'on' with custom size
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 3: Trace Strategy
test('trace strategy', async ({ page }) => {
    /*
     * Trace Strategies:
     * 
     * Development: 'on' - Full debugging
     * CI: 'retain-on-failure' - Save storage
     * Debugging: 'on' with all options
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 4: CI Configuration
test('CI configuration', async ({ page }) => {
    /*
     * Recommended CI config:
     * 
     * use: {
     *   screenshot: 'only-on-failure',
     *   video: 'retain-on-failure',
     *   trace: 'retain-on-failure',
     * }
     * 
     * Benefits:
     * - Saves storage
     * - Faster tests
     * - Debugging info when needed
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 5: Local Development Configuration
test('local development configuration', async ({ page }) => {
    /*
     * Recommended local config:
     * 
     * use: {
     *   screenshot: 'on',
     *   video: 'on',
     *   trace: 'on',
     * }
     * 
     * Benefits:
     * - Full debugging info
     * - Easy troubleshooting
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 6: Storage Optimization
test('storage optimization', async ({ page }) => {
    /*
     * Storage Optimization:
     * 
     * 1. Use 'retain-on-failure' modes
     * 2. Set video size limits
     * 3. Use minimal HAR mode
     * 4. Clean up old artifacts
     * 5. Compress artifacts
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 7: Visual Testing Strategy
test('visual testing strategy', async ({ page }) => {
    /*
     * Visual Testing Strategy:
     * 
     * 1. Disable animations
     * 2. Mask dynamic content
     * 3. Use appropriate thresholds
     * 4. Test on consistent viewport
     * 5. Update baselines carefully
     */
    
    await page.goto('https://playwright.dev');
    
    await expect(page).toHaveScreenshot('visual-test.png', {
        animations: 'disabled',
        mask: [page.locator('.dynamic')],
    });
});

// Solution 8: Debugging Workflow
test('debugging workflow', async ({ page }) => {
    /*
     * Debugging Workflow:
     * 
     * 1. Run with trace: 'on'
     * 2. View trace: npx playwright show-trace
     * 3. Check screenshots at each step
     * 4. Review network requests
     * 5. Inspect DOM snapshots
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 9: Report Integration
test('report integration', async ({ page }, testInfo) => {
    /*
     * Report Integration:
     * 
     * 1. Attach relevant artifacts
     * 2. Use HTML reporter
     * 3. Include screenshots in reports
     * 4. Link to trace viewer
     */
    
    await page.goto('https://playwright.dev');
    
    // Attach to report
    const screenshot = await page.screenshot();
    await testInfo.attach('final-state', {
        body: screenshot,
        contentType: 'image/png',
    });
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 10: Media Best Practices Summary
test('media best practices summary', async ({ page }) => {
    /*
     * Summary:
     * 
     * 1. Use appropriate modes for environment
     * 2. Optimize storage in CI
     * 3. Enable full debugging locally
     * 4. Use visual testing carefully
     * 5. Integrate with reports
     * 6. Clean up old artifacts
     * 7. Use trace viewer for debugging
     * 8. Attach relevant info to tests
     * 9. Configure per-project settings
     * 10. Document media strategies
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

