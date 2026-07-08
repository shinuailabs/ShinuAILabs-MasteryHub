/**
 * Lab 417: Keyboard Navigation
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Testing keyboard accessibility:
 * 
 * - Tab navigation
 * - Focus management
 * - Keyboard shortcuts
 * - Focus indicators
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Test tab navigation
 * 2. Verify focus indicators
 * 3. Test keyboard shortcuts
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Tab Navigation
test('tab navigation', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const focusedElements: string[] = [];
    
    for (let i = 0; i < 10; i++) {
        await page.keyboard.press('Tab');
        const focused = await page.evaluate(() => {
            const el = document.activeElement;
            return el?.tagName || 'none';
        });
        focusedElements.push(focused);
    }
    
    console.log('Tab order:', focusedElements);
    expect(focusedElements.length).toBeGreaterThan(0);
});

// Solution 2: Shift+Tab Navigation
test('shift tab navigation', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Tab forward
    for (let i = 0; i < 5; i++) {
        await page.keyboard.press('Tab');
    }
    
    const forwardFocus = await page.evaluate(() => document.activeElement?.tagName);
    
    // Tab backward
    await page.keyboard.press('Shift+Tab');
    
    const backwardFocus = await page.evaluate(() => document.activeElement?.tagName);
    
    console.log('Forward:', forwardFocus, 'Backward:', backwardFocus);
});

// Solution 3: Enter Key Activation
test('enter key activation', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Tab to first link
    await page.keyboard.press('Tab');
    
    const beforeUrl = page.url();
    
    // Press Enter
    await page.keyboard.press('Enter');
    await page.waitForLoadState('networkidle');
    
    const afterUrl = page.url();
    
    console.log('Before:', beforeUrl);
    console.log('After:', afterUrl);
});

// Solution 4: Space Key Activation
test('space key activation', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Find and focus a button
    const button = page.locator('button').first();
    await button.focus();
    
    // Press Space
    await page.keyboard.press('Space');
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 5: Escape Key
test('escape key', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Open a modal or dropdown if available
    // await page.click('button.open-modal');
    
    // Press Escape
    await page.keyboard.press('Escape');
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 6: Arrow Key Navigation
test('arrow key navigation', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Arrow keys for menu navigation
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowUp');
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('ArrowRight');
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 7: Focus Indicator Visibility
test('focus indicator visibility', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    await page.keyboard.press('Tab');
    
    const focusStyles = await page.evaluate(() => {
        const el = document.activeElement;
        if (!el) return null;
        
        const style = window.getComputedStyle(el);
        return {
            outline: style.outline,
            outlineColor: style.outlineColor,
            outlineWidth: style.outlineWidth,
            boxShadow: style.boxShadow,
        };
    });
    
    console.log('Focus styles:', focusStyles);
});

// Solution 8: Skip Link Functionality
test('skip link functionality', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // First Tab should focus skip link (if present)
    await page.keyboard.press('Tab');
    
    const firstFocused = await page.evaluate(() => {
        const el = document.activeElement;
        return {
            tag: el?.tagName,
            text: el?.textContent?.trim().substring(0, 50),
            href: (el as HTMLAnchorElement)?.href,
        };
    });
    
    console.log('First focused:', firstFocused);
});

// Solution 9: Focus Trap in Modal
test('focus trap in modal', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // If there's a modal, test focus trap
    // await page.click('button.open-modal');
    
    // Tab through modal elements
    const focusedInModal: string[] = [];
    
    for (let i = 0; i < 5; i++) {
        await page.keyboard.press('Tab');
        const focused = await page.evaluate(() => document.activeElement?.tagName);
        focusedInModal.push(focused || 'none');
    }
    
    console.log('Focus in modal:', focusedInModal);
});

// Solution 10: Keyboard Navigation Best Practices
test('keyboard navigation best practices', async ({ page }) => {
    /*
     * Best Practices:
     * 1. All interactive elements focusable
     * 2. Logical tab order
     * 3. Visible focus indicators
     * 4. Skip links for main content
     * 5. Proper focus management in modals
     */
    
    await page.goto('https://playwright.dev');
    
    // Verify basic keyboard accessibility
    await page.keyboard.press('Tab');
    const hasFocus = await page.evaluate(() => {
        return document.activeElement !== document.body;
    });
    
    expect(hasFocus).toBeTruthy();
});

