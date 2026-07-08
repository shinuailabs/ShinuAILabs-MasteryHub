/**
 * Lab 533: Async Operations
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Handling async operations in POM:
 * 
 * - Async/await patterns
 * - Promise handling
 * - Parallel operations
 * - Error handling
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Handle async operations
 * 2. Use parallel execution
 * 3. Implement error handling
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { Page, Locator } from '@playwright/test';

// Solution 1: Async Page Operations
class AsyncPage {
    constructor(readonly page: Page) {}
    
    // Sequential operations
    async fillFormSequentially(data: Record<string, string>) {
        for (const [name, value] of Object.entries(data)) {
            await this.page.fill(`[name="${name}"]`, value);
        }
    }
    
    // Parallel operations
    async getMultipleTexts(selectors: string[]): Promise<(string | null)[]> {
        return await Promise.all(
            selectors.map(selector => this.page.locator(selector).textContent())
        );
    }
    
    // Wait for multiple conditions
    async waitForAllVisible(selectors: string[]) {
        await Promise.all(
            selectors.map(selector => this.page.locator(selector).waitFor({ state: 'visible' }))
        );
    }
}

// Solution 2: Retry Pattern
class RetryableOperations {
    constructor(readonly page: Page) {}
    
    async retry<T>(
        operation: () => Promise<T>,
        maxRetries: number = 3,
        delay: number = 1000
    ): Promise<T> {
        let lastError: Error | undefined;
        
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                return await operation();
            } catch (error) {
                lastError = error as Error;
                if (attempt < maxRetries) {
                    await this.page.waitForTimeout(delay);
                }
            }
        }
        
        throw lastError;
    }
    
    async clickWithRetry(selector: string) {
        await this.retry(async () => {
            await this.page.click(selector);
        });
    }
}

// Solution 3: Polling Pattern
class PollingOperations {
    constructor(readonly page: Page) {}
    
    async pollUntil<T>(
        condition: () => Promise<T>,
        predicate: (value: T) => boolean,
        timeout: number = 30000,
        interval: number = 500
    ): Promise<T> {
        const startTime = Date.now();
        
        while (Date.now() - startTime < timeout) {
            const value = await condition();
            if (predicate(value)) {
                return value;
            }
            await this.page.waitForTimeout(interval);
        }
        
        throw new Error('Polling timeout');
    }
    
    async waitForTextChange(selector: string, initialText: string) {
        return await this.pollUntil(
            () => this.page.locator(selector).textContent(),
            (text) => text !== initialText
        );
    }
}

// Solution 4: Batch Operations
class BatchOperations {
    constructor(readonly page: Page) {}
    
    async batchFill(fields: { selector: string; value: string }[]) {
        await Promise.all(
            fields.map(({ selector, value }) => this.page.fill(selector, value))
        );
    }
    
    async batchClick(selectors: string[]) {
        for (const selector of selectors) {
            await this.page.click(selector);
        }
    }
    
    async collectData(selectors: string[]): Promise<Map<string, string | null>> {
        const results = new Map<string, string | null>();
        
        await Promise.all(
            selectors.map(async (selector) => {
                const text = await this.page.locator(selector).textContent();
                results.set(selector, text);
            })
        );
        
        return results;
    }
}

// Solution 5: Async Queue
class AsyncQueue {
    private queue: (() => Promise<void>)[] = [];
    private running = false;
    
    add(operation: () => Promise<void>) {
        this.queue.push(operation);
    }
    
    async process() {
        if (this.running) return;
        this.running = true;
        
        while (this.queue.length > 0) {
            const operation = this.queue.shift()!;
            await operation();
        }
        
        this.running = false;
    }
}

// Solution 6: Timeout Wrapper
async function withTimeout<T>(
    promise: Promise<T>,
    timeout: number,
    errorMessage: string = 'Operation timed out'
): Promise<T> {
    let timeoutId: NodeJS.Timeout;
    
    const timeoutPromise = new Promise<never>((_, reject) => {
        timeoutId = setTimeout(() => reject(new Error(errorMessage)), timeout);
    });
    
    try {
        return await Promise.race([promise, timeoutPromise]);
    } finally {
        clearTimeout(timeoutId!);
    }
}

// Solution 7: Async Page with Error Handling
class RobustAsyncPage {
    constructor(readonly page: Page) {}
    
    async safeClick(selector: string): Promise<boolean> {
        try {
            await this.page.click(selector, { timeout: 5000 });
            return true;
        } catch {
            return false;
        }
    }
    
    async safeGetText(selector: string): Promise<string | null> {
        try {
            return await this.page.locator(selector).textContent({ timeout: 5000 });
        } catch {
            return null;
        }
    }
    
    async safeWaitForNavigation(action: () => Promise<void>): Promise<boolean> {
        try {
            await Promise.all([
                this.page.waitForNavigation(),
                action(),
            ]);
            return true;
        } catch {
            return false;
        }
    }
}

// Solution 8: Export
export {
    AsyncPage,
    RetryableOperations,
    PollingOperations,
    BatchOperations,
    AsyncQueue,
    withTimeout,
    RobustAsyncPage,
};

