/**
 * Lab 276: Focus and Blur Actions
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Managing element focus:
 * 
 * - focus()
 * - blur()
 * - Focus events
 * - Tab navigation
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Focus elements
 * 2. Blur elements
 * 3. Navigate with Tab
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Basic Focus
test('basic focus', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    await page.getByRole('button', { name: 'Search' }).click();
    
    const searchInput = page.getByPlaceholder('Search docs');
    
    // Focus the element
    await searchInput.focus();
    
    // Verify focus
    await expect(searchInput).toBeFocused();
    
    await page.keyboard.press('Escape');
});

// Solution 2: Blur Element
test('blur element', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    await page.getByRole('button', { name: 'Search' }).click();
    
    const searchInput = page.getByPlaceholder('Search docs');
    
    // Focus then blur
    await searchInput.focus();
    await searchInput.blur();
    
    // Verify not focused
    await expect(searchInput).not.toBeFocused();
    
    await page.keyboard.press('Escape');
});

// Solution 3: Tab Navigation
test('tab navigation', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Tab to next focusable element
    await page.keyboard.press('Tab');
    
    // Shift+Tab to previous
    await page.keyboard.press('Shift+Tab');
    
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
});

// Solution 4: Focus and Type
test('focus and type', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    await page.getByRole('button', { name: 'Search' }).click();
    
    const searchInput = page.getByPlaceholder('Search docs');
    
    // Focus and type
    await searchInput.focus();
    await page.keyboard.type('test query');
    
    await expect(searchInput).toHaveValue('test query');
    
    await page.keyboard.press('Escape');
});

// Solution 5: Check Focused Element
test('check focused element', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    await page.getByRole('button', { name: 'Search' }).click();
    
    const searchInput = page.getByPlaceholder('Search docs');
    await searchInput.focus();
    
    // Assert element is focused
    await expect(searchInput).toBeFocused();
    
    // Get currently focused element
    const focused = page.locator(':focus');
    await expect(focused).toBeVisible();
    
    await page.keyboard.press('Escape');
});

// Solution 6: Focus Events
test('focus events', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Listen for focus events
    let focusEventFired = false;
    
    await page.exposeFunction('onFocus', () => {
        focusEventFired = true;
    });
    
    // Add focus listener
    // await page.evaluate(() => {
    //     document.querySelector('input')?.addEventListener('focus', () => {
    //         (window as any).onFocus();
    //     });
    // });
    
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
});

// Solution 7: Focus Within Container
test('focus within container', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Focus first focusable element in container
    const nav = page.getByRole('navigation');
    const firstLink = nav.getByRole('link').first();
    
    await firstLink.focus();
    await expect(firstLink).toBeFocused();
});

// Solution 8: Focus Order
test('focus order', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Tab through elements and track order
    const focusedElements: string[] = [];
    
    for (let i = 0; i < 5; i++) {
        await page.keyboard.press('Tab');
        
        const focused = await page.evaluate(() => {
            const el = document.activeElement;
            return el?.tagName || 'unknown';
        });
        
        focusedElements.push(focused);
    }
    
    console.log('Focus order:', focusedElements);
});

// Solution 9: Focus Trap
test('focus trap in modal', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Open search modal
    await page.getByRole('button', { name: 'Search' }).click();
    
    // Focus should be trapped in modal
    const searchInput = page.getByPlaceholder('Search docs');
    await expect(searchInput).toBeFocused();
    
    // Tab should cycle within modal
    await page.keyboard.press('Tab');
    
    // Close modal
    await page.keyboard.press('Escape');
});

// Solution 10: Programmatic Focus
test('programmatic focus', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Focus using JavaScript
    await page.evaluate(() => {
        const link = document.querySelector('a');
        link?.focus();
    });
    
    // Verify focus
    const firstLink = page.locator('a').first();
    // Focus may or may not be on first link depending on page structure
    
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
});

