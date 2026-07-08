/**
 * Lab 117: Testing Async Code
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Testing async functions:
 * 
 * - Async test functions
 * - Mocking async operations
 * - Testing error cases
 * - Timing and timeouts
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Write async tests
 * 2. Mock async dependencies
 * 3. Test error handling
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Simple test framework
function describe(name, fn) {
    console.log(`\n${name}`);
    fn();
}

function it(name, fn) {
    return fn()
        .then(() => console.log(`  ✓ ${name}`))
        .catch(error => console.log(`  ✗ ${name}: ${error.message}`));
}

function expect(actual) {
    return {
        toBe(expected) {
            if (actual !== expected) {
                throw new Error(`Expected ${expected} but got ${actual}`);
            }
        },
        toEqual(expected) {
            if (JSON.stringify(actual) !== JSON.stringify(expected)) {
                throw new Error(`Expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`);
            }
        },
        toThrow() {
            // For sync functions
        },
        rejects: {
            async toThrow(ErrorType) {
                try {
                    await actual;
                    throw new Error("Expected promise to reject");
                } catch (error) {
                    if (ErrorType && !(error instanceof ErrorType)) {
                        throw new Error(`Expected ${ErrorType.name} but got ${error.constructor.name}`);
                    }
                }
            }
        }
    };
}

// Helper
const delay = (ms, value) => new Promise(r => setTimeout(() => r(value), ms));

// Code to test
class UserService {
    constructor(api) {
        this.api = api;
    }
    
    async getUser(id) {
        const user = await this.api.fetchUser(id);
        return user;
    }
    
    async createUser(data) {
        if (!data.email) {
            throw new Error("Email required");
        }
        return this.api.createUser(data);
    }
}

// Solution 1: Basic Async Test
describe("Basic Async Tests", () => {
    it("should resolve with value", async () => {
        const result = await delay(10, "hello");
        expect(result).toBe("hello");
    });
    
    it("should handle async operations", async () => {
        const values = await Promise.all([
            delay(10, 1),
            delay(10, 2),
            delay(10, 3)
        ]);
        expect(values).toEqual([1, 2, 3]);
    });
});

// Solution 2: Mocking Async Dependencies
describe("Mocking Async Dependencies", () => {
    it("should fetch user with mocked API", async () => {
        const mockApi = {
            fetchUser: async (id) => ({ id, name: "John" })
        };
        
        const service = new UserService(mockApi);
        const user = await service.getUser(1);
        
        expect(user.name).toBe("John");
    });
    
    it("should create user with mocked API", async () => {
        const mockApi = {
            createUser: async (data) => ({ id: 1, ...data })
        };
        
        const service = new UserService(mockApi);
        const user = await service.createUser({ email: "test@test.com" });
        
        expect(user.email).toBe("test@test.com");
    });
});

// Solution 3: Testing Errors
describe("Testing Async Errors", () => {
    it("should throw on missing email", async () => {
        const mockApi = { createUser: async () => ({}) };
        const service = new UserService(mockApi);
        
        await expect(service.createUser({})).rejects.toThrow(Error);
    });
    
    it("should handle API errors", async () => {
        const mockApi = {
            fetchUser: async () => { throw new Error("Network error"); }
        };
        
        const service = new UserService(mockApi);
        
        await expect(service.getUser(1)).rejects.toThrow(Error);
    });
});

// Solution 4: Testing with Delays
describe("Testing with Timing", () => {
    it("should complete within timeout", async () => {
        const start = Date.now();
        await delay(50, "done");
        const elapsed = Date.now() - start;
        
        if (elapsed > 100) {
            throw new Error("Took too long");
        }
    });
});

// Solution 5: Spy on Async Calls
describe("Spying on Async Calls", () => {
    it("should track API calls", async () => {
        const calls = [];
        
        const mockApi = {
            fetchUser: async (id) => {
                calls.push({ method: "fetchUser", args: [id] });
                return { id, name: "John" };
            }
        };
        
        const service = new UserService(mockApi);
        await service.getUser(1);
        await service.getUser(2);
        
        expect(calls.length).toBe(2);
        expect(calls[0].args[0]).toBe(1);
    });
});

// Solution 6: Testing Parallel Operations
describe("Testing Parallel Operations", () => {
    it("should fetch multiple users in parallel", async () => {
        const mockApi = {
            fetchUser: async (id) => delay(20, { id, name: `User ${id}` })
        };
        
        const service = new UserService(mockApi);
        
        const start = Date.now();
        const users = await Promise.all([
            service.getUser(1),
            service.getUser(2),
            service.getUser(3)
        ]);
        const elapsed = Date.now() - start;
        
        expect(users.length).toBe(3);
        // Should be parallel, not sequential
        if (elapsed > 50) {
            throw new Error("Operations were not parallel");
        }
    });
});

// Solution 7: Testing Retry Logic
describe("Testing Retry Logic", () => {
    it("should retry on failure", async () => {
        let attempts = 0;
        
        const mockApi = {
            fetchUser: async () => {
                attempts++;
                if (attempts < 3) throw new Error("Temporary failure");
                return { id: 1, name: "John" };
            }
        };
        
        async function fetchWithRetry(api, id, retries = 3) {
            for (let i = 0; i < retries; i++) {
                try {
                    return await api.fetchUser(id);
                } catch (error) {
                    if (i === retries - 1) throw error;
                }
            }
        }
        
        const user = await fetchWithRetry(mockApi, 1);
        expect(user.name).toBe("John");
        expect(attempts).toBe(3);
    });
});

