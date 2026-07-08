/**
 * Lab 308: Wait for Timeout
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Fixed time waits:
 * 
 * - waitForTimeout()
 * - When to use
 * - Alternatives
 * - Anti-patterns
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Understand timeout waits
 * 2. Know when to use
 * 3. Learn alternatives
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Basic Timeout Wait
test('basic timeout wait', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Wait for fixed time (use sparingly!)
    await page.waitForTimeout(1000); // 1 second
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 2: Short Delay
test('short delay', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Short delay for visual debugging
    await page.waitForTimeout(500);
    
    await expect(page.locator('h1')).toBeVisible();
});

// Solution 3: When Timeout is Acceptable
test('when timeout is acceptable', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    /*
     * Acceptable uses of waitForTimeout:
     * 1. Debugging/development
     * 2. Rate limiting (API calls)
     * 3. Animation timing (when no other option)
     * 4. Third-party integrations
     */
    
    // Example: Wait for animation
    await page.waitForTimeout(300);
    
    await expect(page.locator('h1')).toBeVisible();
});

// Solution 4: Better Alternative - Wait for Element
test('better alternative - element', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Bad: Fixed wait
    // await page.waitForTimeout(2000);
    
    // Good: Wait for element
    await expect(page.locator('h1')).toBeVisible();
});

// Solution 5: Better Alternative - Wait for Network
test('better alternative - network', async ({ page }) => {
    // Bad: Fixed wait for API
    // await page.waitForTimeout(3000);
    
    // Good: Wait for response
    const responsePromise = page.waitForResponse(/playwright/);
    await page.goto('https://playwright.dev');
    await responsePromise;
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 6: Better Alternative - Wait for Load State
test('better alternative - load state', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Bad: Fixed wait for page load
    // await page.waitForTimeout(5000);
    
    // Good: Wait for load state
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 7: Better Alternative - Wait for Function
test('better alternative - function', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Bad: Fixed wait for condition
    // await page.waitForTimeout(2000);
    
    // Good: Wait for condition
    await page.waitForFunction(() => {
        return document.querySelector('h1') !== null;
    });
    
    await expect(page.locator('h1')).toBeVisible();
});

// Solution 8: Debugging with Timeout
test('debugging with timeout', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Useful for debugging - see state at this point
    // Remove before committing!
    // await page.waitForTimeout(5000);
    
    await expect(page.locator('h1')).toBeVisible();
});

// Solution 9: Rate Limiting
test('rate limiting', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Acceptable: Rate limiting API calls
    for (let i = 0; i < 3; i++) {
        // await page.click('#api-button');
        await page.waitForTimeout(100); // Rate limit
    }
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 10: Animation Timing
test('animation timing', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Sometimes needed for CSS animations
    // Better: Use waitForFunction to check animation state
    
    // await page.click('#animate-button');
    // await page.waitForTimeout(300); // Animation duration
    
    // Better approach:
    await page.waitForFunction(() => {
        const h1 = document.querySelector('h1');
        if (!h1) return false;
        const style = getComputedStyle(h1);
        return style.opacity === '1';
    });
    
    await expect(page.locator('h1')).toBeVisible();
});

// Solution 11: Anti-Pattern Examples
test('anti-pattern examples', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    /*
     * Anti-patterns (avoid these):
     * 
     * 1. await page.waitForTimeout(5000);
     *    await page.click('button');
     *    
     * 2. await page.waitForTimeout(10000); // "Just to be safe"
     * 
     * 3. for (let i = 0; i < 10; i++) {
     *        await page.waitForTimeout(1000);
     *        if (await page.isVisible('element')) break;
     *    }
     */
    
    // Good pattern
    await expect(page.locator('h1')).toBeVisible();
});

// Solution 12: Timeout Best Practices
test('timeout best practices', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    /*
     * Best Practices:
     * 1. Avoid waitForTimeout in production tests
     * 2. Use element/network/function waits instead
     * 3. If needed, keep timeouts short
     * 4. Document why timeout is necessary
     * 5. Remove debug timeouts before commit
     */
    
    await expect(page.locator('h1')).toBeVisible();
});

