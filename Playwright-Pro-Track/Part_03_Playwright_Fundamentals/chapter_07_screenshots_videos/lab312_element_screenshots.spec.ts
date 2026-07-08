/**
 * Lab 312: Element Screenshots
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Capturing element screenshots:
 * 
 * - locator.screenshot()
 * - Element bounds
 * - Screenshot options
 * - Multiple elements
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Capture element screenshots
 * 2. Use element options
 * 3. Handle multiple elements
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Basic Element Screenshot
test('basic element screenshot', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Screenshot specific element
    await page.locator('h1').screenshot({
        path: 'screenshots/heading.png',
    });
    
    await expect(page.locator('h1')).toBeVisible();
});

// Solution 2: Navigation Screenshot
test('navigation screenshot', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Screenshot navigation
    await page.locator('nav').screenshot({
        path: 'screenshots/navigation.png',
    });
    
    await expect(page.locator('nav')).toBeVisible();
});

// Solution 3: Element Screenshot as Buffer
test('element screenshot as buffer', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Get as buffer
    const buffer = await page.locator('h1').screenshot();
    
    expect(buffer).toBeInstanceOf(Buffer);
    expect(buffer.length).toBeGreaterThan(0);
});

// Solution 4: Element Screenshot JPEG
test('element screenshot JPEG', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Save as JPEG
    await page.locator('h1').screenshot({
        path: 'screenshots/heading.jpg',
        type: 'jpeg',
        quality: 90,
    });
    
    await expect(page.locator('h1')).toBeVisible();
});

// Solution 5: Element with Omit Background
test('element omit background', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Transparent background
    await page.locator('h1').screenshot({
        path: 'screenshots/heading-transparent.png',
        omitBackground: true,
    });
    
    await expect(page.locator('h1')).toBeVisible();
});

// Solution 6: Element Screenshot with Scale
test('element screenshot scale', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Scale option
    await page.locator('h1').screenshot({
        path: 'screenshots/heading-scaled.png',
        scale: 'css',
    });
    
    await expect(page.locator('h1')).toBeVisible();
});

// Solution 7: Element Screenshot with Timeout
test('element screenshot timeout', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Custom timeout
    await page.locator('h1').screenshot({
        path: 'screenshots/heading-timeout.png',
        timeout: 10000,
    });
    
    await expect(page.locator('h1')).toBeVisible();
});

// Solution 8: Element Screenshot Animations
test('element screenshot animations', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Disable animations
    await page.locator('h1').screenshot({
        path: 'screenshots/heading-no-anim.png',
        animations: 'disabled',
    });
    
    await expect(page.locator('h1')).toBeVisible();
});

// Solution 9: Multiple Element Screenshots
test('multiple element screenshots', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Screenshot multiple elements
    await page.locator('h1').screenshot({ path: 'screenshots/h1.png' });
    await page.locator('nav').screenshot({ path: 'screenshots/nav.png' });
    await page.locator('footer').screenshot({ path: 'screenshots/footer.png' });
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 10: First Element Screenshot
test('first element screenshot', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Screenshot first matching element
    await page.locator('a').first().screenshot({
        path: 'screenshots/first-link.png',
    });
    
    await expect(page.locator('a').first()).toBeVisible();
});

// Solution 11: Element by Role Screenshot
test('element by role screenshot', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Screenshot by role
    await page.getByRole('heading', { level: 1 }).screenshot({
        path: 'screenshots/main-heading.png',
    });
    
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});

// Solution 12: Element Screenshot with Mask
test('element screenshot with mask', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Mask child elements
    await page.locator('nav').screenshot({
        path: 'screenshots/nav-masked.png',
        mask: [page.locator('nav a').first()],
    });
    
    await expect(page.locator('nav')).toBeVisible();
});

