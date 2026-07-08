/**
 * Lab 255: Writing Your First Test
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Creating your first Playwright test:
 * 
 * - Test structure
 * - Basic assertions
 * - Navigation
 * - Element interaction
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Write a complete test
 * 2. Use assertions
 * 3. Interact with elements
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Basic Test Structure
test('my first Playwright test', async ({ page }) => {
    // Step 1: Navigate to a page
    await page.goto('https://playwright.dev');
    
    // Step 2: Verify page loaded
    await expect(page).toHaveTitle(/Playwright/);
    
    // Step 3: Find an element
    const heading = page.locator('h1');
    
    // Step 4: Assert element state
    await expect(heading).toBeVisible();
});

// Solution 2: Test with Interactions
test('interact with elements', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Click a link
    await page.getByRole('link', { name: 'Get started' }).click();
    
    // Verify navigation
    await expect(page).toHaveURL(/.*intro/);
});

// Solution 3: Test with Form Input
test('fill form fields', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Use search functionality
    await page.getByRole('button', { name: 'Search' }).click();
    
    // Type in search box
    await page.getByPlaceholder('Search docs').fill('locators');
    
    // Verify search results appear
    // await expect(page.locator('.search-result')).toBeVisible();
});

// Solution 4: Multiple Assertions
test('multiple assertions', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Assert page title
    await expect(page).toHaveTitle(/Playwright/);
    
    // Assert URL
    await expect(page).toHaveURL('https://playwright.dev/');
    
    // Assert element visibility
    const logo = page.locator('.navbar__brand');
    await expect(logo).toBeVisible();
    
    // Assert element text
    const tagline = page.locator('.hero__subtitle');
    await expect(tagline).toContainText('testing');
});

// Solution 5: Test with Setup
test.describe('Tests with setup', () => {
    test.beforeEach(async ({ page }) => {
        // Runs before each test
        await page.goto('https://playwright.dev');
    });
    
    test('check homepage', async ({ page }) => {
        await expect(page).toHaveTitle(/Playwright/);
    });
    
    test('check navigation', async ({ page }) => {
        await page.getByRole('link', { name: 'Docs' }).click();
        await expect(page).toHaveURL(/.*docs/);
    });
});

// Solution 6: Test with Cleanup
test.describe('Tests with cleanup', () => {
    test.afterEach(async ({ page }) => {
        // Runs after each test
        console.log('Test completed');
    });
    
    test('example test', async ({ page }) => {
        await page.goto('https://playwright.dev');
    });
});

// Solution 7: Descriptive Test Names
test.describe('Playwright Homepage', () => {
    test('should display the main heading', async ({ page }) => {
        await page.goto('https://playwright.dev');
        const heading = page.locator('h1');
        await expect(heading).toBeVisible();
    });
    
    test('should navigate to documentation', async ({ page }) => {
        await page.goto('https://playwright.dev');
        await page.getByRole('link', { name: 'Docs' }).click();
        await expect(page).toHaveURL(/.*docs/);
    });
});

// Solution 8: Test with Comments
test('well-documented test', async ({ page }) => {
    // Arrange: Set up test conditions
    await page.goto('https://playwright.dev');
    
    // Act: Perform the action
    await page.getByRole('link', { name: 'Get started' }).click();
    
    // Assert: Verify the result
    await expect(page).toHaveURL(/.*intro/);
});

// Solution 9: Handling Async Operations
test('async operations', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // All Playwright operations are async
    // Always use await
    
    const title = await page.title();
    console.log('Page title:', title);
    
    const url = page.url();
    console.log('Current URL:', url);
});

// Solution 10: Complete Example
test('complete first test example', async ({ page }) => {
    // 1. Navigate
    await page.goto('https://playwright.dev');
    
    // 2. Verify initial state
    await expect(page).toHaveTitle(/Playwright/);
    
    // 3. Interact
    await page.getByRole('link', { name: 'Get started' }).click();
    
    // 4. Verify result
    await expect(page).toHaveURL(/.*intro/);
    
    // 5. Additional verification
    const heading = page.locator('h1');
    await expect(heading).toContainText('Installation');
});

