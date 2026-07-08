/**
 * Lab 461: Page Factory
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Implementing page factory pattern:
 * 
 * - Centralized page creation
 * - Lazy initialization
 * - Dependency injection
 * - Clean test code
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create page factory
 * 2. Implement lazy loading
 * 3. Use in tests
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { Page, Locator } from '@playwright/test';

// Solution 1: Simple Page Classes
class HomePage {
    readonly page: Page;
    readonly heading: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.heading = page.locator('h1');
    }
    
    async navigate() {
        await this.page.goto('/');
    }
}

class LoginPage {
    readonly page: Page;
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.usernameInput = page.locator('#username');
        this.passwordInput = page.locator('#password');
    }
    
    async navigate() {
        await this.page.goto('/login');
    }
}

class DashboardPage {
    readonly page: Page;
    readonly welcomeMessage: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.welcomeMessage = page.locator('.welcome');
    }
}

// Solution 2: Basic Page Factory
class PageFactory {
    private page: Page;
    
    constructor(page: Page) {
        this.page = page;
    }
    
    getHomePage() {
        return new HomePage(this.page);
    }
    
    getLoginPage() {
        return new LoginPage(this.page);
    }
    
    getDashboardPage() {
        return new DashboardPage(this.page);
    }
}

// Solution 3: Page Factory with Lazy Loading
class LazyPageFactory {
    private page: Page;
    private _homePage?: HomePage;
    private _loginPage?: LoginPage;
    private _dashboardPage?: DashboardPage;
    
    constructor(page: Page) {
        this.page = page;
    }
    
    get homePage() {
        if (!this._homePage) {
            this._homePage = new HomePage(this.page);
        }
        return this._homePage;
    }
    
    get loginPage() {
        if (!this._loginPage) {
            this._loginPage = new LoginPage(this.page);
        }
        return this._loginPage;
    }
    
    get dashboardPage() {
        if (!this._dashboardPage) {
            this._dashboardPage = new DashboardPage(this.page);
        }
        return this._dashboardPage;
    }
}

// Solution 4: Generic Page Factory
class GenericPageFactory {
    private page: Page;
    private cache: Map<string, any> = new Map();
    
    constructor(page: Page) {
        this.page = page;
    }
    
    getPage<T>(PageClass: new (page: Page) => T): T {
        const className = PageClass.name;
        
        if (!this.cache.has(className)) {
            this.cache.set(className, new PageClass(this.page));
        }
        
        return this.cache.get(className);
    }
}

// Solution 5: Page Factory with Configuration
interface PageFactoryConfig {
    baseUrl: string;
    timeout: number;
}

class ConfigurablePageFactory {
    private page: Page;
    private config: PageFactoryConfig;
    
    constructor(page: Page, config: PageFactoryConfig) {
        this.page = page;
        this.config = config;
    }
    
    getHomePage() {
        return new HomePage(this.page);
    }
    
    getConfig() {
        return this.config;
    }
}

// Solution 6: Using Page Factory in Tests
async function exampleTest(page: Page) {
    const factory = new PageFactory(page);
    
    // Get pages from factory
    const homePage = factory.getHomePage();
    const loginPage = factory.getLoginPage();
    
    // Use pages
    await homePage.navigate();
    await loginPage.navigate();
}

// Solution 7: Page Factory with Lazy Loading Usage
async function lazyLoadingExample(page: Page) {
    const factory = new LazyPageFactory(page);
    
    // Pages created only when accessed
    await factory.homePage.navigate();
    await factory.loginPage.navigate();
    
    // Same instance returned on subsequent access
    const sameHomePage = factory.homePage;
}

// Solution 8: Generic Factory Usage
async function genericFactoryExample(page: Page) {
    const factory = new GenericPageFactory(page);
    
    // Get any page type
    const homePage = factory.getPage(HomePage);
    const loginPage = factory.getPage(LoginPage);
    
    await homePage.navigate();
}

// Solution 9: Page Factory Best Practices
/*
 * Best Practices:
 * 
 * 1. Use lazy loading for performance
 * 2. Cache page instances
 * 3. Provide configuration options
 * 4. Keep factory simple
 * 5. Use generics for flexibility
 */

// Solution 10: Export
export {
    HomePage,
    LoginPage,
    DashboardPage,
    PageFactory,
    LazyPageFactory,
    GenericPageFactory,
    ConfigurablePageFactory,
};

