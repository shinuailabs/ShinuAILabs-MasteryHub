/**
 * Lab 309: Expect Poll
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Polling assertions:
 * 
 * - expect.poll()
 * - Custom polling
 * - Async conditions
 * - Timeout handling
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Use expect.poll()
 * 2. Poll async conditions
 * 3. Configure polling
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Basic Expect Poll
test('basic expect poll', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Poll until condition is met
    await expect.poll(async () => {
        return await page.locator('h1').count();
    }).toBeGreaterThan(0);
});

// Solution 2: Poll for Element Count
test('poll for element count', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Poll until we have enough links
    await expect.poll(async () => {
        return await page.locator('a').count();
    }).toBeGreaterThan(5);
});

// Solution 3: Poll for Text Content
test('poll for text content', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Poll until text appears
    await expect.poll(async () => {
        return await page.locator('h1').textContent();
    }).toContain('Playwright');
});

// Solution 4: Poll with Custom Message
test('poll with custom message', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    await expect.poll(async () => {
        return await page.locator('h1').count();
    }, {
        message: 'Waiting for heading to appear',
    }).toBeGreaterThan(0);
});

// Solution 5: Poll with Timeout
test('poll with timeout', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    await expect.poll(async () => {
        return await page.locator('h1').count();
    }, {
        timeout: 10000, // 10 seconds
    }).toBeGreaterThan(0);
});

// Solution 6: Poll with Intervals
test('poll with intervals', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    await expect.poll(async () => {
        return await page.locator('h1').count();
    }, {
        intervals: [100, 200, 500, 1000], // Increasing intervals
    }).toBeGreaterThan(0);
});

// Solution 7: Poll API Response
test('poll API response', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Poll for API data
    // await expect.poll(async () => {
    //     const response = await page.request.get('/api/status');
    //     const data = await response.json();
    //     return data.status;
    // }).toBe('ready');
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 8: Poll for Attribute
test('poll for attribute', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Poll until attribute has value
    await expect.poll(async () => {
        return await page.locator('a').first().getAttribute('href');
    }).toBeTruthy();
});

// Solution 9: Poll for Visibility
test('poll for visibility', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Poll until element is visible
    await expect.poll(async () => {
        return await page.locator('h1').isVisible();
    }).toBe(true);
});

// Solution 10: Poll Complex Condition
test('poll complex condition', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Poll for complex condition
    await expect.poll(async () => {
        const h1Visible = await page.locator('h1').isVisible();
        const navVisible = await page.locator('nav').isVisible();
        return h1Visible && navVisible;
    }).toBe(true);
});

// Solution 11: Poll vs Regular Assertion
test('poll vs regular assertion', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Regular assertion (auto-retry built-in)
    await expect(page.locator('h1')).toBeVisible();
    
    // Poll (for custom async conditions)
    await expect.poll(async () => {
        const count = await page.locator('a').count();
        return count;
    }).toBeGreaterThan(5);
});

// Solution 12: Poll Best Practices
test('poll best practices', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    /*
     * When to use expect.poll():
     * 1. Custom async conditions
     * 2. API polling
     * 3. Complex state checks
     * 4. Non-locator assertions
     * 
     * When NOT to use:
     * 1. Simple element assertions (use expect(locator))
     * 2. Page assertions (use expect(page))
     */
    
    // Good use case: Custom condition
    await expect.poll(async () => {
        const links = await page.locator('a').count();
        const images = await page.locator('img').count();
        return links + images;
    }).toBeGreaterThan(5);
});

