/**
 * Lab 269: Frame Locators
 *
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Working with iframes:
 *
 * - frameLocator()
 * - Nested frames
 * - Frame navigation
 * - Frame assertions
 *
 * =====================
 * EXERCISE:
 * =====================
 * 1. Locate elements in frames
 * 2. Handle nested frames
 * 3. Interact with frame content
 *
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Basic Frame Locator
test('basic frame locator', async ({ page }) => {
    await page.goto('https://playwright.dev');

    // Locate frame by various selectors
    // const frame = page.frameLocator('iframe');
    // const frameById = page.frameLocator('#my-frame');
    // const frameByName = page.frameLocator('iframe[name="content"]');

    // Then locate elements inside frame
    // const button = frame.getByRole('button', { name: 'Submit' });
    // await button.click();

    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
});

// Solution 2: Frame Locator with CSS
test('frame locator with CSS', async ({ page }) => {
    await page.goto('https://playwright.dev');

    // CSS selector for frame
    // const frame = page.frameLocator('iframe.content-frame');

    // XPath for frame
    // const frameXPath = page.frameLocator('xpath=//iframe[@id="main"]');

    // Nth frame
    // const secondFrame = page.frameLocator('iframe').nth(1);

    const nav = page.getByRole('navigation');
    await expect(nav.first()).toBeVisible();
});

// Solution 3: Interacting with Frame Content
test('interacting with frame content', async ({ page }) => {
    await page.goto('https://playwright.dev');

    // Example: Interact with elements inside frame
    // const frame = page.frameLocator('#editor-frame');

    // Click button in frame
    // await frame.getByRole('button', { name: 'Save' }).click();

    // Fill input in frame
    // await frame.getByLabel('Name').fill('John');

    // Assert element in frame
    // await expect(frame.getByText('Success')).toBeVisible();

    const link = page.getByRole('link', { name: 'Docs' });
    await expect(link).toBeVisible();
});

// Solution 4: Nested Frames
test('nested frames', async ({ page }) => {
    await page.goto('https://playwright.dev');

    // Access nested frame
    // const outerFrame = page.frameLocator('#outer-frame');
    // const innerFrame = outerFrame.frameLocator('#inner-frame');

    // Interact with element in nested frame
    // await innerFrame.getByRole('button').click();

    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
});

// Solution 5: Frame by URL
test('frame by URL', async ({ page }) => {
    await page.goto('https://playwright.dev');

    // Get frame by URL pattern
    // const frame = page.frame({ url: /.*editor.*/ });

    // Or exact URL
    // const exactFrame = page.frame({ url: 'https://example.com/embed' });

    // Or by name
    // const namedFrame = page.frame({ name: 'content' });

    const nav = page.getByRole('navigation');
    await expect(nav.first()).toBeVisible();
});

// Solution 6: Frame Assertions
test('frame assertions', async ({ page }) => {
    await page.goto('https://playwright.dev');

    // Assert element visibility in frame
    // const frame = page.frameLocator('iframe');
    // await expect(frame.getByRole('heading')).toBeVisible();

    // Assert text in frame
    // await expect(frame.getByText('Welcome')).toBeVisible();

    // Assert input value in frame
    // await expect(frame.getByLabel('Email')).toHaveValue('test@example.com');

    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
});

// Solution 7: Multiple Frames
test('multiple frames', async ({ page }) => {
    await page.goto('https://playwright.dev');

    // Work with multiple frames
    // const headerFrame = page.frameLocator('#header-frame');
    // const contentFrame = page.frameLocator('#content-frame');
    // const footerFrame = page.frameLocator('#footer-frame');

    // Interact with each
    // await headerFrame.getByRole('link', { name: 'Home' }).click();
    // await contentFrame.getByRole('button', { name: 'Submit' }).click();

    const link = page.getByRole('link', { name: 'Get started' });
    await expect(link).toBeVisible();
});

// Solution 8: Frame Owner
test('frame owner element', async ({ page }) => {
    await page.goto('https://playwright.dev');

    // Get the iframe element itself
    // const frameElement = page.locator('iframe#my-frame');
    // await expect(frameElement).toBeVisible();

    // Get frame's src attribute
    // const src = await frameElement.getAttribute('src');
    // console.log('Frame source:', src);

    const nav = page.getByRole('navigation');
    await expect(nav.first()).toBeVisible();
});

// Solution 9: Waiting for Frame
test('waiting for frame', async ({ page }) => {
    await page.goto('https://playwright.dev');

    // Wait for frame to load
    // await page.waitForSelector('iframe#dynamic-frame');
    // const frame = page.frameLocator('#dynamic-frame');

    // Wait for element in frame
    // await frame.getByRole('button').waitFor();

    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
});

// Solution 10: Frame Best Practices
test('frame best practices', async ({ page }) => {
    await page.goto('https://playwright.dev');

    /*
     * Best Practices:
     * 1. Use specific frame selectors
     * 2. Wait for frame to load before interacting
     * 3. Use frameLocator for chaining
     * 4. Handle frame load errors
     * 5. Consider frame security restrictions
     */

    // Good: Specific selector
    // const frame = page.frameLocator('iframe[name="editor"]');

    // Good: Chain locators
    // const button = frame.getByRole('button', { name: 'Save' });

    const link = page.getByRole('link', { name: 'Docs' });
    await expect(link).toBeVisible();
});
