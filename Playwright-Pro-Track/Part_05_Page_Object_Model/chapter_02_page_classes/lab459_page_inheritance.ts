/**
 * Lab 459: Page Inheritance
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Using inheritance in page objects:
 * 
 * - Extending base classes
 * - Method overriding
 * - Super calls
 * - Inheritance hierarchy
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create inheritance hierarchy
 * 2. Override methods
 * 3. Use super calls
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { Page, Locator } from '@playwright/test';

// Solution 1: Base Class
class BasePage {
    readonly page: Page;
    
    constructor(page: Page) {
        this.page = page;
    }
    
    async navigate(url: string) {
        await this.page.goto(url);
    }
    
    async getTitle() {
        return await this.page.title();
    }
}

// Solution 2: Simple Inheritance
class HomePage extends BasePage {
    readonly heroSection: Locator;
    
    constructor(page: Page) {
        super(page); // Call parent constructor
        this.heroSection = page.locator('.hero');
    }
    
    async navigateToHome() {
        await this.navigate('/'); // Use inherited method
    }
}

// Solution 3: Method Overriding
class AuthenticatedPage extends BasePage {
    readonly logoutButton: Locator;
    
    constructor(page: Page) {
        super(page);
        this.logoutButton = page.locator('#logout');
    }
    
    // Override navigate to check auth
    async navigate(url: string) {
        await super.navigate(url); // Call parent method
        await this.checkAuthentication();
    }
    
    private async checkAuthentication() {
        // Check if user is authenticated
        const isLoggedIn = await this.logoutButton.isVisible();
        if (!isLoggedIn) {
            throw new Error('User not authenticated');
        }
    }
}

// Solution 4: Multi-level Inheritance
class AdminPage extends AuthenticatedPage {
    readonly adminPanel: Locator;
    
    constructor(page: Page) {
        super(page);
        this.adminPanel = page.locator('.admin-panel');
    }
    
    async navigate(url: string) {
        await super.navigate(url);
        await this.checkAdminAccess();
    }
    
    private async checkAdminAccess() {
        const hasAccess = await this.adminPanel.isVisible();
        if (!hasAccess) {
            throw new Error('Admin access required');
        }
    }
}

// Solution 5: Abstract-like Base Class
class AbstractPage {
    readonly page: Page;
    protected readonly pageUrl: string;
    
    constructor(page: Page, pageUrl: string) {
        this.page = page;
        this.pageUrl = pageUrl;
    }
    
    async navigate() {
        await this.page.goto(this.pageUrl);
        await this.waitForPageLoad();
    }
    
    // To be overridden by child classes
    async waitForPageLoad() {
        await this.page.waitForLoadState('networkidle');
    }
}

class ProductsPage extends AbstractPage {
    readonly productList: Locator;
    
    constructor(page: Page) {
        super(page, '/products');
        this.productList = page.locator('.product-list');
    }
    
    // Override wait method
    async waitForPageLoad() {
        await super.waitForPageLoad();
        await this.productList.waitFor();
    }
}

// Solution 6: Protected Members
class ProtectedBasePage {
    readonly page: Page;
    protected readonly baseUrl: string;
    
    constructor(page: Page) {
        this.page = page;
        this.baseUrl = 'https://example.com';
    }
    
    protected async navigateTo(path: string) {
        await this.page.goto(`${this.baseUrl}${path}`);
    }
}

class ChildPage extends ProtectedBasePage {
    async goToProducts() {
        await this.navigateTo('/products'); // Access protected method
    }
}

// Solution 7: Inheritance with Composition
class HeaderComponent {
    readonly page: Page;
    readonly logo: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.logo = page.locator('.logo');
    }
}

class PageWithHeader extends BasePage {
    readonly header: HeaderComponent;
    
    constructor(page: Page) {
        super(page);
        this.header = new HeaderComponent(page);
    }
}

// Solution 8: Inheritance Best Practices
/*
 * Best Practices:
 * 
 * 1. Keep inheritance shallow (2-3 levels max)
 * 2. Use composition when possible
 * 3. Call super() in constructors
 * 4. Override methods carefully
 * 5. Use protected for shared members
 */

// Solution 9: Export
export {
    BasePage,
    HomePage,
    AuthenticatedPage,
    AdminPage,
    AbstractPage,
    ProductsPage,
    ProtectedBasePage,
    ChildPage,
    PageWithHeader,
};

