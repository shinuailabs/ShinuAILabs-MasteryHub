/**
 * Lab 446: Advanced Patterns Best Practices
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Best practices for advanced patterns:
 * 
 * - Code organization
 * - Test architecture
 * - Maintainability
 * - Scalability
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Apply best practices
 * 2. Organize test code
 * 3. Build scalable tests
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Test Organization
test.describe('Feature: User Authentication', () => {
    test.describe('Login', () => {
        test('should login with valid credentials', async ({ page }) => {
            await page.goto('https://playwright.dev');
            await expect(page).toHaveTitle(/Playwright/);
        });
        
        test('should show error for invalid credentials', async ({ page }) => {
            await page.goto('https://playwright.dev');
            await expect(page).toHaveTitle(/Playwright/);
        });
    });
    
    test.describe('Logout', () => {
        test('should logout successfully', async ({ page }) => {
            await page.goto('https://playwright.dev');
            await expect(page).toHaveTitle(/Playwright/);
        });
    });
});

// Solution 2: Reusable Test Helpers
async function navigateAndVerify(page: any, url: string, titlePattern: RegExp) {
    await page.goto(url);
    await expect(page).toHaveTitle(titlePattern);
}

test('using test helpers', async ({ page }) => {
    await navigateAndVerify(page, 'https://playwright.dev', /Playwright/);
});

// Solution 3: Data-Driven Tests
const testCases = [
    { url: 'https://playwright.dev', title: /Playwright/ },
    { url: 'https://playwright.dev/docs/intro', title: /Installation/ },
];

for (const tc of testCases) {
    test(`should load ${tc.url}`, async ({ page }) => {
        await page.goto(tc.url);
        await expect(page).toHaveTitle(tc.title);
    });
}

// Solution 4: Test Tagging
test('smoke test @smoke', async ({ page }) => {
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

test('regression test @regression', async ({ page }) => {
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 5: Conditional Tests
test('conditional test', async ({ page, browserName }) => {
    test.skip(browserName === 'webkit', 'Skip on WebKit');
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 6: Test Timeouts
test('test with custom timeout', async ({ page }) => {
    test.setTimeout(60000); // 60 seconds
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 7: Soft Assertions
test('soft assertions', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Soft assertions don't stop test execution
    await expect.soft(page).toHaveTitle(/Playwright/);
    await expect.soft(page.locator('body')).toBeVisible();
    
    // Test continues even if soft assertions fail
    console.log('Test completed');
});

// Solution 8: Test Isolation Pattern
test.describe('isolated tests', () => {
    test.beforeEach(async ({ page }) => {
        // Fresh state for each test
        await page.goto('https://playwright.dev');
    });
    
    test('test 1', async ({ page }) => {
        await expect(page).toHaveTitle(/Playwright/);
    });
    
    test('test 2', async ({ page }) => {
        await expect(page.locator('body')).toBeVisible();
    });
});

// Solution 9: Error Handling Pattern
test('error handling pattern', async ({ page }) => {
    try {
        await page.goto('https://playwright.dev');
        await expect(page).toHaveTitle(/Playwright/);
    } catch (error) {
        console.error('Test failed:', (error as Error).message);
        throw error;
    }
});

// Solution 10: Advanced Patterns Summary
test('advanced patterns summary', async ({ page }) => {
    /*
     * Advanced Patterns Best Practices:
     * 
     * Organization:
     * - Group related tests
     * - Use descriptive names
     * - Follow naming conventions
     * 
     * Reusability:
     * - Create helper functions
     * - Use fixtures for setup
     * - Share common utilities
     * 
     * Maintainability:
     * - Keep tests focused
     * - Avoid test interdependence
     * - Document complex logic
     * 
     * Scalability:
     * - Use parallel execution
     * - Implement sharding
     * - Optimize test speed
     * 
     * Reliability:
     * - Handle flaky tests
     * - Use appropriate waits
     * - Implement retries
     * 
     * Reporting:
     * - Use meaningful steps
     * - Attach relevant data
     * - Configure multiple reporters
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

