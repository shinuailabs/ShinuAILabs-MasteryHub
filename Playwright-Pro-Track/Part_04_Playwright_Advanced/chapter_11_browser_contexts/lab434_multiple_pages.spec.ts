/**
 * Lab 434: Multiple Pages
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Working with multiple pages:
 * 
 * - Creating multiple pages
 * - Page communication
 * - Tab management
 * - Page events
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create multiple pages
 * 2. Switch between pages
 * 3. Handle page events
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Creating Multiple Pages
test('creating multiple pages', async ({ context }) => {
    const page1 = await context.newPage();
    const page2 = await context.newPage();
    
    await page1.goto('https://playwright.dev');
    await page2.goto('https://playwright.dev/docs/intro');
    
    await expect(page1).toHaveTitle(/Playwright/);
    await expect(page2).toHaveTitle(/Installation/);
    
    console.log('Total pages:', context.pages().length);
});

// Solution 2: Switching Between Pages
test('switching between pages', async ({ context }) => {
    const page1 = await context.newPage();
    const page2 = await context.newPage();
    
    await page1.goto('https://playwright.dev');
    await page2.goto('https://playwright.dev/docs/intro');
    
    // Work with page1
    await page1.bringToFront();
    await expect(page1).toHaveTitle(/Playwright/);
    
    // Switch to page2
    await page2.bringToFront();
    await expect(page2).toHaveTitle(/Installation/);
});

// Solution 3: Handling New Page Events
test('handling new page events', async ({ context, page }) => {
    await page.goto('https://playwright.dev');
    
    // Listen for new page
    const pagePromise = context.waitForEvent('page');
    
    // Trigger new page (e.g., clicking a link with target="_blank")
    await page.evaluate(() => {
        const link = document.createElement('a');
        link.href = 'https://playwright.dev/docs/intro';
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
    });
    
    const newPage = await pagePromise;
    await newPage.waitForLoadState();
    
    console.log('New page URL:', newPage.url());
});

// Solution 4: Page Communication via Storage
test('page communication via storage', async ({ context }) => {
    const page1 = await context.newPage();
    const page2 = await context.newPage();
    
    await page1.goto('https://playwright.dev');
    await page2.goto('https://playwright.dev');
    
    // Set data in page1
    await page1.evaluate(() => {
        localStorage.setItem('sharedData', 'Hello from page1');
    });
    
    // Read data in page2 (same origin, same context)
    const data = await page2.evaluate(() => {
        return localStorage.getItem('sharedData');
    });
    
    expect(data).toBe('Hello from page1');
});

// Solution 5: Closing Pages
test('closing pages', async ({ context }) => {
    const page1 = await context.newPage();
    const page2 = await context.newPage();
    const page3 = await context.newPage();
    
    await page1.goto('https://playwright.dev');
    await page2.goto('https://playwright.dev');
    await page3.goto('https://playwright.dev');
    
    console.log('Pages before close:', context.pages().length);
    
    await page2.close();
    
    console.log('Pages after close:', context.pages().length);
    expect(context.pages().length).toBe(2);
});

// Solution 6: Page Close Event
test('page close event', async ({ context }) => {
    const page = await context.newPage();
    
    let pageClosed = false;
    page.on('close', () => {
        pageClosed = true;
    });
    
    await page.goto('https://playwright.dev');
    await page.close();
    
    expect(pageClosed).toBeTruthy();
});

// Solution 7: Iterating Over Pages
test('iterating over pages', async ({ context }) => {
    // Create multiple pages
    for (let i = 0; i < 3; i++) {
        const page = await context.newPage();
        await page.goto('https://playwright.dev');
    }
    
    // Iterate over all pages
    const pages = context.pages();
    
    for (const page of pages) {
        const title = await page.title();
        console.log('Page title:', title);
    }
    
    expect(pages.length).toBe(3);
});

// Solution 8: Finding Specific Page
test('finding specific page', async ({ context }) => {
    const page1 = await context.newPage();
    const page2 = await context.newPage();
    
    await page1.goto('https://playwright.dev');
    await page2.goto('https://playwright.dev/docs/intro');
    
    // Find page by URL
    const pages = context.pages();
    const docsPage = pages.find(p => p.url().includes('/docs/'));
    
    expect(docsPage).toBeDefined();
    await expect(docsPage!).toHaveTitle(/Installation/);
});

// Solution 9: Parallel Page Operations
test('parallel page operations', async ({ context }) => {
    const page1 = await context.newPage();
    const page2 = await context.newPage();
    
    // Navigate in parallel
    await Promise.all([
        page1.goto('https://playwright.dev'),
        page2.goto('https://playwright.dev/docs/intro'),
    ]);
    
    // Verify both pages loaded
    await expect(page1).toHaveTitle(/Playwright/);
    await expect(page2).toHaveTitle(/Installation/);
});

// Solution 10: Multiple Pages Best Practices
test('multiple pages best practices', async ({ page }) => {
    /*
     * Best Practices:
     * 1. Use waitForEvent for new pages
     * 2. Close pages when done
     * 3. Use bringToFront for visibility
     * 4. Handle page events properly
     * 5. Use parallel operations when possible
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

