/**
 * Lab 541: Testability
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Writing testable POM code:
 * 
 * - Testable design
 * - Dependency injection
 * - Mocking support
 * - Assertion helpers
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Design for testability
 * 2. Support mocking
 * 3. Create assertion helpers
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { Page, Locator, expect } from '@playwright/test';

// Solution 1: Interface for Dependency Injection
interface ILogger {
    log(message: string): void;
    error(message: string): void;
}

interface IApiClient {
    get(endpoint: string): Promise<unknown>;
    post(endpoint: string, data: unknown): Promise<unknown>;
}

// Solution 2: Testable Page with DI
class TestablePage {
    constructor(
        readonly page: Page,
        private logger?: ILogger,
        private apiClient?: IApiClient
    ) {}
    
    async performAction() {
        this.logger?.log('Performing action');
        await this.page.click('#action-btn');
    }
    
    async fetchData() {
        if (this.apiClient) {
            return await this.apiClient.get('/data');
        }
        return null;
    }
}

// Solution 3: Page with Built-in Assertions
class AssertablePage {
    constructor(readonly page: Page) {}
    
    // Built-in assertion methods
    async assertTitle(expected: string) {
        await expect(this.page).toHaveTitle(expected);
    }
    
    async assertUrl(expected: string | RegExp) {
        await expect(this.page).toHaveURL(expected);
    }
    
    async assertElementVisible(selector: string) {
        await expect(this.page.locator(selector)).toBeVisible();
    }
    
    async assertElementHidden(selector: string) {
        await expect(this.page.locator(selector)).toBeHidden();
    }
    
    async assertText(selector: string, expected: string) {
        await expect(this.page.locator(selector)).toHaveText(expected);
    }
    
    async assertInputValue(selector: string, expected: string) {
        await expect(this.page.locator(selector)).toHaveValue(expected);
    }
}

// Solution 4: Assertion Helper Class
class PageAssertions {
    constructor(private page: Page) {}
    
    element(selector: string) {
        return new ElementAssertions(this.page.locator(selector));
    }
    
    async pageTitle(expected: string) {
        await expect(this.page).toHaveTitle(expected);
    }
    
    async pageUrl(expected: string | RegExp) {
        await expect(this.page).toHaveURL(expected);
    }
}

class ElementAssertions {
    constructor(private locator: Locator) {}
    
    async isVisible() {
        await expect(this.locator).toBeVisible();
    }
    
    async isHidden() {
        await expect(this.locator).toBeHidden();
    }
    
    async hasText(expected: string) {
        await expect(this.locator).toHaveText(expected);
    }
    
    async containsText(expected: string) {
        await expect(this.locator).toContainText(expected);
    }
    
    async hasValue(expected: string) {
        await expect(this.locator).toHaveValue(expected);
    }
    
    async hasCount(expected: number) {
        await expect(this.locator).toHaveCount(expected);
    }
    
    async isEnabled() {
        await expect(this.locator).toBeEnabled();
    }
    
    async isDisabled() {
        await expect(this.locator).toBeDisabled();
    }
}

// Solution 5: Page with State Verification
class VerifiablePage {
    constructor(readonly page: Page) {}
    
    async isLoaded(): Promise<boolean> {
        try {
            await this.page.waitForSelector('.page-content', { timeout: 5000 });
            return true;
        } catch {
            return false;
        }
    }
    
    async getState(): Promise<{
        url: string;
        title: string;
        isLoaded: boolean;
    }> {
        return {
            url: this.page.url(),
            title: await this.page.title(),
            isLoaded: await this.isLoaded(),
        };
    }
    
    async verifyState(expected: { url?: string; title?: string }) {
        const state = await this.getState();
        
        if (expected.url && state.url !== expected.url) {
            throw new Error(`URL mismatch: expected ${expected.url}, got ${state.url}`);
        }
        
        if (expected.title && state.title !== expected.title) {
            throw new Error(`Title mismatch: expected ${expected.title}, got ${state.title}`);
        }
    }
}

// Solution 6: Mock-Friendly Design
class MockFriendlyPage {
    constructor(
        readonly page: Page,
        private dataProvider: { getData: () => Promise<unknown> } = {
            getData: async () => null,
        }
    ) {}
    
    async loadData() {
        return await this.dataProvider.getData();
    }
}

// Solution 7: Export
export {
    ILogger,
    IApiClient,
    TestablePage,
    AssertablePage,
    PageAssertions,
    ElementAssertions,
    VerifiablePage,
    MockFriendlyPage,
};

