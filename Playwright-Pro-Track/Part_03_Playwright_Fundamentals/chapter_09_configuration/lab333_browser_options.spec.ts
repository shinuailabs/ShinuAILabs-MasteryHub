/**
 * Lab 333: Browser Options
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Configuring browser options:
 * 
 * - Launch options
 * - Context options
 * - Browser arguments
 * - Headless mode
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Configure launch options
 * 2. Set context options
 * 3. Use browser arguments
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Headless Mode
test('headless mode', async ({ page }) => {
    /*
     * Configure headless:
     * 
     * use: {
     *   headless: true, // or false for headed
     * }
     * 
     * Or via CLI:
     * npx playwright test --headed
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 2: Slow Motion
test('slow motion', async ({ page }) => {
    /*
     * Configure slow motion:
     * 
     * use: {
     *   launchOptions: {
     *     slowMo: 500, // 500ms between actions
     *   },
     * }
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 3: Browser Arguments
test('browser arguments', async ({ page }) => {
    /*
     * Configure browser args:
     * 
     * use: {
     *   launchOptions: {
     *     args: [
     *       '--disable-extensions',
     *       '--disable-gpu',
     *       '--no-sandbox',
     *     ],
     *   },
     * }
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 4: Viewport Size
test('viewport size', async ({ page }) => {
    /*
     * Configure viewport:
     * 
     * use: {
     *   viewport: { width: 1920, height: 1080 },
     * }
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 5: Device Scale Factor
test('device scale factor', async ({ page }) => {
    /*
     * Configure device scale:
     * 
     * use: {
     *   deviceScaleFactor: 2, // Retina display
     * }
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 6: User Agent
test('user agent', async ({ page }) => {
    /*
     * Configure user agent:
     * 
     * use: {
     *   userAgent: 'Custom User Agent String',
     * }
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 7: Locale and Timezone
test('locale and timezone', async ({ page }) => {
    /*
     * Configure locale and timezone:
     * 
     * use: {
     *   locale: 'en-US',
     *   timezoneId: 'America/New_York',
     * }
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 8: Geolocation
test('geolocation', async ({ page }) => {
    /*
     * Configure geolocation:
     * 
     * use: {
     *   geolocation: { latitude: 40.7128, longitude: -74.0060 },
     *   permissions: ['geolocation'],
     * }
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 9: Color Scheme
test('color scheme', async ({ page }) => {
    /*
     * Configure color scheme:
     * 
     * use: {
     *   colorScheme: 'dark', // 'light', 'dark', 'no-preference'
     * }
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 10: Browser Options Best Practices
test('browser options best practices', async ({ page }) => {
    /*
     * Best Practices:
     * 1. Use headless in CI
     * 2. Use headed for debugging
     * 3. Set appropriate viewport
     * 4. Configure locale for i18n testing
     * 5. Use slow motion for debugging
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

