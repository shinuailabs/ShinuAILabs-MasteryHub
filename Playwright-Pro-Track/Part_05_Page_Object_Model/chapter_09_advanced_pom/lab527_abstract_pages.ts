/**
 * Lab 527: Abstract Pages
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Creating abstract page classes:
 * 
 * - Abstract base classes
 * - Common functionality
 * - Template methods
 * - Inheritance patterns
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create abstract pages
 * 2. Implement common methods
 * 3. Use template pattern
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { Page, Locator, expect } from '@playwright/test';

// Solution 1: Abstract Base Page
abstract class BasePage {
    readonly page: Page;
    abstract readonly url: string;
    
    constructor(page: Page) {
        this.page = page;
    }
    
    async goto() {
        await this.page.goto(this.url);
        await this.waitForPageLoad();
    }
    
    async waitForPageLoad() {
        await this.page.waitForLoadState('networkidle');
    }
    
    async getTitle() {
        return await this.page.title();
    }
    
    async getCurrentUrl() {
        return this.page.url();
    }
    
    // Template method - subclasses can override
    async isLoaded(): Promise<boolean> {
        return this.page.url().includes(this.url);
    }
}

// Solution 2: Concrete Page Implementation
class LoginPage extends BasePage {
    readonly url = '/login';
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly submitButton: Locator;
    
    constructor(page: Page) {
        super(page);
        this.usernameInput = page.locator('#username');
        this.passwordInput = page.locator('#password');
        this.submitButton = page.locator('button[type="submit"]');
    }
    
    async login(username: string, password: string) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.submitButton.click();
    }
    
    override async isLoaded(): Promise<boolean> {
        return await this.usernameInput.isVisible();
    }
}

// Solution 3: Abstract Page with Components
abstract class PageWithHeader extends BasePage {
    readonly header: Locator;
    readonly logo: Locator;
    readonly navigation: Locator;
    
    constructor(page: Page) {
        super(page);
        this.header = page.locator('header');
        this.logo = this.header.locator('.logo');
        this.navigation = this.header.locator('nav');
    }
    
    async clickLogo() {
        await this.logo.click();
    }
    
    async navigateTo(linkText: string) {
        await this.navigation.locator(`text=${linkText}`).click();
    }
}

// Solution 4: Abstract Form Page
abstract class FormPage extends BasePage {
    abstract readonly form: Locator;
    abstract readonly submitButton: Locator;
    
    async fillField(name: string, value: string) {
        await this.form.locator(`[name="${name}"]`).fill(value);
    }
    
    async submit() {
        await this.submitButton.click();
    }
    
    async getFieldError(name: string) {
        return await this.form.locator(`[data-error-for="${name}"]`).textContent();
    }
    
    async hasErrors(): Promise<boolean> {
        return await this.form.locator('.error').count() > 0;
    }
}

// Solution 5: Concrete Form Page
class RegistrationPage extends FormPage {
    readonly url = '/register';
    readonly form: Locator;
    readonly submitButton: Locator;
    
    constructor(page: Page) {
        super(page);
        this.form = page.locator('#registration-form');
        this.submitButton = this.form.locator('button[type="submit"]');
    }
    
    async register(data: { username: string; email: string; password: string }) {
        await this.fillField('username', data.username);
        await this.fillField('email', data.email);
        await this.fillField('password', data.password);
        await this.submit();
    }
}

// Solution 6: Abstract List Page
abstract class ListPage<T> extends BasePage {
    abstract readonly listContainer: Locator;
    abstract readonly items: Locator;
    
    async getItemCount(): Promise<number> {
        return await this.items.count();
    }
    
    async getItemByIndex(index: number): Promise<Locator> {
        return this.items.nth(index);
    }
    
    abstract parseItem(item: Locator): Promise<T>;
    
    async getAllItems(): Promise<T[]> {
        const count = await this.getItemCount();
        const items: T[] = [];
        for (let i = 0; i < count; i++) {
            const item = await this.getItemByIndex(i);
            items.push(await this.parseItem(item));
        }
        return items;
    }
}

// Solution 7: Export
export {
    BasePage,
    LoginPage,
    PageWithHeader,
    FormPage,
    RegistrationPage,
    ListPage,
};

