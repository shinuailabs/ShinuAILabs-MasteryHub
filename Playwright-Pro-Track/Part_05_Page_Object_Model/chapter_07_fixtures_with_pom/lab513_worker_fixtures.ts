/**
 * Lab 513: Worker Fixtures
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Creating worker-scoped fixtures:
 * 
 * - Worker scope
 * - Shared resources
 * - One-time setup
 * - Performance optimization
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create worker fixtures
 * 2. Share resources
 * 3. Optimize performance
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test as base, Browser, BrowserContext } from '@playwright/test';

// Solution 1: Worker-Scoped Database Connection
interface DatabaseConnection {
    query: (sql: string) => Promise<any[]>;
    close: () => Promise<void>;
}

// Mock database connection
const createDatabaseConnection = async (): Promise<DatabaseConnection> => {
    console.log('Creating database connection...');
    return {
        query: async (sql: string) => {
            console.log(`Executing: ${sql}`);
            return [];
        },
        close: async () => {
            console.log('Closing database connection...');
        },
    };
};

// Solution 2: Worker Fixture Definition
type WorkerFixtures = {
    database: DatabaseConnection;
    sharedBrowser: Browser;
};

const test = base.extend<{}, WorkerFixtures>({
    database: [async ({}, use) => {
        // Setup: Create connection once per worker
        const db = await createDatabaseConnection();
        
        await use(db);
        
        // Teardown: Close connection
        await db.close();
    }, { scope: 'worker' }],
    
    sharedBrowser: [async ({ browser }, use) => {
        // Browser is already worker-scoped by default
        await use(browser);
    }, { scope: 'worker' }],
});

// Solution 3: Shared Auth Context
type AuthWorkerFixtures = {
    authContext: BrowserContext;
};

const testWithAuth = base.extend<{}, AuthWorkerFixtures>({
    authContext: [async ({ browser }, use) => {
        // Create authenticated context once per worker
        const context = await browser.newContext();
        const page = await context.newPage();
        
        // Login once
        await page.goto('/login');
        await page.fill('#username', 'testuser');
        await page.fill('#password', 'password');
        await page.click('button[type="submit"]');
        await page.waitForURL('/dashboard');
        
        // Save storage state
        await context.storageState({ path: 'playwright/.auth/worker.json' });
        
        await use(context);
        
        await context.close();
    }, { scope: 'worker' }],
});

// Solution 4: Shared Test Data
interface SharedTestData {
    adminUser: { id: string; username: string };
    testProducts: { id: string; name: string }[];
}

type DataWorkerFixtures = {
    sharedData: SharedTestData;
};

const testWithData = base.extend<{}, DataWorkerFixtures>({
    sharedData: [async ({ request }, use) => {
        // Create test data once per worker
        const adminResponse = await request.post('/api/users', {
            data: { username: 'admin', role: 'admin' },
        });
        const adminUser = await adminResponse.json();
        
        const productsResponse = await request.post('/api/products/bulk', {
            data: [
                { name: 'Product 1' },
                { name: 'Product 2' },
            ],
        });
        const testProducts = await productsResponse.json();
        
        await use({ adminUser, testProducts });
        
        // Cleanup
        await request.delete(`/api/users/${adminUser.id}`);
        for (const product of testProducts) {
            await request.delete(`/api/products/${product.id}`);
        }
    }, { scope: 'worker' }],
});

// Solution 5: Worker Index
type WorkerIndexFixtures = {
    workerIndex: number;
};

const testWithIndex = base.extend<{}, WorkerIndexFixtures>({
    workerIndex: [async ({}, use, workerInfo) => {
        // Access worker index for parallel test distribution
        await use(workerInfo.workerIndex);
    }, { scope: 'worker' }],
});

// Solution 6: Export
export { test, testWithAuth, testWithData, testWithIndex };

