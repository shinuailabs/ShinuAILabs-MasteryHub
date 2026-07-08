/**
 * Lab 454: POM with Playwright
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Implementing POM specifically with Playwright:
 * 
 * - Playwright-specific patterns
 * - Using Locator class
 * - Async/await patterns
 * - TypeScript integration
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create Playwright page objects
 * 2. Use Playwright locators
 * 3. Implement async methods
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { Page, Locator, expect } from '@playwright/test';

// Solution 1: Basic Playwright Page Object
class PlaywrightPage {
    readonly page: Page;
    readonly heading: Locator;
    readonly getStartedButton: Locator;
    readonly searchButton: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.heading = page.locator('h1');
        this.getStartedButton = page.getByRole('link', { name: 'Get started' });
        this.searchButton = page.getByRole('button', { name: 'Search' });
    }
    
    async navigate() {
        await this.page.goto('https://playwright.dev');
    }
    
    async getHeadingText() {
        return await this.heading.textContent();
    }
    
    async clickGetStarted() {
        await this.getStartedButton.click();
    }
}

// Solution 2: Using Playwright Locator Strategies
class LocatorStrategiesPage {
    readonly page: Page;
    
    // Different locator strategies
    readonly byRole: Locator;
    readonly byText: Locator;
    readonly byTestId: Locator;
    readonly byLabel: Locator;
    readonly byPlaceholder: Locator;
    readonly byCss: Locator;
    
    constructor(page: Page) {
        this.page = page;
        
        // Recommended: Role-based
        this.byRole = page.getByRole('button', { name: 'Submit' });
        
        // Text-based
        this.byText = page.getByText('Welcome');
        
        // Test ID (best for testing)
        this.byTestId = page.getByTestId('submit-button');
        
        // Label-based (for form fields)
        this.byLabel = page.getByLabel('Email');
        
        // Placeholder-based
        this.byPlaceholder = page.getByPlaceholder('Enter email');
        
        // CSS selector (fallback)
        this.byCss = page.locator('.submit-btn');
    }
}

// Solution 3: Async/Await Patterns
class AsyncPage {
    readonly page: Page;
    readonly items: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.items = page.locator('.item');
    }
    
    // Async method returning value
    async getItemCount(): Promise<number> {
        return await this.items.count();
    }
    
    // Async method with multiple awaits
    async selectItem(index: number) {
        await this.items.nth(index).click();
        await this.page.waitForSelector('.item-details');
    }
    
    // Async method returning array
    async getAllItemTexts(): Promise<string[]> {
        return await this.items.allTextContents();
    }
}

// Solution 4: TypeScript Types
interface UserCredentials {
    username: string;
    password: string;
}

interface LoginResult {
    success: boolean;
    message: string;
}

class TypedLoginPage {
    readonly page: Page;
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly submitButton: Locator;
    readonly errorMessage: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.usernameInput = page.getByLabel('Username');
        this.passwordInput = page.getByLabel('Password');
        this.submitButton = page.getByRole('button', { name: 'Login' });
        this.errorMessage = page.locator('.error');
    }
    
    async login(credentials: UserCredentials): Promise<void> {
        await this.usernameInput.fill(credentials.username);
        await this.passwordInput.fill(credentials.password);
        await this.submitButton.click();
    }
    
    async getLoginResult(): Promise<LoginResult> {
        const hasError = await this.errorMessage.isVisible();
        return {
            success: !hasError,
            message: hasError ? await this.errorMessage.textContent() || '' : 'Success',
        };
    }
}

// Solution 5: Chained Locators
class ChainedLocatorsPage {
    readonly page: Page;
    readonly form: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.form = page.locator('form');
    }
    
    // Chained locators
    get usernameInput() {
        return this.form.locator('#username');
    }
    
    get passwordInput() {
        return this.form.locator('#password');
    }
    
    get submitButton() {
        return this.form.locator('button[type="submit"]');
    }
}

// Solution 6: Page Object with Waits
class WaitingPage {
    readonly page: Page;
    readonly loadingSpinner: Locator;
    readonly content: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.loadingSpinner = page.locator('.spinner');
        this.content = page.locator('.content');
    }
    
    async waitForLoad() {
        await this.loadingSpinner.waitFor({ state: 'hidden' });
        await this.content.waitFor({ state: 'visible' });
    }
    
    async navigateAndWait(url: string) {
        await this.page.goto(url);
        await this.waitForLoad();
    }
}

// Solution 7: Page Object with Actions
class ActionsPage {
    readonly page: Page;
    readonly draggable: Locator;
    readonly dropzone: Locator;
    readonly slider: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.draggable = page.locator('.draggable');
        this.dropzone = page.locator('.dropzone');
        this.slider = page.locator('.slider');
    }
    
    async dragAndDrop() {
        await this.draggable.dragTo(this.dropzone);
    }
    
    async moveSlider(percentage: number) {
        const box = await this.slider.boundingBox();
        if (box) {
            const x = box.x + (box.width * percentage / 100);
            await this.page.mouse.click(x, box.y + box.height / 2);
        }
    }
}

// Solution 8: Export
export {
    PlaywrightPage,
    LocatorStrategiesPage,
    AsyncPage,
    TypedLoginPage,
    ChainedLocatorsPage,
    WaitingPage,
    ActionsPage,
};

