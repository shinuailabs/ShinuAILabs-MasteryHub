/**
 * Lab 485: Wait Actions
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Implementing wait actions in POM:
 * 
 * - Wait for element
 * - Wait for state
 * - Wait for network
 * - Custom waits
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Implement wait methods
 * 2. Handle different wait conditions
 * 3. Create custom waits
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { Page, Locator } from '@playwright/test';

// Solution 1: Wait for Element
class WaitForElementPage {
    readonly page: Page;
    readonly element: Locator;
    readonly loader: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.element = page.locator('.content');
        this.loader = page.locator('.loader');
    }
    
    async waitForElementVisible() {
        await this.element.waitFor({ state: 'visible' });
    }
    
    async waitForElementHidden() {
        await this.loader.waitFor({ state: 'hidden' });
    }
    
    async waitForElementAttached() {
        await this.element.waitFor({ state: 'attached' });
    }
    
    async waitForElementDetached() {
        await this.element.waitFor({ state: 'detached' });
    }
}

// Solution 2: Wait for State
class WaitForStatePage {
    readonly page: Page;
    readonly button: Locator;
    readonly input: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.button = page.locator('button');
        this.input = page.locator('input');
    }
    
    async waitForButtonEnabled() {
        await this.button.waitFor({ state: 'visible' });
        while (!(await this.button.isEnabled())) {
            await this.page.waitForTimeout(100);
        }
    }
    
    async waitForInputEditable() {
        await this.input.waitFor({ state: 'visible' });
        while (!(await this.input.isEditable())) {
            await this.page.waitForTimeout(100);
        }
    }
}

// Solution 3: Wait for Network
class WaitForNetworkPage {
    readonly page: Page;
    
    constructor(page: Page) {
        this.page = page;
    }
    
    async waitForNetworkIdle() {
        await this.page.waitForLoadState('networkidle');
    }
    
    async waitForDOMContentLoaded() {
        await this.page.waitForLoadState('domcontentloaded');
    }
    
    async waitForLoad() {
        await this.page.waitForLoadState('load');
    }
    
    async waitForResponse(urlPattern: string | RegExp) {
        await this.page.waitForResponse(urlPattern);
    }
    
    async waitForRequest(urlPattern: string | RegExp) {
        await this.page.waitForRequest(urlPattern);
    }
}

// Solution 4: Wait for URL
class WaitForURLPage {
    readonly page: Page;
    
    constructor(page: Page) {
        this.page = page;
    }
    
    async waitForURL(url: string) {
        await this.page.waitForURL(url);
    }
    
    async waitForURLContains(text: string) {
        await this.page.waitForURL(`**/*${text}*`);
    }
    
    async waitForURLPattern(pattern: RegExp) {
        await this.page.waitForURL(pattern);
    }
}

// Solution 5: Wait with Timeout
class WaitWithTimeoutPage {
    readonly page: Page;
    readonly element: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.element = page.locator('.element');
    }
    
    async waitWithCustomTimeout(timeout: number) {
        await this.element.waitFor({ state: 'visible', timeout });
    }
    
    async waitOrFail(timeout: number) {
        try {
            await this.element.waitFor({ state: 'visible', timeout });
            return true;
        } catch {
            return false;
        }
    }
}

// Solution 6: Custom Wait Conditions
class CustomWaitPage {
    readonly page: Page;
    readonly counter: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.counter = page.locator('.counter');
    }
    
    async waitForCounterValue(value: number) {
        await this.page.waitForFunction(
            (expected) => {
                const el = document.querySelector('.counter');
                return el && parseInt(el.textContent || '0') === expected;
            },
            value
        );
    }
    
    async waitForTextChange(initialText: string) {
        await this.page.waitForFunction(
            (text) => {
                const el = document.querySelector('.counter');
                return el && el.textContent !== text;
            },
            initialText
        );
    }
}

// Solution 7: Export
export {
    WaitForElementPage,
    WaitForStatePage,
    WaitForNetworkPage,
    WaitForURLPage,
    WaitWithTimeoutPage,
    CustomWaitPage,
};

