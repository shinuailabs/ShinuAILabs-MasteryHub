/**
 * Lab 488: Text Assertions
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Implementing text assertions in POM:
 * 
 * - toHaveText
 * - toContainText
 * - Regex matching
 * - Multiple text assertions
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Assert exact text
 * 2. Assert partial text
 * 3. Use regex patterns
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { Page, Locator, expect } from '@playwright/test';

// Solution 1: Exact Text Assertions
class ExactTextPage {
    readonly page: Page;
    readonly heading: Locator;
    readonly message: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.heading = page.locator('h1');
        this.message = page.locator('.message');
    }
    
    async assertHeadingText(text: string) {
        await expect(this.heading).toHaveText(text);
    }
    
    async assertMessageText(text: string) {
        await expect(this.message).toHaveText(text);
    }
}

// Solution 2: Partial Text Assertions
class PartialTextPage {
    readonly page: Page;
    readonly description: Locator;
    readonly status: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.description = page.locator('.description');
        this.status = page.locator('.status');
    }
    
    async assertDescriptionContains(text: string) {
        await expect(this.description).toContainText(text);
    }
    
    async assertStatusContains(text: string) {
        await expect(this.status).toContainText(text);
    }
}

// Solution 3: Regex Text Assertions
class RegexTextPage {
    readonly page: Page;
    readonly price: Locator;
    readonly date: Locator;
    readonly email: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.price = page.locator('.price');
        this.date = page.locator('.date');
        this.email = page.locator('.email');
    }
    
    async assertPriceFormat() {
        await expect(this.price).toHaveText(/\$\d+\.\d{2}/);
    }
    
    async assertDateFormat() {
        await expect(this.date).toHaveText(/\d{2}\/\d{2}\/\d{4}/);
    }
    
    async assertEmailFormat() {
        await expect(this.email).toHaveText(/[\w.-]+@[\w.-]+\.\w+/);
    }
}

// Solution 4: Multiple Text Assertions
class MultipleTextPage {
    readonly page: Page;
    readonly items: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.items = page.locator('.item');
    }
    
    async assertItemTexts(texts: string[]) {
        await expect(this.items).toHaveText(texts);
    }
    
    async assertItemContainsText(index: number, text: string) {
        await expect(this.items.nth(index)).toContainText(text);
    }
}

// Solution 5: Empty Text Assertions
class EmptyTextPage {
    readonly page: Page;
    readonly emptyElement: Locator;
    readonly placeholder: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.emptyElement = page.locator('.empty');
        this.placeholder = page.locator('.placeholder');
    }
    
    async assertEmpty() {
        await expect(this.emptyElement).toHaveText('');
    }
    
    async assertNotEmpty() {
        await expect(this.placeholder).not.toHaveText('');
    }
}

// Solution 6: Case Insensitive Assertions
class CaseInsensitivePage {
    readonly page: Page;
    readonly text: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.text = page.locator('.text');
    }
    
    async assertTextIgnoreCase(text: string) {
        await expect(this.text).toHaveText(new RegExp(text, 'i'));
    }
    
    async assertContainsIgnoreCase(text: string) {
        await expect(this.text).toContainText(new RegExp(text, 'i'));
    }
}

// Solution 7: Dynamic Text Assertions
class DynamicTextPage {
    readonly page: Page;
    readonly counter: Locator;
    readonly greeting: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.counter = page.locator('.counter');
        this.greeting = page.locator('.greeting');
    }
    
    async assertCounterValue(value: number) {
        await expect(this.counter).toHaveText(String(value));
    }
    
    async assertGreetingForUser(username: string) {
        await expect(this.greeting).toContainText(username);
    }
}

// Solution 8: Export
export {
    ExactTextPage,
    PartialTextPage,
    RegexTextPage,
    MultipleTextPage,
    EmptyTextPage,
    CaseInsensitivePage,
    DynamicTextPage,
};

