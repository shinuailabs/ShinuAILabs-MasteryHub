/**
 * Lab 112: Async/Await Error Handling
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Error handling with async/await:
 * 
 * - try/catch blocks
 * - Multiple catch blocks
 * - Error propagation
 * - finally for cleanup
 * - Handling multiple errors
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Use try/catch with async
 * 2. Handle specific error types
 * 3. Implement cleanup logic
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Helper functions
function delay(ms, value) {
    return new Promise(resolve => setTimeout(() => resolve(value), ms));
}

function failingOperation(shouldFail = true) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (shouldFail) reject(new Error("Operation failed"));
            else resolve("Success");
        }, 50);
    });
}

// Solution 1: Basic Try/Catch
console.log("--- Basic Try/Catch ---");

async function basicErrorHandling() {
    try {
        const result = await failingOperation(true);
        console.log("Result:", result);
    } catch (error) {
        console.log("Caught error:", error.message);
    }
}

basicErrorHandling();

// Solution 2: Try/Catch/Finally
console.log("\n--- Try/Catch/Finally ---");

async function withFinally() {
    let connection = null;
    
    try {
        connection = "Connected";
        console.log(connection);
        
        const data = await failingOperation(true);
        return data;
    } catch (error) {
        console.log("Error:", error.message);
        return null;
    } finally {
        connection = null;
        console.log("Connection closed");
    }
}

withFinally();

// Solution 3: Multiple Operations
console.log("\n--- Multiple Operations ---");

async function multipleOperations() {
    try {
        const first = await delay(50, "First");
        console.log(first);
        
        const second = await failingOperation(true); // This fails
        console.log(second);
        
        const third = await delay(50, "Third"); // Never reached
        console.log(third);
    } catch (error) {
        console.log("Caught at:", error.message);
    }
}

multipleOperations();

// Solution 4: Specific Error Types
console.log("\n--- Specific Error Types ---");

class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = "ValidationError";
    }
}

class NetworkError extends Error {
    constructor(message) {
        super(message);
        this.name = "NetworkError";
    }
}

async function handleSpecificErrors() {
    try {
        throw new ValidationError("Invalid input");
    } catch (error) {
        if (error instanceof ValidationError) {
            console.log("Validation error:", error.message);
        } else if (error instanceof NetworkError) {
            console.log("Network error:", error.message);
        } else {
            throw error; // Re-throw unknown errors
        }
    }
}

handleSpecificErrors();

// Solution 5: Error Recovery
console.log("\n--- Error Recovery ---");

async function fetchWithFallback() {
    try {
        const primary = await failingOperation(true);
        return primary;
    } catch (error) {
        console.log("Primary failed, trying fallback");
        try {
            const fallback = await failingOperation(false);
            return fallback;
        } catch (fallbackError) {
            console.log("Fallback also failed");
            return "Default value";
        }
    }
}

fetchWithFallback().then(result => console.log("Result:", result));

// Solution 6: Handling Parallel Errors
console.log("\n--- Parallel Errors ---");

async function parallelWithErrors() {
    const promises = [
        delay(50, "Success 1"),
        failingOperation(true),
        delay(50, "Success 2")
    ];
    
    try {
        const results = await Promise.all(promises);
        console.log("All succeeded:", results);
    } catch (error) {
        console.log("One failed:", error.message);
    }
}

parallelWithErrors();

// Solution 7: allSettled for Partial Success
console.log("\n--- Partial Success ---");

async function partialSuccess() {
    const promises = [
        delay(50, "Success 1"),
        failingOperation(true),
        delay(50, "Success 2")
    ];
    
    const results = await Promise.allSettled(promises);
    
    results.forEach((result, index) => {
        if (result.status === "fulfilled") {
            console.log(`Promise ${index}: ${result.value}`);
        } else {
            console.log(`Promise ${index}: ${result.reason.message}`);
        }
    });
}

partialSuccess();

// Solution 8: Retry Pattern
console.log("\n--- Retry Pattern ---");

async function retry(fn, retries = 3, delayMs = 100) {
    for (let i = 0; i < retries; i++) {
        try {
            return await fn();
        } catch (error) {
            console.log(`Attempt ${i + 1} failed: ${error.message}`);
            if (i < retries - 1) {
                await delay(delayMs);
            }
        }
    }
    throw new Error("All retries failed");
}

let attempts = 0;
retry(() => {
    attempts++;
    if (attempts < 3) throw new Error("Temporary failure");
    return Promise.resolve("Success on attempt " + attempts);
})
.then(result => console.log("Retry result:", result))
.catch(error => console.log("Retry failed:", error.message));

// Solution 9: Error Wrapper
console.log("\n--- Error Wrapper ---");

async function safeAsync(fn) {
    try {
        const result = await fn();
        return [null, result];
    } catch (error) {
        return [error, null];
    }
}

(async () => {
    const [error, data] = await safeAsync(() => failingOperation(true));
    
    if (error) {
        console.log("Safe wrapper caught:", error.message);
    } else {
        console.log("Data:", data);
    }
})();

