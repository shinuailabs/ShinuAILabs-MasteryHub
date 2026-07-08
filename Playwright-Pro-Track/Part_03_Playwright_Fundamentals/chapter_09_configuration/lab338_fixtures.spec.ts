/**
 * Lab 338: Fixtures Configuration
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Configuring fixtures:
 * 
 * - Built-in fixtures
 * - Custom fixtures
 * - Fixture scope
 * - Fixture options
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Use built-in fixtures
 * 2. Create custom fixtures
 * 3. Configure fixture scope
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test as base, expect } from '@playwright/test';

// Solution 1: Built-in Fixtures
test('built-in fixtures', async ({ page, context, browser }) => {
    /*
     * Built-in fixtures:
     * - page: Page instance
     * - context: Browser context
     * - browser: Browser instance
     * - browserName: Browser name
     * - request: API request context
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 2: Custom Fixture
const test = base.extend<{ todoPage: any }>({
    todoPage: async ({ page }, use) => {
        // Setup
        await page.goto('https://playwright.dev');
        
        // Provide fixture
        await use(page);
        
        // Teardown (optional)
    },
});

test('custom fixture', async ({ todoPage }) => {
    await expect(todoPage).toHaveTitle(/Playwright/);
});

// Solution 3: Fixture with Options
type MyFixtures = {
    baseUrl: string;
};

const testWithOptions = base.extend<MyFixtures>({
    baseUrl: ['https://playwright.dev', { option: true }],
});

testWithOptions('fixture with options', async ({ page, baseUrl }) => {
    await page.goto(baseUrl);
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 4: Worker-Scoped Fixture
type WorkerFixtures = {
    sharedData: string;
};

const testWithWorker = base.extend<{}, WorkerFixtures>({
    sharedData: [async ({}, use) => {
        // Shared across all tests in worker
        await use('shared value');
    }, { scope: 'worker' }],
});

testWithWorker('worker scoped fixture', async ({ page, sharedData }) => {
    console.log('Shared data:', sharedData);
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 5: Auto Fixture
const testWithAuto = base.extend<{ autoSetup: void }>({
    autoSetup: [async ({ page }, use) => {
        // Runs automatically for every test
        console.log('Auto setup running');
        await use();
    }, { auto: true }],
});

testWithAuto('auto fixture', async ({ page }) => {
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 6: Fixture Dependencies
type DependentFixtures = {
    user: { name: string };
    loggedInPage: any;
};

const testWithDeps = base.extend<DependentFixtures>({
    user: async ({}, use) => {
        await use({ name: 'Test User' });
    },
    loggedInPage: async ({ page, user }, use) => {
        // Depends on user fixture
        console.log('Logging in as:', user.name);
        await page.goto('https://playwright.dev');
        await use(page);
    },
});

testWithDeps('fixture dependencies', async ({ loggedInPage }) => {
    await expect(loggedInPage).toHaveTitle(/Playwright/);
});

// Solution 7: Override Built-in Fixture
const testOverride = base.extend({
    page: async ({ page }, use) => {
        // Add custom behavior to page
        await page.setViewportSize({ width: 1920, height: 1080 });
        await use(page);
    },
});

testOverride('override built-in fixture', async ({ page }) => {
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 8: Fixture in Separate File
/*
 * fixtures.ts:
 * 
 * import { test as base } from '@playwright/test';
 * 
 * export const test = base.extend<MyFixtures>({
 *   // fixtures here
 * });
 * 
 * export { expect } from '@playwright/test';
 * 
 * In test file:
 * import { test, expect } from './fixtures';
 */

// Solution 9: Fixture Best Practices
base('fixture best practices', async ({ page }) => {
    /*
     * Best Practices:
     * 1. Use fixtures for reusable setup
     * 2. Use worker scope for expensive setup
     * 3. Use auto fixtures for common setup
     * 4. Keep fixtures focused
     * 5. Document fixture behavior
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

