/**
 * Lab 271: Click Actions
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Different click actions in Playwright:
 * 
 * - click()
 * - dblclick()
 * - click options
 * - Force click
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Perform various clicks
 * 2. Use click options
 * 3. Handle click scenarios
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Basic Click
test('basic click', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Simple click
    await page.getByRole('link', { name: 'Get started' }).click();
    
    await expect(page).toHaveURL(/.*intro/);
});

// Solution 2: Double Click
test('double click', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Double click
    const heading = page.locator('h1');
    await heading.dblclick();
    
    // Text might be selected after double click
    await expect(heading).toBeVisible();
});

// Solution 3: Right Click
test('right click', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Right click (context menu)
    const heading = page.locator('h1');
    await heading.click({ button: 'right' });
    
    await expect(heading).toBeVisible();
});

// Solution 4: Middle Click
test('middle click', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Middle click (often opens in new tab)
    const link = page.getByRole('link', { name: 'Docs' });
    await link.click({ button: 'middle' });
    
    // Note: Middle click behavior depends on browser
});

// Solution 5: Click with Modifiers
test('click with modifiers', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const link = page.getByRole('link', { name: 'Docs' });
    
    // Ctrl+Click (Cmd on Mac)
    // await link.click({ modifiers: ['Control'] });
    
    // Shift+Click
    // await link.click({ modifiers: ['Shift'] });
    
    // Multiple modifiers
    // await link.click({ modifiers: ['Control', 'Shift'] });
    
    await link.click();
    await expect(page).toHaveURL(/.*docs/);
});

// Solution 6: Click at Position
test('click at position', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const element = page.locator('h1');
    
    // Click at specific position within element
    await element.click({ position: { x: 10, y: 10 } });
    
    // Click at center (default)
    await element.click();
    
    await expect(element).toBeVisible();
});

// Solution 7: Force Click
test('force click', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Force click bypasses actionability checks
    // Use when element is covered or not interactable
    const element = page.locator('h1');
    await element.click({ force: true });
    
    // Warning: Use sparingly, may indicate test issues
    await expect(element).toBeVisible();
});

// Solution 8: Click with Delay
test('click with delay', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Add delay between mousedown and mouseup
    const link = page.getByRole('link', { name: 'Get started' });
    await link.click({ delay: 100 }); // 100ms delay
    
    await expect(page).toHaveURL(/.*intro/);
});

// Solution 9: Click Count
test('click count', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const heading = page.locator('h1');
    
    // Triple click (select paragraph)
    await heading.click({ clickCount: 3 });
    
    await expect(heading).toBeVisible();
});

// Solution 10: Click with Timeout
test('click with timeout', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Custom timeout for this click
    const link = page.getByRole('link', { name: 'Get started' });
    await link.click({ timeout: 10000 }); // 10 second timeout
    
    await expect(page).toHaveURL(/.*intro/);
});

// Solution 11: No Wait After Click
test('no wait after click', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Don't wait for navigation after click
    const link = page.getByRole('link', { name: 'Get started' });
    await link.click({ noWaitAfter: true });
    
    // Manually wait if needed
    await page.waitForURL(/.*intro/);
});

// Solution 12: Trial Click
test('trial click', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Check if click would work without actually clicking
    const link = page.getByRole('link', { name: 'Get started' });
    await link.click({ trial: true });
    
    // URL should not change with trial
    await expect(page).toHaveURL('https://playwright.dev/');
});

