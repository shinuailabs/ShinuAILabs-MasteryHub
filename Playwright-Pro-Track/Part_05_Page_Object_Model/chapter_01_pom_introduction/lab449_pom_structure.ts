/**
 * Lab 449: POM Structure
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Structuring Page Object Model:
 * 
 * - Folder organization
 * - File naming conventions
 * - Class structure
 * - Export patterns
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Organize POM folders
 * 2. Create proper file structure
 * 3. Follow naming conventions
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { Page, Locator } from '@playwright/test';

// Solution 1: Recommended Folder Structure
/*
 * project/
 * ├── pages/
 * │   ├── base.page.ts
 * │   ├── home.page.ts
 * │   ├── login.page.ts
 * │   └── dashboard.page.ts
 * ├── components/
 * │   ├── header.component.ts
 * │   ├── footer.component.ts
 * │   └── sidebar.component.ts
 * ├── tests/
 * │   ├── login.spec.ts
 * │   └── dashboard.spec.ts
 * └── fixtures/
 *     └── test.fixture.ts
 */

// Solution 2: Base Page Class
class BasePage {
    readonly page: Page;
    
    constructor(page: Page) {
        this.page = page;
    }
    
    // Common methods for all pages
    async getTitle() {
        return await this.page.title();
    }
    
    async getUrl() {
        return this.page.url();
    }
    
    async waitForPageLoad() {
        await this.page.waitForLoadState('networkidle');
    }
}

// Solution 3: Page Class Extending Base
class HomePage extends BasePage {
    readonly heroSection: Locator;
    readonly featuresSection: Locator;
    
    constructor(page: Page) {
        super(page);
        this.heroSection = page.locator('.hero');
        this.featuresSection = page.locator('.features');
    }
    
    async navigate() {
        await this.page.goto('/');
        await this.waitForPageLoad();
    }
}

// Solution 4: Naming Conventions
/*
 * File Naming:
 * - home.page.ts (page objects)
 * - header.component.ts (components)
 * - login.spec.ts (tests)
 * - auth.fixture.ts (fixtures)
 * 
 * Class Naming:
 * - HomePage (PascalCase)
 * - LoginPage
 * - HeaderComponent
 * 
 * Method Naming:
 * - navigate() (camelCase)
 * - clickLoginButton()
 * - getUsername()
 */

// Solution 5: Locator Organization
class LoginPage extends BasePage {
    // Group locators by section
    // Form elements
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly submitButton: Locator;
    
    // Error messages
    readonly errorMessage: Locator;
    readonly fieldErrors: Locator;
    
    // Links
    readonly forgotPasswordLink: Locator;
    readonly registerLink: Locator;
    
    constructor(page: Page) {
        super(page);
        
        // Form elements
        this.usernameInput = page.locator('#username');
        this.passwordInput = page.locator('#password');
        this.submitButton = page.locator('button[type="submit"]');
        
        // Error messages
        this.errorMessage = page.locator('.error-message');
        this.fieldErrors = page.locator('.field-error');
        
        // Links
        this.forgotPasswordLink = page.locator('a[href="/forgot-password"]');
        this.registerLink = page.locator('a[href="/register"]');
    }
}

// Solution 6: Method Organization
class DashboardPage extends BasePage {
    readonly welcomeMessage: Locator;
    readonly statsSection: Locator;
    
    constructor(page: Page) {
        super(page);
        this.welcomeMessage = page.locator('.welcome');
        this.statsSection = page.locator('.stats');
    }
    
    // Navigation methods
    async navigate() {
        await this.page.goto('/dashboard');
    }
    
    // Action methods
    async refreshStats() {
        await this.page.locator('.refresh-btn').click();
    }
    
    // Getter methods
    async getWelcomeText() {
        return await this.welcomeMessage.textContent();
    }
    
    // Verification methods
    async isLoaded() {
        return await this.welcomeMessage.isVisible();
    }
}

// Solution 7: Export Pattern
// Single export
export { BasePage };

// Multiple exports
export { HomePage, LoginPage, DashboardPage };

// Default export (for main page)
// export default HomePage;

// Solution 8: Index File Pattern
/*
 * pages/index.ts:
 * 
 * export { BasePage } from './base.page';
 * export { HomePage } from './home.page';
 * export { LoginPage } from './login.page';
 * export { DashboardPage } from './dashboard.page';
 * 
 * Usage in tests:
 * import { HomePage, LoginPage } from '../pages';
 */

// Solution 9: Type Definitions
interface PageConfig {
    baseUrl: string;
    timeout: number;
}

class ConfigurablePage extends BasePage {
    readonly config: PageConfig;
    
    constructor(page: Page, config: PageConfig) {
        super(page);
        this.config = config;
    }
    
    async navigate(path: string) {
        await this.page.goto(`${this.config.baseUrl}${path}`);
    }
}

// Solution 10: Complete Structure Example
/*
 * Best Practice Structure:
 * 
 * 1. Base page with common functionality
 * 2. Page classes extending base
 * 3. Component classes for reusable UI parts
 * 4. Clear naming conventions
 * 5. Organized exports
 * 6. Type definitions where needed
 * 7. Consistent method patterns
 */

