/**
 * Lab 324: UI Mode
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Playwright UI Mode:
 * 
 * - Interactive test runner
 * - Watch mode
 * - Test explorer
 * - Time travel debugging
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Run tests in UI mode
 * 2. Use watch mode
 * 3. Debug with time travel
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Start UI Mode
test('start UI mode', async ({ page }) => {
    /*
     * Start UI mode:
     * npx playwright test --ui
     * 
     * Features:
     * - Visual test runner
     * - Test explorer
     * - Watch mode
     * - Time travel debugging
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 2: Test Explorer
test('test explorer', async ({ page }) => {
    /*
     * Test Explorer features:
     * - View all tests
     * - Filter by status
     * - Search tests
     * - Run individual tests
     * - Run test files
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 3: Watch Mode
test('watch mode', async ({ page }) => {
    /*
     * Watch Mode:
     * - Auto-runs tests on file change
     * - Shows test results in real-time
     * - Quick feedback loop
     * 
     * Enable in UI mode or:
     * npx playwright test --watch
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 4: Time Travel Debugging
test('time travel debugging', async ({ page }) => {
    /*
     * Time Travel features:
     * - Step through actions
     * - See DOM at each step
     * - View screenshots
     * - Inspect network
     */
    
    await page.goto('https://playwright.dev');
    await page.getByRole('link', { name: 'Get started' }).click();
    await expect(page).toHaveURL(/.*intro/);
});

// Solution 5: Action Inspector
test('action inspector', async ({ page }) => {
    /*
     * Action Inspector shows:
     * - Action details
     * - Selector used
     * - Duration
     * - Before/after screenshots
     */
    
    await page.goto('https://playwright.dev');
    await page.getByRole('link', { name: 'Get started' }).click();
    await expect(page).toHaveURL(/.*intro/);
});

// Solution 6: DOM Snapshot
test('DOM snapshot', async ({ page }) => {
    /*
     * DOM Snapshot features:
     * - Full DOM tree
     * - Element inspection
     * - CSS styles
     * - Computed properties
     */
    
    await page.goto('https://playwright.dev');
    await expect(page.locator('h1')).toBeVisible();
});

// Solution 7: Network Panel
test('network panel', async ({ page }) => {
    /*
     * Network Panel shows:
     * - All requests
     * - Request/response details
     * - Timing
     * - Filtering
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 8: Console Panel
test('console panel', async ({ page }) => {
    /*
     * Console Panel shows:
     * - Browser console messages
     * - Errors and warnings
     * - Test output
     */
    
    await page.goto('https://playwright.dev');
    
    await page.evaluate(() => {
        console.log('Test message');
    });
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 9: Source Panel
test('source panel', async ({ page }) => {
    /*
     * Source Panel shows:
     * - Test source code
     * - Current line
     * - Breakpoints
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 10: Filter Tests
test('filter tests', async ({ page }) => {
    /*
     * Filter options:
     * - By status (passed, failed, skipped)
     * - By project
     * - By file
     * - By search term
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 11: Run Options
test('run options', async ({ page }) => {
    /*
     * Run options in UI mode:
     * - Run all tests
     * - Run failed tests
     * - Run single test
     * - Run test file
     * - Run with specific project
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 12: UI Mode Best Practices
test('UI mode best practices', async ({ page }) => {
    /*
     * Best Practices:
     * 1. Use UI mode for development
     * 2. Enable watch mode for TDD
     * 3. Use time travel for debugging
     * 4. Inspect DOM snapshots
     * 5. Check network requests
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

