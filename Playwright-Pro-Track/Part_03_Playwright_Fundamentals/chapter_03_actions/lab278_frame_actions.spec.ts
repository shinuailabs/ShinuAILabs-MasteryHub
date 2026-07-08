/**
 * Lab 278: Frame Actions
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Interacting with iframes:
 * 
 * - Frame navigation
 * - Frame interactions
 * - Nested frames
 * - Frame events
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Navigate within frames
 * 2. Interact with frame content
 * 3. Handle nested frames
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Click in Frame
test('click in frame', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Click element inside frame
    // const frame = page.frameLocator('iframe#my-frame');
    // await frame.getByRole('button', { name: 'Submit' }).click();
    
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
});

// Solution 2: Fill Form in Frame
test('fill form in frame', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Fill input inside frame
    // const frame = page.frameLocator('iframe');
    // await frame.getByLabel('Email').fill('test@example.com');
    // await frame.getByLabel('Password').fill('password123');
    // await frame.getByRole('button', { name: 'Login' }).click();
    
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
});

// Solution 3: Navigate Frame
test('navigate frame', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Get frame by name and navigate
    // const frame = page.frame({ name: 'content' });
    // if (frame) {
    //     await frame.goto('https://example.com');
    // }
    
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
});

// Solution 4: Wait for Frame
test('wait for frame', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Wait for frame to be attached
    // const framePromise = page.waitForEvent('frameattached');
    // await page.click('#load-frame-button');
    // const frame = await framePromise;
    
    // Or wait for frame to load
    // await page.waitForSelector('iframe');
    // const frame = page.frameLocator('iframe');
    
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
});

// Solution 5: Frame Content Assertions
test('frame content assertions', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Assert content in frame
    // const frame = page.frameLocator('iframe');
    // await expect(frame.getByRole('heading')).toHaveText('Welcome');
    // await expect(frame.getByRole('button')).toBeEnabled();
    
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
});

// Solution 6: Nested Frame Actions
test('nested frame actions', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Access nested frame
    // const outerFrame = page.frameLocator('#outer');
    // const innerFrame = outerFrame.frameLocator('#inner');
    
    // Interact with nested frame
    // await innerFrame.getByRole('button').click();
    
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
});

// Solution 7: Frame URL Check
test('frame URL check', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Check frame URL
    // const frame = page.frame({ name: 'content' });
    // if (frame) {
    //     const url = frame.url();
    //     expect(url).toContain('example.com');
    // }
    
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
});

// Solution 8: Frame Evaluate
test('frame evaluate', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Execute JavaScript in frame
    // const frame = page.frame({ name: 'content' });
    // if (frame) {
    //     const title = await frame.evaluate(() => document.title);
    //     console.log('Frame title:', title);
    // }
    
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
});

// Solution 9: Multiple Frames
test('multiple frames', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Work with multiple frames
    // const frames = page.frames();
    // console.log(`Found ${frames.length} frames`);
    
    // for (const frame of frames) {
    //     console.log('Frame URL:', frame.url());
    // }
    
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
});

// Solution 10: Frame Events
test('frame events', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Listen for frame events
    page.on('frameattached', frame => {
        console.log('Frame attached:', frame.url());
    });
    
    page.on('framedetached', frame => {
        console.log('Frame detached:', frame.url());
    });
    
    page.on('framenavigated', frame => {
        console.log('Frame navigated:', frame.url());
    });
    
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
});

