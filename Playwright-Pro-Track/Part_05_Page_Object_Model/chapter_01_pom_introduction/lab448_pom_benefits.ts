/**
 * Lab 448: POM Benefits
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Benefits of Page Object Model:
 * 
 * - Code reusability
 * - Maintainability
 * - Readability
 * - Reduced duplication
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Understand POM benefits
 * 2. Compare with non-POM approach
 * 3. See practical examples
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { Page, Locator, expect } from '@playwright/test';

// Solution 1: Benefit - Code Reusability
class LoginPage {
    readonly page: Page;
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.usernameInput = page.locator('#username');
        this.passwordInput = page.locator('#password');
        this.loginButton = page.locator('#login-btn');
    }
    
    // Reusable login method
    async login(username: string, password: string) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }
}

// Can be used in multiple tests
async function test1(page: Page) {
    const loginPage = new LoginPage(page);
    await loginPage.login('user1', 'pass1');
}

async function test2(page: Page) {
    const loginPage = new LoginPage(page);
    await loginPage.login('user2', 'pass2');
}

// Solution 2: Benefit - Maintainability
class SearchPage {
    readonly page: Page;
    // If selector changes, update only here
    readonly searchInput: Locator;
    
    constructor(page: Page) {
        this.page = page;
        // Change from '#search' to '.search-box' in one place
        this.searchInput = page.locator('.search-box');
    }
    
    async search(query: string) {
        await this.searchInput.fill(query);
        await this.searchInput.press('Enter');
    }
}

// Solution 3: Benefit - Readability
class CheckoutPage {
    readonly page: Page;
    readonly cartItems: Locator;
    readonly totalPrice: Locator;
    readonly checkoutButton: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.cartItems = page.locator('.cart-item');
        this.totalPrice = page.locator('.total-price');
        this.checkoutButton = page.locator('#checkout');
    }
    
    async getItemCount() {
        return await this.cartItems.count();
    }
    
    async getTotalPrice() {
        return await this.totalPrice.textContent();
    }
    
    async proceedToCheckout() {
        await this.checkoutButton.click();
    }
}

// Readable test
async function readableTest(page: Page) {
    const checkout = new CheckoutPage(page);
    
    // Clear, readable actions
    const itemCount = await checkout.getItemCount();
    const total = await checkout.getTotalPrice();
    await checkout.proceedToCheckout();
}

// Solution 4: Benefit - Reduced Duplication
// Without POM - duplication
async function duplicatedCode(page: Page) {
    // Test 1
    await page.locator('#username').fill('user');
    await page.locator('#password').fill('pass');
    await page.locator('#login').click();
    
    // Test 2 - same code repeated
    await page.locator('#username').fill('user');
    await page.locator('#password').fill('pass');
    await page.locator('#login').click();
}

// With POM - no duplication
async function noDuplication(page: Page) {
    const login = new LoginPage(page);
    await login.login('user', 'pass'); // Reused
}

// Solution 5: Benefit - Encapsulation
class ProductPage {
    readonly page: Page;
    private readonly addToCartButton: Locator;
    private readonly quantityInput: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.addToCartButton = page.locator('#add-to-cart');
        this.quantityInput = page.locator('#quantity');
    }
    
    // Encapsulated complex logic
    async addToCart(quantity: number) {
        await this.quantityInput.fill(quantity.toString());
        await this.addToCartButton.click();
        // Wait for cart update
        await this.page.waitForSelector('.cart-updated');
    }
}

// Solution 6: Benefit - Single Responsibility
class NavigationBar {
    readonly page: Page;
    readonly homeLink: Locator;
    readonly productsLink: Locator;
    readonly cartLink: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.homeLink = page.locator('nav a[href="/"]');
        this.productsLink = page.locator('nav a[href="/products"]');
        this.cartLink = page.locator('nav a[href="/cart"]');
    }
    
    async goToHome() {
        await this.homeLink.click();
    }
    
    async goToProducts() {
        await this.productsLink.click();
    }
    
    async goToCart() {
        await this.cartLink.click();
    }
}

// Solution 7: Benefit - Team Collaboration
/*
 * POM enables team collaboration:
 * 
 * - Clear structure everyone follows
 * - Easy to understand others' code
 * - Consistent patterns
 * - Easier code reviews
 */

// Solution 8: Benefit - Test Independence
class UserDashboard {
    readonly page: Page;
    
    constructor(page: Page) {
        this.page = page;
    }
    
    // Each method is independent
    async getUserName() {
        return await this.page.locator('.user-name').textContent();
    }
    
    async getNotificationCount() {
        return await this.page.locator('.notifications').count();
    }
}

// Solution 9: Benefit - Easier Debugging
class FormPage {
    readonly page: Page;
    readonly form: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.form = page.locator('form');
    }
    
    async submitForm(data: Record<string, string>) {
        console.log('Filling form with:', data);
        
        for (const [field, value] of Object.entries(data)) {
            await this.form.locator(`[name="${field}"]`).fill(value);
        }
        
        console.log('Submitting form');
        await this.form.locator('button[type="submit"]').click();
    }
}

// Solution 10: Summary of Benefits
/*
 * POM Benefits Summary:
 * 
 * 1. Reusability - Write once, use many times
 * 2. Maintainability - Update in one place
 * 3. Readability - Clear, descriptive methods
 * 4. Reduced Duplication - DRY principle
 * 5. Encapsulation - Hide complexity
 * 6. Single Responsibility - Focused classes
 * 7. Team Collaboration - Consistent patterns
 * 8. Test Independence - Isolated methods
 * 9. Easier Debugging - Centralized logic
 * 10. Scalability - Easy to extend
 */

export { LoginPage, SearchPage, CheckoutPage, ProductPage, NavigationBar };

