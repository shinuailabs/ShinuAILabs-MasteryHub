/**
 * Lab 514: Fixture Composition
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Composing fixtures:
 * 
 * - Combining fixtures
 * - Fixture dependencies
 * - Layered fixtures
 * - Fixture merging
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Compose fixtures
 * 2. Handle dependencies
 * 3. Create layered fixtures
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test as base, Page } from '@playwright/test';

// Solution 1: Base Page Objects
class BasePage {
    constructor(readonly page: Page) {}
    
    async goto(path: string) {
        await this.page.goto(path);
    }
}

class LoginPage extends BasePage {
    async login(username: string, password: string) {
        await this.page.fill('#username', username);
        await this.page.fill('#password', password);
        await this.page.click('#submit');
    }
}

class DashboardPage extends BasePage {
    async getTitle() {
        return await this.page.locator('h1').textContent();
    }
}

// Solution 2: Layer 1 - Base Fixtures
type BaseFixtures = {
    basePage: BasePage;
};

const baseTest = base.extend<BaseFixtures>({
    basePage: async ({ page }, use) => {
        await use(new BasePage(page));
    },
});

// Solution 3: Layer 2 - Page Fixtures
type PageFixtures = {
    loginPage: LoginPage;
    dashboardPage: DashboardPage;
};

const pageTest = baseTest.extend<PageFixtures>({
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },
    
    dashboardPage: async ({ page }, use) => {
        await use(new DashboardPage(page));
    },
});

// Solution 4: Layer 3 - Auth Fixtures
type AuthFixtures = {
    authenticatedDashboard: DashboardPage;
};

const authTest = pageTest.extend<AuthFixtures>({
    authenticatedDashboard: async ({ loginPage, dashboardPage }, use) => {
        await loginPage.goto('/login');
        await loginPage.login('testuser', 'password');
        await use(dashboardPage);
    },
});

// Solution 5: Merging Multiple Fixture Sets
type DataFixtures = {
    testData: { username: string; email: string };
};

type APIFixtures = {
    apiEndpoint: string;
};

// Combine all fixtures
const fullTest = authTest.extend<DataFixtures & APIFixtures>({
    testData: async ({}, use) => {
        await use({
            username: 'testuser',
            email: 'test@example.com',
        });
    },
    
    apiEndpoint: async ({}, use) => {
        await use('https://api.example.com');
    },
});

// Solution 6: Fixture with Multiple Dependencies
type ComplexFixtures = {
    setupComplete: boolean;
};

const complexTest = fullTest.extend<ComplexFixtures>({
    setupComplete: async ({ authenticatedDashboard, testData, apiEndpoint }, use) => {
        // This fixture depends on multiple other fixtures
        console.log(`User: ${testData.username}`);
        console.log(`API: ${apiEndpoint}`);
        const title = await authenticatedDashboard.getTitle();
        console.log(`Dashboard: ${title}`);
        
        await use(true);
    },
});

// Solution 7: Export all test variants
export { baseTest, pageTest, authTest, fullTest, complexTest };
export { BasePage, LoginPage, DashboardPage };

