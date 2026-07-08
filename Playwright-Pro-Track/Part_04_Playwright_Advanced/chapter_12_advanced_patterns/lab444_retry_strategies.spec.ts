/**
 * Lab 444: Retry Strategies
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Handling flaky tests with retries:
 * 
 * - Global retries
 * - Test-level retries
 * - Retry conditions
 * - Retry reporting
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Configure retries
 * 2. Handle flaky tests
 * 3. Analyze retry results
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Test-Level Retries
test.describe('test-level retries', () => {
    test.describe.configure({ retries: 2 });
    
    test('test with retries', async ({ page }) => {
        await page.goto('https://playwright.dev');
        await expect(page).toHaveTitle(/Playwright/);
    });
});

// Solution 2: Detecting Retry Attempt
test('detecting retry attempt', async ({ page }, testInfo) => {
    console.log('Retry attempt:', testInfo.retry);
    console.log('Max retries:', testInfo.project.retries);
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 3: Different Behavior on Retry
test('different behavior on retry', async ({ page }, testInfo) => {
    if (testInfo.retry > 0) {
        console.log('This is a retry, adding extra wait');
        await page.waitForTimeout(1000);
    }
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 4: Conditional Retry Logic
test('conditional retry logic', async ({ page }, testInfo) => {
    const maxAttempts = testInfo.project.retries + 1;
    const currentAttempt = testInfo.retry + 1;
    
    console.log(`Attempt ${currentAttempt} of ${maxAttempts}`);
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 5: Retry with Screenshot
test('retry with screenshot', async ({ page }, testInfo) => {
    await page.goto('https://playwright.dev');
    
    if (testInfo.retry > 0) {
        // Take screenshot on retry
        await page.screenshot({
            path: `retry-screenshot-${testInfo.retry}.png`,
        });
    }
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 6: Flaky Test Handling
test.describe('flaky test handling', () => {
    test.describe.configure({ retries: 3 });
    
    let attemptCount = 0;
    
    test('simulated flaky test', async ({ page }) => {
        attemptCount++;
        console.log('Attempt:', attemptCount);
        
        await page.goto('https://playwright.dev');
        await expect(page).toHaveTitle(/Playwright/);
    });
});

// Solution 7: Retry with Cleanup
test('retry with cleanup', async ({ page, context }, testInfo) => {
    // Clean state on retry
    if (testInfo.retry > 0) {
        await context.clearCookies();
        console.log('Cleared cookies for retry');
    }
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 8: Retry Reporting
test('retry reporting', async ({ page }, testInfo) => {
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
    
    // Add retry info to test output
    testInfo.annotations.push({
        type: 'retry-info',
        description: `Completed on attempt ${testInfo.retry + 1}`,
    });
});

// Solution 9: Exponential Backoff
test('exponential backoff', async ({ page }, testInfo) => {
    if (testInfo.retry > 0) {
        // Exponential backoff: 1s, 2s, 4s, etc.
        const waitTime = Math.pow(2, testInfo.retry - 1) * 1000;
        console.log(`Waiting ${waitTime}ms before retry`);
        await page.waitForTimeout(waitTime);
    }
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 10: Retry Best Practices
test('retry best practices', async ({ page }, testInfo) => {
    /*
     * Retry Best Practices:
     * 
     * Configuration:
     * - Set reasonable retry count (2-3)
     * - Use retries for flaky tests
     * - Don't mask real failures
     * 
     * Implementation:
     * - Clean state on retry
     * - Add extra waits if needed
     * - Log retry attempts
     * 
     * Analysis:
     * - Monitor retry rates
     * - Fix consistently flaky tests
     * - Use retry data for debugging
     * 
     * Reporting:
     * - Track which tests retry
     * - Identify patterns
     * - Prioritize fixes
     */
    
    console.log('Test info:', {
        retry: testInfo.retry,
        maxRetries: testInfo.project.retries,
        title: testInfo.title,
    });
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

