/**
 * Lab 517: Test Data Basics
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Understanding test data:
 * 
 * - Test data types
 * - Data sources
 * - Data organization
 * - Data isolation
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create test data
 * 2. Organize data
 * 3. Isolate test data
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Test Data Types
interface UserData {
    username: string;
    email: string;
    password: string;
    role: 'admin' | 'user' | 'guest';
}

interface ProductData {
    name: string;
    price: number;
    category: string;
    inStock: boolean;
}

interface OrderData {
    userId: string;
    products: { productId: string; quantity: number }[];
    total: number;
}

// Solution 2: Static Test Data
const testUsers: UserData[] = [
    {
        username: 'admin_user',
        email: 'admin@test.com',
        password: 'Admin123!',
        role: 'admin',
    },
    {
        username: 'regular_user',
        email: 'user@test.com',
        password: 'User123!',
        role: 'user',
    },
    {
        username: 'guest_user',
        email: 'guest@test.com',
        password: 'Guest123!',
        role: 'guest',
    },
];

const testProducts: ProductData[] = [
    { name: 'Laptop', price: 999.99, category: 'Electronics', inStock: true },
    { name: 'Mouse', price: 29.99, category: 'Electronics', inStock: true },
    { name: 'Keyboard', price: 79.99, category: 'Electronics', inStock: false },
];

// Solution 3: Data Access Functions
function getUserByRole(role: UserData['role']): UserData | undefined {
    return testUsers.find(user => user.role === role);
}

function getProductsByCategory(category: string): ProductData[] {
    return testProducts.filter(product => product.category === category);
}

function getInStockProducts(): ProductData[] {
    return testProducts.filter(product => product.inStock);
}

// Solution 4: Data Factory
class TestDataFactory {
    private static userCounter = 0;
    private static productCounter = 0;
    
    static createUser(overrides: Partial<UserData> = {}): UserData {
        this.userCounter++;
        return {
            username: `user_${this.userCounter}`,
            email: `user_${this.userCounter}@test.com`,
            password: 'Test123!',
            role: 'user',
            ...overrides,
        };
    }
    
    static createProduct(overrides: Partial<ProductData> = {}): ProductData {
        this.productCounter++;
        return {
            name: `Product ${this.productCounter}`,
            price: 9.99,
            category: 'General',
            inStock: true,
            ...overrides,
        };
    }
    
    static reset() {
        this.userCounter = 0;
        this.productCounter = 0;
    }
}

// Solution 5: Data Isolation
class IsolatedTestData {
    private testId: string;
    
    constructor() {
        this.testId = Math.random().toString(36).substring(7);
    }
    
    createUser(overrides: Partial<UserData> = {}): UserData {
        return {
            username: `user_${this.testId}`,
            email: `user_${this.testId}@test.com`,
            password: 'Test123!',
            role: 'user',
            ...overrides,
        };
    }
    
    getTestId(): string {
        return this.testId;
    }
}

// Solution 6: Data Constants
const TestConstants = {
    VALID_PASSWORD: 'ValidPass123!',
    INVALID_PASSWORD: 'short',
    VALID_EMAIL: 'valid@email.com',
    INVALID_EMAIL: 'invalid-email',
    MAX_USERNAME_LENGTH: 50,
    MIN_PASSWORD_LENGTH: 8,
};

// Solution 7: Export
export {
    UserData,
    ProductData,
    OrderData,
    testUsers,
    testProducts,
    getUserByRole,
    getProductsByCategory,
    getInStockProducts,
    TestDataFactory,
    IsolatedTestData,
    TestConstants,
};

