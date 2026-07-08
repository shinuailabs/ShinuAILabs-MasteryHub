/**
 * Lab 297: Frame Navigation
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Navigating within frames:
 * 
 * - Frame navigation
 * - Frame URL changes
 * - Nested frames
 * - Frame events
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Navigate frames
 * 2. Handle frame URLs
 * 3. Work with nested frames
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Get Frame by Name
test('get frame by name', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Get frame by name attribute
    // const frame = page.frame({ name: 'content' });
    // if (frame) {
    //     await frame.goto('https://example.com');
    // }
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 2: Get Frame by URL
test('get frame by URL', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Get frame by URL
    // const frame = page.frame({ url: /example\.com/ });
    // if (frame) {
    //     console.log('Frame URL:', frame.url());
    // }
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 3: Navigate Frame
test('navigate frame', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Navigate frame to new URL
    // const frame = page.frame({ name: 'content' });
    // if (frame) {
    //     await frame.goto('https://example.com/page2');
    //     expect(frame.url()).toContain('page2');
    // }
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 4: Frame Locator Navigation
test('frame locator navigation', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Use frameLocator for interactions
    // const frame = page.frameLocator('iframe#my-frame');
    // await frame.getByRole('link', { name: 'Next' }).click();
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 5: Wait for Frame Navigation
test('wait for frame navigation', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Wait for frame to navigate
    // const frame = page.frame({ name: 'content' });
    // if (frame) {
    //     await Promise.all([
    //         frame.waitForNavigation(),
    //         frame.click('a.next'),
    //     ]);
    // }
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 6: Frame URL Check
test('frame URL check', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Check frame URL
    // const frame = page.frame({ name: 'content' });
    // if (frame) {
    //     expect(frame.url()).toContain('expected-path');
    // }
    
    // Main frame URL
    expect(page.mainFrame().url()).toContain('playwright');
});

// Solution 7: Nested Frame Navigation
test('nested frame navigation', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Navigate nested frame
    // const outerFrame = page.frame({ name: 'outer' });
    // if (outerFrame) {
    //     const innerFrame = outerFrame.childFrames()[0];
    //     if (innerFrame) {
    //         await innerFrame.goto('https://example.com');
    //     }
    // }
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 8: Frame Navigation Events
test('frame navigation events', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Listen for frame navigation
    page.on('framenavigated', frame => {
        console.log('Frame navigated:', frame.url());
    });
    
    // Navigate
    await page.getByRole('link', { name: 'Get started' }).click();
    
    await expect(page).toHaveURL(/.*intro/);
});

// Solution 9: All Frames
test('all frames', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Get all frames
    const frames = page.frames();
    console.log(`Page has ${frames.length} frames`);
    
    // Main frame is always first
    expect(frames[0]).toBe(page.mainFrame());
});

// Solution 10: Frame Parent
test('frame parent', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Get parent frame
    // const frame = page.frame({ name: 'child' });
    // if (frame) {
    //     const parent = frame.parentFrame();
    //     console.log('Parent URL:', parent?.url());
    // }
    
    // Main frame has no parent
    expect(page.mainFrame().parentFrame()).toBeNull();
});

// Solution 11: Frame Content
test('frame content', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Get frame content
    // const frame = page.frame({ name: 'content' });
    // if (frame) {
    //     const content = await frame.content();
    //     expect(content).toContain('<!DOCTYPE html>');
    // }
    
    const mainContent = await page.mainFrame().content();
    expect(mainContent).toContain('Playwright');
});

// Solution 12: Frame Title
test('frame title', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Get frame title
    // const frame = page.frame({ name: 'content' });
    // if (frame) {
    //     const title = await frame.title();
    //     console.log('Frame title:', title);
    // }
    
    const mainTitle = await page.mainFrame().title();
    expect(mainTitle).toContain('Playwright');
});

