/**
 * Lab 318: HAR Recording
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Recording HTTP Archive (HAR):
 * 
 * - HAR configuration
 * - Recording network
 * - HAR playback
 * - Network analysis
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Record HAR files
 * 2. Analyze network traffic
 * 3. Use HAR for mocking
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Record HAR
test('record HAR', async ({ browser }) => {
    // Create context with HAR recording
    const context = await browser.newContext({
        recordHar: {
            path: 'har/network.har',
        },
    });
    
    const page = await context.newPage();
    await page.goto('https://playwright.dev');
    
    // Close context to save HAR
    await context.close();
});

// Solution 2: HAR with URL Filter
test('HAR with URL filter', async ({ browser }) => {
    const context = await browser.newContext({
        recordHar: {
            path: 'har/filtered.har',
            urlFilter: /playwright\.dev/,
        },
    });
    
    const page = await context.newPage();
    await page.goto('https://playwright.dev');
    
    await context.close();
});

// Solution 3: HAR Mode Minimal
test('HAR mode minimal', async ({ browser }) => {
    const context = await browser.newContext({
        recordHar: {
            path: 'har/minimal.har',
            mode: 'minimal', // Smaller file size
        },
    });
    
    const page = await context.newPage();
    await page.goto('https://playwright.dev');
    
    await context.close();
});

// Solution 4: HAR Mode Full
test('HAR mode full', async ({ browser }) => {
    const context = await browser.newContext({
        recordHar: {
            path: 'har/full.har',
            mode: 'full', // Include all content
        },
    });
    
    const page = await context.newPage();
    await page.goto('https://playwright.dev');
    
    await context.close();
});

// Solution 5: HAR Content Policy
test('HAR content policy', async ({ browser }) => {
    const context = await browser.newContext({
        recordHar: {
            path: 'har/content.har',
            content: 'embed', // 'omit', 'embed', 'attach'
        },
    });
    
    const page = await context.newPage();
    await page.goto('https://playwright.dev');
    
    await context.close();
});

// Solution 6: Route from HAR
test('route from HAR', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // Use recorded HAR for responses
    await page.routeFromHAR('har/network.har', {
        notFound: 'fallback', // 'abort' or 'fallback'
    });
    
    await page.goto('https://playwright.dev');
    
    await context.close();
});

// Solution 7: Route from HAR with Update
test('route from HAR with update', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // Update HAR if request not found
    await page.routeFromHAR('har/updated.har', {
        update: true,
    });
    
    await page.goto('https://playwright.dev');
    
    await context.close();
});

// Solution 8: Route from HAR URL Filter
test('route from HAR URL filter', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // Only use HAR for matching URLs
    await page.routeFromHAR('har/network.har', {
        url: /api/,
    });
    
    await page.goto('https://playwright.dev');
    
    await context.close();
});

// Solution 9: HAR Analysis
test('HAR analysis', async ({ browser }) => {
    const context = await browser.newContext({
        recordHar: {
            path: 'har/analysis.har',
        },
    });
    
    const page = await context.newPage();
    await page.goto('https://playwright.dev');
    
    await context.close();
    
    /*
     * HAR file contains:
     * - All HTTP requests/responses
     * - Timing information
     * - Headers
     * - Body content
     * - Cookies
     * 
     * Analyze with:
     * - Chrome DevTools
     * - HAR Viewer tools
     * - Custom scripts
     */
});

// Solution 10: HAR Best Practices
test('HAR best practices', async ({ browser }) => {
    /*
     * Best Practices:
     * 1. Use URL filter to reduce size
     * 2. Use 'minimal' mode for smaller files
     * 3. Use HAR for API mocking
     * 4. Update HAR periodically
     * 5. Store HAR in version control
     */
    
    const context = await browser.newContext({
        recordHar: {
            path: 'har/best-practices.har',
            mode: 'minimal',
            urlFilter: /api/,
        },
    });
    
    const page = await context.newPage();
    await page.goto('https://playwright.dev');
    
    await context.close();
});

