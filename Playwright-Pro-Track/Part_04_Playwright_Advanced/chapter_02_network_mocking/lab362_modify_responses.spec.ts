/**
 * Lab 362: Modify Responses
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Modifying incoming responses:
 * 
 * - Fetch and modify
 * - Change response body
 * - Change headers
 * - Change status
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Modify response body
 * 2. Modify response headers
 * 3. Modify response status
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Modify Response Body
test('modify response body', async ({ page }) => {
    await page.route('**/api/users', async route => {
        const response = await route.fetch();
        let body = await response.json();
        
        // Modify response
        body = body.map((user: any) => ({
            ...user,
            modified: true,
        }));
        
        await route.fulfill({
            response,
            body: JSON.stringify(body),
        });
    });
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 2: Add Fields to Response
test('add fields to response', async ({ page }) => {
    await page.route('**/api/data', async route => {
        const response = await route.fetch();
        const body = await response.json();
        
        // Add extra fields
        body.timestamp = Date.now();
        body.source = 'modified';
        
        await route.fulfill({
            response,
            body: JSON.stringify(body),
        });
    });
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 3: Filter Response Data
test('filter response data', async ({ page }) => {
    await page.route('**/api/users', async route => {
        const response = await route.fetch();
        let users = await response.json();
        
        // Filter data
        users = users.filter((user: any) => user.id <= 5);
        
        await route.fulfill({
            response,
            body: JSON.stringify(users),
        });
    });
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 4: Modify Response Headers
test('modify response headers', async ({ page }) => {
    await page.route('**/*', async route => {
        const response = await route.fetch();
        
        await route.fulfill({
            response,
            headers: {
                ...response.headers(),
                'X-Modified': 'true',
            },
        });
    });
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 5: Change Response Status
test('change response status', async ({ page }) => {
    await page.route('**/api/data', async route => {
        const response = await route.fetch();
        
        // Change 404 to 200 with empty data
        if (response.status() === 404) {
            await route.fulfill({
                status: 200,
                body: JSON.stringify({ data: [] }),
            });
        } else {
            await route.fulfill({ response });
        }
    });
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 6: Transform Response Format
test('transform response format', async ({ page }) => {
    await page.route('**/api/data', async route => {
        const response = await route.fetch();
        const data = await response.json();
        
        // Transform to different format
        const transformed = {
            items: data,
            count: data.length,
            success: true,
        };
        
        await route.fulfill({
            response,
            body: JSON.stringify(transformed),
        });
    });
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 7: Mask Sensitive Data
test('mask sensitive data', async ({ page }) => {
    await page.route('**/api/users', async route => {
        const response = await route.fetch();
        let users = await response.json();
        
        // Mask sensitive fields
        users = users.map((user: any) => ({
            ...user,
            email: '***@***.com',
            phone: '***-***-****',
        }));
        
        await route.fulfill({
            response,
            body: JSON.stringify(users),
        });
    });
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 8: Inject Error
test('inject error', async ({ page }) => {
    await page.route('**/api/data', async route => {
        const response = await route.fetch();
        
        // Inject error for testing
        await route.fulfill({
            status: 500,
            body: JSON.stringify({ error: 'Injected error' }),
        });
    });
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 9: Log and Pass Through
test('log and pass through', async ({ page }) => {
    await page.route('**/api/**', async route => {
        const response = await route.fetch();
        const body = await response.text();
        
        console.log('Response:', body.substring(0, 100));
        
        await route.fulfill({
            response,
            body,
        });
    });
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 10: Modify Responses Best Practices
test('modify responses best practices', async ({ page }) => {
    /*
     * Best Practices:
     * 1. Preserve original response structure
     * 2. Handle errors gracefully
     * 3. Log modifications
     * 4. Test edge cases
     * 5. Use for debugging
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

