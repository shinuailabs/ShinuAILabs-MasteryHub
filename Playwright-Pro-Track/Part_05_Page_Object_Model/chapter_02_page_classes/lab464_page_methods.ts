/**
 * Lab 464: Page Methods
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Designing effective page methods:
 * 
 * - Action methods
 * - Getter methods
 * - Verification methods
 * - Utility methods
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create different method types
 * 2. Follow naming conventions
 * 3. Return appropriate values
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { Page, Locator } from '@playwright/test';

// Solution 1: Action Methods
class ActionMethodsPage {
    readonly page: Page;
    readonly button: Locator;
    readonly input: Locator;
    readonly checkbox: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.button = page.locator('button');
        this.input = page.locator('input');
        this.checkbox = page.locator('input[type="checkbox"]');
    }
    
    // Click action
    async clickButton() {
        await this.button.click();
    }
    
    // Fill action
    async fillInput(value: string) {
        await this.input.fill(value);
    }
    
    // Check action
    async checkCheckbox() {
        await this.checkbox.check();
    }
    
    // Uncheck action
    async uncheckCheckbox() {
        await this.checkbox.uncheck();
    }
}

// Solution 2: Getter Methods
class GetterMethodsPage {
    readonly page: Page;
    readonly heading: Locator;
    readonly items: Locator;
    readonly input: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.heading = page.locator('h1');
        this.items = page.locator('.item');
        this.input = page.locator('input');
    }
    
    // Get text
    async getHeadingText() {
        return await this.heading.textContent();
    }
    
    // Get count
    async getItemCount() {
        return await this.items.count();
    }
    
    // Get value
    async getInputValue() {
        return await this.input.inputValue();
    }
    
    // Get attribute
    async getInputPlaceholder() {
        return await this.input.getAttribute('placeholder');
    }
    
    // Get all texts
    async getAllItemTexts() {
        return await this.items.allTextContents();
    }
}

// Solution 3: Verification Methods
class VerificationMethodsPage {
    readonly page: Page;
    readonly element: Locator;
    readonly button: Locator;
    readonly checkbox: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.element = page.locator('.element');
        this.button = page.locator('button');
        this.checkbox = page.locator('input[type="checkbox"]');
    }
    
    // Is visible
    async isElementVisible() {
        return await this.element.isVisible();
    }
    
    // Is enabled
    async isButtonEnabled() {
        return await this.button.isEnabled();
    }
    
    // Is checked
    async isCheckboxChecked() {
        return await this.checkbox.isChecked();
    }
    
    // Has text
    async hasText(text: string) {
        const content = await this.element.textContent();
        return content?.includes(text) ?? false;
    }
}

// Solution 4: Navigation Methods
class NavigationMethodsPage {
    readonly page: Page;
    
    constructor(page: Page) {
        this.page = page;
    }
    
    async navigate() {
        await this.page.goto('/');
    }
    
    async navigateTo(path: string) {
        await this.page.goto(path);
    }
    
    async goBack() {
        await this.page.goBack();
    }
    
    async refresh() {
        await this.page.reload();
    }
}

// Solution 5: Wait Methods
class WaitMethodsPage {
    readonly page: Page;
    readonly loader: Locator;
    readonly content: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.loader = page.locator('.loader');
        this.content = page.locator('.content');
    }
    
    async waitForPageLoad() {
        await this.page.waitForLoadState('networkidle');
    }
    
    async waitForLoaderToDisappear() {
        await this.loader.waitFor({ state: 'hidden' });
    }
    
    async waitForContent() {
        await this.content.waitFor({ state: 'visible' });
    }
}

// Solution 6: Combined Methods
class CombinedMethodsPage {
    readonly page: Page;
    readonly searchInput: Locator;
    readonly searchButton: Locator;
    readonly results: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.searchInput = page.locator('#search');
        this.searchButton = page.locator('#search-btn');
        this.results = page.locator('.results');
    }
    
    // Combined action method
    async search(query: string) {
        await this.searchInput.fill(query);
        await this.searchButton.click();
        await this.results.waitFor();
    }
    
    // Combined getter method
    async getSearchResultsCount() {
        await this.results.waitFor();
        return await this.results.locator('.item').count();
    }
}

// Solution 7: Export
export {
    ActionMethodsPage,
    GetterMethodsPage,
    VerificationMethodsPage,
    NavigationMethodsPage,
    WaitMethodsPage,
    CombinedMethodsPage,
};

