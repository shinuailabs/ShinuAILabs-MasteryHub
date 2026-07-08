/**
 * Lab 571: Async Steps
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Handling async operations:
 * 
 * - Async/await
 * - Promises
 * - Timeouts
 * - Error handling
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Write async steps
 * 2. Handle promises
 * 3. Manage timeouts
 *
 * =====================
 * SOLUTION:
 * =====================
 */

import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

// Solution 1: Basic Async Steps
Given('I wait for the application to load', async function () {
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForLoadState('networkidle');
});

When('I submit the form and wait for response', async function () {
    // Wait for navigation after form submission
    await Promise.all([
        this.page.waitForNavigation(),
        this.page.click('button[type="submit"]'),
    ]);
});

// Solution 2: Waiting for Elements
When('I wait for the results to appear', async function () {
    await this.page.locator('.results').waitFor({ state: 'visible', timeout: 30000 });
});

When('I wait for the loading spinner to disappear', async function () {
    await this.page.locator('.loading-spinner').waitFor({ state: 'hidden', timeout: 30000 });
});

Then('the modal should appear within {int} seconds', async function (seconds: number) {
    await this.page.locator('.modal').waitFor({ 
        state: 'visible', 
        timeout: seconds * 1000 
    });
});

// Solution 3: Waiting for Network
When('I click and wait for API response', async function () {
    const [response] = await Promise.all([
        this.page.waitForResponse(resp => resp.url().includes('/api/') && resp.status() === 200),
        this.page.click('#submit'),
    ]);
    
    this.apiResponse = await response.json();
});

When('I wait for all images to load', async function () {
    await this.page.waitForFunction(() => {
        const images = document.querySelectorAll('img');
        return Array.from(images).every(img => img.complete);
    });
});

// Solution 4: Polling/Retry Pattern
Then('the status should eventually be {string}', async function (expectedStatus: string) {
    await expect(async () => {
        const status = await this.page.locator('.status').textContent();
        expect(status).toBe(expectedStatus);
    }).toPass({ timeout: 30000, intervals: [1000, 2000, 5000] });
});

When('I retry clicking until successful', async function () {
    let attempts = 0;
    const maxAttempts = 3;
    
    while (attempts < maxAttempts) {
        try {
            await this.page.click('#flaky-button', { timeout: 5000 });
            break;
        } catch (error) {
            attempts++;
            if (attempts === maxAttempts) throw error;
            await this.page.waitForTimeout(1000);
        }
    }
});

// Solution 5: Parallel Operations
When('I load multiple pages in parallel', async function () {
    const urls = ['/page1', '/page2', '/page3'];
    
    const pages = await Promise.all(
        urls.map(async (url) => {
            const page = await this.context.newPage();
            await page.goto(url);
            return page;
        })
    );
    
    this.additionalPages = pages;
});

When('I collect data from multiple elements', async function () {
    const elements = this.page.locator('.data-item');
    const count = await elements.count();
    
    const data = await Promise.all(
        Array.from({ length: count }, (_, i) => 
            elements.nth(i).textContent()
        )
    );
    
    this.collectedData = data;
});

// Solution 6: Timeout Handling
When('I perform action with custom timeout', async function () {
    const originalTimeout = this.page.context().browser()?.contexts()[0];
    
    try {
        await this.page.click('#slow-button', { timeout: 60000 });
    } catch (error) {
        // Handle timeout
        console.log('Action timed out');
        throw error;
    }
});

// Solution 7: Sequential vs Parallel
When('I fill form fields sequentially', async function () {
    // Sequential - one after another
    await this.page.fill('#field1', 'value1');
    await this.page.fill('#field2', 'value2');
    await this.page.fill('#field3', 'value3');
});

When('I verify multiple elements in parallel', async function () {
    // Parallel - all at once
    await Promise.all([
        expect(this.page.locator('#element1')).toBeVisible(),
        expect(this.page.locator('#element2')).toBeVisible(),
        expect(this.page.locator('#element3')).toBeVisible(),
    ]);
});

// Solution 8: Async Cleanup
Then('I cleanup test data', async function () {
    // Cleanup operations
    await Promise.all([
        this.page.evaluate(() => localStorage.clear()),
        this.page.evaluate(() => sessionStorage.clear()),
    ]);
    
    // Clear cookies
    await this.context.clearCookies();
});

// Solution 9: Export
export {};

