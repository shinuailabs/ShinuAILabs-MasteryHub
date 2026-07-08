/**
 * Lab 369: Multi-User Authentication
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Testing with multiple users:
 * 
 * - Different roles
 * - Multiple sessions
 * - User switching
 * - Parallel users
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Test with different roles
 * 2. Switch between users
 * 3. Test parallel sessions
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Role-Based Projects
test('role based projects', async ({ page }) => {
    /*
     * playwright.config.ts:
     * 
     * projects: [
     *   {
     *     name: 'admin',
     *     use: { storageState: 'admin-auth.json' },
     *   },
     *   {
     *     name: 'user',
     *     use: { storageState: 'user-auth.json' },
     *   },
     *   {
     *     name: 'guest',
     *     use: { storageState: undefined },
     *   },
     * ],
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 2: Multiple Auth Files
test('multiple auth files', async ({ page }) => {
    /*
     * Setup multiple auth states:
     * 
     * - admin-auth.json
     * - user-auth.json
     * - moderator-auth.json
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 3: User Fixture
test('user fixture', async ({ page }) => {
    /*
     * fixtures.ts:
     * 
     * export const test = base.extend<{
     *   adminPage: Page;
     *   userPage: Page;
     * }>({
     *   adminPage: async ({ browser }, use) => {
     *     const context = await browser.newContext({
     *       storageState: 'admin-auth.json',
     *     });
     *     const page = await context.newPage();
     *     await use(page);
     *     await context.close();
     *   },
     *   userPage: async ({ browser }, use) => {
     *     const context = await browser.newContext({
     *       storageState: 'user-auth.json',
     *     });
     *     const page = await context.newPage();
     *     await use(page);
     *     await context.close();
     *   },
     * });
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 4: Two Users Same Test
test('two users same test', async ({ browser }) => {
    // Admin context
    const adminContext = await browser.newContext();
    const adminPage = await adminContext.newPage();
    
    // User context
    const userContext = await browser.newContext();
    const userPage = await userContext.newPage();
    
    // Both users navigate
    await adminPage.goto('https://playwright.dev');
    await userPage.goto('https://playwright.dev');
    
    await expect(adminPage).toHaveTitle(/Playwright/);
    await expect(userPage).toHaveTitle(/Playwright/);
    
    await adminContext.close();
    await userContext.close();
});

// Solution 5: User Interaction Test
test('user interaction test', async ({ browser }) => {
    // Create two user sessions
    const user1Context = await browser.newContext();
    const user1Page = await user1Context.newPage();
    
    const user2Context = await browser.newContext();
    const user2Page = await user2Context.newPage();
    
    // User 1 performs action
    await user1Page.goto('https://playwright.dev');
    
    // User 2 sees result
    await user2Page.goto('https://playwright.dev');
    
    await expect(user1Page).toHaveTitle(/Playwright/);
    await expect(user2Page).toHaveTitle(/Playwright/);
    
    await user1Context.close();
    await user2Context.close();
});

// Solution 6: Switch User Mid-Test
test('switch user mid test', async ({ browser }) => {
    // Start as user
    const userContext = await browser.newContext();
    const page = await userContext.newPage();
    await page.goto('https://playwright.dev');
    
    // Close user context
    await userContext.close();
    
    // Continue as admin
    const adminContext = await browser.newContext();
    const adminPage = await adminContext.newPage();
    await adminPage.goto('https://playwright.dev');
    
    await expect(adminPage).toHaveTitle(/Playwright/);
    await adminContext.close();
});

// Solution 7: Parallel User Actions
test('parallel user actions', async ({ browser }) => {
    const contexts = await Promise.all([
        browser.newContext(),
        browser.newContext(),
        browser.newContext(),
    ]);
    
    const pages = await Promise.all(
        contexts.map(ctx => ctx.newPage())
    );
    
    // All users navigate in parallel
    await Promise.all(
        pages.map(page => page.goto('https://playwright.dev'))
    );
    
    // Verify all pages
    for (const page of pages) {
        await expect(page).toHaveTitle(/Playwright/);
    }
    
    // Cleanup
    await Promise.all(contexts.map(ctx => ctx.close()));
});

// Solution 8: Permission Testing
test('permission testing', async ({ page }) => {
    /*
     * Test different permission levels:
     * 
     * Admin: Can access all pages
     * User: Can access user pages
     * Guest: Can only access public pages
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 9: Session Isolation
test('session isolation', async ({ browser }) => {
    // Each context is isolated
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();
    
    const page1 = await context1.newPage();
    const page2 = await context2.newPage();
    
    // Set different data in each
    await page1.goto('https://playwright.dev');
    await page2.goto('https://playwright.dev');
    
    // Sessions are completely isolated
    await expect(page1).toHaveTitle(/Playwright/);
    await expect(page2).toHaveTitle(/Playwright/);
    
    await context1.close();
    await context2.close();
});

// Solution 10: Multi-User Auth Best Practices
test('multi user auth best practices', async ({ page }) => {
    /*
     * Best Practices:
     * 1. Use separate auth files per role
     * 2. Create fixtures for common roles
     * 3. Test permission boundaries
     * 4. Clean up contexts
     * 5. Use parallel contexts
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

