/**
 * Lab 261: Locator Basics
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Understanding Playwright locators:
 * 
 * - What are locators
 * - Locator vs ElementHandle
 * - Auto-waiting behavior
 * - Strictness
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create basic locators
 * 2. Understand auto-waiting
 * 3. Use strict mode
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Creating Locators
test('creating locators', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Locators are created but don't query DOM yet
    const heading = page.locator('h1');
    const link = page.locator('a');
    
    // DOM is queried when action is performed
    await expect(heading).toBeVisible();
});

// Solution 2: Locator Auto-Waiting
test('locator auto-waiting', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Playwright automatically waits for:
    // - Element to be attached to DOM
    // - Element to be visible
    // - Element to be stable (not animating)
    // - Element to be enabled
    // - Element to receive events
    
    const button = page.getByRole('link', { name: 'Get started' });
    await button.click(); // Auto-waits before clicking
});

// Solution 3: Locator Strictness
test('locator strictness', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // By default, locators are strict
    // They throw if multiple elements match
    
    // This would throw if multiple h1 elements exist
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
    
    // Use .first(), .last(), .nth() for multiple matches
    const links = page.locator('a');
    await expect(links.first()).toBeVisible();
});

// Solution 4: Locator vs ElementHandle
test('locator vs element handle', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Locator (recommended): Re-queries DOM each time
    const locator = page.locator('h1');
    await expect(locator).toBeVisible();
    await expect(locator).toHaveText(/Playwright/);
    
    // ElementHandle (legacy): Snapshot of element
    // const handle = await page.$('h1');
    // Can become stale if DOM changes
});

// Solution 5: Chaining Locators
test('chaining locators', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Chain locators to narrow down
    const nav = page.locator('nav');
    const navLinks = nav.locator('a');
    
    await expect(navLinks.first()).toBeVisible();
});

// Solution 6: Locator Count
test('locator count', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const links = page.locator('nav a');
    const count = await links.count();
    
    console.log(`Found ${count} navigation links`);
    expect(count).toBeGreaterThan(0);
});

// Solution 7: Locator All
test('locator all', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const links = page.locator('nav a');
    const allLinks = await links.all();
    
    for (const link of allLinks) {
        const text = await link.textContent();
        console.log('Link:', text);
    }
});

// Solution 8: Filtering Locators
test('filtering locators', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Filter by text
    const links = page.locator('a').filter({ hasText: 'Docs' });
    await expect(links.first()).toBeVisible();
    
    // Filter by another locator
    const navWithLinks = page.locator('nav').filter({
        has: page.locator('a')
    });
    await expect(navWithLinks).toBeVisible();
});

// Solution 9: Locator Evaluation
test('locator evaluation', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const heading = page.locator('h1');
    
    // Get text content
    const text = await heading.textContent();
    console.log('Heading text:', text);
    
    // Get attribute
    const className = await heading.getAttribute('class');
    console.log('Class:', className);
    
    // Check visibility
    const isVisible = await heading.isVisible();
    console.log('Is visible:', isVisible);
});

// Solution 10: Best Practices
test('locator best practices', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Prefer user-facing locators
    // Good:
    await page.getByRole('link', { name: 'Get started' }).click();
    
    // Avoid:
    // await page.locator('.hero__button').click();
    
    // Use specific locators
    // Good:
    const heading = page.getByRole('heading', { level: 1 });
    
    // Avoid:
    // const heading = page.locator('h1');
    
    await expect(heading).toBeVisible();
});

