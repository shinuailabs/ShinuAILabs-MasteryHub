/**
 * Lab 507: Fixture Basics
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Understanding fixtures with POM:
 * 
 * - What are fixtures
 * - Fixture types
 * - Fixture scope
 * - Using fixtures
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create basic fixtures
 * 2. Understand fixture scope
 * 3. Use fixtures in tests
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test as base, Page } from '@playwright/test';

// Solution 1: Basic Page Object
class LoginPage {
    readonly page: Page;
    
    constructor(page: Page) {
        this.page = page;
    }
    
    async goto() {
        await this.page.goto('/login');
    }
    
    async login(username: string, password: string) {
        await this.page.fill('#username', username);
        await this.page.fill('#password', password);
        await this.page.click('button[type="submit"]');
    }
}

class DashboardPage {
    readonly page: Page;
    
    constructor(page: Page) {
        this.page = page;
    }
    
    async getWelcomeMessage() {
        return await this.page.locator('.welcome').textContent();
    }
}

// Solution 2: Define Fixtures Type
type MyFixtures = {
    loginPage: LoginPage;
    dashboardPage: DashboardPage;
};

// Solution 3: Extend Test with Fixtures
const test = base.extend<MyFixtures>({
    loginPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page);
        await use(loginPage);
    },
    
    dashboardPage: async ({ page }, use) => {
        const dashboardPage = new DashboardPage(page);
        await use(dashboardPage);
    },
});

// Solution 4: Using Fixtures in Tests
test('login test with fixtures', async ({ loginPage, dashboardPage }) => {
    await loginPage.goto();
    await loginPage.login('user', 'pass');
    const message = await dashboardPage.getWelcomeMessage();
    console.log(message);
});

// Solution 5: Fixture Scope Explanation
/*
 * Fixture Scopes:
 * 
 * - test: Created for each test (default)
 * - worker: Created once per worker
 * 
 * Example:
 * myFixture: [async ({ page }, use) => {
 *     await use(new MyPage(page));
 * }, { scope: 'test' }]
 */

// Solution 6: Export
export { test, LoginPage, DashboardPage };

