/**
 * Lab 354: API Mocking
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Mocking API responses:
 * 
 * - route.fulfill()
 * - Mock responses
 * - Mock errors
 * - Conditional mocking
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Mock API responses
 * 2. Mock error responses
 * 3. Use conditional mocking
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Basic API Mock
test('basic API mock', async ({ page }) => {
    await page.route('**/api/users', async (route) => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify([
                { id: 1, name: 'Mock User' },
            ]),
        });
    });
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 2: Mock with JSON File
test('mock with JSON data', async ({ page }) => {
    const mockData = {
        posts: [
            { id: 1, title: 'Mock Post 1' },
            { id: 2, title: 'Mock Post 2' },
        ],
    };
    
    await page.route('**/api/posts', async (route) => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(mockData),
        });
    });
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 3: Mock Error Response
test('mock error response', async ({ page }) => {
    await page.route('**/api/users', async (route) => {
        await route.fulfill({
            status: 500,
            contentType: 'application/json',
            body: JSON.stringify({ error: 'Internal Server Error' }),
        });
    });
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 4: Mock 404 Response
test('mock 404 response', async ({ page }) => {
    await page.route('**/api/users/999', async (route) => {
        await route.fulfill({
            status: 404,
            contentType: 'application/json',
            body: JSON.stringify({ error: 'Not Found' }),
        });
    });
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 5: Mock with Headers
test('mock with headers', async ({ page }) => {
    await page.route('**/api/users', async (route) => {
        await route.fulfill({
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'X-Custom-Header': 'custom-value',
            },
            body: JSON.stringify({ data: 'test' }),
        });
    });
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 6: Conditional Mock
test('conditional mock', async ({ page }) => {
    await page.route('**/api/**', async (route) => {
        const url = route.request().url();
        
        if (url.includes('/users')) {
            await route.fulfill({
                status: 200,
                body: JSON.stringify({ users: [] }),
            });
        } else if (url.includes('/posts')) {
            await route.fulfill({
                status: 200,
                body: JSON.stringify({ posts: [] }),
            });
        } else {
            await route.continue();
        }
    });
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 7: Mock Based on Method
test('mock based on method', async ({ page }) => {
    await page.route('**/api/users', async (route) => {
        const method = route.request().method();
        
        if (method === 'GET') {
            await route.fulfill({
                status: 200,
                body: JSON.stringify([{ id: 1 }]),
            });
        } else if (method === 'POST') {
            await route.fulfill({
                status: 201,
                body: JSON.stringify({ id: 2 }),
            });
        } else {
            await route.continue();
        }
    });
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 8: Mock with Delay
test('mock with delay', async ({ page }) => {
    await page.route('**/api/users', async (route) => {
        // Simulate slow response
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        await route.fulfill({
            status: 200,
            body: JSON.stringify({ data: 'delayed' }),
        });
    });
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 9: Modify Response
test('modify response', async ({ page }) => {
    await page.route('**/api/users', async (route) => {
        const response = await route.fetch();
        const json = await response.json();
        
        // Modify response
        json.modified = true;
        
        await route.fulfill({
            response,
            body: JSON.stringify(json),
        });
    });
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 10: API Mocking Best Practices
test('API mocking best practices', async ({ page }) => {
    /*
     * Best Practices:
     * 1. Mock external APIs
     * 2. Test error scenarios
     * 3. Use realistic data
     * 4. Clean up routes
     * 5. Document mocked endpoints
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

