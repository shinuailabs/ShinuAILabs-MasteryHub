/**
 * Lab 453: POM Anti-patterns
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Common POM mistakes to avoid:
 * 
 * - God objects
 * - Assertions in page objects
 * - Tight coupling
 * - Over-engineering
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Identify anti-patterns
 * 2. Understand why they're bad
 * 3. Learn correct approaches
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { Page, Locator, expect } from '@playwright/test';

// Solution 1: Anti-pattern - God Object
// BAD: One class doing everything
class GodPageObject {
    readonly page: Page;
    
    constructor(page: Page) {
        this.page = page;
    }
    
    // Login functionality
    async login(user: string, pass: string) { /* ... */ }
    
    // Dashboard functionality
    async getDashboardStats() { /* ... */ }
    
    // Settings functionality
    async updateSettings() { /* ... */ }
    
    // Profile functionality
    async updateProfile() { /* ... */ }
    
    // This class is too big!
}

// GOOD: Separate classes
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

// Solution 2: Anti-pattern - Assertions in Page Objects
// BAD: Assertions inside page object
class BadLoginPage {
    readonly page: Page;
    readonly errorMessage: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.errorMessage = page.locator('.error');
    }
    
    // BAD: Assertion in page object
    async loginAndVerify(user: string, pass: string) {
        await this.page.locator('#user').fill(user);
        await this.page.locator('#pass').fill(pass);
        await this.page.locator('#submit').click();
        // Don't do this!
        await expect(this.page.locator('.welcome')).toBeVisible();
    }
}

// GOOD: Return data, assert in test
class GoodLoginPage {
    readonly page: Page;
    readonly welcomeMessage: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.welcomeMessage = page.locator('.welcome');
    }
    
    async login(user: string, pass: string) {
        await this.page.locator('#user').fill(user);
        await this.page.locator('#pass').fill(pass);
        await this.page.locator('#submit').click();
    }
    
    // Return locator for test to assert
    getWelcomeMessage() {
        return this.welcomeMessage;
    }
}

// Solution 3: Anti-pattern - Tight Coupling
// BAD: Page objects depending on each other
class TightlyCoupledPage {
    readonly page: Page;
    readonly loginPage: LoginPage;
    
    constructor(page: Page) {
        this.page = page;
        this.loginPage = new LoginPage(page); // Tight coupling!
    }
    
    async doSomething() {
        await this.loginPage.login('user', 'pass');
    }
}

// GOOD: Loose coupling via composition
class LooselyCoupledPage {
    readonly page: Page;
    
    constructor(page: Page) {
        this.page = page;
    }
    
    async doSomething() {
        // Let test handle login
    }
}

// Solution 4: Anti-pattern - Over-engineering
// BAD: Too many abstractions
abstract class AbstractBasePage {
    abstract navigate(): Promise<void>;
}

abstract class AbstractAuthenticatedPage extends AbstractBasePage {
    abstract checkAuth(): Promise<boolean>;
}

// GOOD: Simple and practical
class SimplePage {
    readonly page: Page;
    
    constructor(page: Page) {
        this.page = page;
    }
    
    async navigate() {
        await this.page.goto('/');
    }
}

// Solution 5: Anti-pattern - Exposing Page Internals
// BAD: Exposing page directly
class ExposedPage {
    page: Page; // Public page - bad!
    
    constructor(page: Page) {
        this.page = page;
    }
}

// GOOD: Encapsulate page
class EncapsulatedPage {
    private readonly page: Page;
    
    constructor(page: Page) {
        this.page = page;
    }
    
    // Provide methods instead
    async getUrl() {
        return this.page.url();
    }
}

// Solution 6: Anti-pattern - Hard-coded Waits
// BAD: Using fixed timeouts
class HardcodedWaitsPage {
    readonly page: Page;
    
    constructor(page: Page) {
        this.page = page;
    }
    
    async clickButton() {
        await this.page.locator('#btn').click();
        await this.page.waitForTimeout(5000); // BAD!
    }
}

// GOOD: Use proper waits
class ProperWaitsPage {
    readonly page: Page;
    
    constructor(page: Page) {
        this.page = page;
    }
    
    async clickButton() {
        await this.page.locator('#btn').click();
        await this.page.waitForSelector('.result'); // GOOD!
    }
}

// Solution 7: Anti-pattern - Inconsistent Naming
// BAD: Inconsistent method names
class InconsistentPage {
    readonly page: Page;
    
    constructor(page: Page) {
        this.page = page;
    }
    
    async clickLoginBtn() { /* ... */ }
    async press_submit() { /* ... */ }
    async TapOnCancel() { /* ... */ }
}

// GOOD: Consistent naming
class ConsistentPage {
    readonly page: Page;
    
    constructor(page: Page) {
        this.page = page;
    }
    
    async clickLoginButton() { /* ... */ }
    async clickSubmitButton() { /* ... */ }
    async clickCancelButton() { /* ... */ }
}

// Solution 8: Anti-pattern Summary
/*
 * POM Anti-patterns to Avoid:
 * 
 * 1. God Objects - Too many responsibilities
 * 2. Assertions in PO - Keep assertions in tests
 * 3. Tight Coupling - Avoid dependencies between POs
 * 4. Over-engineering - Keep it simple
 * 5. Exposing Internals - Encapsulate properly
 * 6. Hard-coded Waits - Use proper wait strategies
 * 7. Inconsistent Naming - Follow conventions
 * 8. Duplicate Code - Use base classes
 */

export { 
    GoodLoginPage, 
    SimplePage, 
    EncapsulatedPage, 
    ProperWaitsPage, 
    ConsistentPage 
};

