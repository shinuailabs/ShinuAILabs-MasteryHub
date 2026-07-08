/**
 * Lab 458: Base Page Class
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Creating a base page class:
 * 
 * - Common functionality
 * - Inheritance patterns
 * - Shared methods
 * - Configuration
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create base page class
 * 2. Add common methods
 * 3. Extend in child classes
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { Page, Locator } from '@playwright/test';

// Solution 1: Basic Base Page
class BasePage {
    readonly page: Page;
    
    constructor(page: Page) {
        this.page = page;
    }
    
    async getTitle() {
        return await this.page.title();
    }
    
    async getUrl() {
        return this.page.url();
    }
}

// Solution 2: Base Page with Navigation
class NavigableBasePage {
    readonly page: Page;
    protected baseUrl: string;
    
    constructor(page: Page, baseUrl: string = '') {
        this.page = page;
        this.baseUrl = baseUrl;
    }
    
    async navigate(path: string) {
        await this.page.goto(`${this.baseUrl}${path}`);
    }
    
    async goBack() {
        await this.page.goBack();
    }
    
    async goForward() {
        await this.page.goForward();
    }
    
    async refresh() {
        await this.page.reload();
    }
}

// Solution 3: Base Page with Waits
class WaitingBasePage {
    readonly page: Page;
    
    constructor(page: Page) {
        this.page = page;
    }
    
    async waitForPageLoad() {
        await this.page.waitForLoadState('networkidle');
    }
    
    async waitForElement(selector: string) {
        await this.page.waitForSelector(selector);
    }
    
    async waitForUrl(urlPattern: string | RegExp) {
        await this.page.waitForURL(urlPattern);
    }
}

// Solution 4: Base Page with Screenshots
class ScreenshotBasePage {
    readonly page: Page;
    
    constructor(page: Page) {
        this.page = page;
    }
    
    async takeScreenshot(name: string) {
        await this.page.screenshot({ path: `screenshots/${name}.png` });
    }
    
    async takeFullPageScreenshot(name: string) {
        await this.page.screenshot({ 
            path: `screenshots/${name}.png`,
            fullPage: true,
        });
    }
}

// Solution 5: Complete Base Page
class CompleteBasePage {
    readonly page: Page;
    protected readonly timeout: number;
    
    constructor(page: Page, timeout: number = 30000) {
        this.page = page;
        this.timeout = timeout;
    }
    
    // Navigation
    async navigate(url: string) {
        await this.page.goto(url, { timeout: this.timeout });
    }
    
    // Page info
    async getTitle() {
        return await this.page.title();
    }
    
    async getUrl() {
        return this.page.url();
    }
    
    // Waits
    async waitForPageLoad() {
        await this.page.waitForLoadState('networkidle');
    }
    
    // Screenshots
    async screenshot(name: string) {
        await this.page.screenshot({ path: `screenshots/${name}.png` });
    }
    
    // Alerts
    async acceptAlert() {
        this.page.on('dialog', dialog => dialog.accept());
    }
    
    async dismissAlert() {
        this.page.on('dialog', dialog => dialog.dismiss());
    }
}

// Solution 6: Child Page Extending Base
class HomePage extends CompleteBasePage {
    readonly heroSection: Locator;
    readonly featuresSection: Locator;
    
    constructor(page: Page) {
        super(page);
        this.heroSection = page.locator('.hero');
        this.featuresSection = page.locator('.features');
    }
    
    async navigateToHome() {
        await this.navigate('/');
        await this.waitForPageLoad();
    }
    
    async getHeroText() {
        return await this.heroSection.textContent();
    }
}

// Solution 7: Another Child Page
class LoginPage extends CompleteBasePage {
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    
    constructor(page: Page) {
        super(page);
        this.usernameInput = page.locator('#username');
        this.passwordInput = page.locator('#password');
        this.loginButton = page.locator('#login');
    }
    
    async navigateToLogin() {
        await this.navigate('/login');
    }
    
    async login(username: string, password: string) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }
}

// Solution 8: Export
export { 
    BasePage, 
    NavigableBasePage, 
    WaitingBasePage, 
    ScreenshotBasePage,
    CompleteBasePage, 
    HomePage, 
    LoginPage 
};

