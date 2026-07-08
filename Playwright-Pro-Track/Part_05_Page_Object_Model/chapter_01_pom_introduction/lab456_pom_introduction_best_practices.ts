/**
 * Lab 456: POM Introduction Best Practices
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Best practices for POM introduction:
 * 
 * - Getting started tips
 * - Common pitfalls
 * - Learning path
 * - Resources
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Review best practices
 * 2. Plan learning path
 * 3. Avoid common mistakes
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { Page, Locator } from '@playwright/test';

// Solution 1: Start Simple
class SimpleStartPage {
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

// Solution 2: Gradual Complexity
// Step 1: Basic page object
class Step1Page {
    readonly page: Page;
    constructor(page: Page) { this.page = page; }
}

// Step 2: Add locators
class Step2Page {
    readonly page: Page;
    readonly button: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.button = page.locator('button');
    }
}

// Step 3: Add methods
class Step3Page {
    readonly page: Page;
    readonly button: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.button = page.locator('button');
    }
    
    async clickButton() {
        await this.button.click();
    }
}

// Solution 3: Naming Conventions
class WellNamedPage {
    readonly page: Page;
    
    // Locators: noun-based
    readonly loginButton: Locator;
    readonly usernameInput: Locator;
    readonly errorMessage: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.loginButton = page.locator('#login');
        this.usernameInput = page.locator('#username');
        this.errorMessage = page.locator('.error');
    }
    
    // Methods: verb-based
    async clickLogin() {
        await this.loginButton.click();
    }
    
    async enterUsername(username: string) {
        await this.usernameInput.fill(username);
    }
    
    async getErrorText() {
        return await this.errorMessage.textContent();
    }
}

// Solution 4: Documentation
/**
 * LoginPage handles all login-related interactions
 * 
 * @example
 * const loginPage = new LoginPage(page);
 * await loginPage.login('user', 'pass');
 */
class DocumentedLoginPage {
    readonly page: Page;
    
    constructor(page: Page) {
        this.page = page;
    }
    
    /**
     * Performs login with given credentials
     * @param username - User's username
     * @param password - User's password
     */
    async login(username: string, password: string) {
        await this.page.locator('#user').fill(username);
        await this.page.locator('#pass').fill(password);
        await this.page.locator('#submit').click();
    }
}

// Solution 5: Learning Path
/*
 * Recommended Learning Path:
 * 
 * Week 1: Basics
 * - Understand POM concept
 * - Create simple page objects
 * - Write basic tests
 * 
 * Week 2: Structure
 * - Organize project
 * - Create base classes
 * - Use inheritance
 * 
 * Week 3: Advanced
 * - Components
 * - Fixtures
 * - Data management
 * 
 * Week 4: Best Practices
 * - Refactoring
 * - Code review
 * - CI/CD integration
 */

// Solution 6: Common Mistakes to Avoid
/*
 * Common Mistakes:
 * 
 * 1. Starting too complex
 * 2. Not using TypeScript
 * 3. Putting assertions in PO
 * 4. Creating god objects
 * 5. Ignoring naming conventions
 * 6. Not documenting code
 * 7. Skipping base classes
 */

// Solution 7: Resources
/*
 * Learning Resources:
 * 
 * - Playwright Documentation
 * - Martin Fowler's POM article
 * - Test Automation University
 * - GitHub examples
 */

// Solution 8: Summary
/*
 * POM Introduction Summary:
 * 
 * 1. Start simple, grow gradually
 * 2. Follow naming conventions
 * 3. Document your code
 * 4. Learn from examples
 * 5. Practice regularly
 * 6. Review and refactor
 */

export { SimpleStartPage, WellNamedPage, DocumentedLoginPage };

