/**
 * Lab 361: Modify Requests
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Modifying outgoing requests:
 * 
 * - Modify headers
 * - Modify URL
 * - Modify body
 * - Modify method
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Modify request headers
 * 2. Modify request URL
 * 3. Modify request body
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Add Headers
test('add headers', async ({ page }) => {
    await page.route('**/*', route => {
        route.continue({
            headers: {
                ...route.request().headers(),
                'X-Custom-Header': 'custom-value',
                'X-Test-ID': 'test-123',
            },
        });
    });
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 2: Remove Headers
test('remove headers', async ({ page }) => {
    await page.route('**/*', route => {
        const headers = { ...route.request().headers() };
        delete headers['accept-language'];
        
        route.continue({ headers });
    });
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 3: Modify Authorization
test('modify authorization', async ({ page }) => {
    await page.route('**/api/**', route => {
        route.continue({
            headers: {
                ...route.request().headers(),
                'Authorization': 'Bearer mock-token',
            },
        });
    });
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 4: Modify URL
test('modify URL', async ({ page }) => {
    await page.route('**/api/v1/**', route => {
        const url = route.request().url().replace('/v1/', '/v2/');
        route.continue({ url });
    });
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 5: Redirect Request
test('redirect request', async ({ page }) => {
    await page.route('**/old-endpoint', route => {
        route.continue({
            url: route.request().url().replace('old-endpoint', 'new-endpoint'),
        });
    });
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 6: Modify POST Body
test('modify POST body', async ({ page }) => {
    await page.route('**/api/submit', route => {
        const postData = route.request().postData();
        let data = postData ? JSON.parse(postData) : {};
        
        // Add extra field
        data.timestamp = Date.now();
        data.source = 'test';
        
        route.continue({
            postData: JSON.stringify(data),
        });
    });
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 7: Change Request Method
test('change request method', async ({ page }) => {
    await page.route('**/api/data', route => {
        // Change GET to POST
        if (route.request().method() === 'GET') {
            route.continue({
                method: 'POST',
                postData: JSON.stringify({ converted: true }),
            });
        } else {
            route.continue();
        }
    });
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 8: Add Query Parameters
test('add query parameters', async ({ page }) => {
    await page.route('**/api/**', route => {
        const url = new URL(route.request().url());
        url.searchParams.set('test', 'true');
        url.searchParams.set('timestamp', Date.now().toString());
        
        route.continue({ url: url.toString() });
    });
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 9: Conditional Modification
test('conditional modification', async ({ page }) => {
    await page.route('**/*', route => {
        const url = route.request().url();
        
        if (url.includes('api')) {
            route.continue({
                headers: {
                    ...route.request().headers(),
                    'X-API-Request': 'true',
                },
            });
        } else {
            route.continue();
        }
    });
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 10: Modify Requests Best Practices
test('modify requests best practices', async ({ page }) => {
    /*
     * Best Practices:
     * 1. Preserve existing headers
     * 2. Use specific route patterns
     * 3. Log modifications for debugging
     * 4. Handle all request types
     * 5. Test modified requests
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

