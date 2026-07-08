/**
 * Lab 538: Code Organization
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Organizing POM code:
 * 
 * - Folder structure
 * - Module organization
 * - Index exports
 * - Dependency management
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Organize code structure
 * 2. Create modules
 * 3. Manage exports
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Recommended Folder Structure
/*
 * tests/
 * ├── pages/
 * │   ├── index.ts
 * │   ├── login.page.ts
 * │   ├── dashboard.page.ts
 * │   └── profile.page.ts
 * ├── components/
 * │   ├── index.ts
 * │   ├── header.component.ts
 * │   ├── footer.component.ts
 * │   └── modal.component.ts
 * ├── fixtures/
 * │   ├── index.ts
 * │   ├── auth.fixture.ts
 * │   └── data.fixture.ts
 * ├── helpers/
 * │   ├── index.ts
 * │   ├── api.helper.ts
 * │   └── data.helper.ts
 * ├── data/
 * │   ├── users.json
 * │   └── products.json
 * └── specs/
 *     ├── login.spec.ts
 *     └── checkout.spec.ts
 */

// Solution 2: Page Module (pages/login.page.ts)
import { Page, Locator } from '@playwright/test';

export class LoginPage {
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly submitButton: Locator;
    
    constructor(readonly page: Page) {
        this.usernameInput = page.locator('#username');
        this.passwordInput = page.locator('#password');
        this.submitButton = page.locator('button[type="submit"]');
    }
    
    async login(username: string, password: string) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.submitButton.click();
    }
}

// Solution 3: Component Module (components/header.component.ts)
export class HeaderComponent {
    constructor(readonly root: Locator) {}
    
    async clickLogo() {
        await this.root.locator('.logo').click();
    }
    
    async search(query: string) {
        await this.root.locator('input[type="search"]').fill(query);
        await this.root.locator('.search-btn').click();
    }
}

// Solution 4: Index File (pages/index.ts)
/*
 * // pages/index.ts
 * export { LoginPage } from './login.page';
 * export { DashboardPage } from './dashboard.page';
 * export { ProfilePage } from './profile.page';
 * 
 * // Usage in tests:
 * import { LoginPage, DashboardPage } from '../pages';
 */

// Solution 5: Barrel Exports
// Re-export everything from a single entry point
export * from './lab537_naming_conventions';

// Solution 6: Feature-Based Organization
/*
 * Alternative: Feature-based structure
 * 
 * tests/
 * ├── features/
 * │   ├── auth/
 * │   │   ├── pages/
 * │   │   │   └── login.page.ts
 * │   │   ├── components/
 * │   │   │   └── login-form.component.ts
 * │   │   ├── fixtures/
 * │   │   │   └── auth.fixture.ts
 * │   │   └── specs/
 * │   │       └── login.spec.ts
 * │   └── checkout/
 * │       ├── pages/
 * │       ├── components/
 * │       └── specs/
 * └── shared/
 *     ├── components/
 *     └── helpers/
 */

// Solution 7: Module Dependencies
/*
 * Dependency Rules:
 * 
 * 1. Pages can import Components
 * 2. Pages can import Helpers
 * 3. Components should not import Pages
 * 4. Specs import Pages and Fixtures
 * 5. Fixtures import Pages
 * 
 * Avoid circular dependencies!
 */

// Solution 8: Configuration Organization
/*
 * config/
 * ├── playwright.config.ts
 * ├── environments/
 * │   ├── dev.config.ts
 * │   ├── staging.config.ts
 * │   └── prod.config.ts
 * └── test-data/
 *     ├── users.ts
 *     └── products.ts
 */

// Solution 9: Export
export { LoginPage, HeaderComponent };

