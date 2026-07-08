/**
 * Lab 350: Test Organization Best Practices
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Best practices for test organization:
 * 
 * - File structure
 * - Naming conventions
 * - Test grouping
 * - Maintainability
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Apply organization best practices
 * 2. Structure test files
 * 3. Use naming conventions
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: File Structure
test('file structure', async ({ page }) => {
    /*
     * Recommended structure:
     * 
     * tests/
     * ├── e2e/
     * │   ├── auth/
     * │   │   ├── login.spec.ts
     * │   │   └── logout.spec.ts
     * │   ├── checkout/
     * │   │   ├── cart.spec.ts
     * │   │   └── payment.spec.ts
     * │   └── home/
     * │       └── homepage.spec.ts
     * ├── api/
     * │   └── users.spec.ts
     * └── fixtures/
     *     └── test-data.json
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 2: Naming Conventions
test('naming conventions', async ({ page }) => {
    /*
     * File naming:
     * - feature.spec.ts
     * - feature-name.spec.ts
     * 
     * Test naming:
     * - should [action] when [condition]
     * - [feature] - [scenario]
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 3: Describe Organization
test.describe('Feature: Homepage', () => {
    test.describe('Navigation', () => {
        test('should display header', async ({ page }) => {
            await page.goto('https://playwright.dev');
            await expect(page.locator('nav')).toBeVisible();
        });
        
        test('should display footer', async ({ page }) => {
            await page.goto('https://playwright.dev');
            await expect(page.locator('footer')).toBeVisible();
        });
    });
    
    test.describe('Content', () => {
        test('should display heading', async ({ page }) => {
            await page.goto('https://playwright.dev');
            await expect(page.locator('h1')).toBeVisible();
        });
    });
});

// Solution 4: Test Independence
test.describe('Independent Tests', () => {
    // Each test should be independent
    test('test 1 - no dependencies', async ({ page }) => {
        await page.goto('https://playwright.dev');
        await expect(page).toHaveTitle(/Playwright/);
    });
    
    test('test 2 - no dependencies', async ({ page }) => {
        await page.goto('https://playwright.dev');
        await expect(page.locator('h1')).toBeVisible();
    });
});

// Solution 5: Common Setup
test.describe('Common Setup', () => {
    test.beforeEach(async ({ page }) => {
        // Common setup for all tests
        await page.goto('https://playwright.dev');
    });
    
    test('verify title', async ({ page }) => {
        await expect(page).toHaveTitle(/Playwright/);
    });
    
    test('verify heading', async ({ page }) => {
        await expect(page.locator('h1')).toBeVisible();
    });
});

// Solution 6: Test Data Management
test('test data management', async ({ page }) => {
    /*
     * Test data options:
     * 1. Inline data for simple tests
     * 2. Constants file for shared data
     * 3. JSON files for complex data
     * 4. Fixtures for dynamic data
     */
    
    const testData = {
        url: 'https://playwright.dev',
        expectedTitle: /Playwright/,
    };
    
    await page.goto(testData.url);
    await expect(page).toHaveTitle(testData.expectedTitle);
});

// Solution 7: Helper Functions
async function navigateAndVerify(page: any, url: string, title: RegExp) {
    await page.goto(url);
    await expect(page).toHaveTitle(title);
}

test('helper functions', async ({ page }) => {
    await navigateAndVerify(page, 'https://playwright.dev', /Playwright/);
});

// Solution 8: Tags for Organization
test('smoke test @smoke @critical', async ({ page }) => {
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

test('regression test @regression', async ({ page }) => {
    await page.goto('https://playwright.dev');
    await expect(page.locator('h1')).toBeVisible();
});

// Solution 9: Documentation
test('documented test', async ({ page }) => {
    /*
     * Test: Verify homepage loads correctly
     * 
     * Prerequisites:
     * - None
     * 
     * Steps:
     * 1. Navigate to homepage
     * 2. Verify title
     * 
     * Expected Result:
     * - Page title contains "Playwright"
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 10: Organization Best Practices Summary
test('organization best practices summary', async ({ page }) => {
    /*
     * Best Practices Summary:
     * 
     * 1. Structure: Organize by feature/module
     * 2. Naming: Use clear, descriptive names
     * 3. Independence: Tests should not depend on each other
     * 4. Setup: Use hooks for common setup
     * 5. Data: Manage test data separately
     * 6. Helpers: Extract reusable functions
     * 7. Tags: Use tags for filtering
     * 8. Documentation: Document complex tests
     * 9. Maintenance: Review and refactor regularly
     * 10. Consistency: Follow team conventions
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

