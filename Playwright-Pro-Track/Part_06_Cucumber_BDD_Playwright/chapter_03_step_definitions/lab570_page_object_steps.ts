/**
 * Lab 570: Page Object Steps
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Using Page Objects in steps:
 * 
 * - Page object integration
 * - Clean step definitions
 * - Separation of concerns
 * - Maintainability
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create page objects
 * 2. Use in step definitions
 * 3. Maintain separation
 *
 * =====================
 * SOLUTION:
 * =====================
 */

import { Given, When, Then } from '@cucumber/cucumber';
import { Page, Locator, expect } from '@playwright/test';

// Solution 1: Page Object Classes
class LoginPage {
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    readonly errorMessage: Locator;
    
    constructor(private page: Page) {
        this.usernameInput = page.locator('#username');
        this.passwordInput = page.locator('#password');
        this.loginButton = page.locator('#login-btn');
        this.errorMessage = page.locator('.error-message');
    }
    
    async goto() {
        await this.page.goto('/login');
    }
    
    async login(username: string, password: string) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }
    
    async getErrorMessage() {
        return await this.errorMessage.textContent();
    }
}

class DashboardPage {
    readonly welcomeMessage: Locator;
    readonly userMenu: Locator;
    readonly logoutButton: Locator;
    
    constructor(private page: Page) {
        this.welcomeMessage = page.locator('.welcome-message');
        this.userMenu = page.locator('.user-menu');
        this.logoutButton = page.locator('#logout');
    }
    
    async getWelcomeText() {
        return await this.welcomeMessage.textContent();
    }
    
    async logout() {
        await this.userMenu.click();
        await this.logoutButton.click();
    }
}

class ProductPage {
    readonly productTitle: Locator;
    readonly productPrice: Locator;
    readonly addToCartButton: Locator;
    readonly quantityInput: Locator;
    
    constructor(private page: Page) {
        this.productTitle = page.locator('.product-title');
        this.productPrice = page.locator('.product-price');
        this.addToCartButton = page.locator('#add-to-cart');
        this.quantityInput = page.locator('#quantity');
    }
    
    async goto(productId: string) {
        await this.page.goto(`/products/${productId}`);
    }
    
    async addToCart(quantity: number = 1) {
        await this.quantityInput.fill(String(quantity));
        await this.addToCartButton.click();
    }
}

// Solution 2: Page Object Factory
function getLoginPage(world: any): LoginPage {
    if (!world.loginPage) {
        world.loginPage = new LoginPage(world.page);
    }
    return world.loginPage;
}

function getDashboardPage(world: any): DashboardPage {
    if (!world.dashboardPage) {
        world.dashboardPage = new DashboardPage(world.page);
    }
    return world.dashboardPage;
}

function getProductPage(world: any): ProductPage {
    if (!world.productPage) {
        world.productPage = new ProductPage(world.page);
    }
    return world.productPage;
}

// Solution 3: Step Definitions Using Page Objects
Given('I am on the login page', async function () {
    const loginPage = getLoginPage(this);
    await loginPage.goto();
});

When('I login with username {string} and password {string}', async function (
    username: string,
    password: string
) {
    const loginPage = getLoginPage(this);
    await loginPage.login(username, password);
});

Then('I should see login error {string}', async function (expectedError: string) {
    const loginPage = getLoginPage(this);
    const actualError = await loginPage.getErrorMessage();
    expect(actualError).toBe(expectedError);
});

Then('I should see welcome message containing {string}', async function (text: string) {
    const dashboardPage = getDashboardPage(this);
    const welcomeText = await dashboardPage.getWelcomeText();
    expect(welcomeText).toContain(text);
});

When('I logout', async function () {
    const dashboardPage = getDashboardPage(this);
    await dashboardPage.logout();
});

Given('I am viewing product {string}', async function (productId: string) {
    const productPage = getProductPage(this);
    await productPage.goto(productId);
});

When('I add {int} items to cart', async function (quantity: number) {
    const productPage = getProductPage(this);
    await productPage.addToCart(quantity);
});

// Solution 4: Export
export { LoginPage, DashboardPage, ProductPage };

