/**
 * Lab 515: Fixture Options
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Using fixture options:
 * 
 * - Configurable fixtures
 * - Option types
 * - Default values
 * - Override options
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create configurable fixtures
 * 2. Define options
 * 3. Override in tests
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test as base, Page } from '@playwright/test';

// Solution 1: Define Options Type
type TestOptions = {
    baseURL: string;
    defaultTimeout: number;
    userRole: 'admin' | 'user' | 'guest';
};

// Solution 2: Fixtures Using Options
type TestFixtures = {
    configuredPage: Page;
};

const test = base.extend<TestFixtures, TestOptions>({
    // Define options with defaults
    baseURL: ['https://example.com', { option: true }],
    defaultTimeout: [30000, { option: true }],
    userRole: ['user', { option: true }],
    
    // Fixture using options
    configuredPage: async ({ page, baseURL, defaultTimeout }, use) => {
        page.setDefaultTimeout(defaultTimeout);
        await page.goto(baseURL);
        await use(page);
    },
});

// Solution 3: Role-Based Options
type RoleOptions = {
    credentials: { username: string; password: string };
};

type RoleFixtures = {
    loggedInPage: Page;
};

const roleTest = base.extend<RoleFixtures, RoleOptions>({
    credentials: [{ username: 'default', password: 'default' }, { option: true }],
    
    loggedInPage: async ({ page, credentials }, use) => {
        await page.goto('/login');
        await page.fill('#username', credentials.username);
        await page.fill('#password', credentials.password);
        await page.click('#submit');
        await use(page);
    },
});

// Solution 4: Environment Options
type EnvOptions = {
    environment: 'dev' | 'staging' | 'prod';
    apiVersion: string;
};

const envTest = base.extend<{}, EnvOptions>({
    environment: ['dev', { option: true, scope: 'worker' }],
    apiVersion: ['v1', { option: true, scope: 'worker' }],
});

// Solution 5: Complex Options
type ComplexOptions = {
    featureFlags: {
        newUI: boolean;
        darkMode: boolean;
        betaFeatures: boolean;
    };
};

const featureTest = base.extend<{}, ComplexOptions>({
    featureFlags: [{
        newUI: false,
        darkMode: false,
        betaFeatures: false,
    }, { option: true, scope: 'worker' }],
});

// Solution 6: Using Options in Config
/*
 * In playwright.config.ts:
 * 
 * export default defineConfig({
 *   use: {
 *     baseURL: 'https://staging.example.com',
 *     defaultTimeout: 60000,
 *     userRole: 'admin',
 *   },
 *   projects: [
 *     {
 *       name: 'admin-tests',
 *       use: { userRole: 'admin' },
 *     },
 *     {
 *       name: 'user-tests',
 *       use: { userRole: 'user' },
 *     },
 *   ],
 * });
 */

// Solution 7: Override in Test File
test.describe('Admin tests', () => {
    test.use({ userRole: 'admin' });
    
    test('admin can access dashboard', async ({ configuredPage }) => {
        // Test with admin role
    });
});

test.describe('User tests', () => {
    test.use({ userRole: 'user' });
    
    test('user can view profile', async ({ configuredPage }) => {
        // Test with user role
    });
});

// Solution 8: Export
export { test, roleTest, envTest, featureTest };
export type { TestOptions, RoleOptions, EnvOptions, ComplexOptions };

