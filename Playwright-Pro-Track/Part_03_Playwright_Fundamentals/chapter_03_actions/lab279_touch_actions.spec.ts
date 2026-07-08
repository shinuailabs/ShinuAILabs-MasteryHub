/**
 * Lab 279: Touch Actions
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Touch interactions for mobile:
 * 
 * - tap()
 * - Touch gestures
 * - Mobile emulation
 * - Touch events
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Perform tap actions
 * 2. Emulate touch gestures
 * 3. Test mobile interactions
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect, devices } from '@playwright/test';

// Solution 1: Basic Tap
test('basic tap', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Tap is like click for touch devices
    const link = page.getByRole('link', { name: 'Get started' });
    await link.tap();
    
    await expect(page).toHaveURL(/.*intro/);
});

// Solution 2: Tap with Options
test('tap with options', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const element = page.locator('h1');
    
    // Tap at specific position
    await element.tap({ position: { x: 10, y: 10 } });
    
    // Force tap
    await element.tap({ force: true });
    
    // Tap with timeout
    await element.tap({ timeout: 5000 });
    
    await expect(element).toBeVisible();
});

// Solution 3: Mobile Device Emulation
test.describe('Mobile Touch Tests', () => {
    test.use({ ...devices['iPhone 13'] });
    
    test('tap on mobile', async ({ page }) => {
        await page.goto('https://playwright.dev');
        
        // Tap works naturally on mobile emulation
        const link = page.getByRole('link', { name: 'Get started' });
        await link.tap();
        
        await expect(page).toHaveURL(/.*intro/);
    });
});

// Solution 4: Touch Screen API
test('touch screen API', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Use touchscreen for low-level touch
    await page.touchscreen.tap(100, 100);
    
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
});

// Solution 5: Swipe Gesture
test('swipe gesture', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Simulate swipe using touchscreen
    // Start touch
    // await page.touchscreen.tap(200, 300);
    
    // Move (swipe)
    // This requires manual implementation
    // Playwright doesn't have built-in swipe
    
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
});

// Solution 6: Long Press
test('long press', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const element = page.locator('h1');
    
    // Simulate long press with delay
    await element.tap({ delay: 500 }); // Hold for 500ms
    
    await expect(element).toBeVisible();
});

// Solution 7: Double Tap
test('double tap', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const element = page.locator('h1');
    
    // Double tap
    await element.dblclick(); // Works for touch too
    
    // Or manual double tap
    await element.tap();
    await element.tap();
    
    await expect(element).toBeVisible();
});

// Solution 8: Touch with Modifiers
test('touch with modifiers', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const element = page.locator('h1');
    
    // Tap with modifiers
    await element.tap({ modifiers: ['Shift'] });
    
    await expect(element).toBeVisible();
});

// Solution 9: Pinch Zoom (Simulated)
test('pinch zoom simulated', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Pinch zoom requires custom implementation
    // Using evaluate to trigger zoom
    await page.evaluate(() => {
        // Simulate zoom by changing viewport meta
        // or using CSS transform
        document.body.style.transform = 'scale(1.5)';
    });
    
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
});

// Solution 10: Touch Events
test('touch events', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Listen for touch events
    await page.evaluate(() => {
        document.addEventListener('touchstart', (e) => {
            console.log('Touch start:', e.touches.length);
        });
        
        document.addEventListener('touchend', (e) => {
            console.log('Touch end');
        });
        
        document.addEventListener('touchmove', (e) => {
            console.log('Touch move');
        });
    });
    
    // Perform touch action
    await page.touchscreen.tap(100, 100);
    
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
});

// Solution 11: Scroll with Touch
test('scroll with touch', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Scroll using mouse wheel (works for touch too)
    await page.mouse.wheel(0, 500);
    
    // Or scroll element into view
    const footer = page.locator('footer');
    await footer.scrollIntoViewIfNeeded();
    
    await expect(footer).toBeVisible();
});

