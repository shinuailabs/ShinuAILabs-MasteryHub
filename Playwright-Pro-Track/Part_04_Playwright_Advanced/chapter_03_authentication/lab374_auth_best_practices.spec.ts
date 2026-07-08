/**
 * Lab 374: Authentication Best Practices
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Best practices for auth testing:
 * 
 * - Security
 * - Performance
 * - Maintainability
 * - Test organization
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Apply auth best practices
 * 2. Secure credentials
 * 3. Optimize auth tests
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Environment Variables
test('environment variables', async ({ page }) => {
    /*
     * Store credentials in environment:
     * 
     * TEST_USERNAME=user
     * TEST_PASSWORD=pass
     * 
     * Access in tests:
     * const username = process.env.TEST_USERNAME;
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 2: Secure Credential Storage
test('secure credential storage', async ({ page }) => {
    /*
     * Never commit credentials:
     * 
     * - Use .env files (gitignored)
     * - Use CI/CD secrets
     * - Use vault services
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 3: Login Once Pattern
test('login once pattern', async ({ page }) => {
    /*
     * Login once in global setup:
     * 
     * 1. Global setup logs in
     * 2. Saves storage state
     * 3. Tests reuse state
     * 
     * Benefits:
     * - Faster tests
     * - Less flaky
     * - Reduced load on auth server
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 4: Auth Fixture
test('auth fixture', async ({ page }) => {
    /*
     * Create auth fixture:
     * 
     * export const test = base.extend({
     *   authenticatedPage: async ({ browser }, use) => {
     *     const context = await browser.newContext({
     *       storageState: 'auth.json',
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

// Solution 5: Test User Management
test('test user management', async ({ page }) => {
    /*
     * Test user strategies:
     * 
     * 1. Dedicated test users
     * 2. User per test suite
     * 3. Dynamic user creation
     * 4. User cleanup after tests
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 6: Auth State Validation
test('auth state validation', async ({ page, context }) => {
    await page.goto('https://playwright.dev');
    
    // Validate auth state before test
    const cookies = await context.cookies();
    const hasSession = cookies.some(c => c.name.includes('session'));
    
    console.log('Has session:', hasSession);
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 7: Auth Error Handling
test('auth error handling', async ({ page }) => {
    /*
     * Handle auth errors:
     * 
     * - Invalid credentials
     * - Expired session
     * - Account locked
     * - Network errors
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 8: Auth Test Organization
test('auth test organization', async ({ page }) => {
    /*
     * Organize auth tests:
     * 
     * tests/
     * ├── auth/
     * │   ├── login.spec.ts
     * │   ├── logout.spec.ts
     * │   ├── registration.spec.ts
     * │   └── password-reset.spec.ts
     * └── authenticated/
     *     ├── dashboard.spec.ts
     *     └── profile.spec.ts
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 9: Auth Performance
test('auth performance', async ({ page }) => {
    /*
     * Optimize auth performance:
     * 
     * 1. Reuse auth state
     * 2. Parallel auth setup
     * 3. Cache tokens
     * 4. Skip unnecessary logins
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 10: Auth Best Practices Summary
test('auth best practices summary', async ({ page }) => {
    /*
     * Best Practices Summary:
     * 
     * Security:
     * - Use environment variables
     * - Never commit credentials
     * - Use secure connections
     * 
     * Performance:
     * - Login once, reuse state
     * - Use fixtures
     * - Cache auth tokens
     * 
     * Maintainability:
     * - Centralize auth logic
     * - Use dedicated test users
     * - Document auth setup
     * 
     * Testing:
     * - Test all auth flows
     * - Test error scenarios
     * - Test session management
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

