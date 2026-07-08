/**
 * Lab 439: Test Fixtures
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Understanding Playwright fixtures:
 * 
 * - Built-in fixtures
 * - Custom fixtures
 * - Fixture scopes
 * - Fixture dependencies
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Use built-in fixtures
 * 2. Create custom fixtures
 * 3. Understand fixture scopes
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test as base, expect } from '@playwright/test';

// Solution 1: Using Built-in Fixtures
base('using built-in fixtures', async ({ page, context, browser }) => {
    // page, context, browser are built-in fixtures
    console.log('Browser name:', browser.browserType().name());
    console.log('Context pages:', context.pages().length);
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 2: Custom Fixture - Simple
type MyFixtures = {
    baseURL: string;
};

const test = base.extend<MyFixtures>({
    baseURL: async ({}, use) => {
        await use('https://playwright.dev');
    },
});

test('using custom fixture', async ({ page, baseURL }) => {
    await page.goto(baseURL);
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 3: Custom Fixture with Setup/Teardown
type SetupFixtures = {
    authenticatedPage: any;
};

const testWithAuth = base.extend<SetupFixtures>({
    authenticatedPage: async ({ page }, use) => {
        // Setup
        await page.goto('https://playwright.dev');
        await page.evaluate(() => {
            localStorage.setItem('auth', 'true');
        });
        
        // Use the fixture
        await use(page);
        
        // Teardown
        await page.evaluate(() => {
            localStorage.removeItem('auth');
        });
    },
});

testWithAuth('using fixture with setup/teardown', async ({ authenticatedPage }) => {
    const isAuth = await authenticatedPage.evaluate(() => {
        return localStorage.getItem('auth');
    });
    expect(isAuth).toBe('true');
});

// Solution 4: Fixture with Options
type OptionsFixtures = {
    greeting: string;
};

type OptionsOptions = {
    defaultGreeting: string;
};

const testWithOptions = base.extend<OptionsFixtures, OptionsOptions>({
    defaultGreeting: ['Hello', { option: true }],
    greeting: async ({ defaultGreeting }, use) => {
        await use(defaultGreeting);
    },
});

testWithOptions('using fixture with options', async ({ greeting }) => {
    expect(greeting).toBe('Hello');
});

// Solution 5: Dependent Fixtures
type DependentFixtures = {
    user: { name: string; email: string };
    userPage: any;
};

const testDependent = base.extend<DependentFixtures>({
    user: async ({}, use) => {
        await use({ name: 'Test User', email: 'test@example.com' });
    },
    userPage: async ({ page, user }, use) => {
        await page.goto('https://playwright.dev');
        await page.evaluate((u) => {
            localStorage.setItem('user', JSON.stringify(u));
        }, user);
        await use(page);
    },
});

testDependent('using dependent fixtures', async ({ userPage, user }) => {
    const storedUser = await userPage.evaluate(() => {
        return JSON.parse(localStorage.getItem('user') || '{}');
    });
    expect(storedUser.name).toBe(user.name);
});

// Solution 6: Worker-Scoped Fixture
type WorkerFixtures = {
    workerData: string;
};

const testWorker = base.extend<{}, WorkerFixtures>({
    workerData: [async ({}, use) => {
        console.log('Worker fixture setup');
        await use('shared-worker-data');
        console.log('Worker fixture teardown');
    }, { scope: 'worker' }],
});

testWorker('using worker-scoped fixture', async ({ workerData }) => {
    expect(workerData).toBe('shared-worker-data');
});

// Solution 7: Auto Fixture
type AutoFixtures = {
    autoSetup: void;
};

const testAuto = base.extend<AutoFixtures>({
    autoSetup: [async ({}, use) => {
        console.log('Auto fixture runs automatically');
        await use();
    }, { auto: true }],
});

testAuto('auto fixture runs', async ({ page }) => {
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 8: Fixture Override
const testOverride = test.extend<MyFixtures>({
    baseURL: async ({}, use) => {
        await use('https://playwright.dev/docs/intro');
    },
});

testOverride('overriding fixture', async ({ page, baseURL }) => {
    await page.goto(baseURL);
    await expect(page).toHaveTitle(/Installation/);
});

// Solution 9: Multiple Fixtures Combined
type CombinedFixtures = {
    apiClient: { get: (url: string) => Promise<any> };
    testData: { id: number; name: string };
};

const testCombined = base.extend<CombinedFixtures>({
    apiClient: async ({}, use) => {
        const client = {
            get: async (url: string) => ({ status: 200, url }),
        };
        await use(client);
    },
    testData: async ({}, use) => {
        await use({ id: 1, name: 'Test Item' });
    },
});

testCombined('using combined fixtures', async ({ apiClient, testData }) => {
    const response = await apiClient.get('/api/items');
    expect(response.status).toBe(200);
    expect(testData.id).toBe(1);
});

// Solution 10: Fixture Best Practices
base('fixture best practices', async ({ page }) => {
    /*
     * Best Practices:
     * 1. Use fixtures for reusable setup
     * 2. Keep fixtures focused
     * 3. Use appropriate scope
     * 4. Clean up in teardown
     * 5. Document fixture purpose
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

