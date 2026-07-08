/**
 * Lab 321: Debug Mode
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Playwright debug mode:
 * 
 * - PWDEBUG environment variable
 * - Inspector
 * - Step through tests
 * - Breakpoints
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Run tests in debug mode
 * 2. Use Playwright Inspector
 * 3. Step through tests
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Enable Debug Mode
test('enable debug mode', async ({ page }) => {
    /*
     * Run with debug mode:
     * PWDEBUG=1 npx playwright test
     * 
     * Or on Windows:
     * set PWDEBUG=1 && npx playwright test
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 2: Debug Single Test
test('debug single test', async ({ page }) => {
    /*
     * Debug specific test:
     * PWDEBUG=1 npx playwright test debug_mode.spec.ts
     * 
     * Or with test name:
     * PWDEBUG=1 npx playwright test -g "debug single test"
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 3: Playwright Inspector
test('playwright inspector', async ({ page }) => {
    /*
     * Inspector features:
     * - Step over actions
     * - Pause execution
     * - Inspect selectors
     * - View console
     * - Record actions
     */
    
    await page.goto('https://playwright.dev');
    await page.getByRole('link', { name: 'Get started' }).click();
    await expect(page).toHaveURL(/.*intro/);
});

// Solution 4: Pause Execution
test('pause execution', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Pause for debugging
    // await page.pause();
    
    await page.getByRole('link', { name: 'Get started' }).click();
    await expect(page).toHaveURL(/.*intro/);
});

// Solution 5: Debug with Headed Browser
test('debug with headed browser', async ({ page }) => {
    /*
     * Run headed for debugging:
     * npx playwright test --headed
     * 
     * Combined with debug:
     * PWDEBUG=1 npx playwright test --headed
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 6: Slow Motion
test('slow motion', async ({ page }) => {
    /*
     * Configure slow motion in playwright.config.ts:
     * 
     * use: {
     *   launchOptions: {
     *     slowMo: 500, // 500ms between actions
     *   },
     * }
     * 
     * Or via CLI:
     * npx playwright test --slow-mo=500
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 7: Debug Console
test('debug console', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Log to console for debugging
    console.log('Current URL:', page.url());
    console.log('Page title:', await page.title());
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 8: Debug with Breakpoints
test('debug with breakpoints', async ({ page }) => {
    /*
     * Set breakpoints in VS Code:
     * 1. Click line number to set breakpoint
     * 2. Run: Debug: Start Debugging
     * 3. Or use JavaScript Debugger terminal
     */
    
    await page.goto('https://playwright.dev');
    
    // Set breakpoint on next line
    const title = await page.title();
    console.log('Title:', title);
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 9: Debug Selector
test('debug selector', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Highlight element for debugging
    // await page.locator('h1').highlight();
    
    // Or use Inspector to find selectors
    // PWDEBUG=1 npx playwright test
    
    await expect(page.locator('h1')).toBeVisible();
});

// Solution 10: Debug Network
test('debug network', async ({ page }) => {
    // Log all requests
    page.on('request', request => {
        console.log('Request:', request.method(), request.url());
    });
    
    page.on('response', response => {
        console.log('Response:', response.status(), response.url());
    });
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 11: Debug Console Messages
test('debug console messages', async ({ page }) => {
    // Log browser console messages
    page.on('console', msg => {
        console.log('Browser console:', msg.type(), msg.text());
    });
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 12: Debug Best Practices
test('debug best practices', async ({ page }) => {
    /*
     * Debug Best Practices:
     * 1. Use PWDEBUG=1 for interactive debugging
     * 2. Use page.pause() for specific points
     * 3. Use --headed for visual debugging
     * 4. Use slow motion for step-by-step
     * 5. Use console.log for quick debugging
     * 6. Use trace viewer for post-mortem
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

