/**
 * Lab 395: Network Conditions
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Simulating network conditions:
 * 
 * - Slow networks
 * - Offline mode
 * - Throttling
 * - Latency
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Simulate slow network
 * 2. Test offline mode
 * 3. Add network latency
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Offline Mode
test('offline mode', async ({ context, page }) => {
    await page.goto('https://playwright.dev');
    
    // Go offline
    await context.setOffline(true);
    
    // Try to navigate (will fail)
    // await page.goto('https://example.com').catch(e => console.log('Offline:', e.message));
    
    // Go back online
    await context.setOffline(false);
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 2: Slow Network Simulation
test('slow network simulation', async ({ page }) => {
    // Simulate slow network with route delay
    await page.route('**/*', async route => {
        await new Promise(resolve => setTimeout(resolve, 500));
        await route.continue();
    });
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 3: 3G Network Simulation
test('3G network simulation', async ({ page }) => {
    // Simulate 3G-like conditions
    await page.route('**/*', async route => {
        // Add latency
        await new Promise(resolve => setTimeout(resolve, 100));
        await route.continue();
    });
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 4: Slow Images
test('slow images', async ({ page }) => {
    // Slow down image loading
    await page.route('**/*.{png,jpg,jpeg,gif,svg}', async route => {
        await new Promise(resolve => setTimeout(resolve, 2000));
        await route.continue();
    });
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 5: Block Resources
test('block resources', async ({ page }) => {
    // Block images to simulate slow network
    await page.route('**/*.{png,jpg,jpeg,gif,svg}', route => route.abort());
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 6: Conditional Throttling
test('conditional throttling', async ({ page }) => {
    await page.route('**/*', async route => {
        const url = route.request().url();
        
        // Slow down API calls
        if (url.includes('api')) {
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        await route.continue();
    });
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 7: Network Failure Simulation
test('network failure simulation', async ({ page }) => {
    // Fail specific requests
    await page.route('**/api/**', route => {
        route.abort('failed');
    });
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 8: Intermittent Connection
test('intermittent connection', async ({ page }) => {
    let requestCount = 0;
    
    await page.route('**/*', async route => {
        requestCount++;
        
        // Fail every 3rd request
        if (requestCount % 3 === 0) {
            await route.abort('failed');
        } else {
            await route.continue();
        }
    });
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 9: Test Loading States
test('test loading states', async ({ page }) => {
    // Delay main content
    await page.route('**/playwright.dev/**', async route => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        await route.continue();
    });
    
    // Navigate and check loading state
    const navigationPromise = page.goto('https://playwright.dev');
    
    // Check for loading indicators
    // await expect(page.locator('.loading')).toBeVisible();
    
    await navigationPromise;
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 10: Network Conditions Best Practices
test('network conditions best practices', async ({ page }) => {
    /*
     * Best Practices:
     * 1. Test offline scenarios
     * 2. Test slow networks
     * 3. Test loading states
     * 4. Test error handling
     * 5. Use realistic delays
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

