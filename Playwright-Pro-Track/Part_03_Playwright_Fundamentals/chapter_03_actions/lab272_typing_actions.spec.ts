/**
 * Lab 272: Typing Actions
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Text input actions:
 * 
 * - fill()
 * - type()
 * - pressSequentially()
 * - clear()
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Fill form inputs
 * 2. Type with delays
 * 3. Clear input fields
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Basic Fill
test('basic fill', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Open search
    await page.getByRole('button', { name: 'Search' }).click();
    
    // Fill input (clears existing content first)
    const searchInput = page.getByPlaceholder('Search docs');
    await searchInput.fill('locators');
    
    await expect(searchInput).toHaveValue('locators');
    
    await page.keyboard.press('Escape');
});

// Solution 2: Type Character by Character
test('type character by character', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    await page.getByRole('button', { name: 'Search' }).click();
    
    const searchInput = page.getByPlaceholder('Search docs');
    
    // Type with delay between keystrokes
    await searchInput.pressSequentially('test', { delay: 100 });
    
    await expect(searchInput).toHaveValue('test');
    
    await page.keyboard.press('Escape');
});

// Solution 3: Clear Input
test('clear input', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    await page.getByRole('button', { name: 'Search' }).click();
    
    const searchInput = page.getByPlaceholder('Search docs');
    
    // Fill then clear
    await searchInput.fill('some text');
    await searchInput.clear();
    
    await expect(searchInput).toHaveValue('');
    
    await page.keyboard.press('Escape');
});

// Solution 4: Fill vs Type
test('fill vs type difference', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    await page.getByRole('button', { name: 'Search' }).click();
    
    const searchInput = page.getByPlaceholder('Search docs');
    
    // fill() - Instant, clears first, triggers input event
    await searchInput.fill('instant');
    
    // pressSequentially() - Character by character, doesn't clear
    await searchInput.clear();
    await searchInput.pressSequentially('typed');
    
    await page.keyboard.press('Escape');
});

// Solution 5: Keyboard Press
test('keyboard press', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    await page.getByRole('button', { name: 'Search' }).click();
    
    const searchInput = page.getByPlaceholder('Search docs');
    await searchInput.fill('test');
    
    // Press specific keys
    await page.keyboard.press('Enter');
    
    // Or on element
    // await searchInput.press('Enter');
});

// Solution 6: Special Keys
test('special keys', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    await page.getByRole('button', { name: 'Search' }).click();
    
    const searchInput = page.getByPlaceholder('Search docs');
    await searchInput.fill('test');
    
    // Backspace
    await page.keyboard.press('Backspace');
    
    // Delete
    // await page.keyboard.press('Delete');
    
    // Tab
    // await page.keyboard.press('Tab');
    
    // Escape
    await page.keyboard.press('Escape');
});

// Solution 7: Key Combinations
test('key combinations', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    await page.getByRole('button', { name: 'Search' }).click();
    
    const searchInput = page.getByPlaceholder('Search docs');
    await searchInput.fill('test');
    
    // Select all (Ctrl+A or Cmd+A)
    await page.keyboard.press('Control+a');
    
    // Copy (Ctrl+C)
    // await page.keyboard.press('Control+c');
    
    // Paste (Ctrl+V)
    // await page.keyboard.press('Control+v');
    
    await page.keyboard.press('Escape');
});

// Solution 8: Hold and Release Keys
test('hold and release keys', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Hold Shift
    await page.keyboard.down('Shift');
    
    // Type while holding (uppercase)
    await page.keyboard.press('KeyA');
    await page.keyboard.press('KeyB');
    
    // Release Shift
    await page.keyboard.up('Shift');
    
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
});

// Solution 9: Input with Timeout
test('input with timeout', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    await page.getByRole('button', { name: 'Search' }).click();
    
    const searchInput = page.getByPlaceholder('Search docs');
    
    // Fill with custom timeout
    await searchInput.fill('test', { timeout: 5000 });
    
    await page.keyboard.press('Escape');
});

// Solution 10: Force Fill
test('force fill', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    await page.getByRole('button', { name: 'Search' }).click();
    
    const searchInput = page.getByPlaceholder('Search docs');
    
    // Force fill bypasses actionability checks
    await searchInput.fill('test', { force: true });
    
    await page.keyboard.press('Escape');
});

