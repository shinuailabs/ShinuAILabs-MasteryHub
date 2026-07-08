/**
 * Lab 392: Touch Gestures
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Simulating touch gestures:
 * 
 * - Tap
 * - Swipe
 * - Pinch
 * - Long press
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Perform tap gestures
 * 2. Perform swipe gestures
 * 3. Simulate multi-touch
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect, devices } from '@playwright/test';

// Solution 1: Basic Tap
test('basic tap', async ({ browser }) => {
    const iPhone = devices['iPhone 13'];
    const context = await browser.newContext({ ...iPhone });
    const page = await context.newPage();
    
    await page.goto('https://playwright.dev');
    
    // Tap on element
    await page.tap('header');
    
    await expect(page).toHaveTitle(/Playwright/);
    await context.close();
});

// Solution 2: Tap with Coordinates
test('tap with coordinates', async ({ browser }) => {
    const iPhone = devices['iPhone 13'];
    const context = await browser.newContext({ ...iPhone });
    const page = await context.newPage();
    
    await page.goto('https://playwright.dev');
    
    // Tap at specific coordinates
    await page.touchscreen.tap(200, 300);
    
    await expect(page).toHaveTitle(/Playwright/);
    await context.close();
});

// Solution 3: Double Tap
test('double tap', async ({ browser }) => {
    const iPhone = devices['iPhone 13'];
    const context = await browser.newContext({ ...iPhone });
    const page = await context.newPage();
    
    await page.goto('https://playwright.dev');
    
    // Double tap
    await page.tap('header');
    await page.tap('header');
    
    await expect(page).toHaveTitle(/Playwright/);
    await context.close();
});

// Solution 4: Swipe Gesture
test('swipe gesture', async ({ browser }) => {
    const iPhone = devices['iPhone 13'];
    const context = await browser.newContext({ ...iPhone });
    const page = await context.newPage();
    
    await page.goto('https://playwright.dev');
    
    // Swipe using mouse (simulates touch)
    await page.mouse.move(200, 400);
    await page.mouse.down();
    await page.mouse.move(200, 100, { steps: 10 });
    await page.mouse.up();
    
    await expect(page).toHaveTitle(/Playwright/);
    await context.close();
});

// Solution 5: Horizontal Swipe
test('horizontal swipe', async ({ browser }) => {
    const iPhone = devices['iPhone 13'];
    const context = await browser.newContext({ ...iPhone });
    const page = await context.newPage();
    
    await page.goto('https://playwright.dev');
    
    // Swipe left
    await page.mouse.move(300, 400);
    await page.mouse.down();
    await page.mouse.move(50, 400, { steps: 10 });
    await page.mouse.up();
    
    await expect(page).toHaveTitle(/Playwright/);
    await context.close();
});

// Solution 6: Long Press
test('long press', async ({ browser }) => {
    const iPhone = devices['iPhone 13'];
    const context = await browser.newContext({ ...iPhone });
    const page = await context.newPage();
    
    await page.goto('https://playwright.dev');
    
    // Long press simulation
    await page.mouse.move(200, 300);
    await page.mouse.down();
    await page.waitForTimeout(1000); // Hold for 1 second
    await page.mouse.up();
    
    await expect(page).toHaveTitle(/Playwright/);
    await context.close();
});

// Solution 7: Scroll with Touch
test('scroll with touch', async ({ browser }) => {
    const iPhone = devices['iPhone 13'];
    const context = await browser.newContext({ ...iPhone });
    const page = await context.newPage();
    
    await page.goto('https://playwright.dev');
    
    // Scroll down
    await page.evaluate(() => {
        window.scrollBy(0, 500);
    });
    
    await expect(page).toHaveTitle(/Playwright/);
    await context.close();
});

// Solution 8: Touch on Element
test('touch on element', async ({ browser }) => {
    const iPhone = devices['iPhone 13'];
    const context = await browser.newContext({ ...iPhone });
    const page = await context.newPage();
    
    await page.goto('https://playwright.dev');
    
    // Get element position and tap
    const element = page.locator('header');
    const box = await element.boundingBox();
    
    if (box) {
        await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
    }
    
    await expect(page).toHaveTitle(/Playwright/);
    await context.close();
});

// Solution 9: Touch Events
test('touch events', async ({ browser }) => {
    const iPhone = devices['iPhone 13'];
    const context = await browser.newContext({ ...iPhone });
    const page = await context.newPage();
    
    await page.goto('https://playwright.dev');
    
    // Dispatch touch events
    await page.evaluate(() => {
        const element = document.querySelector('header');
        if (element) {
            element.dispatchEvent(new TouchEvent('touchstart', { bubbles: true }));
            element.dispatchEvent(new TouchEvent('touchend', { bubbles: true }));
        }
    });
    
    await expect(page).toHaveTitle(/Playwright/);
    await context.close();
});

// Solution 10: Touch Gestures Best Practices
test('touch gestures best practices', async ({ page }) => {
    /*
     * Best Practices:
     * 1. Enable hasTouch in context
     * 2. Use tap for simple touches
     * 3. Use mouse for complex gestures
     * 4. Test on mobile viewports
     * 5. Consider gesture timing
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

