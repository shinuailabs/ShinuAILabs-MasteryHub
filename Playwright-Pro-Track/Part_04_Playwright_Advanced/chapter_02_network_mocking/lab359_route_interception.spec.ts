/**
 * Lab 359: Route Interception
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Intercepting network routes:
 * 
 * - page.route()
 * - URL patterns
 * - Request handling
 * - Route actions
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Intercept routes
 * 2. Use URL patterns
 * 3. Handle requests
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Basic Route Interception
test('basic route interception', async ({ page }) => {
    await page.route('**/*.png', route => route.abort());
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 2: URL Pattern Matching
test('URL pattern matching', async ({ page }) => {
    // Glob pattern
    await page.route('**/api/**', route => route.continue());
    
    // Regex pattern
    await page.route(/\.css$/, route => route.continue());
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 3: Abort Requests
test('abort requests', async ({ page }) => {
    // Abort images
    await page.route('**/*.{png,jpg,jpeg,gif,svg}', route => route.abort());
    
    // Abort specific domain
    await page.route('**/analytics/**', route => route.abort());
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 4: Continue with Modifications
test('continue with modifications', async ({ page }) => {
    await page.route('**/api/**', route => {
        route.continue({
            headers: {
                ...route.request().headers(),
                'X-Custom-Header': 'custom-value',
            },
        });
    });
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 5: Fulfill with Mock
test('fulfill with mock', async ({ page }) => {
    await page.route('**/api/users', route => {
        route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify([{ id: 1, name: 'Mock User' }]),
        });
    });
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 6: Conditional Routing
test('conditional routing', async ({ page }) => {
    await page.route('**/*', route => {
        const url = route.request().url();
        
        if (url.includes('analytics')) {
            route.abort();
        } else if (url.includes('api')) {
            route.fulfill({ status: 200, body: '{}' });
        } else {
            route.continue();
        }
    });
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 7: Route by Method
test('route by method', async ({ page }) => {
    await page.route('**/api/**', route => {
        const method = route.request().method();
        
        if (method === 'POST') {
            route.fulfill({ status: 201, body: '{"id": 1}' });
        } else if (method === 'DELETE') {
            route.fulfill({ status: 204 });
        } else {
            route.continue();
        }
    });
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 8: Unroute
test('unroute', async ({ page }) => {
    const handler = (route: any) => route.abort();
    
    // Add route
    await page.route('**/*.png', handler);
    
    await page.goto('https://playwright.dev');
    
    // Remove route
    await page.unroute('**/*.png', handler);
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 9: Route Once
test('route once', async ({ page }) => {
    // Route only first matching request
    await page.route('**/api/**', route => {
        route.fulfill({ status: 200, body: '{"first": true}' });
    }, { times: 1 });
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 10: Route Interception Best Practices
test('route interception best practices', async ({ page }) => {
    /*
     * Best Practices:
     * 1. Use specific patterns
     * 2. Clean up routes when done
     * 3. Handle all route actions
     * 4. Log intercepted requests
     * 5. Use conditional routing
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

