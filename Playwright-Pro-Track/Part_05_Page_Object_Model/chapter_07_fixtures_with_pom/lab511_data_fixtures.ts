/**
 * Lab 511: Data Fixtures
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Creating data fixtures:
 * 
 * - Test data fixtures
 * - Data generation
 * - Data cleanup
 * - Shared data
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create data fixtures
 * 2. Generate test data
 * 3. Handle cleanup
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test as base, Page } from '@playwright/test';

// Solution 1: Test Data Types
interface User {
    id: string;
    username: string;
    email: string;
    password: string;
}

interface Product {
    id: string;
    name: string;
    price: number;
}

// Solution 2: Data Generator
class TestDataGenerator {
    static generateUser(): User {
        const id = Math.random().toString(36).substring(7);
        return {
            id,
            username: `user_${id}`,
            email: `user_${id}@test.com`,
            password: 'Test123!',
        };
    }
    
    static generateProduct(): Product {
        const id = Math.random().toString(36).substring(7);
        return {
            id,
            name: `Product ${id}`,
            price: Math.floor(Math.random() * 100) + 1,
        };
    }
}

// Solution 3: Data Fixtures
type DataFixtures = {
    testUser: User;
    testProduct: Product;
    testDataGenerator: typeof TestDataGenerator;
};

const test = base.extend<DataFixtures>({
    testUser: async ({}, use) => {
        const user = TestDataGenerator.generateUser();
        await use(user);
    },
    
    testProduct: async ({}, use) => {
        const product = TestDataGenerator.generateProduct();
        await use(product);
    },
    
    testDataGenerator: async ({}, use) => {
        await use(TestDataGenerator);
    },
});

// Solution 4: Data with API Setup
type APIDataFixtures = {
    createdUser: User;
    createdProduct: Product;
};

const testWithAPI = base.extend<APIDataFixtures>({
    createdUser: async ({ request }, use) => {
        // Create user via API
        const user = TestDataGenerator.generateUser();
        const response = await request.post('/api/users', { data: user });
        const createdUser = await response.json();
        
        await use(createdUser);
        
        // Cleanup: Delete user
        await request.delete(`/api/users/${createdUser.id}`);
    },
    
    createdProduct: async ({ request }, use) => {
        // Create product via API
        const product = TestDataGenerator.generateProduct();
        const response = await request.post('/api/products', { data: product });
        const createdProduct = await response.json();
        
        await use(createdProduct);
        
        // Cleanup: Delete product
        await request.delete(`/api/products/${createdProduct.id}`);
    },
});

// Solution 5: Shared Data Fixture (Worker Scope)
type WorkerDataFixtures = {
    sharedUser: User;
};

const testWithShared = base.extend<{}, WorkerDataFixtures>({
    sharedUser: [async ({ }, use) => {
        // Created once per worker
        const user = TestDataGenerator.generateUser();
        await use(user);
    }, { scope: 'worker' }],
});

// Solution 6: Data Provider Fixture
type DataProviderFixtures = {
    userData: (count: number) => User[];
    productData: (count: number) => Product[];
};

const testWithProvider = base.extend<DataProviderFixtures>({
    userData: async ({}, use) => {
        const generator = (count: number) => {
            return Array.from({ length: count }, () => TestDataGenerator.generateUser());
        };
        await use(generator);
    },
    
    productData: async ({}, use) => {
        const generator = (count: number) => {
            return Array.from({ length: count }, () => TestDataGenerator.generateProduct());
        };
        await use(generator);
    },
});

// Solution 7: Export
export { test, testWithAPI, testWithShared, testWithProvider };
export { TestDataGenerator, User, Product };

