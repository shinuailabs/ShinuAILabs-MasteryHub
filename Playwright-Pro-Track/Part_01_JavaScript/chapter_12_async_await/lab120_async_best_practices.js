/**
 * Lab 120: Async/Await Best Practices
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Best practices for async/await:
 * 
 * 1. Always handle errors
 * 2. Use parallel when possible
 * 3. Avoid async in constructors
 * 4. Don't mix callbacks and async
 * 5. Use proper cleanup
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Apply best practices
 * 2. Refactor anti-patterns
 * 3. Write clean async code
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Helper
const delay = (ms, value) => new Promise(r => setTimeout(() => r(value), ms));

// Best Practice 1: Always Handle Errors
console.log("--- Always Handle Errors ---");

// BAD: Unhandled rejection
// async function bad() {
//     await Promise.reject(new Error("Oops"));
// }
// bad();

// GOOD: Try/catch
async function good() {
    try {
        await Promise.reject(new Error("Oops"));
    } catch (error) {
        console.log("Handled:", error.message);
    }
}
good();

// Best Practice 2: Parallel When Possible
console.log("\n--- Parallel When Possible ---");

// BAD: Sequential when parallel is possible
async function badSequential() {
    const a = await delay(50, "A");
    const b = await delay(50, "B"); // Waits unnecessarily
    return [a, b];
}

// GOOD: Parallel execution
async function goodParallel() {
    const [a, b] = await Promise.all([
        delay(50, "A"),
        delay(50, "B")
    ]);
    return [a, b];
}

// Best Practice 3: Avoid Async Constructors
console.log("\n--- Avoid Async Constructors ---");

// BAD: Async constructor (doesn't work as expected)
// class BadClass {
//     constructor() {
//         this.data = await fetchData(); // SyntaxError!
//     }
// }

// GOOD: Factory pattern
class GoodClass {
    constructor(data) {
        this.data = data;
    }
    
    static async create() {
        const data = await delay(50, { initialized: true });
        return new GoodClass(data);
    }
}

GoodClass.create().then(instance => console.log("Factory:", instance.data));

// Best Practice 4: Don't Mix Callbacks and Async
console.log("\n--- Don't Mix Styles ---");

// BAD: Mixing callbacks and async
// function badMix(callback) {
//     fetchData().then(data => callback(null, data));
// }

// GOOD: Stick to async/await
async function goodStyle() {
    return await delay(50, "data");
}

// Best Practice 5: Use finally for Cleanup
console.log("\n--- Use finally ---");

async function withCleanup() {
    let resource = "acquired";
    
    try {
        await delay(50);
        return "success";
    } catch (error) {
        return "error";
    } finally {
        resource = null;
        console.log("Cleanup done");
    }
}

withCleanup();

// Best Practice 6: Avoid Async in forEach
console.log("\n--- Avoid Async forEach ---");

// BAD: forEach doesn't wait
async function badForEach() {
    const items = [1, 2, 3];
    items.forEach(async (item) => {
        await delay(10);
        // These run in parallel, not sequence!
    });
}

// GOOD: Use for...of
async function goodForOf() {
    const items = [1, 2, 3];
    for (const item of items) {
        await delay(10);
        console.log("Sequential:", item);
    }
}

goodForOf();

// Best Practice 7: Return Await in Try/Catch
console.log("\n--- Return Await in Try/Catch ---");

// BAD: return without await loses error context
async function badReturn() {
    try {
        return delay(50).then(() => { throw new Error("Oops"); });
    } catch (error) {
        console.log("Won't catch this!");
    }
}

// GOOD: return await to catch errors
async function goodReturn() {
    try {
        return await delay(50).then(() => { throw new Error("Oops"); });
    } catch (error) {
        console.log("Caught:", error.message);
        return "default";
    }
}

goodReturn();

// Best Practice 8: Use AbortController for Cancellation
console.log("\n--- Use AbortController ---");

async function cancellableOperation(signal) {
    for (let i = 0; i < 5; i++) {
        if (signal?.aborted) {
            throw new Error("Aborted");
        }
        await delay(50);
        console.log(`Step ${i + 1}`);
    }
}

const controller = new AbortController();
setTimeout(() => controller.abort(), 120);

cancellableOperation(controller.signal)
    .catch(error => console.log("Operation:", error.message));

// Best Practice 9: Proper Error Types
console.log("\n--- Proper Error Types ---");

class NetworkError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = "NetworkError";
        this.statusCode = statusCode;
    }
}

async function fetchWithProperErrors() {
    try {
        throw new NetworkError("Not found", 404);
    } catch (error) {
        if (error instanceof NetworkError) {
            console.log(`Network error ${error.statusCode}: ${error.message}`);
        } else {
            throw error;
        }
    }
}

fetchWithProperErrors();

// Best Practice 10: Document Async Functions
console.log("\n--- Document Functions ---");

/**
 * Fetches user data with retry logic
 * @param {number} userId - The user ID to fetch
 * @param {Object} options - Fetch options
 * @param {number} options.retries - Number of retries (default: 3)
 * @param {number} options.timeout - Timeout in ms (default: 5000)
 * @returns {Promise<User>} The user object
 * @throws {NetworkError} If all retries fail
 */
async function fetchUser(userId, options = {}) {
    const { retries = 3, timeout = 5000 } = options;
    // Implementation
    return delay(50, { id: userId, name: "John" });
}

fetchUser(1).then(user => console.log("Documented function:", user));

// Summary
console.log("\n--- Summary ---");
console.log(`
Async/Await Best Practices:
1. Always handle errors with try/catch
2. Use Promise.all for parallel operations
3. Use factory pattern instead of async constructors
4. Don't mix callbacks and async/await
5. Use finally for cleanup
6. Avoid async in forEach - use for...of
7. Use return await in try/catch blocks
8. Use AbortController for cancellation
9. Create proper error types
10. Document async functions properly
`);

