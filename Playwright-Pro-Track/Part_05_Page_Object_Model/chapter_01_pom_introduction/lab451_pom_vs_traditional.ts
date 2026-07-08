/**
 * Lab 451: POM vs Traditional Testing
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Comparing POM with traditional approach:
 * 
 * - Code organization differences
 * - Maintenance comparison
 * - Scalability differences
 * - When to use each
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Compare both approaches
 * 2. Understand trade-offs
 * 3. Choose appropriate approach
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { Page, Locator, expect } from '@playwright/test';

// Solution 1: Traditional Approach - Test 1
async function traditionalTest1(page: Page) {
    await page.goto('https://example.com/login');
    await page.locator('#username').fill('user1');
    await page.locator('#password').fill('pass1');
    await page.locator('button[type="submit"]').click();
    await expect(page.locator('.welcome')).toBeVisible();
}

// Solution 2: Traditional Approach - Test 2 (Duplication)
async function traditionalTest2(page: Page) {
    await page.goto('https://example.com/login');
    await page.locator('#username').fill('user2');  // Same locator
    await page.locator('#password').fill('pass2');  // Same locator
    await page.locator('button[type="submit"]').click();  // Same locator
    await expect(page.locator('.dashboard')).toBeVisible();
}

// Solution 3: POM Approach - Page Object
class LoginPagePOM {
    readonly page: Page;
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly submitButton: Locator;
    readonly welcomeMessage: Locator;
    readonly dashboard: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.usernameInput = page.locator('#username');
        this.passwordInput = page.locator('#password');
        this.submitButton = page.locator('button[type="submit"]');
        this.welcomeMessage = page.locator('.welcome');
        this.dashboard = page.locator('.dashboard');
    }
    
    async navigate() {
        await this.page.goto('https://example.com/login');
    }
    
    async login(username: string, password: string) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.submitButton.click();
    }
}

// Solution 4: POM Approach - Test 1
async function pomTest1(page: Page) {
    const loginPage = new LoginPagePOM(page);
    await loginPage.navigate();
    await loginPage.login('user1', 'pass1');
    await expect(loginPage.welcomeMessage).toBeVisible();
}

// Solution 5: POM Approach - Test 2 (No Duplication)
async function pomTest2(page: Page) {
    const loginPage = new LoginPagePOM(page);
    await loginPage.navigate();
    await loginPage.login('user2', 'pass2');
    await expect(loginPage.dashboard).toBeVisible();
}

// Solution 6: Maintenance Comparison
/*
 * Scenario: Username field ID changes from #username to #user-email
 * 
 * Traditional Approach:
 * - Find all tests using #username
 * - Update each occurrence manually
 * - Risk of missing some
 * 
 * POM Approach:
 * - Update only in LoginPagePOM class
 * - All tests automatically use new locator
 * - Single point of change
 */

// Solution 7: Scalability Comparison
/*
 * Traditional Approach:
 * - 10 tests = 10 places with same locators
 * - 100 tests = 100 places with same locators
 * - Exponential maintenance burden
 * 
 * POM Approach:
 * - 10 tests = 1 page object
 * - 100 tests = still 1 page object
 * - Linear maintenance
 */

// Solution 8: Readability Comparison
// Traditional - Less readable
async function traditionalReadability(page: Page) {
    await page.locator('#add-to-cart-btn').click();
    await page.locator('.cart-icon').click();
    await page.locator('#checkout-btn').click();
    await page.locator('#confirm-order').click();
}

// POM - More readable
class ShoppingPage {
    readonly page: Page;
    
    constructor(page: Page) {
        this.page = page;
    }
    
    async addToCart() {
        await this.page.locator('#add-to-cart-btn').click();
    }
    
    async openCart() {
        await this.page.locator('.cart-icon').click();
    }
    
    async checkout() {
        await this.page.locator('#checkout-btn').click();
    }
    
    async confirmOrder() {
        await this.page.locator('#confirm-order').click();
    }
}

async function pomReadability(page: Page) {
    const shop = new ShoppingPage(page);
    await shop.addToCart();
    await shop.openCart();
    await shop.checkout();
    await shop.confirmOrder();
}

// Solution 9: When to Use Each
/*
 * Use Traditional When:
 * - Quick proof of concept
 * - One-time scripts
 * - Very simple tests
 * - Learning/experimenting
 * 
 * Use POM When:
 * - Production test suite
 * - Multiple tests per page
 * - Team collaboration
 * - Long-term maintenance
 * - Complex applications
 */

// Solution 10: Summary Comparison
/*
 * Comparison Summary:
 * 
 * | Aspect          | Traditional | POM        |
 * |-----------------|-------------|------------|
 * | Setup time      | Fast        | Slower     |
 * | Maintenance     | Hard        | Easy       |
 * | Duplication     | High        | Low        |
 * | Readability     | Lower       | Higher     |
 * | Scalability     | Poor        | Good       |
 * | Team work       | Harder      | Easier     |
 * | Learning curve  | Low         | Medium     |
 */

export { LoginPagePOM, ShoppingPage };

