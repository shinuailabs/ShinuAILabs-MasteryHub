/**
 * Lab 302: Wait for Selector
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Waiting for elements:
 * 
 * - waitForSelector()
 * - Element states
 * - Timeout options
 * - Strict mode
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Wait for elements
 * 2. Use different states
 * 3. Handle timeouts
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Basic Wait for Selector
test('basic wait for selector', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Wait for element to appear
    await page.waitForSelector('h1');
    
    await expect(page.locator('h1')).toBeVisible();
});

// Solution 2: Wait for Visible State
test('wait for visible state', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Wait for element to be visible
    await page.waitForSelector('h1', { state: 'visible' });
    
    await expect(page.locator('h1')).toBeVisible();
});

// Solution 3: Wait for Hidden State
test('wait for hidden state', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Wait for element to be hidden
    await page.waitForSelector('.non-existent', { 
        state: 'hidden',
        timeout: 1000,
    });
    
    await expect(page.locator('h1')).toBeVisible();
});

// Solution 4: Wait for Attached State
test('wait for attached state', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Wait for element to be in DOM (may not be visible)
    await page.waitForSelector('h1', { state: 'attached' });
    
    await expect(page.locator('h1')).toBeVisible();
});

// Solution 5: Wait for Detached State
test('wait for detached state', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Wait for element to be removed from DOM
    await page.waitForSelector('.loading-spinner', { 
        state: 'detached',
        timeout: 1000,
    });
    
    await expect(page.locator('h1')).toBeVisible();
});

// Solution 6: Wait with Timeout
test('wait with timeout', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Custom timeout
    await page.waitForSelector('h1', { timeout: 10000 });
    
    await expect(page.locator('h1')).toBeVisible();
});

// Solution 7: Wait for Selector Returns Element
test('wait for selector returns element', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Returns ElementHandle
    const element = await page.waitForSelector('h1');
    
    expect(element).not.toBeNull();
    
    // Can interact with element
    const text = await element!.textContent();
    expect(text).toContain('Playwright');
});

// Solution 8: Locator waitFor Method
test('locator waitFor method', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Preferred: Use locator.waitFor()
    const heading = page.locator('h1');
    await heading.waitFor({ state: 'visible' });
    
    await expect(heading).toBeVisible();
});

// Solution 9: Wait for Multiple Elements
test('wait for multiple elements', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Wait for first matching element
    await page.waitForSelector('nav a');
    
    // All matching elements
    const links = page.locator('nav a');
    await expect(links.first()).toBeVisible();
});

// Solution 10: Strict Mode
test('strict mode', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Strict mode throws if multiple elements match
    // await page.waitForSelector('a', { strict: true }); // Would throw
    
    // Use specific selector
    await page.waitForSelector('h1');
    
    await expect(page.locator('h1')).toBeVisible();
});

// Solution 11: Handle Wait Timeout
test('handle wait timeout', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    try {
        await page.waitForSelector('.non-existent', { timeout: 1000 });
    } catch (error: any) {
        expect(error.message).toContain('Timeout');
    }
    
    await expect(page.locator('h1')).toBeVisible();
});

// Solution 12: Wait for Selector Best Practices
test('wait for selector best practices', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    /*
     * Best Practices:
     * 1. Prefer locator.waitFor() over page.waitForSelector()
     * 2. Use appropriate state
     * 3. Set reasonable timeouts
     * 4. Use specific selectors
     * 5. Handle timeout errors
     */
    
    // Preferred approach
    const heading = page.locator('h1');
    await heading.waitFor();
    await expect(heading).toBeVisible();
});

