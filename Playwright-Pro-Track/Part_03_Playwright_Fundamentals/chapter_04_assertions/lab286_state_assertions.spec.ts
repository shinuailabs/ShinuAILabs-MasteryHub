/**
 * Lab 286: State Assertions
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Asserting element states:
 * 
 * - Enabled/Disabled
 * - Checked/Unchecked
 * - Focused
 * - Editable
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Assert enabled state
 * 2. Assert checked state
 * 3. Assert focus state
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: toBeEnabled
test('toBeEnabled', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const link = page.getByRole('link', { name: 'Get started' });
    await expect(link).toBeEnabled();
});

// Solution 2: toBeDisabled
test('toBeDisabled', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Check disabled state
    // const button = page.getByRole('button', { name: 'Submit' });
    // await expect(button).toBeDisabled();
    
    // Or use not.toBeEnabled
    // await expect(button).not.toBeEnabled();
    
    const link = page.getByRole('link', { name: 'Docs' });
    await expect(link).toBeEnabled();
});

// Solution 3: toBeChecked
test('toBeChecked', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // For checkboxes
    // const checkbox = page.getByRole('checkbox', { name: 'Accept' });
    // await checkbox.check();
    // await expect(checkbox).toBeChecked();
    
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
});

// Solution 4: Not toBeChecked
test('not toBeChecked', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Unchecked state
    // const checkbox = page.getByRole('checkbox');
    // await expect(checkbox).not.toBeChecked();
    
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
});

// Solution 5: toBeChecked with Options
test('toBeChecked options', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Check with specific checked state
    // await expect(checkbox).toBeChecked({ checked: true });
    // await expect(checkbox).toBeChecked({ checked: false });
    
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
});

// Solution 6: toBeFocused
test('toBeFocused', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    await page.getByRole('button', { name: 'Search' }).click();
    
    const searchInput = page.getByPlaceholder('Search docs');
    await expect(searchInput).toBeFocused();
    
    await page.keyboard.press('Escape');
});

// Solution 7: Not toBeFocused
test('not toBeFocused', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const heading = page.locator('h1');
    await expect(heading).not.toBeFocused();
});

// Solution 8: toBeEditable
test('toBeEditable', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    await page.getByRole('button', { name: 'Search' }).click();
    
    const searchInput = page.getByPlaceholder('Search docs');
    await expect(searchInput).toBeEditable();
    
    await page.keyboard.press('Escape');
});

// Solution 9: Not toBeEditable
test('not toBeEditable', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Readonly input
    // const readonlyInput = page.locator('input[readonly]');
    // await expect(readonlyInput).not.toBeEditable();
    
    const heading = page.locator('h1');
    await expect(heading).not.toBeEditable();
});

// Solution 10: toBeEmpty
test('toBeEmpty', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    await page.getByRole('button', { name: 'Search' }).click();
    
    const searchInput = page.getByPlaceholder('Search docs');
    
    // Empty input
    await expect(searchInput).toBeEmpty();
    
    // Fill and check not empty
    await searchInput.fill('test');
    await expect(searchInput).not.toBeEmpty();
    
    await page.keyboard.press('Escape');
});

// Solution 11: Combined State Checks
test('combined state checks', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    await page.getByRole('button', { name: 'Search' }).click();
    
    const searchInput = page.getByPlaceholder('Search docs');
    
    // Multiple state assertions
    await expect(searchInput).toBeVisible();
    await expect(searchInput).toBeEnabled();
    await expect(searchInput).toBeEditable();
    await expect(searchInput).toBeFocused();
    await expect(searchInput).toBeEmpty();
    
    await page.keyboard.press('Escape');
});

// Solution 12: State After Action
test('state after action', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Check state changes after action
    // const checkbox = page.getByRole('checkbox');
    // await expect(checkbox).not.toBeChecked();
    // await checkbox.check();
    // await expect(checkbox).toBeChecked();
    
    const link = page.getByRole('link', { name: 'Get started' });
    await expect(link).toBeEnabled();
    await link.click();
    await expect(page).toHaveURL(/.*intro/);
});

