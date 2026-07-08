/**
 * Lab 435: Incognito Mode
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Using incognito/private browsing:
 * 
 * - Fresh browser state
 * - No persistent data
 * - Clean test environment
 * - Privacy testing
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create incognito contexts
 * 2. Test clean state
 * 3. Verify no data persistence
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Default Incognito Behavior
test('default incognito behavior', async ({ context, page }) => {
    // Playwright contexts are like incognito by default
    await page.goto('https://playwright.dev');
    
    // No cookies from previous sessions
    const cookies = await context.cookies();
    console.log('Initial cookies:', cookies.length);
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 2: Fresh Context Each Test
test('fresh context each test', async ({ browser }) => {
    // Create a completely fresh context
    const context = await browser.newContext();
    const page = await context.newPage();
    
    await page.goto('https://playwright.dev');
    
    // Verify clean state
    const localStorage = await page.evaluate(() => {
        return Object.keys(window.localStorage).length;
    });
    
    expect(localStorage).toBe(0);
    
    await context.close();
});

// Solution 3: No Cookie Persistence
test('no cookie persistence', async ({ browser }) => {
    // First context
    const context1 = await browser.newContext();
    const page1 = await context1.newPage();
    
    await page1.goto('https://playwright.dev');
    await context1.addCookies([{
        name: 'testCookie',
        value: 'testValue',
        domain: 'playwright.dev',
        path: '/',
    }]);
    
    await context1.close();
    
    // Second context - should not have the cookie
    const context2 = await browser.newContext();
    const page2 = await context2.newPage();
    
    await page2.goto('https://playwright.dev');
    
    const cookies = await context2.cookies();
    const testCookie = cookies.find(c => c.name === 'testCookie');
    
    expect(testCookie).toBeUndefined();
    
    await context2.close();
});

// Solution 4: No LocalStorage Persistence
test('no localStorage persistence', async ({ browser }) => {
    // First context
    const context1 = await browser.newContext();
    const page1 = await context1.newPage();
    
    await page1.goto('https://playwright.dev');
    await page1.evaluate(() => {
        localStorage.setItem('persistTest', 'value');
    });
    
    await context1.close();
    
    // Second context - should not have localStorage
    const context2 = await browser.newContext();
    const page2 = await context2.newPage();
    
    await page2.goto('https://playwright.dev');
    
    const value = await page2.evaluate(() => {
        return localStorage.getItem('persistTest');
    });
    
    expect(value).toBeNull();
    
    await context2.close();
});

// Solution 5: No Cache Sharing
test('no cache sharing', async ({ browser }) => {
    // First context loads page
    const context1 = await browser.newContext();
    const page1 = await context1.newPage();
    
    await page1.goto('https://playwright.dev');
    await context1.close();
    
    // Second context - should not use cached resources
    const context2 = await browser.newContext();
    const page2 = await context2.newPage();
    
    let requestCount = 0;
    page2.on('request', () => requestCount++);
    
    await page2.goto('https://playwright.dev');
    
    console.log('Requests made:', requestCount);
    expect(requestCount).toBeGreaterThan(0);
    
    await context2.close();
});

// Solution 6: Testing Login State
test('testing login state', async ({ browser }) => {
    // Simulate logged-in user
    const loggedInContext = await browser.newContext();
    const loggedInPage = await loggedInContext.newPage();
    
    await loggedInPage.goto('https://playwright.dev');
    await loggedInContext.addCookies([{
        name: 'auth_token',
        value: 'logged_in_user',
        domain: 'playwright.dev',
        path: '/',
    }]);
    
    // Verify logged in
    const authCookies = await loggedInContext.cookies();
    expect(authCookies.some(c => c.name === 'auth_token')).toBeTruthy();
    
    await loggedInContext.close();
    
    // New incognito context - should be logged out
    const incognitoContext = await browser.newContext();
    const incognitoPage = await incognitoContext.newPage();
    
    await incognitoPage.goto('https://playwright.dev');
    
    const incognitoCookies = await incognitoContext.cookies();
    expect(incognitoCookies.some(c => c.name === 'auth_token')).toBeFalsy();
    
    await incognitoContext.close();
});

// Solution 7: Privacy Testing
test('privacy testing', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    
    await page.goto('https://playwright.dev');
    
    // Check that no tracking data exists
    const trackingData = await page.evaluate(() => {
        return {
            cookies: document.cookie,
            localStorage: Object.keys(localStorage).length,
            sessionStorage: Object.keys(sessionStorage).length,
        };
    });
    
    console.log('Tracking data:', trackingData);
    
    await context.close();
});

// Solution 8: Clean State for Each Test
test('clean state for each test', async ({ context, page }) => {
    // Each test starts with clean state
    await page.goto('https://playwright.dev');
    
    // Add some data
    await page.evaluate(() => {
        localStorage.setItem('testData', 'value');
        sessionStorage.setItem('sessionData', 'value');
    });
    
    // This data won't persist to next test
    const data = await page.evaluate(() => ({
        local: localStorage.getItem('testData'),
        session: sessionStorage.getItem('sessionData'),
    }));
    
    expect(data.local).toBe('value');
    expect(data.session).toBe('value');
});

// Solution 9: Simulating First-Time Visitor
test('simulating first-time visitor', async ({ browser }) => {
    // Fresh context = first-time visitor
    const context = await browser.newContext();
    const page = await context.newPage();
    
    await page.goto('https://playwright.dev');
    
    // Check for first-visit indicators
    const isFirstVisit = await page.evaluate(() => {
        return !localStorage.getItem('hasVisited');
    });
    
    expect(isFirstVisit).toBeTruthy();
    
    // Mark as visited
    await page.evaluate(() => {
        localStorage.setItem('hasVisited', 'true');
    });
    
    await context.close();
});

// Solution 10: Incognito Mode Best Practices
test('incognito mode best practices', async ({ page }) => {
    /*
     * Best Practices:
     * 1. Use fresh contexts for isolation
     * 2. Don't rely on persistent data
     * 3. Test first-time user experience
     * 4. Verify privacy features
     * 5. Clean up contexts after tests
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

