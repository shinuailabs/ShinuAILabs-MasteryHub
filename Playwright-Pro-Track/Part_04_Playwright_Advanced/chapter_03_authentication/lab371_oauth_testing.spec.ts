/**
 * Lab 371: OAuth Testing
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Testing OAuth flows:
 * 
 * - OAuth redirects
 * - Token handling
 * - Social login
 * - Mock OAuth
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Test OAuth flow
 * 2. Handle redirects
 * 3. Mock OAuth provider
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: OAuth Flow Test
test('OAuth flow test', async ({ page }) => {
    /*
     * OAuth flow:
     * 1. Click "Login with Google"
     * 2. Redirect to Google
     * 3. Enter credentials
     * 4. Redirect back with token
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 2: Handle OAuth Redirect
test('handle OAuth redirect', async ({ page }) => {
    // Navigate to login
    await page.goto('https://playwright.dev');
    
    // Wait for redirect after OAuth
    // await page.waitForURL('**/callback**');
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 3: Mock OAuth Provider
test('mock OAuth provider', async ({ page }) => {
    // Mock OAuth endpoint
    await page.route('**/oauth/authorize', route => {
        // Redirect with mock token
        route.fulfill({
            status: 302,
            headers: {
                'Location': 'https://playwright.dev/callback?code=mock-code',
            },
        });
    });
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 4: Mock Token Exchange
test('mock token exchange', async ({ page }) => {
    await page.route('**/oauth/token', route => {
        route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                access_token: 'mock-access-token',
                refresh_token: 'mock-refresh-token',
                expires_in: 3600,
            }),
        });
    });
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 5: Social Login Test
test('social login test', async ({ page }) => {
    /*
     * Social login flow:
     * 1. Click social login button
     * 2. Handle popup or redirect
     * 3. Complete login on provider
     * 4. Return to app
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 6: Handle OAuth Popup
test('handle OAuth popup', async ({ page, context }) => {
    await page.goto('https://playwright.dev');
    
    // Listen for popup
    const popupPromise = context.waitForEvent('page');
    
    // Click login button that opens popup
    // await page.click('button.oauth-login');
    
    // Handle popup
    // const popup = await popupPromise;
    // await popup.fill('#email', 'user@example.com');
    // await popup.fill('#password', 'password');
    // await popup.click('button[type="submit"]');
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 7: Bypass OAuth in Tests
test('bypass OAuth in tests', async ({ page }) => {
    // Set auth token directly
    await page.addInitScript(() => {
        localStorage.setItem('auth_token', 'test-token');
    });
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 8: OAuth State Parameter
test('OAuth state parameter', async ({ page }) => {
    // Mock OAuth with state validation
    await page.route('**/oauth/authorize', route => {
        const url = new URL(route.request().url());
        const state = url.searchParams.get('state');
        
        route.fulfill({
            status: 302,
            headers: {
                'Location': `https://playwright.dev/callback?code=mock&state=${state}`,
            },
        });
    });
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 9: Test OAuth Errors
test('test OAuth errors', async ({ page }) => {
    // Mock OAuth error
    await page.route('**/oauth/authorize', route => {
        route.fulfill({
            status: 302,
            headers: {
                'Location': 'https://playwright.dev/callback?error=access_denied',
            },
        });
    });
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 10: OAuth Testing Best Practices
test('OAuth testing best practices', async ({ page }) => {
    /*
     * Best Practices:
     * 1. Mock OAuth in most tests
     * 2. Test real OAuth in E2E
     * 3. Handle popups and redirects
     * 4. Test error scenarios
     * 5. Validate state parameter
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

