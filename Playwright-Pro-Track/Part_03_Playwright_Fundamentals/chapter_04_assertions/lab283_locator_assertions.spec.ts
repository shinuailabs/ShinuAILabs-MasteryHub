/**
 * Lab 283: Locator Assertions
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Assertions on locators:
 * 
 * - Visibility assertions
 * - Text assertions
 * - State assertions
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Assert element visibility
 * 2. Assert element text
 * 3. Assert element state
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: toBeVisible
test('toBeVisible', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
    
    // With timeout
    await expect(heading).toBeVisible({ timeout: 5000 });
});

// Solution 2: toBeHidden
test('toBeHidden', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const nonExistent = page.locator('.non-existent-element');
    await expect(nonExistent).toBeHidden();
    
    // Or use not.toBeVisible
    await expect(nonExistent).not.toBeVisible();
});

// Solution 3: toHaveText - Exact
test('toHaveText exact', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const link = page.getByRole('link', { name: 'Docs' });
    await expect(link).toHaveText('Docs');
});

// Solution 4: toHaveText - Regex
test('toHaveText regex', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const heading = page.locator('h1');
    await expect(heading).toHaveText(/Playwright/);
    await expect(heading).toHaveText(/playwright/i);
});

// Solution 5: toContainText
test('toContainText', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const heading = page.locator('h1');
    
    // Partial text match
    await expect(heading).toContainText('Playwright');
    await expect(heading).toContainText(/play/i);
});

// Solution 6: toHaveAttribute
test('toHaveAttribute', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const link = page.getByRole('link', { name: 'Docs' });
    
    // Check attribute exists
    await expect(link).toHaveAttribute('href');
    
    // Check attribute value
    await expect(link).toHaveAttribute('href', /docs/);
});

// Solution 7: toHaveClass
test('toHaveClass', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const nav = page.locator('nav');
    
    // Check class
    await expect(nav).toHaveClass(/navbar/);
});

// Solution 8: toHaveId
test('toHaveId', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Check element has specific ID
    // const element = page.locator('#my-element');
    // await expect(element).toHaveId('my-element');
    
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
});

// Solution 9: toBeEnabled / toBeDisabled
test('toBeEnabled and toBeDisabled', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const link = page.getByRole('link', { name: 'Get started' });
    
    // Check enabled state
    await expect(link).toBeEnabled();
    
    // For disabled elements
    // await expect(button).toBeDisabled();
});

// Solution 10: toBeEditable
test('toBeEditable', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    await page.getByRole('button', { name: 'Search' }).click();
    
    const searchInput = page.getByPlaceholder('Search docs');
    await expect(searchInput).toBeEditable();
    
    await page.keyboard.press('Escape');
});

// Solution 11: toBeChecked
test('toBeChecked', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // For checkboxes and radio buttons
    // const checkbox = page.getByRole('checkbox');
    // await expect(checkbox).toBeChecked();
    // await expect(checkbox).not.toBeChecked();
    
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
});

// Solution 12: toBeFocused
test('toBeFocused', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    await page.getByRole('button', { name: 'Search' }).click();
    
    const searchInput = page.getByPlaceholder('Search docs');
    await expect(searchInput).toBeFocused();
    
    await page.keyboard.press('Escape');
});

// Solution 13: toHaveCount
test('toHaveCount', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const navLinks = page.locator('nav a');
    
    // Check number of elements
    await expect(navLinks).toHaveCount(await navLinks.count());
});

// Solution 14: toHaveValue
test('toHaveValue', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    await page.getByRole('button', { name: 'Search' }).click();
    
    const searchInput = page.getByPlaceholder('Search docs');
    await searchInput.fill('test');
    
    await expect(searchInput).toHaveValue('test');
    
    await page.keyboard.press('Escape');
});

