/**
 * Lab 486: Action Methods Best Practices
 *
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Best practices for action methods:
 *
 * - Method naming
 * - Return values
 * - Error handling
 * - Reusability
 *
 * =====================
 * EXERCISE:
 * =====================
 * 1. Apply action best practices
 * 2. Create reusable methods
 * 3. Handle errors properly
 *
 * =====================
 * SOLUTION:
 * =====================
 */

import { Page, Locator, expect } from '@playwright/test';

// Solution 1: Clear Method Naming
class ClearNamingPage {
    readonly page: Page;
    readonly loginButton: Locator;
    readonly usernameInput: Locator;

    constructor(page: Page) {
        this.page = page;
        this.loginButton = page.locator('#login');
        this.usernameInput = page.locator('#username');
    }

    // GOOD: Clear action names
    async clickLoginButton() {
        await this.loginButton.click();
    }

    async fillUsername(username: string) {
        await this.usernameInput.fill(username);
    }

    // BAD: Unclear names
    // async doLogin() { ... }
    // async setData(data: string) { ... }
}

// Solution 2: Return Values
class ReturnValuesPage {
    readonly page: Page;
    readonly message: Locator;
    readonly items: Locator;

    constructor(page: Page) {
        this.page = page;
        this.message = page.locator('.message');
        this.items = page.locator('.item');
    }

    // Return data when needed
    async getMessage(): Promise<string> {
        return await this.message.textContent() || '';
    }

    async getItemCount(): Promise<number> {
        return await this.items.count();
    }

    // Return boolean for checks
    async isMessageVisible(): Promise<boolean> {
        return await this.message.isVisible();
    }

    // Return this for chaining
    async clickItem(index: number): Promise<this> {
        await this.items.nth(index).click();
        return this;
    }
}

// Solution 3: Error Handling
class ErrorHandlingPage {
    readonly page: Page;
    readonly element: Locator;

    constructor(page: Page) {
        this.page = page;
        this.element = page.locator('.element');
    }

    // Safe click with error handling
    async safeClick(): Promise<boolean> {
        try {
            await this.element.click({ timeout: 5000 });
            return true;
        } catch (error) {
            console.error('Click failed:', error);
            return false;
        }
    }

    // Click with retry
    async clickWithRetry(retries: number = 3): Promise<void> {
        for (let i = 0; i < retries; i++) {
            try {
                await this.element.click({ timeout: 2000 });
                return;
            } catch {
                if (i === retries - 1) throw new Error('Click failed after retries');
                await this.page.waitForTimeout(1000);
            }
        }
    }
}

// Solution 4: Reusable Methods
class ReusableMethodsPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // Generic fill method
    async fillField(selector: string, value: string): Promise<void> {
        await this.page.locator(selector).fill(value);
    }

    // Generic click method
    async clickElement(selector: string): Promise<void> {
        await this.page.locator(selector).click();
    }

    // Generic wait method
    async waitForElement(selector: string): Promise<void> {
        await this.page.locator(selector).waitFor({ state: 'visible' });
    }
}

// Solution 5: Composite Actions
class CompositeActionsPage {
    readonly page: Page;
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly submitButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.usernameInput = page.locator('#username');
        this.passwordInput = page.locator('#password');
        this.submitButton = page.locator('#submit');
    }

    // Composite action combining multiple steps
    async login(username: string, password: string): Promise<void> {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.submitButton.click();
    }

    // With validation
    async loginAndVerify(username: string, password: string): Promise<boolean> {
        await this.login(username, password);
        return await this.page.locator('.dashboard').isVisible();
    }
}

// Solution 6: Best Practices Summary
/*
 * Action Method Best Practices:
 *
 * 1. Use clear, descriptive names
 * 2. Return appropriate values
 * 3. Handle errors gracefully
 * 4. Create reusable methods
 * 5. Combine related actions
 * 6. Add proper waits
 * 7. Document complex methods
 * 8. Keep methods focused
 */

// Solution 7: Export
export {
    ClearNamingPage,
    ReturnValuesPage,
    ErrorHandlingPage,
    ReusableMethodsPage,
    CompositeActionsPage,
};
