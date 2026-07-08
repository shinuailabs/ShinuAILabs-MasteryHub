/**
 * Lab 516: Fixture Best Practices
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Best practices for fixtures:
 * 
 * - Fixture design
 * - Performance
 * - Maintainability
 * - Testing fixtures
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Apply fixture best practices
 * 2. Optimize performance
 * 3. Improve maintainability
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test as base, Page } from '@playwright/test';

// Solution 1: Single Responsibility
class LoginPage {
    constructor(readonly page: Page) {}
    
    async login(username: string, password: string) {
        await this.page.fill('#username', username);
        await this.page.fill('#password', password);
        await this.page.click('#submit');
    }
}

// GOOD: Focused fixture
const goodTest = base.extend<{ loginPage: LoginPage }>({
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },
});

// BAD: Fixture doing too much
// const badTest = base.extend({
//     everything: async ({ page }, use) => {
//         // Login, setup data, configure settings...
//     },
// });

// Solution 2: Proper Cleanup
type CleanupFixtures = {
    testUser: { id: string; cleanup: () => Promise<void> };
};

const cleanupTest = base.extend<CleanupFixtures>({
    testUser: async ({ request }, use) => {
        // Setup
        const response = await request.post('/api/users', {
            data: { username: 'test' },
        });
        const user = await response.json();
        
        // Provide cleanup function
        const cleanup = async () => {
            await request.delete(`/api/users/${user.id}`);
        };
        
        await use({ ...user, cleanup });
        
        // Always cleanup
        await cleanup();
    },
});

// Solution 3: Lazy Initialization
type LazyFixtures = {
    expensiveResource: () => Promise<string>;
};

const lazyTest = base.extend<LazyFixtures>({
    expensiveResource: async ({}, use) => {
        let resource: string | null = null;
        
        const getResource = async () => {
            if (!resource) {
                // Only initialize when needed
                resource = await Promise.resolve('expensive data');
            }
            return resource;
        };
        
        await use(getResource);
    },
});

// Solution 4: Fixture Documentation
type DocumentedFixtures = {
    /**
     * Provides an authenticated page with admin privileges.
     * Automatically logs in as admin before test.
     * Logs out after test completion.
     */
    adminPage: Page;
};

const documentedTest = base.extend<DocumentedFixtures>({
    adminPage: async ({ page }, use) => {
        await page.goto('/login');
        await page.fill('#username', 'admin');
        await page.fill('#password', 'admin123');
        await page.click('#submit');
        
        await use(page);
        
        await page.click('#logout');
    },
});

// Solution 5: Fixture Organization
// fixtures/auth.fixtures.ts
// fixtures/data.fixtures.ts
// fixtures/page.fixtures.ts
// fixtures/index.ts - exports combined test

// Solution 6: Best Practices Summary
/*
 * Fixture Best Practices:
 * 
 * DO:
 * - Single responsibility per fixture
 * - Always cleanup resources
 * - Use lazy initialization for expensive resources
 * - Document complex fixtures
 * - Organize fixtures in separate files
 * - Use worker scope for shared resources
 * 
 * DON'T:
 * - Create fixtures that do too much
 * - Forget cleanup (causes flaky tests)
 * - Initialize expensive resources eagerly
 * - Create circular dependencies
 * - Mix test and worker scoped fixtures incorrectly
 */

// Solution 7: Fixture Testing Pattern
const testableTest = base.extend<{ testableFixture: string }>({
    testableFixture: async ({}, use) => {
        // Fixture logic that can be unit tested separately
        const result = 'testable';
        await use(result);
    },
});

// Solution 8: Export
export { goodTest, cleanupTest, lazyTest, documentedTest, testableTest };

