/**
 * Lab 275: Keyboard Actions
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Keyboard interactions:
 * 
 * - Key press
 * - Key combinations
 * - Special keys
 * - Keyboard shortcuts
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Press various keys
 * 2. Use key combinations
 * 3. Handle special keys
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Basic Key Press
test('basic key press', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Press a key
    await page.keyboard.press('Tab');
    
    // Press Enter
    await page.keyboard.press('Enter');
    
    // Press Escape
    await page.keyboard.press('Escape');
    
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
});

// Solution 2: Press on Element
test('press on element', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    await page.getByRole('button', { name: 'Search' }).click();
    
    const searchInput = page.getByPlaceholder('Search docs');
    await searchInput.fill('test');
    
    // Press key on specific element
    await searchInput.press('Enter');
    
    await page.keyboard.press('Escape');
});

// Solution 3: Key Combinations
test('key combinations', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Ctrl+A (Select All)
    await page.keyboard.press('Control+a');
    
    // Ctrl+C (Copy)
    await page.keyboard.press('Control+c');
    
    // Ctrl+V (Paste)
    await page.keyboard.press('Control+v');
    
    // Ctrl+Z (Undo)
    await page.keyboard.press('Control+z');
    
    // Ctrl+Shift+Z (Redo)
    await page.keyboard.press('Control+Shift+z');
    
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
});

// Solution 4: Special Keys
test('special keys', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Arrow keys
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowUp');
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('ArrowRight');
    
    // Function keys
    await page.keyboard.press('F1');
    // await page.keyboard.press('F5'); // Refresh
    
    // Other special keys
    await page.keyboard.press('Home');
    await page.keyboard.press('End');
    await page.keyboard.press('PageDown');
    await page.keyboard.press('PageUp');
    
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
});

// Solution 5: Hold and Release Keys
test('hold and release keys', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Hold Shift
    await page.keyboard.down('Shift');
    
    // Press keys while Shift is held
    await page.keyboard.press('Tab'); // Shift+Tab
    
    // Release Shift
    await page.keyboard.up('Shift');
    
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
});

// Solution 6: Type Text
test('type text', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    await page.getByRole('button', { name: 'Search' }).click();
    
    const searchInput = page.getByPlaceholder('Search docs');
    
    // Type text (inserts at cursor)
    await searchInput.focus();
    await page.keyboard.type('hello world');
    
    await expect(searchInput).toHaveValue('hello world');
    
    await page.keyboard.press('Escape');
});

// Solution 7: Type with Delay
test('type with delay', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    await page.getByRole('button', { name: 'Search' }).click();
    
    const searchInput = page.getByPlaceholder('Search docs');
    await searchInput.focus();
    
    // Type with delay between keystrokes
    await page.keyboard.type('slow typing', { delay: 100 });
    
    await page.keyboard.press('Escape');
});

// Solution 8: Insert Text
test('insert text', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    await page.getByRole('button', { name: 'Search' }).click();
    
    const searchInput = page.getByPlaceholder('Search docs');
    await searchInput.focus();
    
    // Insert text (doesn't trigger key events)
    await page.keyboard.insertText('inserted text');
    
    await page.keyboard.press('Escape');
});

// Solution 9: Keyboard Shortcuts
test('keyboard shortcuts', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Open search with keyboard shortcut
    await page.keyboard.press('Control+k');
    // or
    // await page.keyboard.press('Meta+k'); // Mac
    
    // Close with Escape
    await page.keyboard.press('Escape');
    
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
});

// Solution 10: Platform-Specific Keys
test('platform specific keys', async ({ page, browserName }) => {
    await page.goto('https://playwright.dev');
    
    // Use Meta for Mac, Control for others
    const modifier = process.platform === 'darwin' ? 'Meta' : 'Control';
    
    // Platform-aware shortcut
    await page.keyboard.press(`${modifier}+a`);
    
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
});

