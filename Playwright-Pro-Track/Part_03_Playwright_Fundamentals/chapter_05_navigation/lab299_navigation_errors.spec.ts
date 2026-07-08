/**
 * Lab 299: Navigation Errors
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Handling navigation errors:
 * 
 * - Timeout errors
 * - Network errors
 * - HTTP errors
 * - Error recovery
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Handle navigation timeouts
 * 2. Handle network errors
 * 3. Recover from errors
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Handle Timeout Error
test('handle timeout error', async ({ page }) => {
    try {
        await page.goto('https://playwright.dev', {
            timeout: 1, // Very short timeout
        });
    } catch (error: any) {
        expect(error.message).toContain('Timeout');
    }
});

// Solution 2: Handle Network Error
test('handle network error', async ({ page }) => {
    try {
        // Non-existent domain
        await page.goto('https://nonexistent-domain-12345.com', {
            timeout: 5000,
        });
    } catch (error: any) {
        // Network error expected
        expect(error).toBeDefined();
    }
});

// Solution 3: Check Response Status
test('check response status', async ({ page }) => {
    const response = await page.goto('https://playwright.dev');
    
    expect(response).not.toBeNull();
    expect(response!.status()).toBe(200);
    expect(response!.ok()).toBe(true);
});

// Solution 4: Handle 404 Error
test('handle 404 error', async ({ page }) => {
    const response = await page.goto('https://playwright.dev/nonexistent-page-12345');
    
    // Page loads but returns 404
    expect(response).not.toBeNull();
    expect(response!.status()).toBe(404);
    expect(response!.ok()).toBe(false);
});

// Solution 5: Handle 500 Error
test('handle 500 error', async ({ page }) => {
    // Mock 500 error
    await page.route('**/api/error', route => {
        route.fulfill({
            status: 500,
            body: 'Internal Server Error',
        });
    });
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 6: Retry on Error
test('retry on error', async ({ page }) => {
    let attempts = 0;
    const maxAttempts = 3;
    
    while (attempts < maxAttempts) {
        try {
            await page.goto('https://playwright.dev', {
                timeout: 30000,
            });
            break; // Success
        } catch (error) {
            attempts++;
            if (attempts === maxAttempts) {
                throw error;
            }
            await page.waitForTimeout(1000);
        }
    }
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 7: Navigation with Fallback
test('navigation with fallback', async ({ page }) => {
    const urls = [
        'https://playwright.dev',
        'https://playwright.dev/docs/intro',
    ];
    
    for (const url of urls) {
        try {
            await page.goto(url, { timeout: 10000 });
            break; // Success
        } catch (error) {
            console.log(`Failed to load ${url}`);
        }
    }
    
    await expect(page.locator('body')).toBeVisible();
});

// Solution 8: Abort Navigation
test('abort navigation', async ({ page }) => {
    // Abort specific requests
    await page.route('**/slow-resource', route => {
        route.abort();
    });
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 9: Navigation Error Events
test('navigation error events', async ({ page }) => {
    const errors: string[] = [];
    
    page.on('pageerror', error => {
        errors.push(error.message);
    });
    
    page.on('requestfailed', request => {
        console.log('Request failed:', request.url());
    });
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 10: Validate Navigation Success
test('validate navigation success', async ({ page }) => {
    const response = await page.goto('https://playwright.dev');
    
    // Validate successful navigation
    expect(response).not.toBeNull();
    expect(response!.ok()).toBe(true);
    expect(response!.status()).toBeLessThan(400);
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 11: Handle SSL Errors
test('handle SSL errors', async ({ page }) => {
    // SSL errors are handled by browser context
    // Configure in playwright.config.ts:
    // use: { ignoreHTTPSErrors: true }
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 12: Error Recovery Pattern
test('error recovery pattern', async ({ page }) => {
    async function safeNavigate(url: string) {
        try {
            const response = await page.goto(url, { timeout: 10000 });
            return { success: true, response };
        } catch (error) {
            return { success: false, error };
        }
    }
    
    const result = await safeNavigate('https://playwright.dev');
    
    expect(result.success).toBe(true);
    await expect(page).toHaveTitle(/Playwright/);
});

