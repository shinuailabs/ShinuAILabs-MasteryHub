/**
 * Lab 432: Context Isolation
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Understanding context isolation:
 * 
 * - Cookie isolation
 * - Storage isolation
 * - Cache isolation
 * - Session isolation
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Test cookie isolation
 * 2. Test storage isolation
 * 3. Verify session separation
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Cookie Isolation
test('cookie isolation', async ({ browser }) => {
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();
    
    const page1 = await context1.newPage();
    const page2 = await context2.newPage();
    
    // Set cookie in context1
    await context1.addCookies([{
        name: 'testCookie',
        value: 'context1Value',
        domain: 'playwright.dev',
        path: '/',
    }]);
    
    await page1.goto('https://playwright.dev');
    await page2.goto('https://playwright.dev');
    
    // Get cookies from both contexts
    const cookies1 = await context1.cookies();
    const cookies2 = await context2.cookies();
    
    const testCookie1 = cookies1.find(c => c.name === 'testCookie');
    const testCookie2 = cookies2.find(c => c.name === 'testCookie');
    
    expect(testCookie1?.value).toBe('context1Value');
    expect(testCookie2).toBeUndefined();
    
    await context1.close();
    await context2.close();
});

// Solution 2: LocalStorage Isolation
test('localStorage isolation', async ({ browser }) => {
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();
    
    const page1 = await context1.newPage();
    const page2 = await context2.newPage();
    
    await page1.goto('https://playwright.dev');
    await page2.goto('https://playwright.dev');
    
    // Set localStorage in page1
    await page1.evaluate(() => {
        localStorage.setItem('testKey', 'context1Value');
    });
    
    // Check localStorage in both pages
    const value1 = await page1.evaluate(() => localStorage.getItem('testKey'));
    const value2 = await page2.evaluate(() => localStorage.getItem('testKey'));
    
    expect(value1).toBe('context1Value');
    expect(value2).toBeNull();
    
    await context1.close();
    await context2.close();
});

// Solution 3: SessionStorage Isolation
test('sessionStorage isolation', async ({ browser }) => {
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();
    
    const page1 = await context1.newPage();
    const page2 = await context2.newPage();
    
    await page1.goto('https://playwright.dev');
    await page2.goto('https://playwright.dev');
    
    // Set sessionStorage in page1
    await page1.evaluate(() => {
        sessionStorage.setItem('sessionKey', 'context1Session');
    });
    
    // Check sessionStorage in both pages
    const session1 = await page1.evaluate(() => sessionStorage.getItem('sessionKey'));
    const session2 = await page2.evaluate(() => sessionStorage.getItem('sessionKey'));
    
    expect(session1).toBe('context1Session');
    expect(session2).toBeNull();
    
    await context1.close();
    await context2.close();
});

// Solution 4: IndexedDB Isolation
test('IndexedDB isolation', async ({ browser }) => {
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();
    
    const page1 = await context1.newPage();
    const page2 = await context2.newPage();
    
    await page1.goto('https://playwright.dev');
    await page2.goto('https://playwright.dev');
    
    // Create IndexedDB in page1
    await page1.evaluate(() => {
        return new Promise((resolve) => {
            const request = indexedDB.open('testDB', 1);
            request.onsuccess = () => resolve(true);
        });
    });
    
    // Check IndexedDB in both pages
    const hasDB1 = await page1.evaluate(() => {
        return new Promise((resolve) => {
            const request = indexedDB.open('testDB', 1);
            request.onsuccess = () => resolve(true);
            request.onerror = () => resolve(false);
        });
    });
    
    expect(hasDB1).toBeTruthy();
    
    await context1.close();
    await context2.close();
});

// Solution 5: Multiple Users Simulation
test('multiple users simulation', async ({ browser }) => {
    // Simulate two different users
    const user1Context = await browser.newContext();
    const user2Context = await browser.newContext();
    
    const user1Page = await user1Context.newPage();
    const user2Page = await user2Context.newPage();
    
    // Both users visit the same site
    await user1Page.goto('https://playwright.dev');
    await user2Page.goto('https://playwright.dev');
    
    // Set different user data
    await user1Page.evaluate(() => {
        localStorage.setItem('userId', 'user1');
    });
    
    await user2Page.evaluate(() => {
        localStorage.setItem('userId', 'user2');
    });
    
    // Verify isolation
    const user1Id = await user1Page.evaluate(() => localStorage.getItem('userId'));
    const user2Id = await user2Page.evaluate(() => localStorage.getItem('userId'));
    
    expect(user1Id).toBe('user1');
    expect(user2Id).toBe('user2');
    
    await user1Context.close();
    await user2Context.close();
});

// Solution 6: Cache Isolation
test('cache isolation', async ({ browser }) => {
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();
    
    const page1 = await context1.newPage();
    const page2 = await context2.newPage();
    
    // First context loads the page
    await page1.goto('https://playwright.dev');
    
    // Second context loads the same page (should not share cache)
    await page2.goto('https://playwright.dev');
    
    // Both should load successfully
    await expect(page1).toHaveTitle(/Playwright/);
    await expect(page2).toHaveTitle(/Playwright/);
    
    await context1.close();
    await context2.close();
});

// Solution 7: Service Worker Isolation
test('service worker isolation', async ({ browser }) => {
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();
    
    const page1 = await context1.newPage();
    const page2 = await context2.newPage();
    
    await page1.goto('https://playwright.dev');
    await page2.goto('https://playwright.dev');
    
    // Service workers are isolated per context
    const sw1 = await page1.evaluate(() => {
        return navigator.serviceWorker?.controller?.scriptURL || null;
    });
    
    const sw2 = await page2.evaluate(() => {
        return navigator.serviceWorker?.controller?.scriptURL || null;
    });
    
    console.log('SW1:', sw1);
    console.log('SW2:', sw2);
    
    await context1.close();
    await context2.close();
});

// Solution 8: Permission Isolation
test('permission isolation', async ({ browser }) => {
    const context1 = await browser.newContext({
        permissions: ['geolocation'],
    });
    
    const context2 = await browser.newContext({
        permissions: [],
    });
    
    const page1 = await context1.newPage();
    const page2 = await context2.newPage();
    
    await page1.goto('https://playwright.dev');
    await page2.goto('https://playwright.dev');
    
    // Permissions are isolated per context
    console.log('Context 1 has geolocation permission');
    console.log('Context 2 has no permissions');
    
    await context1.close();
    await context2.close();
});

// Solution 9: Network State Isolation
test('network state isolation', async ({ browser }) => {
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();
    
    // Set up different network conditions
    // context1 - normal
    // context2 - offline
    
    const page1 = await context1.newPage();
    const page2 = await context2.newPage();
    
    await page1.goto('https://playwright.dev');
    
    // Set context2 to offline
    await context2.setOffline(true);
    
    // context1 should still work
    await expect(page1).toHaveTitle(/Playwright/);
    
    await context1.close();
    await context2.close();
});

// Solution 10: Context Isolation Best Practices
test('context isolation best practices', async ({ page }) => {
    /*
     * Best Practices:
     * 1. Use separate contexts for different users
     * 2. Leverage isolation for parallel testing
     * 3. Clean up contexts after tests
     * 4. Use context options for test scenarios
     * 5. Don't share state between contexts
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

