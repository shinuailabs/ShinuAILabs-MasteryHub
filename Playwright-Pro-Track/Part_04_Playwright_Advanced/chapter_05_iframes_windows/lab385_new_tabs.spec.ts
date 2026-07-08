/**
 * Lab 385: New Tabs
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Handling new browser tabs:
 * 
 * - Tab creation
 * - Tab switching
 * - Tab management
 * - Tab closing
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Open new tabs
 * 2. Switch between tabs
 * 3. Manage multiple tabs
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Open New Tab
test('open new tab', async ({ context }) => {
    const page1 = await context.newPage();
    await page1.goto('https://playwright.dev');
    
    // Open new tab
    const page2 = await context.newPage();
    await page2.goto('https://playwright.dev/docs/intro');
    
    await expect(page1).toHaveTitle(/Playwright/);
    await expect(page2).toHaveTitle(/Installation/);
});

// Solution 2: Handle Link Opening New Tab
test('handle link opening new tab', async ({ page, context }) => {
    await page.goto('https://playwright.dev');
    
    // Handle link that opens new tab
    // const newPagePromise = context.waitForEvent('page');
    // await page.click('a[target="_blank"]');
    // const newPage = await newPagePromise;
    // await newPage.waitForLoadState();
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 3: Switch Between Tabs
test('switch between tabs', async ({ context }) => {
    const page1 = await context.newPage();
    const page2 = await context.newPage();
    
    await page1.goto('https://playwright.dev');
    await page2.goto('https://playwright.dev/docs/intro');
    
    // Work on page1
    await expect(page1).toHaveTitle(/Playwright/);
    
    // Switch to page2
    await page2.bringToFront();
    await expect(page2).toHaveTitle(/Installation/);
    
    // Switch back to page1
    await page1.bringToFront();
});

// Solution 4: Get All Pages
test('get all pages', async ({ context }) => {
    const page1 = await context.newPage();
    const page2 = await context.newPage();
    
    await page1.goto('https://playwright.dev');
    await page2.goto('https://playwright.dev/docs/intro');
    
    // Get all pages
    const pages = context.pages();
    console.log('Number of pages:', pages.length);
    
    expect(pages.length).toBe(2);
});

// Solution 5: Close Tab
test('close tab', async ({ context }) => {
    const page1 = await context.newPage();
    const page2 = await context.newPage();
    
    await page1.goto('https://playwright.dev');
    await page2.goto('https://playwright.dev/docs/intro');
    
    // Close second tab
    await page2.close();
    
    const pages = context.pages();
    expect(pages.length).toBe(1);
});

// Solution 6: Close All Tabs Except One
test('close all tabs except one', async ({ context }) => {
    const mainPage = await context.newPage();
    await mainPage.goto('https://playwright.dev');
    
    // Open multiple tabs
    const page2 = await context.newPage();
    const page3 = await context.newPage();
    
    // Close all except main
    for (const page of context.pages()) {
        if (page !== mainPage) {
            await page.close();
        }
    }
    
    expect(context.pages().length).toBe(1);
});

// Solution 7: Tab Communication
test('tab communication', async ({ context }) => {
    const page1 = await context.newPage();
    const page2 = await context.newPage();
    
    await page1.goto('https://playwright.dev');
    await page2.goto('https://playwright.dev');
    
    // Set data in page1
    await page1.evaluate(() => {
        localStorage.setItem('shared', 'data');
    });
    
    // Read in page2 (same origin)
    const data = await page2.evaluate(() => {
        return localStorage.getItem('shared');
    });
    
    expect(data).toBe('data');
});

// Solution 8: Wait for Tab to Load
test('wait for tab to load', async ({ context }) => {
    const page = await context.newPage();
    await page.goto('https://playwright.dev');
    
    // Wait for new tab and load
    // const newPagePromise = context.waitForEvent('page');
    // await page.click('a[target="_blank"]');
    // const newPage = await newPagePromise;
    // await newPage.waitForLoadState('networkidle');
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 9: Tab Order
test('tab order', async ({ context }) => {
    const pages: any[] = [];
    
    for (let i = 0; i < 3; i++) {
        const page = await context.newPage();
        await page.goto('https://playwright.dev');
        pages.push(page);
    }
    
    // Pages are in order of creation
    expect(context.pages()).toEqual(pages);
});

// Solution 10: Tab Best Practices
test('tab best practices', async ({ page }) => {
    /*
     * Best Practices:
     * 1. Use context.waitForEvent('page')
     * 2. Wait for load state
     * 3. Close unused tabs
     * 4. Use bringToFront
     * 5. Track page references
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

