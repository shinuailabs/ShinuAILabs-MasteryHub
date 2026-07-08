/**
 * Lab 510: Authenticated Fixtures
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Creating authenticated fixtures:
 * 
 * - Login fixtures
 * - Session management
 * - Storage state
 * - Role-based fixtures
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create auth fixtures
 * 2. Manage sessions
 * 3. Handle different roles
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test as base, Page, BrowserContext } from '@playwright/test';

// Solution 1: Page Objects
class DashboardPage {
    constructor(readonly page: Page) {}
    
    async isLoggedIn() {
        return await this.page.locator('.user-menu').isVisible();
    }
    
    async logout() {
        await this.page.click('.logout-btn');
    }
}

class AdminPage {
    constructor(readonly page: Page) {}
    
    async getAdminPanel() {
        return this.page.locator('.admin-panel');
    }
}

// Solution 2: Authenticated Page Fixture
type AuthFixtures = {
    authenticatedPage: Page;
    dashboardPage: DashboardPage;
};

const test = base.extend<AuthFixtures>({
    authenticatedPage: async ({ page }, use) => {
        // Login
        await page.goto('/login');
        await page.fill('#username', 'testuser');
        await page.fill('#password', 'password123');
        await page.click('button[type="submit"]');
        await page.waitForURL('/dashboard');
        
        await use(page);
        
        // Cleanup
        await page.goto('/logout');
    },
    
    dashboardPage: async ({ authenticatedPage }, use) => {
        await use(new DashboardPage(authenticatedPage));
    },
});

// Solution 3: Storage State Fixture
type StorageStateFixtures = {
    loggedInContext: BrowserContext;
    loggedInPage: Page;
};

const testWithStorage = base.extend<StorageStateFixtures>({
    loggedInContext: async ({ browser }, use) => {
        // Create context with saved storage state
        const context = await browser.newContext({
            storageState: 'playwright/.auth/user.json',
        });
        
        await use(context);
        await context.close();
    },
    
    loggedInPage: async ({ loggedInContext }, use) => {
        const page = await loggedInContext.newPage();
        await use(page);
    },
});

// Solution 4: Role-Based Fixtures
type RoleFixtures = {
    adminPage: Page;
    userPage: Page;
    guestPage: Page;
};

const testWithRoles = base.extend<RoleFixtures>({
    adminPage: async ({ browser }, use) => {
        const context = await browser.newContext({
            storageState: 'playwright/.auth/admin.json',
        });
        const page = await context.newPage();
        await use(page);
        await context.close();
    },
    
    userPage: async ({ browser }, use) => {
        const context = await browser.newContext({
            storageState: 'playwright/.auth/user.json',
        });
        const page = await context.newPage();
        await use(page);
        await context.close();
    },
    
    guestPage: async ({ browser }, use) => {
        const context = await browser.newContext();
        const page = await context.newPage();
        await use(page);
        await context.close();
    },
});

// Solution 5: Auth Setup Function
async function loginAs(page: Page, role: 'admin' | 'user') {
    const credentials = {
        admin: { username: 'admin', password: 'admin123' },
        user: { username: 'user', password: 'user123' },
    };
    
    await page.goto('/login');
    await page.fill('#username', credentials[role].username);
    await page.fill('#password', credentials[role].password);
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
}

type FlexibleAuthFixtures = {
    loginAs: (role: 'admin' | 'user') => Promise<void>;
};

const testFlexible = base.extend<FlexibleAuthFixtures>({
    loginAs: async ({ page }, use) => {
        await use(async (role) => {
            await loginAs(page, role);
        });
    },
});

// Solution 6: Export
export { test, testWithStorage, testWithRoles, testFlexible };
export { DashboardPage, AdminPage, loginAs };

