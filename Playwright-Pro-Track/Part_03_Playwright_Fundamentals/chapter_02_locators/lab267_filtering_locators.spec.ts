/**
 * Lab 267: Filtering Locators
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Filtering and narrowing locators:
 * 
 * - filter() method
 * - has and hasText options
 * - Chaining filters
 * - Complex filtering
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Filter locators by text
 * 2. Filter by child elements
 * 3. Chain multiple filters
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Filter by Text
test('filter by text', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Filter links containing specific text
    const docsLink = page.locator('a').filter({ hasText: 'Docs' });
    await expect(docsLink.first()).toBeVisible();
    
    // Filter with regex
    const regexFilter = page.locator('a').filter({ hasText: /get started/i });
    await expect(regexFilter).toBeVisible();
});

// Solution 2: Filter by Child Element
test('filter by child element', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Find nav that contains links
    const navWithLinks = page.locator('nav').filter({
        has: page.locator('a')
    });
    await expect(navWithLinks.first()).toBeVisible();
    
    // Find div containing specific element
    const divWithHeading = page.locator('div').filter({
        has: page.locator('h1')
    });
    await expect(divWithHeading.first()).toBeVisible();
});

// Solution 3: Combining has and hasText
test('combining has and hasText', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Filter by both child element and text
    const container = page.locator('div').filter({
        has: page.locator('a'),
        hasText: 'Playwright'
    });
    
    await expect(container.first()).toBeVisible();
});

// Solution 4: Chaining Filters
test('chaining filters', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Chain multiple filter calls
    const filtered = page.locator('a')
        .filter({ hasText: /doc/i })
        .filter({ has: page.locator('[href]') });
    
    await expect(filtered.first()).toBeVisible();
});

// Solution 5: Filter with hasNot
test('filter with hasNot', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Exclude elements containing specific child
    const linksWithoutIcon = page.locator('a').filter({
        hasNot: page.locator('svg')
    });
    
    const count = await linksWithoutIcon.count();
    console.log(`Links without icons: ${count}`);
});

// Solution 6: Filter with hasNotText
test('filter with hasNotText', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Exclude elements with specific text
    const nonDocsLinks = page.locator('nav a').filter({
        hasNotText: 'Docs'
    });
    
    const count = await nonDocsLinks.count();
    console.log(`Non-docs links: ${count}`);
});

// Solution 7: Filter in List Context
test('filter in list context', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Get all navigation links
    const allLinks = page.locator('nav a');
    
    // Filter to find specific one
    const docsLink = allLinks.filter({ hasText: 'Docs' });
    
    await expect(docsLink.first()).toBeVisible();
    await docsLink.first().click();
});

// Solution 8: Complex Filtering
test('complex filtering', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Complex filter combining multiple conditions
    const complexFilter = page.locator('div')
        .filter({ has: page.locator('a') })
        .filter({ hasText: /playwright/i })
        .filter({ hasNot: page.locator('form') });
    
    await expect(complexFilter.first()).toBeVisible();
});

// Solution 9: Filter with Locator Methods
test('filter with locator methods', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Combine filter with first/last/nth
    const links = page.locator('a').filter({ hasText: /doc/i });
    
    const firstMatch = links.first();
    const lastMatch = links.last();
    
    await expect(firstMatch).toBeVisible();
});

// Solution 10: Practical Filtering Examples
test('practical filtering examples', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Example 1: Find active menu item
    // const activeItem = page.locator('.menu-item').filter({
    //     has: page.locator('.active')
    // });
    
    // Example 2: Find row with specific data
    // const userRow = page.locator('tr').filter({
    //     hasText: 'john@example.com'
    // });
    
    // Example 3: Find card with specific title
    // const productCard = page.locator('.card').filter({
    //     has: page.locator('h3', { hasText: 'Product Name' })
    // });
    
    // Example 4: Find visible error messages
    const visibleContent = page.locator('div').filter({
        hasText: 'Playwright'
    });
    
    await expect(visibleContent.first()).toBeVisible();
});

// Solution 11: Filter Best Practices
test('filter best practices', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    /*
     * Best Practices:
     * 1. Start with broad locator, then filter
     * 2. Use hasText for text-based filtering
     * 3. Use has for structural filtering
     * 4. Chain filters for complex conditions
     * 5. Prefer role locators when possible
     */
    
    // Good: Clear and maintainable
    const goodFilter = page.getByRole('navigation')
        .locator('a')
        .filter({ hasText: 'Docs' });
    
    await expect(goodFilter.first()).toBeVisible();
});

