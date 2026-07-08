/**
 * Lab 433: Storage State
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Managing storage state:
 * 
 * - Saving storage state
 * - Loading storage state
 * - Reusing authentication
 * - State persistence
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Save storage state
 * 2. Load storage state
 * 3. Reuse authentication
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Save Storage State
test('save storage state', async ({ context, page }) => {
    await page.goto('https://playwright.dev');
    
    // Add some cookies and localStorage
    await context.addCookies([{
        name: 'session',
        value: 'abc123',
        domain: 'playwright.dev',
        path: '/',
    }]);
    
    await page.evaluate(() => {
        localStorage.setItem('user', 'testuser');
    });
    
    // Save storage state
    const storageState = await context.storageState();
    
    console.log('Cookies:', storageState.cookies.length);
    console.log('Origins:', storageState.origins.length);
});

// Solution 2: Save Storage State to File
test('save storage state to file', async ({ context, page }) => {
    await page.goto('https://playwright.dev');
    
    // Add authentication data
    await context.addCookies([{
        name: 'authToken',
        value: 'token123',
        domain: 'playwright.dev',
        path: '/',
    }]);
    
    // Save to file
    await context.storageState({ path: 'storage-state.json' });
    
    console.log('Storage state saved to storage-state.json');
});

// Solution 3: Load Storage State
test('load storage state', async ({ browser }) => {
    // First, create a context with some state
    const setupContext = await browser.newContext();
    const setupPage = await setupContext.newPage();
    
    await setupPage.goto('https://playwright.dev');
    await setupContext.addCookies([{
        name: 'testCookie',
        value: 'testValue',
        domain: 'playwright.dev',
        path: '/',
    }]);
    
    // Save the state
    const storageState = await setupContext.storageState();
    await setupContext.close();
    
    // Create new context with saved state
    const newContext = await browser.newContext({ storageState });
    const newPage = await newContext.newPage();
    
    await newPage.goto('https://playwright.dev');
    
    // Verify cookies are loaded
    const cookies = await newContext.cookies();
    const testCookie = cookies.find(c => c.name === 'testCookie');
    
    expect(testCookie?.value).toBe('testValue');
    
    await newContext.close();
});

// Solution 4: Reusing Authentication
test('reusing authentication', async ({ browser }) => {
    // Simulate login and save state
    const loginContext = await browser.newContext();
    const loginPage = await loginContext.newPage();
    
    await loginPage.goto('https://playwright.dev');
    
    // Simulate authentication
    await loginContext.addCookies([{
        name: 'auth_session',
        value: 'authenticated_user_session',
        domain: 'playwright.dev',
        path: '/',
        expires: Date.now() / 1000 + 3600, // 1 hour
    }]);
    
    // Save authenticated state
    const authState = await loginContext.storageState();
    await loginContext.close();
    
    // Use authenticated state in new context
    const testContext = await browser.newContext({ storageState: authState });
    const testPage = await testContext.newPage();
    
    await testPage.goto('https://playwright.dev');
    
    // User should be authenticated
    const cookies = await testContext.cookies();
    const authCookie = cookies.find(c => c.name === 'auth_session');
    
    expect(authCookie).toBeDefined();
    
    await testContext.close();
});

// Solution 5: Storage State with localStorage
test('storage state with localStorage', async ({ browser }) => {
    const context1 = await browser.newContext();
    const page1 = await context1.newPage();
    
    await page1.goto('https://playwright.dev');
    
    // Set localStorage
    await page1.evaluate(() => {
        localStorage.setItem('preferences', JSON.stringify({ theme: 'dark' }));
        localStorage.setItem('lastVisit', new Date().toISOString());
    });
    
    // Save state
    const state = await context1.storageState();
    await context1.close();
    
    // Load in new context
    const context2 = await browser.newContext({ storageState: state });
    const page2 = await context2.newPage();
    
    await page2.goto('https://playwright.dev');
    
    // Verify localStorage
    const preferences = await page2.evaluate(() => {
        return localStorage.getItem('preferences');
    });
    
    expect(JSON.parse(preferences!).theme).toBe('dark');
    
    await context2.close();
});

// Solution 6: Clearing Storage State
test('clearing storage state', async ({ context, page }) => {
    await page.goto('https://playwright.dev');
    
    // Add data
    await context.addCookies([{
        name: 'toBeCleared',
        value: 'value',
        domain: 'playwright.dev',
        path: '/',
    }]);
    
    // Clear cookies
    await context.clearCookies();
    
    // Verify cleared
    const cookies = await context.cookies();
    const clearedCookie = cookies.find(c => c.name === 'toBeCleared');
    
    expect(clearedCookie).toBeUndefined();
});

// Solution 7: Partial Storage State
test('partial storage state', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    
    await page.goto('https://playwright.dev');
    
    // Add multiple cookies
    await context.addCookies([
        { name: 'keep', value: 'keepValue', domain: 'playwright.dev', path: '/' },
        { name: 'remove', value: 'removeValue', domain: 'playwright.dev', path: '/' },
    ]);
    
    // Get state and filter
    const state = await context.storageState();
    const filteredCookies = state.cookies.filter(c => c.name !== 'remove');
    
    console.log('Filtered cookies:', filteredCookies.length);
    
    await context.close();
});

// Solution 8: Storage State Validation
test('storage state validation', async ({ context, page }) => {
    await page.goto('https://playwright.dev');
    
    const state = await context.storageState();
    
    // Validate state structure
    expect(state).toHaveProperty('cookies');
    expect(state).toHaveProperty('origins');
    expect(Array.isArray(state.cookies)).toBeTruthy();
    expect(Array.isArray(state.origins)).toBeTruthy();
});

// Solution 9: Storage State for Multiple Domains
test('storage state for multiple domains', async ({ context, page }) => {
    // Visit multiple domains
    await page.goto('https://playwright.dev');
    
    // Add cookies for different domains
    await context.addCookies([
        { name: 'cookie1', value: 'value1', domain: 'playwright.dev', path: '/' },
    ]);
    
    const state = await context.storageState();
    
    console.log('Total cookies:', state.cookies.length);
    console.log('Total origins:', state.origins.length);
});

// Solution 10: Storage State Best Practices
test('storage state best practices', async ({ page }) => {
    /*
     * Best Practices:
     * 1. Save auth state once, reuse many times
     * 2. Use separate state files for different users
     * 3. Validate state before using
     * 4. Clear sensitive data after tests
     * 5. Don't commit state files to version control
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

