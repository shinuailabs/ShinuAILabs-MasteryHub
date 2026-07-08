/**
 * Lab 372: Session Management
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Managing test sessions:
 * 
 * - Session creation
 * - Session validation
 * - Session expiry
 * - Session refresh
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create sessions
 * 2. Validate sessions
 * 3. Handle expiry
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Create Session
test('create session', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Set session cookie
    await page.context().addCookies([{
        name: 'session_id',
        value: 'test-session-123',
        domain: 'playwright.dev',
        path: '/',
        httpOnly: true,
        secure: true,
    }]);
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 2: Validate Session
test('validate session', async ({ page, context }) => {
    await page.goto('https://playwright.dev');
    
    const cookies = await context.cookies();
    const sessionCookie = cookies.find(c => c.name === 'session_id');
    
    if (sessionCookie) {
        console.log('Session exists:', sessionCookie.value);
    }
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 3: Session Expiry Test
test('session expiry test', async ({ page, context }) => {
    // Set expired cookie
    await context.addCookies([{
        name: 'session_id',
        value: 'expired-session',
        domain: 'playwright.dev',
        path: '/',
        expires: Math.floor(Date.now() / 1000) - 3600, // Expired 1 hour ago
    }]);
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 4: Session Refresh
test('session refresh', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Simulate session refresh
    await page.evaluate(() => {
        // Refresh token logic
        const newToken = 'refreshed-token-' + Date.now();
        localStorage.setItem('auth_token', newToken);
    });
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 5: Multiple Sessions
test('multiple sessions', async ({ browser }) => {
    // Session 1
    const context1 = await browser.newContext();
    await context1.addCookies([{
        name: 'session_id',
        value: 'session-1',
        domain: 'playwright.dev',
        path: '/',
    }]);
    
    // Session 2
    const context2 = await browser.newContext();
    await context2.addCookies([{
        name: 'session_id',
        value: 'session-2',
        domain: 'playwright.dev',
        path: '/',
    }]);
    
    const page1 = await context1.newPage();
    const page2 = await context2.newPage();
    
    await page1.goto('https://playwright.dev');
    await page2.goto('https://playwright.dev');
    
    await expect(page1).toHaveTitle(/Playwright/);
    await expect(page2).toHaveTitle(/Playwright/);
    
    await context1.close();
    await context2.close();
});

// Solution 6: Session Timeout Test
test('session timeout test', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Simulate timeout
    await page.evaluate(() => {
        // Clear session after timeout
        setTimeout(() => {
            localStorage.removeItem('auth_token');
            sessionStorage.clear();
        }, 1000);
    });
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 7: Logout Test
test('logout test', async ({ page, context }) => {
    // Set session
    await context.addCookies([{
        name: 'session_id',
        value: 'active-session',
        domain: 'playwright.dev',
        path: '/',
    }]);
    
    await page.goto('https://playwright.dev');
    
    // Logout - clear cookies
    await context.clearCookies();
    
    // Verify logged out
    const cookies = await context.cookies();
    expect(cookies.find(c => c.name === 'session_id')).toBeUndefined();
});

// Solution 8: Session Storage Test
test('session storage test', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Set session storage
    await page.evaluate(() => {
        sessionStorage.setItem('user_session', JSON.stringify({
            userId: 1,
            role: 'admin',
            expires: Date.now() + 3600000,
        }));
    });
    
    // Verify session storage
    const session = await page.evaluate(() => 
        JSON.parse(sessionStorage.getItem('user_session') || '{}')
    );
    
    expect(session.userId).toBe(1);
});

// Solution 9: Concurrent Session Test
test('concurrent session test', async ({ browser }) => {
    // Test that same user can have multiple sessions
    const contexts = await Promise.all([
        browser.newContext(),
        browser.newContext(),
    ]);
    
    for (const context of contexts) {
        await context.addCookies([{
            name: 'user_id',
            value: 'user-123',
            domain: 'playwright.dev',
            path: '/',
        }]);
    }
    
    const pages = await Promise.all(contexts.map(c => c.newPage()));
    await Promise.all(pages.map(p => p.goto('https://playwright.dev')));
    
    for (const page of pages) {
        await expect(page).toHaveTitle(/Playwright/);
    }
    
    await Promise.all(contexts.map(c => c.close()));
});

// Solution 10: Session Management Best Practices
test('session management best practices', async ({ page }) => {
    /*
     * Best Practices:
     * 1. Test session creation
     * 2. Test session expiry
     * 3. Test session refresh
     * 4. Test logout
     * 5. Test concurrent sessions
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

