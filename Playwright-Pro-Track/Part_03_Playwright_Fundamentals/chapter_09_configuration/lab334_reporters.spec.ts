/**
 * Lab 334: Reporters Configuration
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Configuring test reporters:
 * 
 * - Built-in reporters
 * - Custom reporters
 * - Multiple reporters
 * - Reporter options
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Configure reporters
 * 2. Use multiple reporters
 * 3. Customize output
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: List Reporter
test('list reporter', async ({ page }) => {
    /*
     * List reporter (default):
     * 
     * reporter: 'list',
     * 
     * Or via CLI:
     * npx playwright test --reporter=list
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 2: HTML Reporter
test('HTML reporter', async ({ page }) => {
    /*
     * HTML reporter:
     * 
     * reporter: 'html',
     * 
     * Or with options:
     * reporter: [['html', { outputFolder: 'playwright-report' }]],
     * 
     * Open report:
     * npx playwright show-report
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 3: JSON Reporter
test('JSON reporter', async ({ page }) => {
    /*
     * JSON reporter:
     * 
     * reporter: [['json', { outputFile: 'results.json' }]],
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 4: JUnit Reporter
test('JUnit reporter', async ({ page }) => {
    /*
     * JUnit reporter (for CI):
     * 
     * reporter: [['junit', { outputFile: 'results.xml' }]],
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 5: Dot Reporter
test('dot reporter', async ({ page }) => {
    /*
     * Dot reporter (minimal):
     * 
     * reporter: 'dot',
     * 
     * Shows: . for pass, F for fail
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 6: Line Reporter
test('line reporter', async ({ page }) => {
    /*
     * Line reporter:
     * 
     * reporter: 'line',
     * 
     * Shows one line per test
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 7: Multiple Reporters
test('multiple reporters', async ({ page }) => {
    /*
     * Multiple reporters:
     * 
     * reporter: [
     *   ['list'],
     *   ['html'],
     *   ['json', { outputFile: 'results.json' }],
     *   ['junit', { outputFile: 'results.xml' }],
     * ],
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 8: GitHub Actions Reporter
test('GitHub Actions reporter', async ({ page }) => {
    /*
     * GitHub Actions reporter:
     * 
     * reporter: process.env.CI ? 'github' : 'list',
     * 
     * Shows annotations in GitHub
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 9: CI Reporter Configuration
test('CI reporter configuration', async ({ page }) => {
    /*
     * CI configuration:
     * 
     * reporter: process.env.CI
     *   ? [['github'], ['html'], ['junit', { outputFile: 'results.xml' }]]
     *   : [['list'], ['html']],
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 10: Reporter Best Practices
test('reporter best practices', async ({ page }) => {
    /*
     * Best Practices:
     * 1. Use HTML reporter for detailed reports
     * 2. Use JUnit for CI integration
     * 3. Use GitHub reporter for annotations
     * 4. Use multiple reporters
     * 5. Configure output paths
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

