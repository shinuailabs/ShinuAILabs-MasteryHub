/**
 * Lab 311: Page Screenshots
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Capturing page screenshots:
 * 
 * - page.screenshot()
 * - Screenshot options
 * - Full page capture
 * - File formats
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Capture page screenshots
 * 2. Use screenshot options
 * 3. Save to different formats
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';
import path from 'path';

// Solution 1: Basic Screenshot
test('basic screenshot', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Capture screenshot
    await page.screenshot({ path: 'screenshots/basic.png' });
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 2: Full Page Screenshot
test('full page screenshot', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Capture entire scrollable page
    await page.screenshot({
        path: 'screenshots/fullpage.png',
        fullPage: true,
    });
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 3: Screenshot as Buffer
test('screenshot as buffer', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Get screenshot as buffer
    const buffer = await page.screenshot();
    
    expect(buffer).toBeInstanceOf(Buffer);
    expect(buffer.length).toBeGreaterThan(0);
});

// Solution 4: JPEG Screenshot
test('JPEG screenshot', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Save as JPEG
    await page.screenshot({
        path: 'screenshots/page.jpg',
        type: 'jpeg',
        quality: 80, // 0-100
    });
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 5: Screenshot with Clip
test('screenshot with clip', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Capture specific region
    await page.screenshot({
        path: 'screenshots/clipped.png',
        clip: {
            x: 0,
            y: 0,
            width: 800,
            height: 600,
        },
    });
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 6: Screenshot with Omit Background
test('screenshot omit background', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Transparent background (PNG only)
    await page.screenshot({
        path: 'screenshots/transparent.png',
        omitBackground: true,
    });
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 7: Screenshot with Scale
test('screenshot with scale', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Scale screenshot
    await page.screenshot({
        path: 'screenshots/scaled.png',
        scale: 'css', // 'css' or 'device'
    });
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 8: Screenshot with Timeout
test('screenshot with timeout', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Custom timeout
    await page.screenshot({
        path: 'screenshots/timeout.png',
        timeout: 30000,
    });
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 9: Screenshot with Animations Disabled
test('screenshot animations disabled', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Disable animations for consistent screenshots
    await page.screenshot({
        path: 'screenshots/no-animations.png',
        animations: 'disabled',
    });
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 10: Screenshot with Caret
test('screenshot with caret', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Hide or show caret
    await page.screenshot({
        path: 'screenshots/caret.png',
        caret: 'hide', // 'hide' or 'initial'
    });
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 11: Multiple Screenshots
test('multiple screenshots', async ({ page }) => {
    await page.goto('https://playwright.dev');
    await page.screenshot({ path: 'screenshots/step1.png' });
    
    await page.getByRole('link', { name: 'Get started' }).click();
    await page.screenshot({ path: 'screenshots/step2.png' });
    
    await expect(page).toHaveURL(/.*intro/);
});

// Solution 12: Screenshot with Mask
test('screenshot with mask', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Mask specific elements
    await page.screenshot({
        path: 'screenshots/masked.png',
        mask: [page.locator('nav')],
        maskColor: '#FF00FF',
    });
    
    await expect(page).toHaveTitle(/Playwright/);
});

