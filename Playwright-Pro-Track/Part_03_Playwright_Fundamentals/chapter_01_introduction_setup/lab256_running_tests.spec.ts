/**
 * Lab 256: Running Tests
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Different ways to run tests:
 * 
 * - Command line options
 * - Running specific tests
 * - Parallel execution
 * - Debug mode
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Run tests various ways
 * 2. Use CLI options
 * 3. Debug tests
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

/*
 * Solution 1: Basic Test Running
 * 
 * Run all tests:
 * npx playwright test
 * 
 * Run with npm script:
 * npm test
 */

/*
 * Solution 2: Running Specific Tests
 * 
 * Run single file:
 * npx playwright test login.spec.ts
 * 
 * Run tests in directory:
 * npx playwright test tests/e2e/
 * 
 * Run by test name:
 * npx playwright test -g "login"
 * 
 * Run by tag:
 * npx playwright test --grep @smoke
 */

/*
 * Solution 3: Browser Selection
 * 
 * Run on specific browser:
 * npx playwright test --project=chromium
 * npx playwright test --project=firefox
 * npx playwright test --project=webkit
 * 
 * Run on all browsers:
 * npx playwright test
 */

/*
 * Solution 4: Headed vs Headless
 * 
 * Run headed (visible browser):
 * npx playwright test --headed
 * 
 * Run headless (default):
 * npx playwright test
 */

/*
 * Solution 5: Debug Mode
 * 
 * Debug all tests:
 * npx playwright test --debug
 * 
 * Debug specific test:
 * npx playwright test login.spec.ts --debug
 * 
 * Use Playwright Inspector:
 * PWDEBUG=1 npx playwright test
 */

// Solution 6: Test for Running Examples
test.describe('Running Tests Examples', () => {
    
    test('basic test @smoke', async ({ page }) => {
        await page.goto('https://playwright.dev');
        await expect(page).toHaveTitle(/Playwright/);
    });
    
    test('another test @regression', async ({ page }) => {
        await page.goto('https://playwright.dev');
        await expect(page).toHaveURL('https://playwright.dev/');
    });
    
    test.skip('skipped test', async ({ page }) => {
        // This test will be skipped
    });
});

/*
 * Solution 7: Parallel Execution
 * 
 * Run in parallel (default):
 * npx playwright test
 * 
 * Run with specific workers:
 * npx playwright test --workers=4
 * 
 * Run serially:
 * npx playwright test --workers=1
 */

/*
 * Solution 8: Retries
 * 
 * Run with retries:
 * npx playwright test --retries=2
 * 
 * Retry only failed:
 * npx playwright test --retries=2 --last-failed
 */

/*
 * Solution 9: Reporters
 * 
 * Use specific reporter:
 * npx playwright test --reporter=list
 * npx playwright test --reporter=html
 * npx playwright test --reporter=json
 * 
 * Open HTML report:
 * npx playwright show-report
 */

/*
 * Solution 10: UI Mode
 * 
 * Run with UI:
 * npx playwright test --ui
 * 
 * Features:
 * - Watch mode
 * - Time travel debugging
 * - Test filtering
 * - Trace viewing
 */

// Solution 11: Test with Timeout
test('test with custom timeout', async ({ page }) => {
    test.setTimeout(60000); // 60 seconds
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

/*
 * Solution 12: Common CLI Options Summary
 * 
 * npx playwright test
 *   --headed              Run in headed mode
 *   --debug               Debug mode
 *   --ui                  UI mode
 *   --project=chromium    Specific browser
 *   --workers=4           Parallel workers
 *   --retries=2           Retry failed tests
 *   --reporter=html       Use HTML reporter
 *   --grep "pattern"      Filter by name
 *   --grep-invert "skip"  Exclude by name
 *   --timeout=30000       Global timeout
 *   --output=results      Output directory
 *   --trace=on            Enable tracing
 */

// Solution 13: Environment Variables
test('using environment variables', async ({ page }) => {
    // Set via: TEST_URL=https://example.com npx playwright test
    const url = process.env.TEST_URL || 'https://playwright.dev';
    
    await page.goto(url);
    console.log('Testing URL:', url);
});

