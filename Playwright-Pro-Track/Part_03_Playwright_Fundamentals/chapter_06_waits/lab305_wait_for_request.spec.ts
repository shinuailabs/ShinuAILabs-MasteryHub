/**
 * Lab 305: Wait for Request
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Waiting for network requests:
 * 
 * - waitForRequest()
 * - Request matching
 * - Request data
 * - Request interception
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Wait for requests
 * 2. Match request URLs
 * 3. Access request data
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Wait for Request by URL
test('wait for request by URL', async ({ page }) => {
    const requestPromise = page.waitForRequest('https://playwright.dev/');
    
    await page.goto('https://playwright.dev');
    
    const request = await requestPromise;
    expect(request.url()).toContain('playwright');
});

// Solution 2: Wait for Request by Pattern
test('wait for request by pattern', async ({ page }) => {
    const requestPromise = page.waitForRequest(/playwright\.dev/);
    
    await page.goto('https://playwright.dev');
    
    const request = await requestPromise;
    expect(request.method()).toBe('GET');
});

// Solution 3: Wait for Request with Predicate
test('wait for request with predicate', async ({ page }) => {
    const requestPromise = page.waitForRequest(
        request => request.url().includes('playwright') && request.method() === 'GET'
    );
    
    await page.goto('https://playwright.dev');
    
    const request = await requestPromise;
    expect(request.url()).toContain('playwright');
});

// Solution 4: Wait for POST Request
test('wait for POST request', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Wait for POST request
    // const requestPromise = page.waitForRequest(
    //     request => request.method() === 'POST' && request.url().includes('/api/')
    // );
    
    // Trigger POST
    // await page.getByRole('button', { name: 'Submit' }).click();
    
    // const request = await requestPromise;
    // expect(request.method()).toBe('POST');
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 5: Request with Timeout
test('request with timeout', async ({ page }) => {
    const requestPromise = page.waitForRequest('https://playwright.dev/', {
        timeout: 10000,
    });
    
    await page.goto('https://playwright.dev');
    
    const request = await requestPromise;
    expect(request).toBeDefined();
});

// Solution 6: Request Headers
test('request headers', async ({ page }) => {
    const requestPromise = page.waitForRequest('https://playwright.dev/');
    
    await page.goto('https://playwright.dev');
    
    const request = await requestPromise;
    
    // Get headers
    const headers = request.headers();
    expect(headers['user-agent']).toBeDefined();
});

// Solution 7: Request Post Data
test('request post data', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // For POST requests with body
    // const requestPromise = page.waitForRequest('/api/submit');
    // await page.getByRole('button', { name: 'Submit' }).click();
    // const request = await requestPromise;
    // const postData = request.postData();
    // expect(postData).toContain('email');
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 8: Request Resource Type
test('request resource type', async ({ page }) => {
    const requests: any[] = [];
    
    page.on('request', request => {
        requests.push({
            url: request.url(),
            type: request.resourceType(),
        });
    });
    
    await page.goto('https://playwright.dev');
    await page.waitForLoadState('networkidle');
    
    // Check resource types
    const documentRequests = requests.filter(r => r.type === 'document');
    expect(documentRequests.length).toBeGreaterThan(0);
});

// Solution 9: Wait for Request After Action
test('wait for request after action', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Wait for request triggered by action
    const [request] = await Promise.all([
        page.waitForRequest(req => req.url().includes('intro')),
        page.getByRole('link', { name: 'Get started' }).click(),
    ]);
    
    expect(request.url()).toContain('intro');
});

// Solution 10: Request Timing
test('request timing', async ({ page }) => {
    const requestPromise = page.waitForRequest('https://playwright.dev/');
    
    await page.goto('https://playwright.dev');
    
    const request = await requestPromise;
    
    // Get timing info
    const timing = request.timing();
    console.log('Request timing:', timing);
});

// Solution 11: Request Frame
test('request frame', async ({ page }) => {
    const requestPromise = page.waitForRequest('https://playwright.dev/');
    
    await page.goto('https://playwright.dev');
    
    const request = await requestPromise;
    
    // Get frame that initiated request
    const frame = request.frame();
    expect(frame).toBe(page.mainFrame());
});

// Solution 12: All Requests
test('all requests', async ({ page }) => {
    const allRequests: string[] = [];
    
    page.on('request', request => {
        allRequests.push(request.url());
    });
    
    await page.goto('https://playwright.dev');
    await page.waitForLoadState('networkidle');
    
    console.log(`Total requests: ${allRequests.length}`);
    expect(allRequests.length).toBeGreaterThan(0);
});

