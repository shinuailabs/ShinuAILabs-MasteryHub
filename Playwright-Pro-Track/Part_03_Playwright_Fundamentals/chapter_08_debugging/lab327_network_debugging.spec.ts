/**
 * Lab 327: Network Debugging
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Debugging network issues:
 * 
 * - Request logging
 * - Response inspection
 * - Failed requests
 * - Network timing
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Log network requests
 * 2. Inspect responses
 * 3. Debug network issues
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Log All Requests
test('log all requests', async ({ page }) => {
    page.on('request', request => {
        console.log(`>> ${request.method()} ${request.url()}`);
    });
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 2: Log All Responses
test('log all responses', async ({ page }) => {
    page.on('response', response => {
        console.log(`<< ${response.status()} ${response.url()}`);
    });
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 3: Log Failed Requests
test('log failed requests', async ({ page }) => {
    page.on('requestfailed', request => {
        console.log(`FAILED: ${request.url()}`);
        console.log(`  Reason: ${request.failure()?.errorText}`);
    });
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 4: Log Request Details
test('log request details', async ({ page }) => {
    page.on('request', request => {
        console.log('Request:', {
            url: request.url(),
            method: request.method(),
            headers: request.headers(),
            postData: request.postData(),
            resourceType: request.resourceType(),
        });
    });
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 5: Log Response Details
test('log response details', async ({ page }) => {
    page.on('response', async response => {
        console.log('Response:', {
            url: response.url(),
            status: response.status(),
            statusText: response.statusText(),
            headers: response.headers(),
        });
    });
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 6: Filter Requests by Type
test('filter requests by type', async ({ page }) => {
    page.on('request', request => {
        // Only log API requests
        if (request.resourceType() === 'fetch' || request.resourceType() === 'xhr') {
            console.log(`API: ${request.method()} ${request.url()}`);
        }
    });
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 7: Filter Requests by URL
test('filter requests by URL', async ({ page }) => {
    page.on('request', request => {
        // Only log specific URLs
        if (request.url().includes('/api/')) {
            console.log(`API: ${request.url()}`);
        }
    });
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 8: Log Response Body
test('log response body', async ({ page }) => {
    page.on('response', async response => {
        if (response.url().includes('/api/')) {
            try {
                const body = await response.text();
                console.log('Response body:', body.substring(0, 200));
            } catch (e) {
                // Body may not be available
            }
        }
    });
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 9: Network Timing
test('network timing', async ({ page }) => {
    page.on('request', request => {
        const timing = request.timing();
        console.log('Request timing:', timing);
    });
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 10: Collect All Requests
test('collect all requests', async ({ page }) => {
    const requests: string[] = [];
    
    page.on('request', request => {
        requests.push(request.url());
    });
    
    await page.goto('https://playwright.dev');
    
    console.log(`Total requests: ${requests.length}`);
    console.log('Requests:', requests.slice(0, 10));
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 11: Debug Specific Request
test('debug specific request', async ({ page }) => {
    const responsePromise = page.waitForResponse(
        response => response.url().includes('playwright')
    );
    
    await page.goto('https://playwright.dev');
    
    const response = await responsePromise;
    console.log('Response:', {
        url: response.url(),
        status: response.status(),
        ok: response.ok(),
    });
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 12: Network Debugging Best Practices
test('network debugging best practices', async ({ page }) => {
    /*
     * Best Practices:
     * 1. Log requests and responses
     * 2. Filter by type or URL
     * 3. Check failed requests
     * 4. Inspect response bodies
     * 5. Use HAR recording
     * 6. Check timing for performance
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

