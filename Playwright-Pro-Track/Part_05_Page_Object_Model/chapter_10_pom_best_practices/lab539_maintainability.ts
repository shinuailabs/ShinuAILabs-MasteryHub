/**
 * Lab 539: Maintainability
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Writing maintainable POM code:
 * 
 * - DRY principle
 * - Single source of truth
 * - Readable code
 * - Documentation
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Apply DRY principle
 * 2. Create readable code
 * 3. Add documentation
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { Page, Locator } from '@playwright/test';

// Solution 1: DRY - Don't Repeat Yourself
// BAD: Repeated code
class BadLoginPage {
    constructor(readonly page: Page) {}
    
    async loginAsAdmin() {
        await this.page.fill('#username', 'admin');
        await this.page.fill('#password', 'admin123');
        await this.page.click('#submit');
    }
    
    async loginAsUser() {
        await this.page.fill('#username', 'user');
        await this.page.fill('#password', 'user123');
        await this.page.click('#submit');
    }
}

// GOOD: Reusable method
class GoodLoginPage {
    constructor(readonly page: Page) {}
    
    async login(username: string, password: string) {
        await this.page.fill('#username', username);
        await this.page.fill('#password', password);
        await this.page.click('#submit');
    }
    
    async loginAsAdmin() {
        await this.login('admin', 'admin123');
    }
    
    async loginAsUser() {
        await this.login('user', 'user123');
    }
}

// Solution 2: Single Source of Truth - Selectors
const SELECTORS = {
    USERNAME: '#username',
    PASSWORD: '#password',
    SUBMIT: '#submit',
    ERROR: '.error-message',
} as const;

class SelectorPage {
    constructor(readonly page: Page) {}
    
    async login(username: string, password: string) {
        await this.page.fill(SELECTORS.USERNAME, username);
        await this.page.fill(SELECTORS.PASSWORD, password);
        await this.page.click(SELECTORS.SUBMIT);
    }
    
    async getError() {
        return await this.page.locator(SELECTORS.ERROR).textContent();
    }
}

// Solution 3: Readable Code - Descriptive Methods
class ReadablePage {
    constructor(readonly page: Page) {}
    
    // GOOD: Clear intent
    async addProductToCart(productName: string) {
        await this.searchForProduct(productName);
        await this.selectFirstResult();
        await this.clickAddToCart();
    }
    
    private async searchForProduct(name: string) {
        await this.page.fill('#search', name);
        await this.page.click('#search-btn');
    }
    
    private async selectFirstResult() {
        await this.page.click('.search-result:first-child');
    }
    
    private async clickAddToCart() {
        await this.page.click('#add-to-cart');
    }
}

// Solution 4: Documentation
/**
 * Represents the checkout page of the e-commerce application.
 * Handles all checkout-related operations including shipping,
 * payment, and order confirmation.
 * 
 * @example
 * ```typescript
 * const checkout = new CheckoutPage(page);
 * await checkout.fillShippingAddress(address);
 * await checkout.selectPaymentMethod('credit-card');
 * await checkout.placeOrder();
 * ```
 */
class CheckoutPage {
    constructor(readonly page: Page) {}
    
    /**
     * Fills the shipping address form.
     * @param address - The shipping address details
     * @throws Error if required fields are missing
     */
    async fillShippingAddress(address: {
        street: string;
        city: string;
        zip: string;
    }) {
        await this.page.fill('#street', address.street);
        await this.page.fill('#city', address.city);
        await this.page.fill('#zip', address.zip);
    }
    
    /**
     * Selects a payment method.
     * @param method - The payment method ('credit-card' | 'paypal' | 'bank')
     */
    async selectPaymentMethod(method: string) {
        await this.page.click(`[data-payment="${method}"]`);
    }
    
    /**
     * Places the order and waits for confirmation.
     * @returns The order confirmation number
     */
    async placeOrder(): Promise<string> {
        await this.page.click('#place-order');
        await this.page.waitForSelector('.confirmation');
        return await this.page.locator('.order-number').textContent() || '';
    }
}

// Solution 5: Maintainability Checklist
/*
 * Maintainability Checklist:
 * 
 * ✓ No duplicate code (DRY)
 * ✓ Selectors in one place
 * ✓ Small, focused methods
 * ✓ Descriptive names
 * ✓ JSDoc comments for public methods
 * ✓ Type annotations
 * ✓ Consistent formatting
 * ✓ No magic numbers/strings
 */

// Solution 6: Export
export {
    GoodLoginPage,
    SelectorPage,
    ReadablePage,
    CheckoutPage,
    SELECTORS,
};

