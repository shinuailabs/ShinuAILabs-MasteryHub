/**
 * Lab 251: What is Playwright?
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Introduction to Playwright:
 * 
 * - Modern web testing framework
 * - Cross-browser support
 * - Auto-wait capabilities
 * - Key features
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Understand Playwright basics
 * 2. Learn key features
 * 3. Write first test
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Basic Test Structure
test.describe('Introduction to Playwright', () => {
    
    // Solution 2: First Playwright Test
    test('should navigate to a website', async ({ page }) => {
        // Navigate to URL
        await page.goto('https://playwright.dev');
        
        // Verify page title
        await expect(page).toHaveTitle(/Playwright/);
    });
    
    // Solution 3: Understanding Auto-Wait
    test('auto-wait demonstration', async ({ page }) => {
        await page.goto('https://playwright.dev');
        
        // Playwright automatically waits for elements
        // No need for explicit waits in most cases
        const getStarted = page.getByRole('link', { name: 'Get started' });
        
        // Auto-waits for element to be visible and clickable
        await getStarted.click();
        
        // Auto-waits for URL to change
        await expect(page).toHaveURL(/.*intro/);
    });
    
    // Solution 4: Cross-Browser Testing
    test('works across browsers', async ({ page, browserName }) => {
        await page.goto('https://playwright.dev');
        
        console.log(`Running on: ${browserName}`);
        
        // Same test works on Chromium, Firefox, WebKit
        await expect(page).toHaveTitle(/Playwright/);
    });
    
    // Solution 5: Key Features Demo
    test('key features demonstration', async ({ page }) => {
        // Feature 1: Network interception
        await page.route('**/*.png', route => route.abort());
        
        // Feature 2: Multiple contexts
        await page.goto('https://playwright.dev');
        
        // Feature 3: Powerful selectors
        const heading = page.locator('h1');
        await expect(heading).toBeVisible();
        
        // Feature 4: Screenshots
        await page.screenshot({ path: 'screenshot.png' });
    });
});

// Solution 6: Playwright Benefits
/*
 * Why Playwright?
 * 
 * 1. Auto-waiting - No flaky tests due to timing
 * 2. Cross-browser - Chromium, Firefox, WebKit
 * 3. Cross-platform - Windows, macOS, Linux
 * 4. Mobile emulation - Test mobile viewports
 * 5. Network control - Mock APIs, intercept requests
 * 6. Tracing - Debug with trace viewer
 * 7. Codegen - Generate tests by recording
 * 8. TypeScript - First-class support
 */

// Solution 7: Comparison with Other Tools
/*
 * Playwright vs Selenium:
 * - Faster execution
 * - Better auto-waiting
 * - Modern API
 * - Built-in assertions
 * 
 * Playwright vs Cypress:
 * - Multi-browser support
 * - Multi-tab/window support
 * - Better iframe handling
 * - Network interception
 */

// Solution 8: Test Annotations
test.describe('Test Annotations', () => {
    test.skip('skip this test', async ({ page }) => {
        // This test will be skipped
    });
    
    test('conditional skip', async ({ page, browserName }) => {
        test.skip(browserName === 'firefox', 'Firefox not supported');
        await page.goto('https://playwright.dev');
    });
    
    test.fixme('known broken test', async ({ page }) => {
        // Mark as fixme - will be skipped
    });
});

// Solution 9: Test Tags
test('tagged test @smoke', async ({ page }) => {
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 10: Summary
/*
 * Playwright is a modern end-to-end testing framework that:
 * - Supports all modern browsers
 * - Has powerful auto-wait capabilities
 * - Provides excellent developer experience
 * - Includes built-in test runner
 * - Offers great debugging tools
 */

