/**
 * Lab 265: Text-Based Locators
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Using text-based locators:
 * 
 * - getByText
 * - getByLabel
 * - getByPlaceholder
 * - getByTitle
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Use text-based locators
 * 2. Match text patterns
 * 3. Handle case sensitivity
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: getByText
test('getByText locator', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Exact text match
    const exactText = page.getByText('Get started');
    await expect(exactText).toBeVisible();
    
    // Partial text match
    const partialText = page.getByText('started', { exact: false });
    await expect(partialText.first()).toBeVisible();
    
    // Case insensitive with regex
    const caseInsensitive = page.getByText(/get started/i);
    await expect(caseInsensitive).toBeVisible();
});

// Solution 2: getByLabel
test('getByLabel locator', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Find input by its label
    // <label for="email">Email</label>
    // <input id="email" type="email">
    // const emailInput = page.getByLabel('Email');
    
    // Label with regex
    // const input = page.getByLabel(/email/i);
    
    // Exact match
    // const exactLabel = page.getByLabel('Email', { exact: true });
    
    // This is useful for form inputs
    const searchButton = page.getByRole('button', { name: 'Search' });
    await expect(searchButton).toBeVisible();
});

// Solution 3: getByPlaceholder
test('getByPlaceholder locator', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Click search to open search dialog
    await page.getByRole('button', { name: 'Search' }).click();
    
    // Find by placeholder text
    const searchInput = page.getByPlaceholder('Search docs');
    await expect(searchInput).toBeVisible();
    
    // Type in the input
    await searchInput.fill('locators');
    
    // Close search
    await page.keyboard.press('Escape');
});

// Solution 4: getByTitle
test('getByTitle locator', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Find element by title attribute
    // <button title="Close dialog">X</button>
    // const closeButton = page.getByTitle('Close dialog');
    
    // With regex
    // const element = page.getByTitle(/close/i);
    
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible();
});

// Solution 5: getByAltText
test('getByAltText locator', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Find image by alt text
    // <img alt="Playwright logo" src="logo.png">
    // const logo = page.getByAltText('Playwright logo');
    
    // Partial match
    // const image = page.getByAltText(/logo/i);
    
    const nav = page.getByRole('navigation');
    await expect(nav.first()).toBeVisible();
});

// Solution 6: Text Matching Options
test('text matching options', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Exact match (default for getByText)
    const exact = page.getByText('Playwright', { exact: true });
    
    // Substring match
    const substring = page.getByText('Play', { exact: false });
    
    // Regex patterns
    const startsWithPlay = page.getByText(/^Play/);
    const endsWithWright = page.getByText(/wright$/);
    const caseInsensitive = page.getByText(/playwright/i);
    
    await expect(exact.first()).toBeVisible();
});

// Solution 7: Combining Text Locators
test('combining text locators', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Chain with filter
    const navLink = page.getByRole('navigation')
        .getByText('Docs');
    
    // Filter by text
    const filteredLinks = page.locator('a')
        .filter({ hasText: 'Docs' });
    
    await expect(filteredLinks.first()).toBeVisible();
});

// Solution 8: Text in Nested Elements
test('text in nested elements', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // getByText finds text in nested elements too
    // <div>
    //   <span>Hello</span>
    //   <span>World</span>
    // </div>
    // page.getByText('Hello World') would match the div
    
    const container = page.getByText(/Playwright enables/i);
    await expect(container.first()).toBeVisible();
});

// Solution 9: Whitespace Handling
test('whitespace handling', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Playwright normalizes whitespace
    // <div>  Hello   World  </div>
    // page.getByText('Hello World') would match
    
    // For exact whitespace matching, use regex
    // page.getByText(/Hello\s+World/);
    
    const text = page.getByText('Get started');
    await expect(text).toBeVisible();
});

// Solution 10: Best Practices
test('text locator best practices', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    /*
     * Best Practices:
     * 1. Use getByRole when possible (more resilient)
     * 2. Use getByLabel for form inputs
     * 3. Use getByPlaceholder as fallback for inputs
     * 4. Use getByText for static content
     * 5. Prefer exact matches to avoid ambiguity
     * 6. Use regex for flexible matching
     */
    
    // Good: Specific and clear
    const goodLocator = page.getByRole('link', { name: 'Get started' });
    
    // Also good: When role isn't available
    const textLocator = page.getByText('Get started');
    
    await expect(goodLocator).toBeVisible();
});

