/**
 * Lab 443: Test Sharding
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Distributing tests across machines:
 * 
 * - Sharding configuration
 * - CI/CD integration
 * - Load balancing
 * - Shard strategies
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Configure sharding
 * 2. Run sharded tests
 * 3. Merge shard results
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Basic Sharding Tests
// Run with: npx playwright test --shard=1/3
test('shard test 1', async ({ page }) => {
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

test('shard test 2', async ({ page }) => {
    await page.goto('https://playwright.dev/docs/intro');
    await expect(page).toHaveTitle(/Installation/);
});

test('shard test 3', async ({ page }) => {
    await page.goto('https://playwright.dev/docs/api/class-page');
    await expect(page).toHaveTitle(/Page/);
});

// Solution 2: Multiple Test Files Simulation
test.describe('Feature A tests', () => {
    test('feature A test 1', async ({ page }) => {
        await page.goto('https://playwright.dev');
        await expect(page).toHaveTitle(/Playwright/);
    });
    
    test('feature A test 2', async ({ page }) => {
        await page.goto('https://playwright.dev');
        await expect(page).toHaveTitle(/Playwright/);
    });
});

test.describe('Feature B tests', () => {
    test('feature B test 1', async ({ page }) => {
        await page.goto('https://playwright.dev');
        await expect(page).toHaveTitle(/Playwright/);
    });
    
    test('feature B test 2', async ({ page }) => {
        await page.goto('https://playwright.dev');
        await expect(page).toHaveTitle(/Playwright/);
    });
});

// Solution 3: Sharding with Tags
test('smoke test @smoke', async ({ page }) => {
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

test('regression test @regression', async ({ page }) => {
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 4: Heavy Tests for Sharding
test.describe('heavy tests', () => {
    for (let i = 1; i <= 10; i++) {
        test(`heavy test ${i}`, async ({ page }) => {
            await page.goto('https://playwright.dev');
            await expect(page).toHaveTitle(/Playwright/);
        });
    }
});

// Solution 5: Sharding with Different Browsers
// Configure in playwright.config.ts
test('cross-browser test', async ({ page, browserName }) => {
    console.log('Running on:', browserName);
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 6: Shard-Aware Test
test('shard-aware test', async ({ page }) => {
    // Tests are automatically distributed
    const shardInfo = process.env.TEST_SHARD || 'local';
    console.log('Running in shard:', shardInfo);
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 7: Independent Tests for Sharding
test.describe('independent tests', () => {
    // Each test should be independent for proper sharding
    test('independent test 1', async ({ page }) => {
        await page.goto('https://playwright.dev');
        await expect(page).toHaveTitle(/Playwright/);
    });
    
    test('independent test 2', async ({ page }) => {
        await page.goto('https://playwright.dev');
        await expect(page).toHaveTitle(/Playwright/);
    });
    
    test('independent test 3', async ({ page }) => {
        await page.goto('https://playwright.dev');
        await expect(page).toHaveTitle(/Playwright/);
    });
});

// Solution 8: Sharding with Retries
test.describe('sharding with retries', () => {
    test.describe.configure({ retries: 1 });
    
    test('retryable test 1', async ({ page }) => {
        await page.goto('https://playwright.dev');
        await expect(page).toHaveTitle(/Playwright/);
    });
    
    test('retryable test 2', async ({ page }) => {
        await page.goto('https://playwright.dev');
        await expect(page).toHaveTitle(/Playwright/);
    });
});

// Solution 9: CI/CD Sharding Example
/*
 * GitHub Actions Example:
 * 
 * jobs:
 *   test:
 *     strategy:
 *       matrix:
 *         shard: [1, 2, 3, 4]
 *     steps:
 *       - run: npx playwright test --shard=${{ matrix.shard }}/4
 */
test('CI sharding test', async ({ page }) => {
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 10: Sharding Best Practices
test('sharding best practices', async ({ page }) => {
    /*
     * Best Practices:
     * 1. Keep tests independent
     * 2. Balance test distribution
     * 3. Use appropriate shard count
     * 4. Merge results after sharding
     * 5. Monitor shard execution times
     * 
     * Commands:
     * - npx playwright test --shard=1/4
     * - npx playwright test --shard=2/4
     * - npx playwright test --shard=3/4
     * - npx playwright test --shard=4/4
     * 
     * Merge reports:
     * - npx playwright merge-reports ./all-blob-reports
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

