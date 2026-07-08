/**
 * Lab 450: First Page Object
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Creating your first page object:
 * 
 * - Basic page class
 * - Locator definitions
 * - Simple methods
 * - Using in tests
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create a simple page object
 * 2. Define locators
 * 3. Add action methods
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { Page, Locator, expect } from '@playwright/test';

// Solution 1: Simple Page Object
class PlaywrightHomePage {
    readonly page: Page;
    readonly logo: Locator;
    readonly heading: Locator;
    readonly getStartedLink: Locator;
    readonly docsLink: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.logo = page.locator('.navbar__logo');
        this.heading = page.locator('h1');
        this.getStartedLink = page.locator('text=Get started');
        this.docsLink = page.locator('text=Docs');
    }
    
    async navigate() {
        await this.page.goto('https://playwright.dev');
    }
    
    async getHeadingText() {
        return await this.heading.textContent();
    }
    
    async clickGetStarted() {
        await this.getStartedLink.click();
    }
    
    async clickDocs() {
        await this.docsLink.click();
    }
}

// Solution 2: Using the Page Object
async function usePageObject(page: Page) {
    const homePage = new PlaywrightHomePage(page);
    
    // Navigate to page
    await homePage.navigate();
    
    // Get heading text
    const heading = await homePage.getHeadingText();
    console.log('Heading:', heading);
    
    // Click link
    await homePage.clickGetStarted();
}

// Solution 3: Page Object with Assertions
class SearchPage {
    readonly page: Page;
    readonly searchInput: Locator;
    readonly searchButton: Locator;
    readonly results: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.searchInput = page.locator('[type="search"]');
        this.searchButton = page.locator('button.search-btn');
        this.results = page.locator('.search-results');
    }
    
    async search(query: string) {
        await this.searchInput.fill(query);
        await this.searchButton.click();
    }
    
    async verifyResultsVisible() {
        await expect(this.results).toBeVisible();
    }
    
    async getResultCount() {
        return await this.results.locator('.result-item').count();
    }
}

// Solution 4: Page Object with Navigation
class DocsPage {
    readonly page: Page;
    readonly sidebar: Locator;
    readonly content: Locator;
    readonly title: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.sidebar = page.locator('.sidebar');
        this.content = page.locator('.main-content');
        this.title = page.locator('h1');
    }
    
    async navigate() {
        await this.page.goto('https://playwright.dev/docs/intro');
    }
    
    async getPageTitle() {
        return await this.title.textContent();
    }
    
    async clickSidebarLink(text: string) {
        await this.sidebar.locator(`text=${text}`).click();
    }
}

// Solution 5: Page Object with Form
class ContactPage {
    readonly page: Page;
    readonly nameInput: Locator;
    readonly emailInput: Locator;
    readonly messageInput: Locator;
    readonly submitButton: Locator;
    readonly successMessage: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.nameInput = page.locator('#name');
        this.emailInput = page.locator('#email');
        this.messageInput = page.locator('#message');
        this.submitButton = page.locator('button[type="submit"]');
        this.successMessage = page.locator('.success');
    }
    
    async fillForm(name: string, email: string, message: string) {
        await this.nameInput.fill(name);
        await this.emailInput.fill(email);
        await this.messageInput.fill(message);
    }
    
    async submitForm() {
        await this.submitButton.click();
    }
    
    async verifySuccess() {
        await expect(this.successMessage).toBeVisible();
    }
}

// Solution 6: Complete Test Example
async function completeTestExample(page: Page) {
    // Create page object
    const homePage = new PlaywrightHomePage(page);
    
    // Step 1: Navigate
    await homePage.navigate();
    
    // Step 2: Verify page loaded
    await expect(homePage.heading).toBeVisible();
    
    // Step 3: Get heading text
    const headingText = await homePage.getHeadingText();
    expect(headingText).toContain('Playwright');
    
    // Step 4: Navigate to docs
    await homePage.clickDocs();
}

// Solution 7: Page Object Best Practices
/*
 * First Page Object Best Practices:
 * 
 * 1. Keep it simple
 * 2. One class per page
 * 3. Descriptive locator names
 * 4. Clear method names
 * 5. Return values when needed
 */

// Solution 8: Export for Tests
export { PlaywrightHomePage, SearchPage, DocsPage, ContactPage };

