/**
 * Lab 621: Page Objects with Cucumber
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Using Page Objects in Cucumber:
 * 
 * - Page class structure
 * - Step integration
 * - Page factory
 * - Reusability
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create page objects
 * 2. Integrate with steps
 * 3. Use page factory
 *
 * =====================
 * SOLUTION:
 * =====================
 */

import { Page, Locator, expect } from '@playwright/test';
import { Given, When, Then } from '@cucumber/cucumber';

// Solution 1: Base Page Class
abstract class BasePage {
    protected page: Page;
    protected baseUrl: string;
    
    constructor(page: Page, baseUrl: string = '') {
        this.page = page;
        this.baseUrl = baseUrl;
    }
    
    async navigate(path: string = ''): Promise<void> {
        await this.page.goto(`${this.baseUrl}${path}`);
    }
    
    async waitForPageLoad(): Promise<void> {
        await this.page.waitForLoadState('networkidle');
    }
    
    async getTitle(): Promise<string> {
        return this.page.title();
    }
}

// Solution 2: Login Page
class LoginPage extends BasePage {
    // Locators
    private emailInput: Locator;
    private passwordInput: Locator;
    private loginButton: Locator;
    private errorMessage: Locator;
    
    constructor(page: Page, baseUrl: string = '') {
        super(page, baseUrl);
        this.emailInput = page.locator('#email');
        this.passwordInput = page.locator('#password');
        this.loginButton = page.locator('#login-btn');
        this.errorMessage = page.locator('.error-message');
    }
    
    async navigate(): Promise<void> {
        await super.navigate('/login');
    }
    
    async login(email: string, password: string): Promise<void> {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }
    
    async getErrorMessage(): Promise<string> {
        return this.errorMessage.textContent() || '';
    }
    
    async isErrorVisible(): Promise<boolean> {
        return this.errorMessage.isVisible();
    }
}

// Solution 3: Dashboard Page
class DashboardPage extends BasePage {
    private welcomeMessage: Locator;
    private logoutButton: Locator;
    private userMenu: Locator;
    
    constructor(page: Page, baseUrl: string = '') {
        super(page, baseUrl);
        this.welcomeMessage = page.locator('.welcome-message');
        this.logoutButton = page.locator('#logout-btn');
        this.userMenu = page.locator('#user-menu');
    }
    
    async getWelcomeMessage(): Promise<string> {
        return this.welcomeMessage.textContent() || '';
    }
    
    async logout(): Promise<void> {
        await this.userMenu.click();
        await this.logoutButton.click();
    }
    
    async isLoggedIn(): Promise<boolean> {
        return this.welcomeMessage.isVisible();
    }
}

// Solution 4: Page Factory
class PageFactory {
    private page: Page;
    private baseUrl: string;
    private pages: Map<string, BasePage> = new Map();
    
    constructor(page: Page, baseUrl: string = '') {
        this.page = page;
        this.baseUrl = baseUrl;
    }
    
    getLoginPage(): LoginPage {
        if (!this.pages.has('login')) {
            this.pages.set('login', new LoginPage(this.page, this.baseUrl));
        }
        return this.pages.get('login') as LoginPage;
    }
    
    getDashboardPage(): DashboardPage {
        if (!this.pages.has('dashboard')) {
            this.pages.set('dashboard', new DashboardPage(this.page, this.baseUrl));
        }
        return this.pages.get('dashboard') as DashboardPage;
    }
}

// Solution 5: Step Definitions Using Page Objects
Given('I am on the login page', async function () {
    this.pageFactory = new PageFactory(this.page, this.parameters?.baseUrl);
    this.loginPage = this.pageFactory.getLoginPage();
    await this.loginPage.navigate();
});

When('I login with {string} and {string}', async function (email: string, password: string) {
    await this.loginPage.login(email, password);
});

Then('I should see the dashboard', async function () {
    this.dashboardPage = this.pageFactory.getDashboardPage();
    const isLoggedIn = await this.dashboardPage.isLoggedIn();
    expect(isLoggedIn).toBe(true);
});

Then('I should see error message {string}', async function (expectedMessage: string) {
    const actualMessage = await this.loginPage.getErrorMessage();
    expect(actualMessage).toContain(expectedMessage);
});

When('I logout', async function () {
    await this.dashboardPage.logout();
});

Then('I should be on the login page', async function () {
    await expect(this.page).toHaveURL(/.*login/);
});

// Solution 6: Export
export { BasePage, LoginPage, DashboardPage, PageFactory };

