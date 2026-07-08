/**
 * Lab 345: Parameterized Tests
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Creating parameterized tests:
 * 
 * - Data-driven tests
 * - Test.each pattern
 * - Dynamic test generation
 * - Test data management
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create parameterized tests
 * 2. Use test data
 * 3. Generate tests dynamically
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Basic Parameterized Test
const testData = [
    { name: 'Google', url: 'https://google.com', title: /Google/ },
    { name: 'Playwright', url: 'https://playwright.dev', title: /Playwright/ },
];

for (const data of testData) {
    test(`should load ${data.name}`, async ({ page }) => {
        await page.goto(data.url);
        await expect(page).toHaveTitle(data.title);
    });
}

// Solution 2: Array of Values
const urls = [
    'https://playwright.dev',
    'https://playwright.dev/docs/intro',
];

for (const url of urls) {
    test(`should load ${url}`, async ({ page }) => {
        await page.goto(url);
        await expect(page).toHaveURL(url);
    });
}

// Solution 3: Object Parameters
const users = [
    { username: 'user1', role: 'admin' },
    { username: 'user2', role: 'user' },
];

for (const user of users) {
    test(`test for ${user.username} (${user.role})`, async ({ page }) => {
        await page.goto('https://playwright.dev');
        console.log(`Testing user: ${user.username}`);
        await expect(page).toHaveTitle(/Playwright/);
    });
}

// Solution 4: Describe with Parameters
const browsers = ['chromium', 'firefox', 'webkit'];

for (const browser of browsers) {
    test.describe(`Tests for ${browser}`, () => {
        test('should load page', async ({ page }) => {
            await page.goto('https://playwright.dev');
            await expect(page).toHaveTitle(/Playwright/);
        });
    });
}

// Solution 5: Matrix Testing
const viewports = [
    { width: 1920, height: 1080, name: 'desktop' },
    { width: 768, height: 1024, name: 'tablet' },
    { width: 375, height: 667, name: 'mobile' },
];

for (const viewport of viewports) {
    test(`responsive test - ${viewport.name}`, async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.goto('https://playwright.dev');
        await expect(page).toHaveTitle(/Playwright/);
    });
}

// Solution 6: Test Data from File
test('test data from file', async ({ page }) => {
    /*
     * Load test data from JSON:
     * 
     * import testData from './test-data.json';
     * 
     * for (const data of testData) {
     *   test(`test ${data.name}`, async ({ page }) => {
     *     // Use data
     *   });
     * }
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 7: Dynamic Test Names
const scenarios = [
    { scenario: 'valid input', input: 'test', expected: true },
    { scenario: 'empty input', input: '', expected: false },
    { scenario: 'special chars', input: '!@#$', expected: false },
];

for (const { scenario, input, expected } of scenarios) {
    test(`validation: ${scenario}`, async ({ page }) => {
        await page.goto('https://playwright.dev');
        console.log(`Input: ${input}, Expected: ${expected}`);
        await expect(page).toHaveTitle(/Playwright/);
    });
}

// Solution 8: Nested Parameterization
const environments = ['staging', 'production'];
const features = ['login', 'checkout'];

for (const env of environments) {
    for (const feature of features) {
        test(`${feature} on ${env}`, async ({ page }) => {
            await page.goto('https://playwright.dev');
            console.log(`Testing ${feature} on ${env}`);
            await expect(page).toHaveTitle(/Playwright/);
        });
    }
}

// Solution 9: Conditional Parameters
const conditionalData = [
    { name: 'test1', skip: false },
    { name: 'test2', skip: true },
];

for (const data of conditionalData) {
    test(`conditional ${data.name}`, async ({ page }) => {
        if (data.skip) {
            test.skip();
        }
        await page.goto('https://playwright.dev');
        await expect(page).toHaveTitle(/Playwright/);
    });
}

// Solution 10: Parameterized Best Practices
test('parameterized best practices', async ({ page }) => {
    /*
     * Best Practices:
     * 1. Use meaningful test names
     * 2. Keep test data separate
     * 3. Use descriptive parameters
     * 4. Avoid too many combinations
     * 5. Consider test execution time
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

