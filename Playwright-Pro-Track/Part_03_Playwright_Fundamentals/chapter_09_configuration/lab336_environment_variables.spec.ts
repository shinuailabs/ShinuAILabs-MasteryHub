/**
 * Lab 336: Environment Variables
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Using environment variables:
 * 
 * - process.env
 * - .env files
 * - CI variables
 * - Configuration based on env
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Use environment variables
 * 2. Configure .env files
 * 3. Handle CI environments
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Access Environment Variables
test('access environment variables', async ({ page }) => {
    // Access environment variable
    const baseUrl = process.env.BASE_URL || 'https://playwright.dev';
    
    await page.goto(baseUrl);
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 2: CI Detection
test('CI detection', async ({ page }) => {
    // Check if running in CI
    const isCI = process.env.CI === 'true';
    
    console.log('Running in CI:', isCI);
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 3: Environment-Based Config
test('environment based config', async ({ page }) => {
    /*
     * In playwright.config.ts:
     * 
     * export default defineConfig({
     *   retries: process.env.CI ? 2 : 0,
     *   workers: process.env.CI ? 1 : undefined,
     *   use: {
     *     baseURL: process.env.BASE_URL || 'http://localhost:3000',
     *   },
     * });
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 4: dotenv Integration
test('dotenv integration', async ({ page }) => {
    /*
     * Install dotenv:
     * npm install dotenv
     * 
     * In playwright.config.ts:
     * import dotenv from 'dotenv';
     * dotenv.config();
     * 
     * Create .env file:
     * BASE_URL=https://playwright.dev
     * USERNAME=testuser
     * PASSWORD=testpass
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 5: Multiple Environment Files
test('multiple environment files', async ({ page }) => {
    /*
     * Use different .env files:
     * 
     * .env.local
     * .env.staging
     * .env.production
     * 
     * Load specific file:
     * dotenv.config({ path: `.env.${process.env.ENV}` });
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 6: Credentials from Environment
test('credentials from environment', async ({ page }) => {
    // Get credentials from environment
    const username = process.env.TEST_USERNAME || 'default_user';
    const password = process.env.TEST_PASSWORD || 'default_pass';
    
    console.log('Using username:', username);
    // Never log passwords!
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 7: Feature Flags
test('feature flags', async ({ page }) => {
    // Use environment for feature flags
    const enableNewFeature = process.env.ENABLE_NEW_FEATURE === 'true';
    
    if (enableNewFeature) {
        console.log('New feature enabled');
    }
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 8: Debug Mode
test('debug mode', async ({ page }) => {
    // Check debug mode
    const isDebug = process.env.DEBUG === 'true';
    
    if (isDebug) {
        console.log('Debug mode enabled');
    }
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 9: Environment Validation
test('environment validation', async ({ page }) => {
    // Validate required environment variables
    const requiredVars = ['BASE_URL'];
    
    for (const varName of requiredVars) {
        if (!process.env[varName]) {
            console.warn(`Warning: ${varName} not set`);
        }
    }
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 10: Environment Variables Best Practices
test('environment variables best practices', async ({ page }) => {
    /*
     * Best Practices:
     * 1. Never commit .env files
     * 2. Use .env.example as template
     * 3. Validate required variables
     * 4. Use defaults for optional variables
     * 5. Never log sensitive values
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

