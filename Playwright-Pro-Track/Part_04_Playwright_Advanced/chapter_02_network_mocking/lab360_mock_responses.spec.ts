/**
 * Lab 360: Mock Responses
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Creating mock responses:
 * 
 * - route.fulfill()
 * - Response options
 * - Mock data
 * - Error responses
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create mock responses
 * 2. Mock different status codes
 * 3. Mock error responses
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Basic Mock Response
test('basic mock response', async ({ page }) => {
    await page.route('**/api/data', route => {
        route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ message: 'Mocked!' }),
        });
    });
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 2: Mock with Headers
test('mock with headers', async ({ page }) => {
    await page.route('**/api/data', route => {
        route.fulfill({
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'X-Custom-Header': 'custom-value',
                'Cache-Control': 'no-cache',
            },
            body: JSON.stringify({ data: 'test' }),
        });
    });
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 3: Mock Error Response
test('mock error response', async ({ page }) => {
    await page.route('**/api/data', route => {
        route.fulfill({
            status: 500,
            contentType: 'application/json',
            body: JSON.stringify({
                error: 'Internal Server Error',
                message: 'Something went wrong',
            }),
        });
    });
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 4: Mock 404 Response
test('mock 404 response', async ({ page }) => {
    await page.route('**/api/users/999', route => {
        route.fulfill({
            status: 404,
            contentType: 'application/json',
            body: JSON.stringify({ error: 'User not found' }),
        });
    });
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 5: Mock Array Response
test('mock array response', async ({ page }) => {
    await page.route('**/api/users', route => {
        route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify([
                { id: 1, name: 'User 1' },
                { id: 2, name: 'User 2' },
                { id: 3, name: 'User 3' },
            ]),
        });
    });
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 6: Mock with Delay
test('mock with delay', async ({ page }) => {
    await page.route('**/api/slow', async route => {
        await new Promise(resolve => setTimeout(resolve, 2000));
        route.fulfill({
            status: 200,
            body: JSON.stringify({ delayed: true }),
        });
    });
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 7: Mock HTML Response
test('mock HTML response', async ({ page }) => {
    await page.route('**/page.html', route => {
        route.fulfill({
            status: 200,
            contentType: 'text/html',
            body: '<html><body><h1>Mocked Page</h1></body></html>',
        });
    });
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 8: Mock from File
test('mock from file', async ({ page }) => {
    await page.route('**/api/data', route => {
        // In real scenario, read from file
        const mockData = {
            users: [{ id: 1, name: 'Test' }],
            total: 1,
        };
        
        route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(mockData),
        });
    });
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 9: Dynamic Mock Response
test('dynamic mock response', async ({ page }) => {
    let requestCount = 0;
    
    await page.route('**/api/counter', route => {
        requestCount++;
        route.fulfill({
            status: 200,
            body: JSON.stringify({ count: requestCount }),
        });
    });
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 10: Mock Response Best Practices
test('mock response best practices', async ({ page }) => {
    /*
     * Best Practices:
     * 1. Use realistic mock data
     * 2. Mock all response fields
     * 3. Test error scenarios
     * 4. Use appropriate status codes
     * 5. Include proper headers
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

