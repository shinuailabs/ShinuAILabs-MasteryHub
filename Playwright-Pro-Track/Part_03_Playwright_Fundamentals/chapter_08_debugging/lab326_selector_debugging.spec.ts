/**
 * Lab 326: Selector Debugging
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Debugging selectors:
 * 
 * - Locator highlight
 * - Selector playground
 * - Testing selectors
 * - Common issues
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Debug selectors
 * 2. Use selector tools
 * 3. Fix selector issues
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Highlight Locator
test('highlight locator', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Highlight element for debugging
    // await page.locator('h1').highlight();
    
    // Pause to see highlight
    // await page.pause();
    
    await expect(page.locator('h1')).toBeVisible();
});

// Solution 2: Count Elements
test('count elements', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Check how many elements match
    const count = await page.locator('a').count();
    console.log(`Found ${count} links`);
    
    // Verify selector matches expected count
    expect(count).toBeGreaterThan(0);
});

// Solution 3: Get All Matching Elements
test('get all matching elements', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Get all matching elements
    const links = page.locator('nav a');
    const count = await links.count();
    
    console.log(`Found ${count} nav links:`);
    for (let i = 0; i < count; i++) {
        const text = await links.nth(i).textContent();
        console.log(`  ${i}: ${text}`);
    }
});

// Solution 4: Test Selector in Console
test('test selector in console', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    /*
     * Test selectors in browser console:
     * 
     * document.querySelector('h1')
     * document.querySelectorAll('a')
     * 
     * Or use Playwright's $ and $$:
     * playwright.$('h1')
     * playwright.$$('a')
     */
    
    await expect(page.locator('h1')).toBeVisible();
});

// Solution 5: Evaluate Selector
test('evaluate selector', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Evaluate selector in page context
    const exists = await page.evaluate(() => {
        return document.querySelector('h1') !== null;
    });
    
    console.log('h1 exists:', exists);
    expect(exists).toBe(true);
});

// Solution 6: Debug Strict Mode
test('debug strict mode', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Strict mode throws if multiple elements match
    // Use .first(), .last(), or .nth() to be specific
    
    // This would throw in strict mode:
    // await page.locator('a').click();
    
    // Use specific locator:
    await page.locator('a').first().click();
    
    await expect(page.locator('body')).toBeVisible();
});

// Solution 7: Debug Visibility
test('debug visibility', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const heading = page.locator('h1');
    
    // Check visibility
    const isVisible = await heading.isVisible();
    const isHidden = await heading.isHidden();
    const isEnabled = await heading.isEnabled();
    
    console.log('Visible:', isVisible);
    console.log('Hidden:', isHidden);
    console.log('Enabled:', isEnabled);
});

// Solution 8: Debug Bounding Box
test('debug bounding box', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const heading = page.locator('h1');
    
    // Get element position and size
    const box = await heading.boundingBox();
    console.log('Bounding box:', box);
    
    expect(box).not.toBeNull();
});

// Solution 9: Debug Attributes
test('debug attributes', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const link = page.locator('a').first();
    
    // Get attributes
    const href = await link.getAttribute('href');
    const className = await link.getAttribute('class');
    
    console.log('href:', href);
    console.log('class:', className);
});

// Solution 10: Debug Text Content
test('debug text content', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const heading = page.locator('h1');
    
    // Get text content
    const text = await heading.textContent();
    const innerText = await heading.innerText();
    
    console.log('textContent:', text);
    console.log('innerText:', innerText);
});

// Solution 11: Selector Playground
test('selector playground', async ({ page }) => {
    /*
     * Use Playwright Inspector:
     * PWDEBUG=1 npx playwright test
     * 
     * Or VS Code extension:
     * Click "Pick Locator" button
     */
    
    await page.goto('https://playwright.dev');
    await expect(page.locator('h1')).toBeVisible();
});

// Solution 12: Selector Debugging Best Practices
test('selector debugging best practices', async ({ page }) => {
    /*
     * Best Practices:
     * 1. Use highlight() to visualize
     * 2. Check element count
     * 3. Verify visibility
     * 4. Use specific selectors
     * 5. Test in browser console
     * 6. Use Playwright Inspector
     */
    
    await page.goto('https://playwright.dev');
    await expect(page.locator('h1')).toBeVisible();
});

