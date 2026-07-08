/**
 * Lab 363: HAR Recording
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Recording and replaying HAR files:
 * 
 * - Record HAR
 * - Replay HAR
 * - HAR options
 * - Network analysis
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Record HAR file
 * 2. Replay from HAR
 * 3. Analyze network
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Record HAR
test('record HAR', async ({ page }) => {
    /*
     * Record HAR via config:
     * 
     * use: {
     *   recordHar: {
     *     path: 'network.har',
     *   },
     * }
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 2: Record HAR with Options
test('record HAR with options', async ({ browser }) => {
    const context = await browser.newContext({
        recordHar: {
            path: 'test-results/network.har',
            mode: 'full',
        },
    });
    
    const page = await context.newPage();
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
    
    await context.close(); // HAR saved on close
});

// Solution 3: Record HAR Minimal
test('record HAR minimal', async ({ browser }) => {
    const context = await browser.newContext({
        recordHar: {
            path: 'test-results/minimal.har',
            mode: 'minimal', // Only URL and status
        },
    });
    
    const page = await context.newPage();
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
    
    await context.close();
});

// Solution 4: Record HAR with URL Filter
test('record HAR with URL filter', async ({ browser }) => {
    const context = await browser.newContext({
        recordHar: {
            path: 'test-results/filtered.har',
            urlFilter: '**/api/**',
        },
    });
    
    const page = await context.newPage();
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
    
    await context.close();
});

// Solution 5: Replay from HAR
test('replay from HAR', async ({ page }) => {
    // Route from HAR file
    await page.routeFromHAR('test-results/network.har', {
        notFound: 'fallback',
    });
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 6: Replay HAR with Update
test('replay HAR with update', async ({ page }) => {
    // Update HAR if request not found
    await page.routeFromHAR('test-results/network.har', {
        update: true,
    });
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 7: Replay HAR Abort Missing
test('replay HAR abort missing', async ({ page }) => {
    // Abort if request not in HAR
    await page.routeFromHAR('test-results/network.har', {
        notFound: 'abort',
    });
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 8: Replay HAR with URL Filter
test('replay HAR with URL filter', async ({ page }) => {
    await page.routeFromHAR('test-results/network.har', {
        url: '**/api/**',
        notFound: 'fallback',
    });
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 9: Unroute HAR
test('unroute HAR', async ({ page }) => {
    await page.routeFromHAR('test-results/network.har');
    
    await page.goto('https://playwright.dev');
    
    // Remove HAR routing
    await page.unrouteAll({ behavior: 'ignoreErrors' });
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 10: HAR Recording Best Practices
test('HAR recording best practices', async ({ page }) => {
    /*
     * Best Practices:
     * 1. Use minimal mode for smaller files
     * 2. Filter URLs to reduce size
     * 3. Update HAR periodically
     * 4. Use for offline testing
     * 5. Analyze for performance
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

