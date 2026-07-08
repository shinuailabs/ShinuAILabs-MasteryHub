/**
 * Lab 304: Wait for Response
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Waiting for network responses:
 * 
 * - waitForResponse()
 * - Response matching
 * - Response data
 * - Timeout handling
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Wait for API responses
 * 2. Match response URLs
 * 3. Access response data
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Wait for Response by URL
test('wait for response by URL', async ({ page }) => {
    // Start waiting before navigation
    const responsePromise = page.waitForResponse('https://playwright.dev/');
    
    await page.goto('https://playwright.dev');
    
    const response = await responsePromise;
    expect(response.status()).toBe(200);
});

// Solution 2: Wait for Response by URL Pattern
test('wait for response by URL pattern', async ({ page }) => {
    const responsePromise = page.waitForResponse(/playwright\.dev/);
    
    await page.goto('https://playwright.dev');
    
    const response = await responsePromise;
    expect(response.ok()).toBe(true);
});

// Solution 3: Wait for Response with Predicate
test('wait for response with predicate', async ({ page }) => {
    const responsePromise = page.waitForResponse(
        response => response.url().includes('playwright') && response.status() === 200
    );
    
    await page.goto('https://playwright.dev');
    
    const response = await responsePromise;
    expect(response.status()).toBe(200);
});

// Solution 4: Wait for API Response
test('wait for API response', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Wait for API call
    const responsePromise = page.waitForResponse(
        response => response.url().includes('/api/') && response.status() === 200
    );
    
    // Trigger API call
    // await page.getByRole('button', { name: 'Load Data' }).click();
    
    // const response = await responsePromise;
    // const data = await response.json();
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 5: Response with Timeout
test('response with timeout', async ({ page }) => {
    const responsePromise = page.waitForResponse('https://playwright.dev/', {
        timeout: 10000,
    });
    
    await page.goto('https://playwright.dev');
    
    const response = await responsePromise;
    expect(response.ok()).toBe(true);
});

// Solution 6: Get Response Body
test('get response body', async ({ page }) => {
    const responsePromise = page.waitForResponse('https://playwright.dev/');
    
    await page.goto('https://playwright.dev');
    
    const response = await responsePromise;
    
    // Get response body as text
    const body = await response.text();
    expect(body).toContain('Playwright');
});

// Solution 7: Get Response JSON
test('get response JSON', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // For JSON API responses
    // const responsePromise = page.waitForResponse('/api/data');
    // await page.click('#load-data');
    // const response = await responsePromise;
    // const json = await response.json();
    // expect(json.success).toBe(true);
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 8: Response Headers
test('response headers', async ({ page }) => {
    const responsePromise = page.waitForResponse('https://playwright.dev/');
    
    await page.goto('https://playwright.dev');
    
    const response = await responsePromise;
    
    // Get headers
    const headers = response.headers();
    expect(headers['content-type']).toContain('text/html');
});

// Solution 9: Multiple Responses
test('multiple responses', async ({ page }) => {
    const responses: any[] = [];
    
    // Collect all responses
    page.on('response', response => {
        if (response.url().includes('playwright')) {
            responses.push(response);
        }
    });
    
    await page.goto('https://playwright.dev');
    await page.waitForLoadState('networkidle');
    
    expect(responses.length).toBeGreaterThan(0);
});

// Solution 10: Wait for Response After Action
test('wait for response after action', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Wait for response triggered by action
    const [response] = await Promise.all([
        page.waitForResponse(resp => resp.url().includes('intro')),
        page.getByRole('link', { name: 'Get started' }).click(),
    ]);
    
    expect(response.status()).toBe(200);
});

// Solution 11: Response Status Codes
test('response status codes', async ({ page }) => {
    const responsePromise = page.waitForResponse('https://playwright.dev/');
    
    await page.goto('https://playwright.dev');
    
    const response = await responsePromise;
    
    // Check status
    expect(response.status()).toBe(200);
    expect(response.ok()).toBe(true); // 200-299
    expect(response.statusText()).toBe('OK');
});

// Solution 12: Response Request
test('response request', async ({ page }) => {
    const responsePromise = page.waitForResponse('https://playwright.dev/');
    
    await page.goto('https://playwright.dev');
    
    const response = await responsePromise;
    
    // Get original request
    const request = response.request();
    expect(request.method()).toBe('GET');
    expect(request.url()).toContain('playwright');
});

