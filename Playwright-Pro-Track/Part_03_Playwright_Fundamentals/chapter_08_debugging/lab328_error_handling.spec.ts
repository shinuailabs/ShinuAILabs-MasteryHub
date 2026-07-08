/**
 * Lab 328: Error Handling
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Handling errors in tests:
 * 
 * - Try-catch blocks
 * - Error types
 * - Custom error handling
 * - Recovery strategies
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Handle test errors
 * 2. Identify error types
 * 3. Implement recovery
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Basic Try-Catch
test('basic try-catch', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    try {
        await page.locator('.non-existent').click({ timeout: 1000 });
    } catch (error) {
        console.log('Error caught:', (error as Error).message);
    }
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 2: Handle Timeout Error
test('handle timeout error', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    try {
        await page.locator('.non-existent').click({ timeout: 1000 });
    } catch (error: any) {
        if (error.message.includes('Timeout')) {
            console.log('Timeout error - element not found');
        } else {
            throw error;
        }
    }
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 3: Handle Navigation Error
test('handle navigation error', async ({ page }) => {
    try {
        await page.goto('https://nonexistent-domain-12345.com', {
            timeout: 5000,
        });
    } catch (error: any) {
        console.log('Navigation failed:', error.message);
    }
    
    // Continue with valid URL
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 4: Handle Assertion Error
test('handle assertion error', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    try {
        await expect(page).toHaveTitle(/NonExistent/, { timeout: 1000 });
    } catch (error: any) {
        console.log('Assertion failed:', error.message);
    }
    
    // Correct assertion
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 5: Retry on Error
test('retry on error', async ({ page }) => {
    let attempts = 0;
    const maxAttempts = 3;
    
    while (attempts < maxAttempts) {
        try {
            await page.goto('https://playwright.dev');
            await expect(page).toHaveTitle(/Playwright/);
            break;
        } catch (error) {
            attempts++;
            console.log(`Attempt ${attempts} failed`);
            if (attempts === maxAttempts) throw error;
        }
    }
});

// Solution 6: Error with Screenshot
test('error with screenshot', async ({ page }, testInfo) => {
    await page.goto('https://playwright.dev');
    
    try {
        await page.locator('.non-existent').click({ timeout: 1000 });
    } catch (error) {
        // Take screenshot on error
        const screenshot = await page.screenshot();
        await testInfo.attach('error-screenshot', {
            body: screenshot,
            contentType: 'image/png',
        });
        console.log('Error captured with screenshot');
    }
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 7: Custom Error Handler
test('custom error handler', async ({ page }) => {
    const handleError = async (error: Error, context: string) => {
        console.log(`Error in ${context}:`, error.message);
        // Log additional info
        console.log('URL:', page.url());
        console.log('Title:', await page.title());
    };
    
    await page.goto('https://playwright.dev');
    
    try {
        await page.locator('.non-existent').click({ timeout: 1000 });
    } catch (error) {
        await handleError(error as Error, 'click action');
    }
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 8: Page Error Handler
test('page error handler', async ({ page }) => {
    // Handle uncaught page errors
    page.on('pageerror', error => {
        console.log('Page error:', error.message);
    });
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 9: Console Error Handler
test('console error handler', async ({ page }) => {
    // Handle console errors
    page.on('console', msg => {
        if (msg.type() === 'error') {
            console.log('Console error:', msg.text());
        }
    });
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 10: Graceful Degradation
test('graceful degradation', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Try primary action, fall back to alternative
    const primaryButton = page.locator('.primary-action');
    const fallbackButton = page.getByRole('link', { name: 'Get started' });
    
    if (await primaryButton.isVisible()) {
        await primaryButton.click();
    } else {
        await fallbackButton.click();
    }
    
    await expect(page.locator('body')).toBeVisible();
});

// Solution 11: Error Logging
test('error logging', async ({ page }) => {
    const logError = (error: Error, details: object) => {
        console.error(JSON.stringify({
            timestamp: new Date().toISOString(),
            error: error.message,
            stack: error.stack,
            ...details,
        }, null, 2));
    };
    
    await page.goto('https://playwright.dev');
    
    try {
        await page.locator('.non-existent').click({ timeout: 1000 });
    } catch (error) {
        logError(error as Error, { url: page.url(), action: 'click' });
    }
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 12: Error Handling Best Practices
test('error handling best practices', async ({ page }) => {
    /*
     * Best Practices:
     * 1. Use try-catch for expected failures
     * 2. Take screenshots on error
     * 3. Log meaningful error info
     * 4. Implement retry logic
     * 5. Use graceful degradation
     * 6. Don't swallow unexpected errors
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

