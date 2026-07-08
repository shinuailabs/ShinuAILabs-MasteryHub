/**
 * Lab 524: API Data Setup
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Setting up test data via API:
 * 
 * - API data creation
 * - Data seeding
 * - Cleanup strategies
 * - Transaction rollback
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create data via API
 * 2. Seed test data
 * 3. Implement cleanup
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { APIRequestContext } from '@playwright/test';

// Solution 1: API Data Manager
class APIDataManager {
    private createdResources: { type: string; id: string }[] = [];
    
    constructor(private request: APIRequestContext, private baseUrl: string) {}
    
    async createUser(data: { username: string; email: string; password: string }) {
        const response = await this.request.post(`${this.baseUrl}/api/users`, { data });
        const user = await response.json();
        this.createdResources.push({ type: 'user', id: user.id });
        return user;
    }
    
    async createProduct(data: { name: string; price: number }) {
        const response = await this.request.post(`${this.baseUrl}/api/products`, { data });
        const product = await response.json();
        this.createdResources.push({ type: 'product', id: product.id });
        return product;
    }
    
    async createOrder(data: { userId: string; items: { productId: string; quantity: number }[] }) {
        const response = await this.request.post(`${this.baseUrl}/api/orders`, { data });
        const order = await response.json();
        this.createdResources.push({ type: 'order', id: order.id });
        return order;
    }
    
    async cleanup() {
        // Delete in reverse order (orders first, then products, then users)
        const reversed = [...this.createdResources].reverse();
        
        for (const resource of reversed) {
            await this.request.delete(`${this.baseUrl}/api/${resource.type}s/${resource.id}`);
        }
        
        this.createdResources = [];
    }
}

// Solution 2: Data Seeder
class TestDataSeeder {
    constructor(private apiManager: APIDataManager) {}
    
    async seedBasicData() {
        const user = await this.apiManager.createUser({
            username: 'test_user',
            email: 'test@example.com',
            password: 'Test123!',
        });
        
        const product = await this.apiManager.createProduct({
            name: 'Test Product',
            price: 29.99,
        });
        
        return { user, product };
    }
    
    async seedEcommerceData() {
        const user = await this.apiManager.createUser({
            username: 'shopper',
            email: 'shopper@example.com',
            password: 'Shop123!',
        });
        
        const products = await Promise.all([
            this.apiManager.createProduct({ name: 'Laptop', price: 999.99 }),
            this.apiManager.createProduct({ name: 'Mouse', price: 29.99 }),
            this.apiManager.createProduct({ name: 'Keyboard', price: 79.99 }),
        ]);
        
        const order = await this.apiManager.createOrder({
            userId: user.id,
            items: products.map(p => ({ productId: p.id, quantity: 1 })),
        });
        
        return { user, products, order };
    }
}

// Solution 3: Bulk Data Creator
class BulkDataCreator {
    constructor(private request: APIRequestContext, private baseUrl: string) {}
    
    async createUsers(count: number) {
        const users = Array.from({ length: count }, (_, i) => ({
            username: `user_${i}`,
            email: `user_${i}@test.com`,
            password: 'Test123!',
        }));
        
        const response = await this.request.post(`${this.baseUrl}/api/users/bulk`, {
            data: { users },
        });
        
        return await response.json();
    }
    
    async createProducts(count: number) {
        const products = Array.from({ length: count }, (_, i) => ({
            name: `Product ${i}`,
            price: Math.random() * 100,
        }));
        
        const response = await this.request.post(`${this.baseUrl}/api/products/bulk`, {
            data: { products },
        });
        
        return await response.json();
    }
}

// Solution 4: Database Reset Helper
class DatabaseResetHelper {
    constructor(private request: APIRequestContext, private baseUrl: string) {}
    
    async resetDatabase() {
        await this.request.post(`${this.baseUrl}/api/test/reset`);
    }
    
    async seedDatabase(seedName: string) {
        await this.request.post(`${this.baseUrl}/api/test/seed/${seedName}`);
    }
    
    async createSnapshot(name: string) {
        await this.request.post(`${this.baseUrl}/api/test/snapshot`, {
            data: { name },
        });
    }
    
    async restoreSnapshot(name: string) {
        await this.request.post(`${this.baseUrl}/api/test/restore`, {
            data: { name },
        });
    }
}

// Solution 5: Transaction-Based Setup
class TransactionSetup {
    private transactionId: string | null = null;
    
    constructor(private request: APIRequestContext, private baseUrl: string) {}
    
    async beginTransaction() {
        const response = await this.request.post(`${this.baseUrl}/api/test/transaction/begin`);
        const { transactionId } = await response.json();
        this.transactionId = transactionId;
    }
    
    async rollbackTransaction() {
        if (this.transactionId) {
            await this.request.post(`${this.baseUrl}/api/test/transaction/rollback`, {
                data: { transactionId: this.transactionId },
            });
            this.transactionId = null;
        }
    }
}

// Solution 6: Export
export {
    APIDataManager,
    TestDataSeeder,
    BulkDataCreator,
    DatabaseResetHelper,
    TransactionSetup,
};

