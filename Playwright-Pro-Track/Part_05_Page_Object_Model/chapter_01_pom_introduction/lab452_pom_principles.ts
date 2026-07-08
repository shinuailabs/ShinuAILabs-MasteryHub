/**
 * Lab 452: POM Principles
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Core principles of Page Object Model:
 * 
 * - Single Responsibility
 * - Encapsulation
 * - DRY (Don't Repeat Yourself)
 * - Abstraction
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Apply POM principles
 * 2. Design clean page objects
 * 3. Follow best practices
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { Page, Locator } from '@playwright/test';

// Solution 1: Single Responsibility Principle
// Each page object handles ONE page only
class LoginPage {
    readonly page: Page;
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.usernameInput = page.locator('#username');
        this.passwordInput = page.locator('#password');
        this.loginButton = page.locator('#login');
    }
    
    async login(username: string, password: string) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }
}

// Separate page object for dashboard
class DashboardPage {
    readonly page: Page;
    readonly welcomeMessage: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.welcomeMessage = page.locator('.welcome');
    }
    
    async getWelcomeText() {
        return await this.welcomeMessage.textContent();
    }
}

// Solution 2: Encapsulation Principle
class SearchPage {
    readonly page: Page;
    private readonly searchInput: Locator;
    private readonly searchButton: Locator;
    private readonly results: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.searchInput = page.locator('#search');
        this.searchButton = page.locator('#search-btn');
        this.results = page.locator('.results');
    }
    
    // Public method hides implementation details
    async search(query: string) {
        await this.searchInput.fill(query);
        await this.searchButton.click();
        await this.results.waitFor();
    }
    
    async getResultCount() {
        return await this.results.locator('.item').count();
    }
}

// Solution 3: DRY Principle
// Base page with common functionality
class BasePage {
    readonly page: Page;
    
    constructor(page: Page) {
        this.page = page;
    }
    
    // Common methods used by all pages
    async waitForPageLoad() {
        await this.page.waitForLoadState('networkidle');
    }
    
    async getTitle() {
        return await this.page.title();
    }
    
    async takeScreenshot(name: string) {
        await this.page.screenshot({ path: `screenshots/${name}.png` });
    }
}

// Pages extend base to avoid repetition
class HomePage extends BasePage {
    readonly heroSection: Locator;
    
    constructor(page: Page) {
        super(page);
        this.heroSection = page.locator('.hero');
    }
    
    async navigate() {
        await this.page.goto('/');
        await this.waitForPageLoad(); // Inherited method
    }
}

// Solution 4: Abstraction Principle
class CheckoutPage extends BasePage {
    private readonly cardNumber: Locator;
    private readonly expiry: Locator;
    private readonly cvv: Locator;
    private readonly payButton: Locator;
    
    constructor(page: Page) {
        super(page);
        this.cardNumber = page.locator('#card-number');
        this.expiry = page.locator('#expiry');
        this.cvv = page.locator('#cvv');
        this.payButton = page.locator('#pay');
    }
    
    // Abstract complex payment process
    async makePayment(cardDetails: {
        number: string;
        expiry: string;
        cvv: string;
    }) {
        await this.cardNumber.fill(cardDetails.number);
        await this.expiry.fill(cardDetails.expiry);
        await this.cvv.fill(cardDetails.cvv);
        await this.payButton.click();
        await this.page.waitForSelector('.payment-success');
    }
}

// Solution 5: Composition Over Inheritance
class HeaderComponent {
    readonly page: Page;
    readonly logo: Locator;
    readonly navLinks: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.logo = page.locator('.logo');
        this.navLinks = page.locator('nav a');
    }
    
    async clickLogo() {
        await this.logo.click();
    }
}

class PageWithHeader extends BasePage {
    readonly header: HeaderComponent;
    
    constructor(page: Page) {
        super(page);
        this.header = new HeaderComponent(page);
    }
}

// Solution 6: Interface Segregation
interface Navigable {
    navigate(): Promise<void>;
}

interface Searchable {
    search(query: string): Promise<void>;
}

class ProductsPage extends BasePage implements Navigable, Searchable {
    readonly searchInput: Locator;
    
    constructor(page: Page) {
        super(page);
        this.searchInput = page.locator('#product-search');
    }
    
    async navigate() {
        await this.page.goto('/products');
    }
    
    async search(query: string) {
        await this.searchInput.fill(query);
        await this.searchInput.press('Enter');
    }
}

// Solution 7: Dependency Inversion
interface PageFactory {
    createLoginPage(): LoginPage;
    createDashboardPage(): DashboardPage;
}

class PlaywrightPageFactory implements PageFactory {
    private page: Page;
    
    constructor(page: Page) {
        this.page = page;
    }
    
    createLoginPage() {
        return new LoginPage(this.page);
    }
    
    createDashboardPage() {
        return new DashboardPage(this.page);
    }
}

// Solution 8: Principle Summary
/*
 * POM Principles Summary:
 * 
 * 1. Single Responsibility
 *    - One page object per page
 *    - Focused functionality
 * 
 * 2. Encapsulation
 *    - Hide implementation details
 *    - Expose clean public API
 * 
 * 3. DRY
 *    - Common code in base class
 *    - Reusable components
 * 
 * 4. Abstraction
 *    - Hide complexity
 *    - Simple method interfaces
 * 
 * 5. Composition
 *    - Combine smaller objects
 *    - Flexible structure
 */

export { 
    LoginPage, 
    DashboardPage, 
    SearchPage, 
    BasePage, 
    HomePage, 
    CheckoutPage,
    HeaderComponent,
    PageWithHeader,
    ProductsPage
};

