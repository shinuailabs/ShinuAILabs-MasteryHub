/**
 * Lab 252: Installation and Setup
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Setting up Playwright:
 * 
 * - Installation methods
 * - Project initialization
 * - Browser installation
 * - Configuration basics
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Install Playwright
 * 2. Initialize project
 * 3. Configure basics
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

/*
 * Solution 1: Installation Methods
 * 
 * Method 1: Create new project
 * npm init playwright@latest
 * 
 * Method 2: Add to existing project
 * npm install -D @playwright/test
 * npx playwright install
 * 
 * Method 3: With specific browsers
 * npx playwright install chromium
 * npx playwright install firefox webkit
 */

/*
 * Solution 2: Project Structure
 * 
 * my-project/
 * ├── tests/
 * │   └── example.spec.ts
 * ├── playwright.config.ts
 * ├── package.json
 * └── node_modules/
 */

/*
 * Solution 3: Basic playwright.config.ts
 * 
 * import { defineConfig } from '@playwright/test';
 * 
 * export default defineConfig({
 *     testDir: './tests',
 *     timeout: 30000,
 *     use: {
 *         baseURL: 'http://localhost:3000',
 *         trace: 'on-first-retry',
 *     },
 * });
 */

// Solution 4: Verify Installation
test.describe('Installation Verification', () => {
    
    test('playwright is installed correctly', async ({ page }) => {
        // If this runs, Playwright is installed
        await page.goto('https://playwright.dev');
        await expect(page).toHaveTitle(/Playwright/);
    });
    
    test('browser is available', async ({ page, browserName }) => {
        console.log(`Browser: ${browserName}`);
        expect(['chromium', 'firefox', 'webkit']).toContain(browserName);
    });
});

/*
 * Solution 5: Package.json Scripts
 * 
 * {
 *     "scripts": {
 *         "test": "playwright test",
 *         "test:headed": "playwright test --headed",
 *         "test:debug": "playwright test --debug",
 *         "test:ui": "playwright test --ui",
 *         "codegen": "playwright codegen"
 *     }
 * }
 */

/*
 * Solution 6: Browser Installation
 * 
 * Install all browsers:
 * npx playwright install
 * 
 * Install specific browser:
 * npx playwright install chromium
 * 
 * Install with dependencies (Linux):
 * npx playwright install --with-deps
 * 
 * Check installed browsers:
 * npx playwright --version
 */

/*
 * Solution 7: VS Code Extension
 * 
 * Install "Playwright Test for VS Code" extension
 * 
 * Features:
 * - Run tests from editor
 * - Debug tests
 * - Show test results
 * - Pick locators
 */

// Solution 8: First Test After Setup
test('first test after setup', async ({ page }) => {
    // Navigate
    await page.goto('https://example.com');
    
    // Assert
    await expect(page).toHaveTitle('Example Domain');
    
    // Interact
    const heading = page.locator('h1');
    await expect(heading).toHaveText('Example Domain');
});

/*
 * Solution 9: Running Tests
 * 
 * Run all tests:
 * npx playwright test
 * 
 * Run specific file:
 * npx playwright test example.spec.ts
 * 
 * Run with UI:
 * npx playwright test --ui
 * 
 * Run headed:
 * npx playwright test --headed
 * 
 * Run specific browser:
 * npx playwright test --project=chromium
 */

/*
 * Solution 10: Troubleshooting
 * 
 * Issue: Browsers not found
 * Fix: npx playwright install
 * 
 * Issue: Permission denied
 * Fix: npx playwright install --with-deps
 * 
 * Issue: Tests timeout
 * Fix: Increase timeout in config
 * 
 * Issue: Element not found
 * Fix: Check selectors, use codegen
 */

