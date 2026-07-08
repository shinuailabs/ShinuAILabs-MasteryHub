/**
 * Lab 631: Test Data Management Best Practices
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Managing test data effectively:
 * 
 * - Data isolation
 * - Fixtures
 * - Dynamic data
 * - Cleanup strategies
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create data fixtures
 * 2. Generate dynamic data
 * 3. Implement cleanup
 *
 * =====================
 * SOLUTION:
 * =====================
 */

import { Given, After } from '@cucumber/cucumber';
import * as fs from 'fs';
import * as path from 'path';

/*
 * Best Practice 1: Use Fixture Files
 */
interface UserFixture {
    email: string;
    password: string;
    name: string;
    role: string;
}

function loadFixtures<T>(filename: string): T {
    const filepath = path.join(__dirname, '..', 'fixtures', filename);
    const content = fs.readFileSync(filepath, 'utf-8');
    return JSON.parse(content);
}

// Usage
Given('I have a {word} user', async function (userType: string) {
    const users = loadFixtures<Record<string, UserFixture>>('users.json');
    this.currentUser = users[userType];
});

/*
 * Best Practice 2: Generate Unique Data
 */
function generateUniqueEmail(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    return `test_${timestamp}_${random}@example.com`;
}

function generateUniqueUsername(): string {
    const timestamp = Date.now();
    return `user_${timestamp}`;
}

Given('I have a unique user', async function () {
    this.currentUser = {
        email: generateUniqueEmail(),
        password: 'TestPass123!',
        name: `Test User ${Date.now()}`,
    };
});

/*
 * Best Practice 3: Data Builder Pattern
 */
class UserBuilder {
    private user: Partial<UserFixture> = {};
    
    withEmail(email: string): UserBuilder {
        this.user.email = email;
        return this;
    }
    
    withPassword(password: string): UserBuilder {
        this.user.password = password;
        return this;
    }
    
    withName(name: string): UserBuilder {
        this.user.name = name;
        return this;
    }
    
    withRole(role: string): UserBuilder {
        this.user.role = role;
        return this;
    }
    
    build(): UserFixture {
        return {
            email: this.user.email || generateUniqueEmail(),
            password: this.user.password || 'DefaultPass123!',
            name: this.user.name || 'Test User',
            role: this.user.role || 'user',
        };
    }
}

Given('I have a user with role {string}', async function (role: string) {
    this.currentUser = new UserBuilder()
        .withRole(role)
        .build();
});

/*
 * Best Practice 4: Test Data Registry
 */
class TestDataRegistry {
    private createdItems: Array<{ type: string; id: string; cleanup: () => Promise<void> }> = [];
    
    register(type: string, id: string, cleanup: () => Promise<void>): void {
        this.createdItems.push({ type, id, cleanup });
    }
    
    async cleanupAll(): Promise<void> {
        // Clean up in reverse order (LIFO)
        for (const item of this.createdItems.reverse()) {
            try {
                await item.cleanup();
                console.log(`Cleaned up ${item.type}: ${item.id}`);
            } catch (error) {
                console.error(`Failed to cleanup ${item.type}: ${item.id}`, error);
            }
        }
        this.createdItems = [];
    }
}

// Usage in hooks
Given('I create a test user via API', async function () {
    this.dataRegistry = this.dataRegistry || new TestDataRegistry();
    
    const userData = new UserBuilder().build();
    const response = await this.page.request.post('/api/users', { data: userData });
    const user = await response.json();
    
    this.dataRegistry.register('user', user.id, async () => {
        await this.page.request.delete(`/api/users/${user.id}`);
    });
    
    this.createdUser = user;
});

After(async function () {
    if (this.dataRegistry) {
        await this.dataRegistry.cleanupAll();
    }
});

/*
 * Best Practice 5: Environment-Specific Data
 */
function getTestData(key: string): any {
    const env = process.env.TEST_ENV || 'local';
    const dataFile = `test-data.${env}.json`;
    const data = loadFixtures<Record<string, any>>(dataFile);
    return data[key];
}

/*
 * Best Practice 6: Sensitive Data Handling
 */
function getCredentials(userType: string): { email: string; password: string } {
    // Load from environment variables for sensitive data
    const envKey = `TEST_USER_${userType.toUpperCase()}`;
    const envPassword = `TEST_PASSWORD_${userType.toUpperCase()}`;
    
    return {
        email: process.env[envKey] || `${userType}@test.com`,
        password: process.env[envPassword] || 'defaultPassword',
    };
}

/*
 * Best Practice 7: Data Seeding
 */
async function seedTestData(page: any): Promise<void> {
    const seedData = loadFixtures<any>('seed-data.json');
    
    for (const user of seedData.users) {
        await page.request.post('/api/users', { data: user });
    }
    
    for (const product of seedData.products) {
        await page.request.post('/api/products', { data: product });
    }
}

// Export
export {
    UserBuilder,
    TestDataRegistry,
    generateUniqueEmail,
    generateUniqueUsername,
    loadFixtures,
    getTestData,
    getCredentials,
    seedTestData,
};

