/**
 * Lab 325: VS Code Debugging
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Debugging in VS Code:
 * 
 * - Playwright extension
 * - Breakpoints
 * - Debug configuration
 * - Watch expressions
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Set up VS Code debugging
 * 2. Use breakpoints
 * 3. Debug with extension
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Install Playwright Extension
test('install playwright extension', async ({ page }) => {
    /*
     * Install VS Code extension:
     * 1. Open VS Code
     * 2. Go to Extensions (Ctrl+Shift+X)
     * 3. Search "Playwright Test for VSCode"
     * 4. Install by Microsoft
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 2: Run Tests from Extension
test('run tests from extension', async ({ page }) => {
    /*
     * Run tests:
     * 1. Open Testing sidebar
     * 2. Click play button next to test
     * 3. Or right-click test and select "Run Test"
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 3: Debug Tests from Extension
test('debug tests from extension', async ({ page }) => {
    /*
     * Debug tests:
     * 1. Open Testing sidebar
     * 2. Click debug button next to test
     * 3. Or right-click and select "Debug Test"
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 4: Set Breakpoints
test('set breakpoints', async ({ page }) => {
    /*
     * Set breakpoints:
     * 1. Click in gutter (left of line numbers)
     * 2. Red dot appears
     * 3. Debug test to hit breakpoint
     */
    
    await page.goto('https://playwright.dev');
    
    // Set breakpoint on this line
    const title = await page.title();
    console.log('Title:', title);
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 5: Conditional Breakpoints
test('conditional breakpoints', async ({ page }) => {
    /*
     * Conditional breakpoints:
     * 1. Right-click in gutter
     * 2. Select "Add Conditional Breakpoint"
     * 3. Enter condition (e.g., i === 5)
     */
    
    await page.goto('https://playwright.dev');
    
    const links = page.locator('a');
    const count = await links.count();
    
    for (let i = 0; i < Math.min(count, 10); i++) {
        // Breakpoint when i === 5
        const href = await links.nth(i).getAttribute('href');
        console.log(`Link ${i}:`, href);
    }
});

// Solution 6: Watch Expressions
test('watch expressions', async ({ page }) => {
    /*
     * Watch expressions:
     * 1. Open Debug sidebar
     * 2. Add expression in Watch panel
     * 3. Expression updates during debugging
     */
    
    await page.goto('https://playwright.dev');
    
    // Add these to watch panel:
    // page.url()
    // await page.title()
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 7: Debug Console
test('debug console', async ({ page }) => {
    /*
     * Debug Console:
     * 1. Open Debug Console (Ctrl+Shift+Y)
     * 2. Evaluate expressions during debugging
     * 3. Access variables in scope
     */
    
    await page.goto('https://playwright.dev');
    
    // In debug console, try:
    // page.url()
    // await page.locator('h1').textContent()
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 8: Step Through Code
test('step through code', async ({ page }) => {
    /*
     * Step controls:
     * - F5: Continue
     * - F10: Step Over
     * - F11: Step Into
     * - Shift+F11: Step Out
     */
    
    await page.goto('https://playwright.dev');
    await page.getByRole('link', { name: 'Get started' }).click();
    await expect(page).toHaveURL(/.*intro/);
});

// Solution 9: Launch Configuration
test('launch configuration', async ({ page }) => {
    /*
     * Create .vscode/launch.json:
     * 
     * {
     *   "version": "0.2.0",
     *   "configurations": [
     *     {
     *       "type": "node",
     *       "request": "launch",
     *       "name": "Debug Playwright Tests",
     *       "program": "${workspaceFolder}/node_modules/.bin/playwright",
     *       "args": ["test", "--debug"],
     *       "console": "integratedTerminal"
     *     }
     *   ]
     * }
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 10: Pick Locator
test('pick locator', async ({ page }) => {
    /*
     * Pick Locator feature:
     * 1. Click "Pick Locator" in Testing sidebar
     * 2. Click element in browser
     * 3. Locator is copied to clipboard
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 11: Show Browser
test('show browser', async ({ page }) => {
    /*
     * Show Browser:
     * 1. Check "Show Browser" in Testing sidebar
     * 2. Browser opens during test
     * 3. See test execution visually
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 12: VS Code Debugging Best Practices
test('VS Code debugging best practices', async ({ page }) => {
    /*
     * Best Practices:
     * 1. Use Playwright extension
     * 2. Set meaningful breakpoints
     * 3. Use watch expressions
     * 4. Use debug console
     * 5. Enable "Show Browser"
     * 6. Use "Pick Locator"
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

