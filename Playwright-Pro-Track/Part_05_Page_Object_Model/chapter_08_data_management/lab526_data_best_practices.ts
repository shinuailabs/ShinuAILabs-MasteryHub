/**
 * Lab 526: Data Best Practices
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Best practices for test data:
 * 
 * - Data isolation
 * - Deterministic data
 * - Data organization
 * - Performance
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Apply data best practices
 * 2. Ensure isolation
 * 3. Optimize performance
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Data Isolation - Unique Identifiers
class IsolatedDataFactory {
    private testId: string;
    
    constructor() {
        // Unique per test run
        this.testId = `${Date.now()}_${Math.random().toString(36).substring(7)}`;
    }
    
    createUser() {
        return {
            username: `user_${this.testId}`,
            email: `user_${this.testId}@test.com`,
            password: 'Test123!',
        };
    }
    
    createProduct() {
        return {
            name: `Product_${this.testId}`,
            sku: `SKU_${this.testId}`,
            price: 29.99,
        };
    }
    
    getTestId(): string {
        return this.testId;
    }
}

// Solution 2: Deterministic Data - Seeded Random
class SeededRandom {
    private seed: number;
    
    constructor(seed: number) {
        this.seed = seed;
    }
    
    next(): number {
        this.seed = (this.seed * 1103515245 + 12345) & 0x7fffffff;
        return this.seed / 0x7fffffff;
    }
    
    nextInt(min: number, max: number): number {
        return Math.floor(this.next() * (max - min + 1)) + min;
    }
    
    nextElement<T>(array: T[]): T {
        return array[this.nextInt(0, array.length - 1)];
    }
}

class DeterministicDataFactory {
    private random: SeededRandom;
    
    constructor(seed: number = 12345) {
        this.random = new SeededRandom(seed);
    }
    
    createUser(index: number) {
        return {
            username: `user_${index}`,
            email: `user_${index}@test.com`,
            age: this.random.nextInt(18, 65),
        };
    }
}

// Solution 3: Data Organization - Centralized Repository
class TestDataRepository {
    private static instance: TestDataRepository;
    private data: Map<string, unknown> = new Map();
    
    private constructor() {}
    
    static getInstance(): TestDataRepository {
        if (!this.instance) {
            this.instance = new TestDataRepository();
        }
        return this.instance;
    }
    
    set<T>(key: string, value: T): void {
        this.data.set(key, value);
    }
    
    get<T>(key: string): T | undefined {
        return this.data.get(key) as T | undefined;
    }
    
    clear(): void {
        this.data.clear();
    }
}

// Solution 4: Lazy Loading Data
class LazyDataLoader<T> {
    private data: T | null = null;
    private loadFn: () => Promise<T>;
    
    constructor(loadFn: () => Promise<T>) {
        this.loadFn = loadFn;
    }
    
    async get(): Promise<T> {
        if (this.data === null) {
            this.data = await this.loadFn();
        }
        return this.data;
    }
    
    invalidate(): void {
        this.data = null;
    }
}

// Solution 5: Data Caching
class DataCache {
    private cache: Map<string, { data: unknown; expiry: number }> = new Map();
    
    set<T>(key: string, data: T, ttlMs: number = 60000): void {
        this.cache.set(key, {
            data,
            expiry: Date.now() + ttlMs,
        });
    }
    
    get<T>(key: string): T | undefined {
        const entry = this.cache.get(key);
        if (!entry) return undefined;
        
        if (Date.now() > entry.expiry) {
            this.cache.delete(key);
            return undefined;
        }
        
        return entry.data as T;
    }
    
    clear(): void {
        this.cache.clear();
    }
}

// Solution 6: Best Practices Summary
/*
 * Test Data Best Practices:
 * 
 * DO:
 * - Use unique identifiers per test
 * - Use deterministic data when possible
 * - Centralize data management
 * - Clean up after tests
 * - Use lazy loading for expensive data
 * - Cache frequently used data
 * 
 * DON'T:
 * - Share mutable data between tests
 * - Use random data without seeds
 * - Hardcode test data in tests
 * - Leave test data in database
 * - Load all data upfront
 */

// Solution 7: Complete Example
class BestPracticeDataManager {
    private factory: IsolatedDataFactory;
    private cache: DataCache;
    private repository: TestDataRepository;
    
    constructor() {
        this.factory = new IsolatedDataFactory();
        this.cache = new DataCache();
        this.repository = TestDataRepository.getInstance();
    }
    
    async getOrCreateUser() {
        const cacheKey = `user_${this.factory.getTestId()}`;
        let user = this.cache.get(cacheKey);
        
        if (!user) {
            user = this.factory.createUser();
            this.cache.set(cacheKey, user);
        }
        
        return user;
    }
    
    cleanup() {
        this.cache.clear();
        this.repository.clear();
    }
}

// Solution 8: Export
export {
    IsolatedDataFactory,
    SeededRandom,
    DeterministicDataFactory,
    TestDataRepository,
    LazyDataLoader,
    DataCache,
    BestPracticeDataManager,
};

