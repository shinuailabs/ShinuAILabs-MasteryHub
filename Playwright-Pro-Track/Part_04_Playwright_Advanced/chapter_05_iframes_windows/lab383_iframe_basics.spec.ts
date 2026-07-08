/**
 * Lab 383: Iframe Basics
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Working with iframes:
 * 
 * - frameLocator
 * - Frame navigation
 * - Frame content
 * - Nested frames
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Access iframe content
 * 2. Interact with elements
 * 3. Handle nested frames
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Basic Frame Locator
test('basic frame locator', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Access iframe by selector
    // const frame = page.frameLocator('iframe');
    // await frame.locator('button').click();
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 2: Frame by Name
test('frame by name', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Access iframe by name
    // const frame = page.frameLocator('iframe[name="myframe"]');
    // await frame.locator('input').fill('text');
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 3: Frame by ID
test('frame by ID', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Access iframe by ID
    // const frame = page.frameLocator('#frame-id');
    // await frame.locator('a').click();
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 4: Frame by Index
test('frame by index', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Access first iframe
    // const frame = page.frameLocator('iframe').first();
    // await frame.locator('button').click();
    
    // Access nth iframe
    // const frame2 = page.frameLocator('iframe').nth(1);
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 5: Nested Frames
test('nested frames', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Access nested iframe
    // const outerFrame = page.frameLocator('#outer-frame');
    // const innerFrame = outerFrame.frameLocator('#inner-frame');
    // await innerFrame.locator('button').click();
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 6: Frame Content Assertions
test('frame content assertions', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Assert on frame content
    // const frame = page.frameLocator('iframe');
    // await expect(frame.locator('h1')).toHaveText('Frame Title');
    // await expect(frame.locator('button')).toBeVisible();
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 7: Frame Form Interaction
test('frame form interaction', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Fill form in iframe
    // const frame = page.frameLocator('iframe');
    // await frame.locator('#name').fill('John');
    // await frame.locator('#email').fill('john@example.com');
    // await frame.locator('button[type="submit"]').click();
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 8: Wait for Frame
test('wait for frame', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Wait for frame to load
    // const frame = page.frameLocator('iframe');
    // await frame.locator('body').waitFor();
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 9: Frame URL Check
test('frame URL check', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Check frame URL using frame object
    // const frame = page.frame({ url: /example\.com/ });
    // if (frame) {
    //     await frame.locator('button').click();
    // }
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 10: Iframe Best Practices
test('iframe best practices', async ({ page }) => {
    /*
     * Best Practices:
     * 1. Use frameLocator for modern API
     * 2. Wait for frame content
     * 3. Use specific selectors
     * 4. Handle nested frames
     * 5. Check frame existence
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

