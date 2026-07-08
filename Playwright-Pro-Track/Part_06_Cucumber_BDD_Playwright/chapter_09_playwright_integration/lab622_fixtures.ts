/**
 * Lab 622: Playwright Fixtures with Cucumber
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Using fixtures pattern:
 * 
 * - Test fixtures
 * - Data fixtures
 * - State fixtures
 * - Cleanup
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create fixtures
 * 2. Use in tests
 * 3. Handle cleanup
 *
 * =====================
 * SOLUTION:
 * =====================
 */

import { Before, After } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page } from '@playwright/test';

// Solution 1: User Fixture
interface UserFixture {
    email: string;
    password: string;
    name: string;
    role: string;
}

const userFixtures: Record<string, UserFixture> = {
    admin: {
        email: 'admin@test.com',
        password: 'AdminPass123!',
        name: 'Admin User',
        role: 'admin',
    },
    editor: {
        email: 'editor@test.com',
        password: 'EditorPass123!',
        name: 'Editor User',
        role: 'editor',
    },
    viewer: {
        email: 'viewer@test.com',
        password: 'ViewerPass123!',
        name: 'Viewer User',
        role: 'viewer',
    },
};

function getUserFixture(userType: string): UserFixture {
    const fixture = userFixtures[userType];
    if (!fixture) {
        throw new Error(`Unknown user type: ${userType}`);
    }
    return fixture;
}

// Solution 2: Product Fixture
interface ProductFixture {
    name: string;
    price: number;
    category: string;
    inStock: boolean;
}

const productFixtures: ProductFixture[] = [
    { name: 'Laptop', price: 999.99, category: 'Electronics', inStock: true },
    { name: 'Mouse', price: 29.99, category: 'Electronics', inStock: true },
    { name: 'Keyboard', price: 79.99, category: 'Electronics', inStock: false },
    { name: 'Monitor', price: 299.99, category: 'Electronics', inStock: true },
];

function getProductFixtures(): ProductFixture[] {
    return [...productFixtures];
}

// Solution 3: Authentication State Fixture
async function createAuthenticatedContext(
    browser: Browser,
    userType: string
): Promise<BrowserContext> {
    const user = getUserFixture(userType);
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // Perform login
    await page.goto('/login');
    await page.fill('#email', user.email);
    await page.fill('#password', user.password);
    await page.click('#login-btn');
    await page.waitForURL('**/dashboard');
    
    // Save storage state
    await context.storageState({ path: `.auth/${userType}.json` });
    
    await page.close();
    return context;
}

// Solution 4: Fixture Manager
class FixtureManager {
    private createdResources: Array<{ type: string; id: string }> = [];
    private page: Page;
    
    constructor(page: Page) {
        this.page = page;
    }
    
    async createUser(userData: Partial<UserFixture>): Promise<string> {
        const response = await this.page.request.post('/api/users', {
            data: userData,
        });
        const user = await response.json();
        this.createdResources.push({ type: 'user', id: user.id });
        return user.id;
    }
    
    async createProduct(productData: Partial<ProductFixture>): Promise<string> {
        const response = await this.page.request.post('/api/products', {
            data: productData,
        });
        const product = await response.json();
        this.createdResources.push({ type: 'product', id: product.id });
        return product.id;
    }
    
    async cleanup(): Promise<void> {
        for (const resource of this.createdResources.reverse()) {
            try {
                await this.page.request.delete(`/api/${resource.type}s/${resource.id}`);
            } catch (error) {
                console.error(`Failed to cleanup ${resource.type} ${resource.id}`);
            }
        }
        this.createdResources = [];
    }
}

// Solution 5: Before Hook with Fixtures
Before({ tags: '@authenticated' }, async function () {
    const userType = this.parameters?.userType || 'viewer';
    const user = getUserFixture(userType);
    
    // Login
    await this.page.goto('/login');
    await this.page.fill('#email', user.email);
    await this.page.fill('#password', user.password);
    await this.page.click('#login-btn');
    await this.page.waitForURL('**/dashboard');
    
    this.currentUser = user;
});

// Solution 6: Before Hook with Fixture Manager
Before(async function () {
    this.fixtureManager = new FixtureManager(this.page);
});

// Solution 7: After Hook for Cleanup
After(async function () {
    if (this.fixtureManager) {
        await this.fixtureManager.cleanup();
    }
});

// Solution 8: Export
export {
    UserFixture,
    ProductFixture,
    getUserFixture,
    getProductFixtures,
    createAuthenticatedContext,
    FixtureManager,
};

