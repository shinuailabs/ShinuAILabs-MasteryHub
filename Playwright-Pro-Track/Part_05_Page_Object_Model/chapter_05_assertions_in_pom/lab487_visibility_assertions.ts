/**
 * Lab 487: Visibility Assertions
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Implementing visibility assertions in POM:
 * 
 * - toBeVisible
 * - toBeHidden
 * - toBeAttached
 * - Custom visibility checks
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Assert element visibility
 * 2. Check hidden elements
 * 3. Verify attachment state
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { Page, Locator, expect } from '@playwright/test';

// Solution 1: Basic Visibility Assertions
class BasicVisibilityPage {
    readonly page: Page;
    readonly header: Locator;
    readonly modal: Locator;
    readonly loader: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.header = page.locator('header');
        this.modal = page.locator('.modal');
        this.loader = page.locator('.loader');
    }
    
    async assertHeaderVisible() {
        await expect(this.header).toBeVisible();
    }
    
    async assertModalHidden() {
        await expect(this.modal).toBeHidden();
    }
    
    async assertLoaderNotVisible() {
        await expect(this.loader).not.toBeVisible();
    }
}

// Solution 2: Attachment Assertions
class AttachmentAssertionsPage {
    readonly page: Page;
    readonly dynamicElement: Locator;
    readonly removedElement: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.dynamicElement = page.locator('.dynamic');
        this.removedElement = page.locator('.removed');
    }
    
    async assertElementAttached() {
        await expect(this.dynamicElement).toBeAttached();
    }
    
    async assertElementDetached() {
        await expect(this.removedElement).not.toBeAttached();
    }
}

// Solution 3: Conditional Visibility
class ConditionalVisibilityPage {
    readonly page: Page;
    readonly element: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.element = page.locator('.conditional');
    }
    
    async assertVisibleWhen(condition: boolean) {
        if (condition) {
            await expect(this.element).toBeVisible();
        } else {
            await expect(this.element).toBeHidden();
        }
    }
    
    async isVisible(): Promise<boolean> {
        return await this.element.isVisible();
    }
}

// Solution 4: Multiple Elements Visibility
class MultipleVisibilityPage {
    readonly page: Page;
    readonly items: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.items = page.locator('.item');
    }
    
    async assertAllItemsVisible() {
        const count = await this.items.count();
        for (let i = 0; i < count; i++) {
            await expect(this.items.nth(i)).toBeVisible();
        }
    }
    
    async assertItemVisible(index: number) {
        await expect(this.items.nth(index)).toBeVisible();
    }
}

// Solution 5: Visibility with Timeout
class TimeoutVisibilityPage {
    readonly page: Page;
    readonly slowElement: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.slowElement = page.locator('.slow-loading');
    }
    
    async assertVisibleWithTimeout(timeout: number) {
        await expect(this.slowElement).toBeVisible({ timeout });
    }
    
    async assertHiddenWithTimeout(timeout: number) {
        await expect(this.slowElement).toBeHidden({ timeout });
    }
}

// Solution 6: Page State Assertions
class PageStateAssertionsPage {
    readonly page: Page;
    readonly loginForm: Locator;
    readonly dashboard: Locator;
    readonly errorBanner: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.loginForm = page.locator('#login-form');
        this.dashboard = page.locator('#dashboard');
        this.errorBanner = page.locator('.error-banner');
    }
    
    async assertLoggedOut() {
        await expect(this.loginForm).toBeVisible();
        await expect(this.dashboard).toBeHidden();
    }
    
    async assertLoggedIn() {
        await expect(this.loginForm).toBeHidden();
        await expect(this.dashboard).toBeVisible();
    }
    
    async assertNoErrors() {
        await expect(this.errorBanner).toBeHidden();
    }
}

// Solution 7: Export
export {
    BasicVisibilityPage,
    AttachmentAssertionsPage,
    ConditionalVisibilityPage,
    MultipleVisibilityPage,
    TimeoutVisibilityPage,
    PageStateAssertionsPage,
};

