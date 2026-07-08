/**
 * Lab 544: Anti-Patterns
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Common POM anti-patterns to avoid:
 * 
 * - God objects
 * - Tight coupling
 * - Assertions in pages
 * - Hardcoded data
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Identify anti-patterns
 * 2. Understand problems
 * 3. Learn solutions
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { Page, expect } from '@playwright/test';

// Anti-Pattern 1: God Object
// BAD: One class does everything
class GodPage {
    constructor(readonly page: Page) {}
    
    // Login functionality
    async login() { /* ... */ }
    async logout() { /* ... */ }
    
    // Product functionality
    async addToCart() { /* ... */ }
    async removeFromCart() { /* ... */ }
    
    // Checkout functionality
    async checkout() { /* ... */ }
    async enterPayment() { /* ... */ }
    
    // User profile
    async updateProfile() { /* ... */ }
    async changePassword() { /* ... */ }
    
    // Admin functionality
    async createUser() { /* ... */ }
    async deleteUser() { /* ... */ }
}

// GOOD: Separate classes by responsibility
class LoginPage {
    constructor(readonly page: Page) {}
    async login(username: string, password: string) { /* ... */ }
    async logout() { /* ... */ }
}

class CartPage {
    constructor(readonly page: Page) {}
    async addToCart(productId: string) { /* ... */ }
    async removeFromCart(productId: string) { /* ... */ }
}

// Anti-Pattern 2: Assertions in Page Objects
// BAD: Page object contains assertions
class BadLoginPage {
    constructor(readonly page: Page) {}
    
    async loginAndVerify(username: string, password: string) {
        await this.page.fill('#username', username);
        await this.page.fill('#password', password);
        await this.page.click('#submit');
        // BAD: Assertion in page object
        await expect(this.page).toHaveURL('/dashboard');
    }
}

// GOOD: Return data, assert in tests
class GoodLoginPage {
    constructor(readonly page: Page) {}
    
    async login(username: string, password: string) {
        await this.page.fill('#username', username);
        await this.page.fill('#password', password);
        await this.page.click('#submit');
    }
    
    async getCurrentUrl(): Promise<string> {
        return this.page.url();
    }
}

// Anti-Pattern 3: Hardcoded Data
// BAD: Hardcoded values
class HardcodedPage {
    constructor(readonly page: Page) {}
    
    async loginAsAdmin() {
        // BAD: Hardcoded credentials
        await this.page.fill('#username', 'admin@company.com');
        await this.page.fill('#password', 'SuperSecret123!');
        await this.page.click('#submit');
    }
}

// GOOD: Parameterized methods
class ParameterizedPage {
    constructor(readonly page: Page) {}
    
    async login(username: string, password: string) {
        await this.page.fill('#username', username);
        await this.page.fill('#password', password);
        await this.page.click('#submit');
    }
}

// Anti-Pattern 4: Exposing Locators
// BAD: Exposing internal locators
class ExposedPage {
    constructor(readonly page: Page) {}
    
    // BAD: Exposing locator for external use
    getUsernameInput() {
        return this.page.locator('#username');
    }
}

// GOOD: Expose behavior, not implementation
class EncapsulatedPage {
    private usernameInput = this.page.locator('#username');
    
    constructor(readonly page: Page) {}
    
    async enterUsername(username: string) {
        await this.usernameInput.fill(username);
    }
    
    async getUsernameValue(): Promise<string> {
        return await this.usernameInput.inputValue();
    }
}

// Anti-Pattern 5: Deep Inheritance
// BAD: Deep inheritance hierarchy
class BasePage { }
class AuthenticatedPage extends BasePage { }
class AdminPage extends AuthenticatedPage { }
class SuperAdminPage extends AdminPage { }
class MegaAdminPage extends SuperAdminPage { } // Too deep!

// GOOD: Composition
class ComposedAdminPage {
    private auth: AuthComponent;
    private admin: AdminComponent;
    
    constructor(page: Page) {
        this.auth = new AuthComponent(page);
        this.admin = new AdminComponent(page);
    }
}

class AuthComponent {
    constructor(private page: Page) {}
}

class AdminComponent {
    constructor(private page: Page) {}
}

// Anti-Pattern Summary
/*
 * Common Anti-Patterns:
 * 
 * 1. God Objects - Split into focused classes
 * 2. Assertions in Pages - Keep assertions in tests
 * 3. Hardcoded Data - Use parameters
 * 4. Exposed Locators - Encapsulate implementation
 * 5. Deep Inheritance - Prefer composition
 * 6. Duplicate Code - Extract common methods
 * 7. Tight Coupling - Use dependency injection
 * 8. No Error Handling - Add proper error handling
 */

// Export
export {
    LoginPage,
    CartPage,
    GoodLoginPage,
    ParameterizedPage,
    EncapsulatedPage,
    ComposedAdminPage,
};

