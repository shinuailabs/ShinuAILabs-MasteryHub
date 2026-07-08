/**
 * Lab 462: Page Interfaces
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Using interfaces with page objects:
 * 
 * - Defining contracts
 * - Type safety
 * - Polymorphism
 * - Testability
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Define page interfaces
 * 2. Implement interfaces
 * 3. Use polymorphism
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { Page, Locator } from '@playwright/test';

// Solution 1: Basic Page Interface
interface IPage {
    page: Page;
    navigate(): Promise<void>;
    isLoaded(): Promise<boolean>;
}

// Solution 2: Implementing Interface
class HomePage implements IPage {
    readonly page: Page;
    readonly heading: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.heading = page.locator('h1');
    }
    
    async navigate() {
        await this.page.goto('/');
    }
    
    async isLoaded() {
        return await this.heading.isVisible();
    }
}

// Solution 3: Searchable Interface
interface ISearchable {
    search(query: string): Promise<void>;
    getSearchResults(): Promise<string[]>;
}

class SearchPage implements ISearchable {
    readonly page: Page;
    readonly searchInput: Locator;
    readonly results: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.searchInput = page.locator('#search');
        this.results = page.locator('.result');
    }
    
    async search(query: string) {
        await this.searchInput.fill(query);
        await this.searchInput.press('Enter');
    }
    
    async getSearchResults() {
        return await this.results.allTextContents();
    }
}

// Solution 4: Multiple Interfaces
interface INavigable {
    navigate(): Promise<void>;
}

interface IAuthenticatable {
    login(username: string, password: string): Promise<void>;
    logout(): Promise<void>;
}

class LoginPage implements INavigable, IAuthenticatable {
    readonly page: Page;
    
    constructor(page: Page) {
        this.page = page;
    }
    
    async navigate() {
        await this.page.goto('/login');
    }
    
    async login(username: string, password: string) {
        await this.page.locator('#username').fill(username);
        await this.page.locator('#password').fill(password);
        await this.page.locator('#submit').click();
    }
    
    async logout() {
        await this.page.locator('#logout').click();
    }
}

// Solution 5: Generic Interface
interface IFormPage<T> {
    fillForm(data: T): Promise<void>;
    submitForm(): Promise<void>;
    getFormData(): Promise<T>;
}

interface UserData {
    name: string;
    email: string;
}

class UserFormPage implements IFormPage<UserData> {
    readonly page: Page;
    
    constructor(page: Page) {
        this.page = page;
    }
    
    async fillForm(data: UserData) {
        await this.page.locator('#name').fill(data.name);
        await this.page.locator('#email').fill(data.email);
    }
    
    async submitForm() {
        await this.page.locator('button[type="submit"]').click();
    }
    
    async getFormData(): Promise<UserData> {
        return {
            name: await this.page.locator('#name').inputValue(),
            email: await this.page.locator('#email').inputValue(),
        };
    }
}

// Solution 6: Interface for Components
interface IComponent {
    isVisible(): Promise<boolean>;
    waitForVisible(): Promise<void>;
}

class HeaderComponent implements IComponent {
    readonly page: Page;
    readonly header: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.header = page.locator('header');
    }
    
    async isVisible() {
        return await this.header.isVisible();
    }
    
    async waitForVisible() {
        await this.header.waitFor({ state: 'visible' });
    }
}

// Solution 7: Using Interfaces for Polymorphism
async function testPage(page: IPage) {
    await page.navigate();
    const loaded = await page.isLoaded();
    console.log('Page loaded:', loaded);
}

// Solution 8: Interface Segregation
interface IReadable {
    getText(): Promise<string>;
}

interface IClickable {
    click(): Promise<void>;
}

interface IFillable {
    fill(value: string): Promise<void>;
}

// Solution 9: Combined Interface
interface IInteractiveElement extends IReadable, IClickable {
    // Combines multiple interfaces
}

// Solution 10: Export
export {
    IPage,
    ISearchable,
    INavigable,
    IAuthenticatable,
    IFormPage,
    IComponent,
    HomePage,
    SearchPage,
    LoginPage,
    UserFormPage,
    HeaderComponent,
};

