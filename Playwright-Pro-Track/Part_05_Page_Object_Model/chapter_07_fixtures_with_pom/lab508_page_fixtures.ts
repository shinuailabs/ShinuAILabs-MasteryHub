/**
 * Lab 508: Page Fixtures
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Creating page object fixtures:
 * 
 * - Page fixture pattern
 * - Multiple page fixtures
 * - Fixture dependencies
 * - Auto-use fixtures
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create page fixtures
 * 2. Handle dependencies
 * 3. Use auto-use fixtures
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test as base, Page } from '@playwright/test';

// Solution 1: Page Objects
class HomePage {
    constructor(readonly page: Page) {}
    
    async goto() {
        await this.page.goto('/');
    }
    
    async clickLogin() {
        await this.page.click('text=Login');
    }
}

class LoginPage {
    constructor(readonly page: Page) {}
    
    async login(username: string, password: string) {
        await this.page.fill('#username', username);
        await this.page.fill('#password', password);
        await this.page.click('#submit');
    }
}

class ProfilePage {
    constructor(readonly page: Page) {}
    
    async getUsername() {
        return await this.page.locator('.username').textContent();
    }
}

// Solution 2: Multiple Page Fixtures
type PageFixtures = {
    homePage: HomePage;
    loginPage: LoginPage;
    profilePage: ProfilePage;
};

const test = base.extend<PageFixtures>({
    homePage: async ({ page }, use) => {
        await use(new HomePage(page));
    },
    
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },
    
    profilePage: async ({ page }, use) => {
        await use(new ProfilePage(page));
    },
});

// Solution 3: Fixture with Setup
type SetupFixtures = {
    authenticatedPage: Page;
    loggedInProfilePage: ProfilePage;
};

const testWithAuth = base.extend<SetupFixtures>({
    authenticatedPage: async ({ page }, use) => {
        // Setup: Login
        await page.goto('/login');
        await page.fill('#username', 'testuser');
        await page.fill('#password', 'password');
        await page.click('#submit');
        await page.waitForURL('/dashboard');
        
        await use(page);
        
        // Teardown: Logout
        await page.click('#logout');
    },
    
    loggedInProfilePage: async ({ authenticatedPage }, use) => {
        await use(new ProfilePage(authenticatedPage));
    },
});

// Solution 4: Auto-Use Fixture
type AutoFixtures = {
    setupPage: void;
};

const testWithAuto = base.extend<AutoFixtures>({
    setupPage: [async ({ page }, use) => {
        // Runs before every test automatically
        await page.goto('/');
        await use();
    }, { auto: true }],
});

// Solution 5: Fixture Dependencies
type DependentFixtures = {
    basePage: Page;
    derivedPage: HomePage;
};

const testWithDeps = base.extend<DependentFixtures>({
    basePage: async ({ page }, use) => {
        await page.goto('/');
        await use(page);
    },
    
    derivedPage: async ({ basePage }, use) => {
        // Depends on basePage fixture
        await use(new HomePage(basePage));
    },
});

// Solution 6: Export
export { test, testWithAuth, testWithAuto, testWithDeps };
export { HomePage, LoginPage, ProfilePage };

