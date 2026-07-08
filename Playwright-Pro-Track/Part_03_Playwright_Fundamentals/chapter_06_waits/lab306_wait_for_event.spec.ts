/**
 * Lab 306: Wait for Event
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Waiting for page events:
 * 
 * - waitForEvent()
 * - Event types
 * - Event predicates
 * - Timeout handling
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Wait for various events
 * 2. Use event predicates
 * 3. Handle event timeouts
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Wait for Load Event
test('wait for load event', async ({ page }) => {
    const loadPromise = page.waitForEvent('load');
    
    await page.goto('https://playwright.dev');
    
    await loadPromise;
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 2: Wait for DOMContentLoaded Event
test('wait for domcontentloaded event', async ({ page }) => {
    const domPromise = page.waitForEvent('domcontentloaded');
    
    await page.goto('https://playwright.dev');
    
    await domPromise;
    await expect(page.locator('body')).toBeVisible();
});

// Solution 3: Wait for Popup Event
test('wait for popup event', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Wait for popup
    const [popup] = await Promise.all([
        page.waitForEvent('popup'),
        page.getByRole('link', { name: 'GitHub' }).click(),
    ]);
    
    await popup.waitForLoadState();
    await expect(popup).toHaveURL(/github/);
});

// Solution 4: Wait for Dialog Event
test('wait for dialog event', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Set up dialog handler
    page.on('dialog', async dialog => {
        await dialog.accept();
    });
    
    // Wait for dialog
    // const dialogPromise = page.waitForEvent('dialog');
    // await page.evaluate(() => alert('Hello'));
    // const dialog = await dialogPromise;
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 5: Wait for Console Event
test('wait for console event', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Wait for console message
    const consolePromise = page.waitForEvent('console');
    
    await page.evaluate(() => console.log('Test message'));
    
    const message = await consolePromise;
    expect(message.text()).toBe('Test message');
});

// Solution 6: Wait for Download Event
test('wait for download event', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Wait for download
    // const [download] = await Promise.all([
    //     page.waitForEvent('download'),
    //     page.getByRole('link', { name: 'Download' }).click(),
    // ]);
    
    // const path = await download.path();
    // expect(path).toBeDefined();
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 7: Wait for File Chooser Event
test('wait for file chooser event', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Wait for file chooser
    // const [fileChooser] = await Promise.all([
    //     page.waitForEvent('filechooser'),
    //     page.getByLabel('Upload').click(),
    // ]);
    
    // await fileChooser.setFiles('path/to/file.txt');
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 8: Wait for Request Event
test('wait for request event', async ({ page }) => {
    const requestPromise = page.waitForEvent('request');
    
    await page.goto('https://playwright.dev');
    
    const request = await requestPromise;
    expect(request.url()).toContain('playwright');
});

// Solution 9: Wait for Response Event
test('wait for response event', async ({ page }) => {
    const responsePromise = page.waitForEvent('response');
    
    await page.goto('https://playwright.dev');
    
    const response = await responsePromise;
    expect(response.status()).toBe(200);
});

// Solution 10: Event with Predicate
test('event with predicate', async ({ page }) => {
    const responsePromise = page.waitForEvent('response', {
        predicate: response => response.url().includes('playwright') && response.status() === 200,
    });
    
    await page.goto('https://playwright.dev');
    
    const response = await responsePromise;
    expect(response.ok()).toBe(true);
});

// Solution 11: Event with Timeout
test('event with timeout', async ({ page }) => {
    const loadPromise = page.waitForEvent('load', {
        timeout: 30000,
    });
    
    await page.goto('https://playwright.dev');
    
    await loadPromise;
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 12: Context Events
test('context events', async ({ context }) => {
    // Wait for new page in context
    const pagePromise = context.waitForEvent('page');
    
    const page = await context.newPage();
    await page.goto('https://playwright.dev');
    
    const newPage = await pagePromise;
    expect(newPage).toBe(page);
});

