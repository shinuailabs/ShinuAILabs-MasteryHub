/**
 * Lab 466: Page Classes Best Practices
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Best practices for page classes:
 * 
 * - Class organization
 * - Naming conventions
 * - Code structure
 * - Maintainability
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Apply best practices
 * 2. Organize page classes
 * 3. Follow conventions
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { Page, Locator } from '@playwright/test';

// Solution 1: Well-Organized Page Class
class WellOrganizedPage {
    // 1. Page reference
    readonly page: Page;
    
    // 2. Locators (grouped by section)
    // Header
    readonly logo: Locator;
    readonly navMenu: Locator;
    
    // Main content
    readonly heading: Locator;
    readonly content: Locator;
    
    // Footer
    readonly footerLinks: Locator;
    
    // 3. Constructor
    constructor(page: Page) {
        this.page = page;
        
        // Header
        this.logo = page.locator('.logo');
        this.navMenu = page.locator('nav');
        
        // Main content
        this.heading = page.locator('h1');
        this.content = page.locator('.content');
        
        // Footer
        this.footerLinks = page.locator('footer a');
    }
    
    // 4. Navigation methods
    async navigate() {
        await this.page.goto('/');
    }
    
    // 5. Action methods
    async clickLogo() {
        await this.logo.click();
    }
    
    // 6. Getter methods
    async getHeadingText() {
        return await this.heading.textContent();
    }
    
    // 7. Verification methods
    async isLoaded() {
        return await this.heading.isVisible();
    }
}

// Solution 2: Naming Conventions
class NamingConventionsPage {
    readonly page: Page;
    
    // Locators: descriptive noun-based names
    readonly loginButton: Locator;
    readonly usernameInput: Locator;
    readonly errorMessage: Locator;
    readonly submitForm: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.loginButton = page.locator('#login');
        this.usernameInput = page.locator('#username');
        this.errorMessage = page.locator('.error');
        this.submitForm = page.locator('form');
    }
    
    // Methods: verb-based names
    async clickLogin() { /* ... */ }
    async enterUsername(value: string) { /* ... */ }
    async getErrorText() { /* ... */ }
    async submitFormData() { /* ... */ }
}

// Solution 3: Single Responsibility
// Each page class handles ONE page
class LoginPage {
    readonly page: Page;
    constructor(page: Page) { this.page = page; }
    async login(user: string, pass: string) { /* ... */ }
}

class DashboardPage {
    readonly page: Page;
    constructor(page: Page) { this.page = page; }
    async getStats() { /* ... */ }
}

// Solution 4: Encapsulation
class EncapsulatedPage {
    private readonly page: Page;
    private readonly submitButton: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.submitButton = page.locator('#submit');
    }
    
    // Public method hides implementation
    async submit() {
        await this.submitButton.click();
        await this.page.waitForLoadState('networkidle');
    }
}

// Solution 5: Documentation
/**
 * CheckoutPage handles the checkout process
 * 
 * @example
 * const checkout = new CheckoutPage(page);
 * await checkout.navigate();
 * await checkout.completeCheckout(paymentDetails);
 */
class CheckoutPage {
    readonly page: Page;
    
    constructor(page: Page) {
        this.page = page;
    }
    
    /**
     * Navigates to checkout page
     */
    async navigate() {
        await this.page.goto('/checkout');
    }
    
    /**
     * Completes the checkout process
     * @param payment - Payment details
     */
    async completeCheckout(payment: { card: string; cvv: string }) {
        // Implementation
    }
}

// Solution 6: Best Practices Summary
/*
 * Page Classes Best Practices:
 * 
 * Organization:
 * - Group locators by section
 * - Order: properties, constructor, methods
 * - Keep classes focused
 * 
 * Naming:
 * - Descriptive locator names
 * - Verb-based method names
 * - Consistent conventions
 * 
 * Design:
 * - Single responsibility
 * - Encapsulation
 * - Composition over inheritance
 * 
 * Documentation:
 * - JSDoc comments
 * - Usage examples
 * - Parameter descriptions
 * 
 * Maintainability:
 * - Keep methods small
 * - Avoid duplication
 * - Use base classes
 */

// Solution 7: Export
export {
    WellOrganizedPage,
    NamingConventionsPage,
    LoginPage,
    DashboardPage,
    EncapsulatedPage,
    CheckoutPage,
};

