/**
 * Lab 529: Fluent Interface
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Implementing fluent interface:
 * 
 * - Method chaining
 * - Fluent API design
 * - Page transitions
 * - Readable tests
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create fluent pages
 * 2. Implement chaining
 * 3. Handle transitions
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { Page, Locator } from '@playwright/test';

// Solution 1: Fluent Login Page
class FluentLoginPage {
    constructor(private page: Page) {}
    
    async goto(): Promise<this> {
        await this.page.goto('/login');
        return this;
    }
    
    async enterUsername(username: string): Promise<this> {
        await this.page.fill('#username', username);
        return this;
    }
    
    async enterPassword(password: string): Promise<this> {
        await this.page.fill('#password', password);
        return this;
    }
    
    async checkRememberMe(): Promise<this> {
        await this.page.check('#remember-me');
        return this;
    }
    
    async submit(): Promise<FluentDashboardPage> {
        await this.page.click('button[type="submit"]');
        return new FluentDashboardPage(this.page);
    }
    
    async submitExpectingError(): Promise<this> {
        await this.page.click('button[type="submit"]');
        return this;
    }
}

// Solution 2: Fluent Dashboard Page
class FluentDashboardPage {
    constructor(private page: Page) {}
    
    async clickProfile(): Promise<FluentProfilePage> {
        await this.page.click('#profile-link');
        return new FluentProfilePage(this.page);
    }
    
    async clickSettings(): Promise<FluentSettingsPage> {
        await this.page.click('#settings-link');
        return new FluentSettingsPage(this.page);
    }
    
    async logout(): Promise<FluentLoginPage> {
        await this.page.click('#logout');
        return new FluentLoginPage(this.page);
    }
    
    async getWelcomeMessage(): Promise<string | null> {
        return await this.page.locator('.welcome').textContent();
    }
}

// Solution 3: Fluent Profile Page
class FluentProfilePage {
    constructor(private page: Page) {}
    
    async enterName(name: string): Promise<this> {
        await this.page.fill('#name', name);
        return this;
    }
    
    async enterEmail(email: string): Promise<this> {
        await this.page.fill('#email', email);
        return this;
    }
    
    async enterBio(bio: string): Promise<this> {
        await this.page.fill('#bio', bio);
        return this;
    }
    
    async save(): Promise<this> {
        await this.page.click('#save');
        return this;
    }
    
    async goBack(): Promise<FluentDashboardPage> {
        await this.page.click('#back');
        return new FluentDashboardPage(this.page);
    }
}

// Solution 4: Fluent Settings Page
class FluentSettingsPage {
    constructor(private page: Page) {}
    
    async toggleDarkMode(): Promise<this> {
        await this.page.click('#dark-mode');
        return this;
    }
    
    async toggleNotifications(): Promise<this> {
        await this.page.click('#notifications');
        return this;
    }
    
    async selectLanguage(language: string): Promise<this> {
        await this.page.selectOption('#language', language);
        return this;
    }
    
    async save(): Promise<this> {
        await this.page.click('#save');
        return this;
    }
    
    async goBack(): Promise<FluentDashboardPage> {
        await this.page.click('#back');
        return new FluentDashboardPage(this.page);
    }
}

// Solution 5: Fluent Form Builder
class FluentFormBuilder {
    private page: Page;
    private formLocator: Locator;
    
    constructor(page: Page, formSelector: string) {
        this.page = page;
        this.formLocator = page.locator(formSelector);
    }
    
    async fill(name: string, value: string): Promise<this> {
        await this.formLocator.locator(`[name="${name}"]`).fill(value);
        return this;
    }
    
    async check(name: string): Promise<this> {
        await this.formLocator.locator(`[name="${name}"]`).check();
        return this;
    }
    
    async select(name: string, value: string): Promise<this> {
        await this.formLocator.locator(`[name="${name}"]`).selectOption(value);
        return this;
    }
    
    async submit(): Promise<void> {
        await this.formLocator.locator('button[type="submit"]').click();
    }
}

// Solution 6: Usage Example
async function fluentExample(page: Page) {
    const dashboard = await new FluentLoginPage(page)
        .then(p => p.goto())
        .then(p => p.enterUsername('user'))
        .then(p => p.enterPassword('pass'))
        .then(p => p.submit());
    
    await dashboard
        .clickProfile()
        .then(p => p.enterName('John'))
        .then(p => p.enterEmail('john@test.com'))
        .then(p => p.save())
        .then(p => p.goBack());
}

// Solution 7: Export
export {
    FluentLoginPage,
    FluentDashboardPage,
    FluentProfilePage,
    FluentSettingsPage,
    FluentFormBuilder,
};

