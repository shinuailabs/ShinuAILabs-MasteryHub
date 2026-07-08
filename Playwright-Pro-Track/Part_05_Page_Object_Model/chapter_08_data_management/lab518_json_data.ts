/**
 * Lab 518: JSON Data
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Working with JSON test data:
 * 
 * - Loading JSON files
 * - JSON structure
 * - Type safety
 * - Data validation
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Load JSON data
 * 2. Type JSON data
 * 3. Validate data
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import * as fs from 'fs';
import * as path from 'path';

// Solution 1: Data Types
interface User {
    id: string;
    username: string;
    email: string;
    password: string;
}

interface TestDataSet {
    users: User[];
    products: { id: string; name: string; price: number }[];
    settings: { baseUrl: string; timeout: number };
}

// Solution 2: JSON Loader
class JSONDataLoader {
    private basePath: string;
    
    constructor(basePath: string = './test-data') {
        this.basePath = basePath;
    }
    
    load<T>(filename: string): T {
        const filePath = path.join(this.basePath, filename);
        const content = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(content) as T;
    }
    
    loadSync<T>(filename: string): T {
        return this.load<T>(filename);
    }
    
    async loadAsync<T>(filename: string): Promise<T> {
        const filePath = path.join(this.basePath, filename);
        const content = await fs.promises.readFile(filePath, 'utf-8');
        return JSON.parse(content) as T;
    }
}

// Solution 3: Typed Data Loader
class TypedDataLoader {
    private loader: JSONDataLoader;
    
    constructor(basePath?: string) {
        this.loader = new JSONDataLoader(basePath);
    }
    
    loadUsers(): User[] {
        return this.loader.load<User[]>('users.json');
    }
    
    loadTestData(): TestDataSet {
        return this.loader.load<TestDataSet>('test-data.json');
    }
    
    loadEnvironmentData(env: string): TestDataSet {
        return this.loader.load<TestDataSet>(`${env}-data.json`);
    }
}

// Solution 4: Data Validator
class DataValidator {
    static validateUser(user: unknown): user is User {
        if (typeof user !== 'object' || user === null) return false;
        const u = user as Record<string, unknown>;
        return (
            typeof u.id === 'string' &&
            typeof u.username === 'string' &&
            typeof u.email === 'string' &&
            typeof u.password === 'string'
        );
    }
    
    static validateUsers(data: unknown): User[] {
        if (!Array.isArray(data)) {
            throw new Error('Expected array of users');
        }
        
        for (const item of data) {
            if (!this.validateUser(item)) {
                throw new Error('Invalid user data');
            }
        }
        
        return data as User[];
    }
}

// Solution 5: Safe JSON Loader
class SafeJSONLoader {
    static loadAndValidate<T>(
        filePath: string,
        validator: (data: unknown) => T
    ): T {
        const content = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(content);
        return validator(data);
    }
}

// Solution 6: JSON Data Manager
class JSONDataManager {
    private cache: Map<string, unknown> = new Map();
    private loader: JSONDataLoader;
    
    constructor(basePath?: string) {
        this.loader = new JSONDataLoader(basePath);
    }
    
    get<T>(filename: string): T {
        if (!this.cache.has(filename)) {
            this.cache.set(filename, this.loader.load<T>(filename));
        }
        return this.cache.get(filename) as T;
    }
    
    clearCache() {
        this.cache.clear();
    }
    
    reload<T>(filename: string): T {
        this.cache.delete(filename);
        return this.get<T>(filename);
    }
}

// Solution 7: Sample JSON Structure
/*
 * users.json:
 * [
 *   { "id": "1", "username": "admin", "email": "admin@test.com", "password": "admin123" },
 *   { "id": "2", "username": "user", "email": "user@test.com", "password": "user123" }
 * ]
 * 
 * test-data.json:
 * {
 *   "users": [...],
 *   "products": [...],
 *   "settings": { "baseUrl": "https://example.com", "timeout": 30000 }
 * }
 */

// Solution 8: Export
export {
    User,
    TestDataSet,
    JSONDataLoader,
    TypedDataLoader,
    DataValidator,
    SafeJSONLoader,
    JSONDataManager,
};

