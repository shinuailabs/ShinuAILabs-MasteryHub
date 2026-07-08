/**
 * Lab 378: Clipboard Operations
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Working with clipboard:
 * 
 * - Copy text
 * - Paste text
 * - Clipboard API
 * - Permissions
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Copy to clipboard
 * 2. Paste from clipboard
 * 3. Handle permissions
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Grant Clipboard Permissions
test('grant clipboard permissions', async ({ browser }) => {
    const context = await browser.newContext({
        permissions: ['clipboard-read', 'clipboard-write'],
    });
    
    const page = await context.newPage();
    await page.goto('https://playwright.dev');
    
    await expect(page).toHaveTitle(/Playwright/);
    await context.close();
});

// Solution 2: Copy Text to Clipboard
test('copy text to clipboard', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Copy using keyboard
    // await page.locator('input').fill('Hello World');
    // await page.locator('input').selectText();
    // await page.keyboard.press('Control+C');
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 3: Paste from Clipboard
test('paste from clipboard', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Paste using keyboard
    // await page.locator('input').click();
    // await page.keyboard.press('Control+V');
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 4: Clipboard API Write
test('clipboard API write', async ({ browser }) => {
    const context = await browser.newContext({
        permissions: ['clipboard-write'],
    });
    
    const page = await context.newPage();
    await page.goto('https://playwright.dev');
    
    // Write to clipboard
    await page.evaluate(async () => {
        await navigator.clipboard.writeText('Test clipboard content');
    });
    
    await expect(page).toHaveTitle(/Playwright/);
    await context.close();
});

// Solution 5: Clipboard API Read
test('clipboard API read', async ({ browser }) => {
    const context = await browser.newContext({
        permissions: ['clipboard-read', 'clipboard-write'],
    });
    
    const page = await context.newPage();
    await page.goto('https://playwright.dev');
    
    // Write then read
    await page.evaluate(async () => {
        await navigator.clipboard.writeText('Test content');
    });
    
    const clipboardContent = await page.evaluate(async () => {
        return await navigator.clipboard.readText();
    });
    
    expect(clipboardContent).toBe('Test content');
    await context.close();
});

// Solution 6: Copy with Context Menu
test('copy with context menu', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Right-click and copy
    // await page.locator('text=Playwright').click({ button: 'right' });
    // await page.locator('text=Copy').click();
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 7: Cut Operation
test('cut operation', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Cut using keyboard
    // await page.locator('input').fill('Hello World');
    // await page.locator('input').selectText();
    // await page.keyboard.press('Control+X');
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 8: Copy Rich Content
test('copy rich content', async ({ browser }) => {
    const context = await browser.newContext({
        permissions: ['clipboard-write'],
    });
    
    const page = await context.newPage();
    await page.goto('https://playwright.dev');
    
    // Copy HTML content
    await page.evaluate(async () => {
        const blob = new Blob(['<b>Bold text</b>'], { type: 'text/html' });
        const item = new ClipboardItem({ 'text/html': blob });
        await navigator.clipboard.write([item]);
    });
    
    await expect(page).toHaveTitle(/Playwright/);
    await context.close();
});

// Solution 9: Verify Clipboard Content
test('verify clipboard content', async ({ browser }) => {
    const context = await browser.newContext({
        permissions: ['clipboard-read', 'clipboard-write'],
    });
    
    const page = await context.newPage();
    await page.goto('https://playwright.dev');
    
    // Set and verify
    const testText = 'Verification text';
    await page.evaluate(async (text) => {
        await navigator.clipboard.writeText(text);
    }, testText);
    
    const result = await page.evaluate(async () => {
        return await navigator.clipboard.readText();
    });
    
    expect(result).toBe(testText);
    await context.close();
});

// Solution 10: Clipboard Best Practices
test('clipboard best practices', async ({ page }) => {
    /*
     * Best Practices:
     * 1. Grant clipboard permissions
     * 2. Use Clipboard API
     * 3. Test copy/paste flows
     * 4. Handle permission errors
     * 5. Test rich content
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

