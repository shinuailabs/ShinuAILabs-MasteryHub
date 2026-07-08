/**
 * Lab 284: Text Assertions
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Text-related assertions:
 * 
 * - Exact text matching
 * - Partial text matching
 * - Regex patterns
 * - Multiple elements
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Assert exact text
 * 2. Assert partial text
 * 3. Use regex patterns
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Exact Text Match
test('exact text match', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const link = page.getByRole('link', { name: 'Docs' });
    await expect(link).toHaveText('Docs');
});

// Solution 2: Partial Text Match
test('partial text match', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const heading = page.locator('h1');
    
    // Contains text
    await expect(heading).toContainText('Playwright');
});

// Solution 3: Case Insensitive Match
test('case insensitive match', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const heading = page.locator('h1');
    
    // Regex with case insensitive flag
    await expect(heading).toHaveText(/playwright/i);
    await expect(heading).toContainText(/PLAYWRIGHT/i);
});

// Solution 4: Regex Patterns
test('regex patterns', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const heading = page.locator('h1');
    
    // Starts with
    await expect(heading).toHaveText(/^Playwright/);
    
    // Ends with
    // await expect(heading).toHaveText(/testing$/);
    
    // Contains word
    await expect(heading).toHaveText(/\bPlaywright\b/);
});

// Solution 5: Whitespace Handling
test('whitespace handling', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const heading = page.locator('h1');
    
    // Playwright normalizes whitespace by default
    // Multiple spaces become single space
    await expect(heading).toContainText('Playwright');
    
    // Use regex for exact whitespace
    // await expect(heading).toHaveText(/Hello\s+World/);
});

// Solution 6: Multiple Elements Text
test('multiple elements text', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const links = page.locator('nav a');
    
    // Check text of multiple elements
    await expect(links).toHaveText([
        /Docs/,
        /API/,
        /Community/,
        /.*/ // Match any for remaining
    ].slice(0, await links.count()));
});

// Solution 7: Empty Text
test('empty text', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Check for empty text
    // await expect(element).toHaveText('');
    // await expect(element).toBeEmpty();
    
    const heading = page.locator('h1');
    await expect(heading).not.toHaveText('');
});

// Solution 8: Text with Special Characters
test('text with special characters', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Escape special regex characters
    // await expect(element).toHaveText('Price: $100');
    // await expect(element).toHaveText(/Price: \$100/);
    
    const heading = page.locator('h1');
    await expect(heading).toContainText('Playwright');
});

// Solution 9: Inner Text vs Text Content
test('inner text vs text content', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const heading = page.locator('h1');
    
    // toHaveText uses textContent (includes hidden text)
    await expect(heading).toHaveText(/Playwright/);
    
    // For visible text only, get innerText
    const innerText = await heading.innerText();
    expect(innerText).toContain('Playwright');
});

// Solution 10: Text in Nested Elements
test('text in nested elements', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Text content includes nested elements
    // <div>Hello <span>World</span></div>
    // toHaveText('Hello World') would match
    
    const container = page.locator('.hero__subtitle').first();
    await expect(container).toContainText(/testing/i);
});

// Solution 11: Trimmed Text
test('trimmed text', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const link = page.getByRole('link', { name: 'Docs' });
    
    // Text is trimmed by default
    await expect(link).toHaveText('Docs');
    
    // Not ' Docs ' with spaces
});

// Solution 12: Text Assertions Best Practices
test('text assertions best practices', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    /*
     * Best Practices:
     * 1. Use toContainText for partial matches
     * 2. Use regex for flexible matching
     * 3. Use case insensitive when appropriate
     * 4. Consider localization
     * 5. Avoid asserting dynamic text
     */
    
    // Good: Flexible match
    await expect(page.locator('h1')).toContainText(/Playwright/i);
    
    // Avoid: Exact match on dynamic content
    // await expect(element).toHaveText('Updated 5 minutes ago');
});

