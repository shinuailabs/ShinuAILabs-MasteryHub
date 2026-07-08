/**
 * Lab 536: Advanced POM Best Practices
 *
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Best practices for advanced POM:
 *
 * - Design principles
 * - Code organization
 * - Maintainability
 * - Scalability
 *
 * =====================
 * EXERCISE:
 * =====================
 * 1. Apply best practices
 * 2. Organize code
 * 3. Ensure maintainability
 *
 * =====================
 * SOLUTION:
 * =====================
 */

import { Page, Locator, expect } from '@playwright/test';

// Solution 1: Single Responsibility
// GOOD: Each class has one responsibility
class LoginForm {
    constructor(private form: Locator) {}

    async fill(username: string, password: string) {
        await this.form.locator('#username').fill(username);
        await this.form.locator('#password').fill(password);
    }

    async submit() {
        await this.form.locator('button[type="submit"]').click();
    }
}

class LoginValidation {
    constructor(private page: Page) {}

    async getErrorMessage() {
        return await this.page.locator('.error').textContent();
    }

    async isLoggedIn() {
        return await this.page.locator('.user-menu').isVisible();
    }
}

// Solution 2: Open/Closed Principle
// GOOD: Open for extension, closed for modification
abstract class BasePage {
    constructor(protected page: Page) {}

    abstract get url(): string;

    async goto() {
        await this.page.goto(this.url);
    }

    // Can be extended without modifying
    async waitForLoad() {
        await this.page.waitForLoadState('networkidle');
    }
}

class ProductPage extends BasePage {
    get url() { return '/products'; }

    // Extended functionality
    async waitForLoad() {
        await super.waitForLoad();
        await this.page.locator('.product-list').waitFor();
    }
}

// Solution 3: Dependency Injection
// GOOD: Dependencies are injected
class CheckoutPage {
    constructor(
        private page: Page,
        private logger?: { log: (msg: string) => void }
    ) {}

    async checkout() {
        this.logger?.log('Starting checkout');
        await this.page.click('#checkout');
    }
}

// Solution 4: Interface Segregation
// GOOD: Small, focused interfaces
interface Clickable {
    click(): Promise<void>;
}

interface Fillable {
    fill(value: string): Promise<void>;
}

interface Readable {
    getText(): Promise<string | null>;
}

class Button implements Clickable, Readable {
    constructor(private locator: Locator) {}

    async click() {
        await this.locator.click();
    }

    async getText() {
        return await this.locator.textContent();
    }
}

// Solution 5: Composition Over Inheritance
// GOOD: Compose behavior
class PageWithComponents {
    readonly header: HeaderComponent;
    readonly footer: FooterComponent;

    constructor(protected page: Page) {
        this.header = new HeaderComponent(page.locator('header'));
        this.footer = new FooterComponent(page.locator('footer'));
    }
}

class HeaderComponent {
    constructor(private root: Locator) {}
    async clickLogo() { await this.root.locator('.logo').click(); }
}

class FooterComponent {
    constructor(private root: Locator) {}
    async getCopyright() { return await this.root.locator('.copyright').textContent(); }
}

// Solution 6: Encapsulation
// GOOD: Hide implementation details
class SecurePage {
    private readonly sensitiveData: Locator;

    constructor(private page: Page) {
        this.sensitiveData = page.locator('.sensitive');
    }

    // Expose behavior, not implementation
    async hasSensitiveData(): Promise<boolean> {
        return await this.sensitiveData.isVisible();
    }

    // Don't expose: getSensitiveDataLocator()
}

// Solution 7: Best Practices Summary
/*
 * Advanced POM Best Practices:
 *
 * DESIGN:
 * - Single Responsibility Principle
 * - Open/Closed Principle
 * - Dependency Injection
 * - Interface Segregation
 * - Composition over Inheritance
 * - Encapsulation
 *
 * ORGANIZATION:
 * - Group by feature/domain
 * - Separate pages, components, fixtures
 * - Use index files for exports
 *
 * MAINTAINABILITY:
 * - Consistent naming conventions
 * - Document complex logic
 * - Keep methods small
 * - Use TypeScript for type safety
 *
 * SCALABILITY:
 * - Use factories for page creation
 * - Implement lazy loading
 * - Cache reusable components
 */

// Solution 8: Export
export {
    LoginForm,
    LoginValidation,
    BasePage,
    ProductPage,
    CheckoutPage,
    Clickable,
    Fillable,
    Readable,
    Button,
    PageWithComponents,
    SecurePage,
};
