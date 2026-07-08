/**
 * Lab 356: API with UI Testing
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Combining API and UI tests:
 * 
 * - Setup via API
 * - Verify via UI
 * - Hybrid testing
 * - Data seeding
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Setup data via API
 * 2. Verify in UI
 * 3. Clean up via API
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: API Setup, UI Verify
test('API setup, UI verify', async ({ page, request }) => {
    // Setup via API
    const response = await request.post('https://jsonplaceholder.typicode.com/posts', {
        data: {
            title: 'Test Post',
            body: 'Test Body',
            userId: 1,
        },
    });
    expect(response.status()).toBe(201);
    
    // Verify in UI
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 2: UI Action, API Verify
test('UI action, API verify', async ({ page, request }) => {
    // Perform UI action
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
    
    // Verify via API
    const response = await request.get('https://jsonplaceholder.typicode.com/posts/1');
    expect(response.ok()).toBeTruthy();
});

// Solution 3: Data Seeding
test('data seeding', async ({ page, request }) => {
    // Seed test data via API
    const users = [
        { name: 'User 1', email: 'user1@test.com' },
        { name: 'User 2', email: 'user2@test.com' },
    ];
    
    for (const user of users) {
        await request.post('https://jsonplaceholder.typicode.com/users', {
            data: user,
        });
    }
    
    // Test UI with seeded data
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 4: Authentication via API
test('authentication via API', async ({ page, request }) => {
    // Login via API
    const loginResponse = await request.post('https://jsonplaceholder.typicode.com/posts', {
        data: {
            username: 'testuser',
            password: 'testpass',
        },
    });
    expect(loginResponse.status()).toBe(201);
    
    // Use authenticated session in UI
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 5: Cleanup via API
test('cleanup via API', async ({ page, request }) => {
    // Create test data
    const createRes = await request.post('https://jsonplaceholder.typicode.com/posts', {
        data: { title: 'Test', body: 'Body', userId: 1 },
    });
    const created = await createRes.json();
    
    // Test UI
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
    
    // Cleanup via API
    await request.delete(`https://jsonplaceholder.typicode.com/posts/${created.id}`);
});

// Solution 6: Mock API in UI Test
test('mock API in UI test', async ({ page }) => {
    // Mock API response
    await page.route('**/api/data', async (route) => {
        await route.fulfill({
            status: 200,
            body: JSON.stringify({ data: 'mocked' }),
        });
    });
    
    // Test UI with mocked API
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 7: Intercept and Verify
test('intercept and verify', async ({ page }) => {
    let apiCalled = false;
    
    // Intercept API call
    await page.route('**/api/**', async (route) => {
        apiCalled = true;
        await route.continue();
    });
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 8: Wait for API Response
test('wait for API response', async ({ page }) => {
    // Navigate and wait for API
    const [response] = await Promise.all([
        page.waitForResponse('**/api/**').catch(() => null),
        page.goto('https://playwright.dev'),
    ]);
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 9: Parallel Setup
test('parallel setup', async ({ page, request }) => {
    // Setup multiple resources in parallel
    await Promise.all([
        request.post('https://jsonplaceholder.typicode.com/posts', {
            data: { title: 'Post 1', body: 'Body 1', userId: 1 },
        }),
        request.post('https://jsonplaceholder.typicode.com/posts', {
            data: { title: 'Post 2', body: 'Body 2', userId: 1 },
        }),
    ]);
    
    // Test UI
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 10: API with UI Best Practices
test('API with UI best practices', async ({ page, request }) => {
    /*
     * Best Practices:
     * 1. Use API for fast setup
     * 2. Use UI for user-facing tests
     * 3. Clean up test data
     * 4. Mock external APIs
     * 5. Verify critical paths via API
     */
    
    const response = await request.get('https://jsonplaceholder.typicode.com/posts/1');
    expect(response.ok()).toBeTruthy();
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

