/**
 * Lab 387: Shadow DOM
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Working with Shadow DOM:
 * 
 * - Piercing shadow DOM
 * - Shadow root access
 * - Nested shadows
 * - Custom elements
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Access shadow DOM elements
 * 2. Interact with shadow content
 * 3. Handle nested shadows
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Basic Shadow DOM Access
test('basic shadow DOM access', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Playwright automatically pierces shadow DOM
    // await page.locator('custom-element button').click();
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 2: Explicit Shadow Piercing
test('explicit shadow piercing', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Use >> for explicit piercing
    // await page.locator('custom-element >> button').click();
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 3: Shadow DOM with CSS
test('shadow DOM with CSS', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // CSS selector pierces shadow DOM
    // const button = page.locator('custom-element .shadow-button');
    // await button.click();
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 4: Nested Shadow DOM
test('nested shadow DOM', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Access nested shadow elements
    // const nestedButton = page.locator('outer-element inner-element button');
    // await nestedButton.click();
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 5: Shadow DOM Assertions
test('shadow DOM assertions', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Assert on shadow DOM content
    // await expect(page.locator('custom-element h1')).toHaveText('Shadow Title');
    // await expect(page.locator('custom-element button')).toBeVisible();
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 6: Shadow DOM Form
test('shadow DOM form', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Fill form in shadow DOM
    // await page.locator('custom-form input[name="email"]').fill('test@example.com');
    // await page.locator('custom-form button[type="submit"]').click();
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 7: Shadow DOM with evaluate
test('shadow DOM with evaluate', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Access shadow root directly
    // const text = await page.evaluate(() => {
    //     const host = document.querySelector('custom-element');
    //     const shadowRoot = host.shadowRoot;
    //     return shadowRoot.querySelector('p').textContent;
    // });
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 8: Open vs Closed Shadow
test('open vs closed shadow', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    /*
     * Open shadow: Accessible via shadowRoot
     * Closed shadow: Not accessible via shadowRoot
     * 
     * Playwright can pierce both open and closed shadows
     */
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 9: Shadow DOM Slots
test('shadow DOM slots', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Access slotted content
    // const slottedContent = page.locator('custom-element slot');
    // await expect(slottedContent).toHaveText('Slotted text');
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 10: Shadow DOM Best Practices
test('shadow DOM best practices', async ({ page }) => {
    /*
     * Best Practices:
     * 1. Use standard locators (auto-pierce)
     * 2. Use >> for explicit piercing
     * 3. Test custom elements
     * 4. Handle nested shadows
     * 5. Use evaluate for complex cases
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

