/**
 * Lab 457: Creating Page Classes
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Creating effective page classes:
 * 
 * - Class structure
 * - Constructor patterns
 * - Property definitions
 * - Method organization
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create page classes
 * 2. Define properties
 * 3. Implement methods
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { Page, Locator } from '@playwright/test';

// Solution 1: Basic Page Class
class BasicPage {
    readonly page: Page;
    
    constructor(page: Page) {
        this.page = page;
    }
}

// Solution 2: Page Class with Locators
class PageWithLocators {
    readonly page: Page;
    readonly header: Locator;
    readonly footer: Locator;
    readonly mainContent: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.header = page.locator('header');
        this.footer = page.locator('footer');
        this.mainContent = page.locator('main');
    }
}

// Solution 3: Page Class with Methods
class PageWithMethods {
    readonly page: Page;
    readonly searchInput: Locator;
    readonly searchButton: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.searchInput = page.locator('#search');
        this.searchButton = page.locator('#search-btn');
    }
    
    async search(query: string) {
        await this.searchInput.fill(query);
        await this.searchButton.click();
    }
    
    async clearSearch() {
        await this.searchInput.clear();
    }
}

// Solution 4: Page Class with Navigation
class NavigablePage {
    readonly page: Page;
    readonly url: string;
    
    constructor(page: Page, url: string = '/') {
        this.page = page;
        this.url = url;
    }
    
    async navigate() {
        await this.page.goto(this.url);
    }
    
    async isLoaded() {
        return this.page.url().includes(this.url);
    }
}

// Solution 5: Page Class with Getters
class PageWithGetters {
    readonly page: Page;
    
    constructor(page: Page) {
        this.page = page;
    }
    
    get title() {
        return this.page.locator('h1');
    }
    
    get description() {
        return this.page.locator('.description');
    }
    
    get buttons() {
        return this.page.locator('button');
    }
}

// Solution 6: Page Class with Private Members
class PageWithPrivate {
    readonly page: Page;
    private readonly apiEndpoint: string;
    
    constructor(page: Page) {
        this.page = page;
        this.apiEndpoint = '/api/data';
    }
    
    async fetchData() {
        const response = await this.page.request.get(this.apiEndpoint);
        return response.json();
    }
}

// Solution 7: Page Class with Static Members
class PageWithStatic {
    readonly page: Page;
    static readonly DEFAULT_TIMEOUT = 30000;
    static readonly BASE_URL = 'https://example.com';
    
    constructor(page: Page) {
        this.page = page;
    }
    
    async navigate(path: string) {
        await this.page.goto(`${PageWithStatic.BASE_URL}${path}`);
    }
}

// Solution 8: Page Class with Types
interface PageElements {
    header: Locator;
    content: Locator;
    footer: Locator;
}

class TypedPage {
    readonly page: Page;
    readonly elements: PageElements;
    
    constructor(page: Page) {
        this.page = page;
        this.elements = {
            header: page.locator('header'),
            content: page.locator('main'),
            footer: page.locator('footer'),
        };
    }
}

// Solution 9: Complete Page Class Example
class CompletePage {
    readonly page: Page;
    readonly heading: Locator;
    readonly content: Locator;
    readonly submitButton: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.heading = page.locator('h1');
        this.content = page.locator('.content');
        this.submitButton = page.locator('button[type="submit"]');
    }
    
    async navigate() {
        await this.page.goto('/');
        await this.page.waitForLoadState('networkidle');
    }
    
    async getHeadingText() {
        return await this.heading.textContent();
    }
    
    async submit() {
        await this.submitButton.click();
    }
    
    async isLoaded() {
        return await this.heading.isVisible();
    }
}

// Solution 10: Export
export {
    BasicPage,
    PageWithLocators,
    PageWithMethods,
    NavigablePage,
    PageWithGetters,
    PageWithPrivate,
    PageWithStatic,
    TypedPage,
    CompletePage,
};

