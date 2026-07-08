/**
 * Lab 495: Async Assertions
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Implementing async assertions in POM:
 * 
 * - Polling assertions
 * - Retry assertions
 * - Timeout handling
 * - Eventually assertions
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create polling assertions
 * 2. Implement retry logic
 * 3. Handle timeouts
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { Page, Locator, expect } from '@playwright/test';

// Solution 1: Polling Assertions
class PollingAssertionsPage {
    readonly page: Page;
    readonly counter: Locator;
    readonly status: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.counter = page.locator('.counter');
        this.status = page.locator('.status');
    }
    
    // Poll until condition is met
    async assertCounterReaches(value: number, timeout: number = 10000) {
        await expect(async () => {
            const text = await this.counter.textContent();
            expect(Number(text)).toBe(value);
        }).toPass({ timeout });
    }
    
    async assertStatusBecomes(status: string, timeout: number = 10000) {
        await expect(async () => {
            await expect(this.status).toHaveText(status);
        }).toPass({ timeout });
    }
}

// Solution 2: Retry Assertions
class RetryAssertionsPage {
    readonly page: Page;
    readonly element: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.element = page.locator('.dynamic-element');
    }
    
    async assertWithRetry(
        assertion: () => Promise<void>,
        retries: number = 3,
        delay: number = 1000
    ) {
        let lastError: Error | null = null;
        
        for (let i = 0; i < retries; i++) {
            try {
                await assertion();
                return;
            } catch (error) {
                lastError = error as Error;
                await this.page.waitForTimeout(delay);
            }
        }
        
        throw lastError;
    }
    
    async assertElementVisibleWithRetry() {
        await this.assertWithRetry(async () => {
            await expect(this.element).toBeVisible();
        });
    }
}

// Solution 3: Eventually Assertions
class EventuallyAssertionsPage {
    readonly page: Page;
    readonly loadingIndicator: Locator;
    readonly content: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.loadingIndicator = page.locator('.loading');
        this.content = page.locator('.content');
    }
    
    async assertEventuallyLoaded(timeout: number = 30000) {
        await expect(this.loadingIndicator).toBeHidden({ timeout });
        await expect(this.content).toBeVisible({ timeout });
    }
    
    async assertEventuallyHasText(text: string, timeout: number = 10000) {
        await expect(this.content).toContainText(text, { timeout });
    }
}

// Solution 4: Timeout Handling
class TimeoutAssertionsPage {
    readonly page: Page;
    readonly element: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.element = page.locator('.element');
    }
    
    async assertWithCustomTimeout(timeout: number) {
        await expect(this.element).toBeVisible({ timeout });
    }
    
    async assertOrTimeout(timeout: number): Promise<boolean> {
        try {
            await expect(this.element).toBeVisible({ timeout });
            return true;
        } catch {
            return false;
        }
    }
}

// Solution 5: Wait and Assert
class WaitAndAssertPage {
    readonly page: Page;
    readonly button: Locator;
    readonly result: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.button = page.locator('button');
        this.result = page.locator('.result');
    }
    
    async clickAndAssertResult(expectedText: string) {
        await this.button.click();
        await expect(this.result).toHaveText(expectedText);
    }
    
    async waitForNetworkAndAssert(expectedText: string) {
        await this.page.waitForLoadState('networkidle');
        await expect(this.result).toContainText(expectedText);
    }
}

// Solution 6: Conditional Async Assertions
class ConditionalAsyncAssertionsPage {
    readonly page: Page;
    readonly element: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.element = page.locator('.conditional');
    }
    
    async assertIfExists() {
        const count = await this.element.count();
        if (count > 0) {
            await expect(this.element).toBeVisible();
        }
    }
    
    async assertWhenReady() {
        await this.element.waitFor({ state: 'visible' });
        await expect(this.element).toBeEnabled();
    }
}

// Solution 7: Export
export {
    PollingAssertionsPage,
    RetryAssertionsPage,
    EventuallyAssertionsPage,
    TimeoutAssertionsPage,
    WaitAndAssertPage,
    ConditionalAsyncAssertionsPage,
};

