/**
 * Lab 365: Wait for Network
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Waiting for network activity:
 * 
 * - waitForRequest
 * - waitForResponse
 * - waitForLoadState
 * - Network idle
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Wait for requests
 * 2. Wait for responses
 * 3. Wait for network idle
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Wait for Request
test('wait for request', async ({ page }) => {
    const requestPromise = page.waitForRequest(request => 
        request.url().includes('playwright.dev') && request.method() === 'GET'
    );
    
    await page.goto('https://playwright.dev');
    const request = await requestPromise;
    
    expect(request.url()).toContain('playwright.dev');
});

// Solution 2: Wait for Response
test('wait for response', async ({ page }) => {
    const responsePromise = page.waitForResponse(response =>
        response.url().includes('playwright.dev') && response.status() === 200
    );
    
    await page.goto('https://playwright.dev');
    const response = await responsePromise;
    
    expect(response.status()).toBe(200);
});

// Solution 3: Wait for URL Pattern
test('wait for URL pattern', async ({ page }) => {
    const responsePromise = page.waitForResponse('**/playwright.dev/**');
    
    await page.goto('https://playwright.dev');
    const response = await responsePromise;
    
    expect(response.ok()).toBeTruthy();
});

// Solution 4: Wait for Network Idle
test('wait for network idle', async ({ page }) => {
    await page.goto('https://playwright.dev', {
        waitUntil: 'networkidle',
    });
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 5: Wait for Load State
test('wait for load state', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Wait for different load states
    await page.waitForLoadState('domcontentloaded');
    await page.waitForLoadState('load');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 6: Wait with Timeout
test('wait with timeout', async ({ page }) => {
    const responsePromise = page.waitForResponse('**/playwright.dev/**', {
        timeout: 30000,
    });
    
    await page.goto('https://playwright.dev');
    const response = await responsePromise;
    
    expect(response.ok()).toBeTruthy();
});

// Solution 7: Wait for Multiple Responses
test('wait for multiple responses', async ({ page }) => {
    const responses: any[] = [];
    
    page.on('response', response => {
        if (response.url().includes('playwright.dev')) {
            responses.push(response);
        }
    });
    
    await page.goto('https://playwright.dev');
    await page.waitForLoadState('networkidle');
    
    expect(responses.length).toBeGreaterThan(0);
});

// Solution 8: Wait for API Response
test('wait for API response', async ({ page }) => {
    // Navigate and wait for specific API
    const [response] = await Promise.all([
        page.waitForResponse(resp => resp.url().includes('api') && resp.status() === 200).catch(() => null),
        page.goto('https://playwright.dev'),
    ]);
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 9: Wait After Action
test('wait after action', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Click and wait for response
    const [response] = await Promise.all([
        page.waitForResponse('**/docs/**').catch(() => null),
        page.getByRole('link', { name: 'Get started' }).click(),
    ]);
    
    await expect(page).toHaveURL(/.*intro/);
});

// Solution 10: Wait for Network Best Practices
test('wait for network best practices', async ({ page }) => {
    /*
     * Best Practices:
     * 1. Use specific URL patterns
     * 2. Set appropriate timeouts
     * 3. Use Promise.all for parallel waits
     * 4. Handle missing responses
     * 5. Use networkidle sparingly
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

