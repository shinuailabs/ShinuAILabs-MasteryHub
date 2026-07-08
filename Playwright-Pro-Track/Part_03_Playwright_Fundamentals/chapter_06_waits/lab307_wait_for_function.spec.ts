/**
 * Lab 307: Wait for Function
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Waiting for custom conditions:
 * 
 * - waitForFunction()
 * - Custom predicates
 * - Polling options
 * - Page context
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Wait for custom conditions
 * 2. Use polling options
 * 3. Access page context
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Basic Wait for Function
test('basic wait for function', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Wait for condition in page context
    await page.waitForFunction(() => {
        return document.querySelector('h1') !== null;
    });
    
    await expect(page.locator('h1')).toBeVisible();
});

// Solution 2: Wait for Element Text
test('wait for element text', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Wait for specific text
    await page.waitForFunction(() => {
        const h1 = document.querySelector('h1');
        return h1 && h1.textContent?.includes('Playwright');
    });
    
    await expect(page.locator('h1')).toContainText('Playwright');
});

// Solution 3: Wait for Element Count
test('wait for element count', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Wait for minimum number of elements
    await page.waitForFunction(() => {
        return document.querySelectorAll('a').length > 5;
    });
    
    const links = page.locator('a');
    expect(await links.count()).toBeGreaterThan(5);
});

// Solution 4: Wait with Arguments
test('wait with arguments', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const expectedText = 'Playwright';
    
    // Pass arguments to function
    await page.waitForFunction(
        (text) => {
            const h1 = document.querySelector('h1');
            return h1 && h1.textContent?.includes(text);
        },
        expectedText
    );
    
    await expect(page.locator('h1')).toContainText(expectedText);
});

// Solution 5: Wait with Polling
test('wait with polling', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Custom polling interval
    await page.waitForFunction(
        () => document.querySelector('h1') !== null,
        {},
        { polling: 100 } // Check every 100ms
    );
    
    await expect(page.locator('h1')).toBeVisible();
});

// Solution 6: Wait with Timeout
test('wait with timeout', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Custom timeout
    await page.waitForFunction(
        () => document.querySelector('h1') !== null,
        {},
        { timeout: 10000 }
    );
    
    await expect(page.locator('h1')).toBeVisible();
});

// Solution 7: Wait for Window Property
test('wait for window property', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Wait for global variable
    // await page.waitForFunction(() => {
    //     return (window as any).myApp !== undefined;
    // });
    
    // Wait for document ready state
    await page.waitForFunction(() => {
        return document.readyState === 'complete';
    });
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 8: Wait for Animation
test('wait for animation', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Wait for animation to complete
    await page.waitForFunction(() => {
        const element = document.querySelector('h1');
        if (!element) return false;
        
        const style = getComputedStyle(element);
        return style.opacity === '1';
    });
    
    await expect(page.locator('h1')).toBeVisible();
});

// Solution 9: Wait for Network Idle (Custom)
test('wait for network idle custom', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Custom network idle check
    await page.waitForFunction(() => {
        // Check if all images loaded
        const images = document.querySelectorAll('img');
        return Array.from(images).every(img => img.complete);
    });
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 10: Wait for Scroll Position
test('wait for scroll position', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Scroll down
    await page.evaluate(() => window.scrollTo(0, 500));
    
    // Wait for scroll
    await page.waitForFunction(() => {
        return window.scrollY >= 500;
    });
    
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeGreaterThanOrEqual(500);
});

// Solution 11: Wait for Local Storage
test('wait for local storage', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Set local storage
    await page.evaluate(() => {
        localStorage.setItem('test', 'value');
    });
    
    // Wait for local storage value
    await page.waitForFunction(() => {
        return localStorage.getItem('test') === 'value';
    });
    
    const value = await page.evaluate(() => localStorage.getItem('test'));
    expect(value).toBe('value');
});

// Solution 12: Complex Condition
test('complex condition', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Wait for multiple conditions
    await page.waitForFunction(() => {
        const h1 = document.querySelector('h1');
        const nav = document.querySelector('nav');
        const footer = document.querySelector('footer');
        
        return h1 !== null && nav !== null && footer !== null;
    });
    
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('nav')).toBeVisible();
});

