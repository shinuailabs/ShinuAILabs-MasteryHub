/**
 * Lab 364: Network Events
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Listening to network events:
 * 
 * - request event
 * - response event
 * - requestfailed event
 * - requestfinished event
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Listen to network events
 * 2. Log network activity
 * 3. Handle failures
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Request Event
test('request event', async ({ page }) => {
    page.on('request', request => {
        console.log('Request:', request.method(), request.url());
    });
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 2: Response Event
test('response event', async ({ page }) => {
    page.on('response', response => {
        console.log('Response:', response.status(), response.url());
    });
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 3: Request Failed Event
test('request failed event', async ({ page }) => {
    page.on('requestfailed', request => {
        console.log('Failed:', request.url(), request.failure()?.errorText);
    });
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 4: Request Finished Event
test('request finished event', async ({ page }) => {
    page.on('requestfinished', request => {
        console.log('Finished:', request.url());
    });
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 5: Collect All Requests
test('collect all requests', async ({ page }) => {
    const requests: string[] = [];
    
    page.on('request', request => {
        requests.push(request.url());
    });
    
    await page.goto('https://playwright.dev');
    
    console.log('Total requests:', requests.length);
    expect(requests.length).toBeGreaterThan(0);
});

// Solution 6: Collect All Responses
test('collect all responses', async ({ page }) => {
    const responses: { url: string; status: number }[] = [];
    
    page.on('response', response => {
        responses.push({
            url: response.url(),
            status: response.status(),
        });
    });
    
    await page.goto('https://playwright.dev');
    
    console.log('Total responses:', responses.length);
    expect(responses.length).toBeGreaterThan(0);
});

// Solution 7: Filter Network Events
test('filter network events', async ({ page }) => {
    const apiRequests: string[] = [];
    
    page.on('request', request => {
        if (request.url().includes('api')) {
            apiRequests.push(request.url());
        }
    });
    
    await page.goto('https://playwright.dev');
    console.log('API requests:', apiRequests.length);
});

// Solution 8: Track Response Times
test('track response times', async ({ page }) => {
    const timings: { url: string; time: number }[] = [];
    const startTimes = new Map<string, number>();
    
    page.on('request', request => {
        startTimes.set(request.url(), Date.now());
    });
    
    page.on('response', response => {
        const startTime = startTimes.get(response.url());
        if (startTime) {
            timings.push({
                url: response.url(),
                time: Date.now() - startTime,
            });
        }
    });
    
    await page.goto('https://playwright.dev');
    
    console.log('Slowest requests:', timings.sort((a, b) => b.time - a.time).slice(0, 5));
});

// Solution 9: Wait for Specific Request
test('wait for specific request', async ({ page }) => {
    const requestPromise = page.waitForRequest('**/api/**');
    const responsePromise = page.waitForResponse('**/api/**');
    
    await page.goto('https://playwright.dev');
    
    // These would resolve if matching requests occur
    // const request = await requestPromise;
    // const response = await responsePromise;
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 10: Network Events Best Practices
test('network events best practices', async ({ page }) => {
    /*
     * Best Practices:
     * 1. Use events for monitoring
     * 2. Filter relevant requests
     * 3. Track performance metrics
     * 4. Handle failures gracefully
     * 5. Clean up listeners
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

