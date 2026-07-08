/**
 * Lab 366: Network Mocking Best Practices
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Best practices for network mocking:
 * 
 * - When to mock
 * - Mock organization
 * - Maintenance
 * - Testing strategies
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Apply network mocking best practices
 * 2. Organize mocks
 * 3. Maintain mock data
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Centralized Mock Data
const mockData = {
    users: [
        { id: 1, name: 'User 1' },
        { id: 2, name: 'User 2' },
    ],
    posts: [
        { id: 1, title: 'Post 1' },
        { id: 2, title: 'Post 2' },
    ],
};

test('centralized mock data', async ({ page }) => {
    await page.route('**/api/users', route => {
        route.fulfill({
            status: 200,
            body: JSON.stringify(mockData.users),
        });
    });
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 2: Mock Helper Function
async function mockAPI(page: any, endpoint: string, data: any, status = 200) {
    await page.route(`**/api/${endpoint}`, route => {
        route.fulfill({
            status,
            contentType: 'application/json',
            body: JSON.stringify(data),
        });
    });
}

test('mock helper function', async ({ page }) => {
    await mockAPI(page, 'users', mockData.users);
    await mockAPI(page, 'posts', mockData.posts);
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 3: Mock Error Scenarios
async function mockError(page: any, endpoint: string, status: number, message: string) {
    await page.route(`**/api/${endpoint}`, route => {
        route.fulfill({
            status,
            body: JSON.stringify({ error: message }),
        });
    });
}

test('mock error scenarios', async ({ page }) => {
    await mockError(page, 'users', 500, 'Internal Server Error');
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 4: Conditional Mocking
test('conditional mocking', async ({ page }) => {
    const shouldMock = process.env.MOCK_API === 'true';
    
    if (shouldMock) {
        await page.route('**/api/**', route => {
            route.fulfill({ status: 200, body: '{}' });
        });
    }
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 5: Mock with Validation
test('mock with validation', async ({ page }) => {
    await page.route('**/api/submit', async route => {
        const postData = route.request().postData();
        
        if (!postData) {
            route.fulfill({ status: 400, body: '{"error": "No data"}' });
            return;
        }
        
        const data = JSON.parse(postData);
        if (!data.name) {
            route.fulfill({ status: 400, body: '{"error": "Name required"}' });
            return;
        }
        
        route.fulfill({ status: 200, body: '{"success": true}' });
    });
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 6: Mock Cleanup
test('mock cleanup', async ({ page }) => {
    // Add mocks
    await page.route('**/api/**', route => route.fulfill({ status: 200, body: '{}' }));
    
    await page.goto('https://playwright.dev');
    
    // Clean up all routes
    await page.unrouteAll();
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 7: Mock with Logging
test('mock with logging', async ({ page }) => {
    await page.route('**/api/**', route => {
        console.log(`Mocking: ${route.request().method()} ${route.request().url()}`);
        route.fulfill({ status: 200, body: '{}' });
    });
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 8: Selective Mocking
test('selective mocking', async ({ page }) => {
    // Only mock external APIs
    await page.route('**/external-api/**', route => {
        route.fulfill({ status: 200, body: '{}' });
    });
    
    // Let internal APIs pass through
    await page.route('**/internal-api/**', route => {
        route.continue();
    });
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 9: Mock State Management
test('mock state management', async ({ page }) => {
    let items: any[] = [];
    
    await page.route('**/api/items', async route => {
        const method = route.request().method();
        
        if (method === 'GET') {
            route.fulfill({ status: 200, body: JSON.stringify(items) });
        } else if (method === 'POST') {
            const data = JSON.parse(route.request().postData() || '{}');
            items.push({ id: items.length + 1, ...data });
            route.fulfill({ status: 201, body: JSON.stringify(items[items.length - 1]) });
        }
    });
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 10: Network Mocking Best Practices Summary
test('network mocking best practices summary', async ({ page }) => {
    /*
     * Best Practices Summary:
     * 
     * 1. When to Mock:
     *    - External APIs
     *    - Slow endpoints
     *    - Error scenarios
     *    - Unstable services
     * 
     * 2. Organization:
     *    - Centralize mock data
     *    - Use helper functions
     *    - Separate mock files
     * 
     * 3. Maintenance:
     *    - Keep mocks updated
     *    - Validate mock data
     *    - Document mocked endpoints
     * 
     * 4. Testing:
     *    - Test happy path
     *    - Test error scenarios
     *    - Test edge cases
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

