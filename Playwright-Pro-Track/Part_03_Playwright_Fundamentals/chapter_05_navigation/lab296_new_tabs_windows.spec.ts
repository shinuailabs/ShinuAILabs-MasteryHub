/**
 * Lab 296: New Tabs and Windows
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Handling multiple pages:
 * 
 * - New tab handling
 * - Popup windows
 * - Context pages
 * - Page switching
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Handle new tabs
 * 2. Work with popups
 * 3. Switch between pages
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Wait for New Tab
test('wait for new tab', async ({ page, context }) => {
    await page.goto('https://playwright.dev');
    
    // Wait for new page (tab)
    const [newPage] = await Promise.all([
        context.waitForEvent('page'),
        page.getByRole('link', { name: 'GitHub' }).click(),
    ]);
    
    await newPage.waitForLoadState();
    await expect(newPage).toHaveURL(/github/);
});

// Solution 2: Work with New Tab
test('work with new tab', async ({ page, context }) => {
    await page.goto('https://playwright.dev');
    
    const [newPage] = await Promise.all([
        context.waitForEvent('page'),
        page.getByRole('link', { name: 'GitHub' }).click(),
    ]);
    
    // Interact with new tab
    await newPage.waitForLoadState();
    await expect(newPage.locator('body')).toBeVisible();
    
    // Original page still accessible
    await expect(page).toHaveURL('https://playwright.dev/');
});

// Solution 3: Close New Tab
test('close new tab', async ({ page, context }) => {
    await page.goto('https://playwright.dev');
    
    const [newPage] = await Promise.all([
        context.waitForEvent('page'),
        page.getByRole('link', { name: 'GitHub' }).click(),
    ]);
    
    await newPage.waitForLoadState();
    
    // Close new tab
    await newPage.close();
    
    // Original page still works
    await expect(page).toHaveURL('https://playwright.dev/');
});

// Solution 4: Handle Popup
test('handle popup', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Wait for popup
    const [popup] = await Promise.all([
        page.waitForEvent('popup'),
        page.getByRole('link', { name: 'GitHub' }).click(),
    ]);
    
    await popup.waitForLoadState();
    await expect(popup).toHaveURL(/github/);
});

// Solution 5: Multiple Tabs
test('multiple tabs', async ({ page, context }) => {
    await page.goto('https://playwright.dev');
    
    // Open first new tab
    const [page2] = await Promise.all([
        context.waitForEvent('page'),
        page.getByRole('link', { name: 'GitHub' }).click(),
    ]);
    
    await page2.waitForLoadState();
    
    // All pages in context
    const pages = context.pages();
    expect(pages.length).toBe(2);
});

// Solution 6: Create New Page Programmatically
test('create new page', async ({ context }) => {
    // Create new page
    const page1 = await context.newPage();
    await page1.goto('https://playwright.dev');
    
    // Create another page
    const page2 = await context.newPage();
    await page2.goto('https://playwright.dev/docs/intro');
    
    // Both pages exist
    expect(context.pages().length).toBe(2);
    
    await expect(page1).toHaveURL('https://playwright.dev/');
    await expect(page2).toHaveURL(/.*intro/);
});

// Solution 7: Switch Between Pages
test('switch between pages', async ({ context }) => {
    const page1 = await context.newPage();
    await page1.goto('https://playwright.dev');
    
    const page2 = await context.newPage();
    await page2.goto('https://playwright.dev/docs/intro');
    
    // Work with page1
    await expect(page1.locator('h1')).toContainText('Playwright');
    
    // Switch to page2
    await expect(page2.locator('h1')).toBeVisible();
    
    // Back to page1
    await page1.bringToFront();
});

// Solution 8: Bring Page to Front
test('bring page to front', async ({ context }) => {
    const page1 = await context.newPage();
    await page1.goto('https://playwright.dev');
    
    const page2 = await context.newPage();
    await page2.goto('https://playwright.dev/docs/intro');
    
    // Bring page1 to front
    await page1.bringToFront();
    
    await expect(page1).toHaveTitle(/Playwright/);
});

// Solution 9: Get All Pages
test('get all pages', async ({ context }) => {
    const page1 = await context.newPage();
    await page1.goto('https://playwright.dev');
    
    const page2 = await context.newPage();
    await page2.goto('https://playwright.dev/docs/intro');
    
    // Get all pages
    const allPages = context.pages();
    
    expect(allPages.length).toBe(2);
    
    // Find specific page
    const introPage = allPages.find(p => p.url().includes('intro'));
    expect(introPage).toBeDefined();
});

// Solution 10: Close All Pages
test('close all pages', async ({ context }) => {
    const page1 = await context.newPage();
    await page1.goto('https://playwright.dev');
    
    const page2 = await context.newPage();
    await page2.goto('https://playwright.dev/docs/intro');
    
    // Close all pages
    for (const page of context.pages()) {
        await page.close();
    }
    
    expect(context.pages().length).toBe(0);
});

