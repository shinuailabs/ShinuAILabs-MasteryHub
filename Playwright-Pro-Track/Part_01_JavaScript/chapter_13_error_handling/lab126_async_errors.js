/**
 * Lab 126: Async Error Handling
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Handling errors in async code:
 * 
 * - Promise rejection
 * - async/await try/catch
 * - Unhandled rejections
 * - Error handling patterns
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Handle promise rejections
 * 2. Use try/catch with async
 * 3. Prevent unhandled rejections
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Helper
const delay = (ms) => new Promise(r => setTimeout(r, ms));

// Solution 1: Promise Rejection
console.log("--- Promise Rejection ---");

const rejectedPromise = new Promise((resolve, reject) => {
    setTimeout(() => reject(new Error("Promise rejected")), 50);
});

rejectedPromise.catch(error => {
    console.log("Caught rejection:", error.message);
});

// Solution 2: Throwing in then()
console.log("\n--- Throwing in then ---");

Promise.resolve("data")
    .then(data => {
        throw new Error("Error in then");
    })
    .catch(error => {
        console.log("Caught from then:", error.message);
    });

// Solution 3: async/await Try/Catch
console.log("\n--- async/await Try/Catch ---");

async function asyncWithError() {
    try {
        await delay(50);
        throw new Error("Async error");
    } catch (error) {
        console.log("Async caught:", error.message);
    }
}

asyncWithError();

// Solution 4: Multiple Async Operations
console.log("\n--- Multiple Operations ---");

async function multipleOps() {
    try {
        await delay(30);
        console.log("Op 1 done");
        
        await Promise.reject(new Error("Op 2 failed"));
        
        await delay(30); // Never reached
        console.log("Op 3 done");
    } catch (error) {
        console.log("Multi-op error:", error.message);
    }
}

multipleOps();

// Solution 5: Promise.all Error Handling
console.log("\n--- Promise.all Errors ---");

async function parallelWithError() {
    try {
        const results = await Promise.all([
            delay(50).then(() => "success 1"),
            Promise.reject(new Error("parallel fail")),
            delay(50).then(() => "success 2")
        ]);
        console.log("Results:", results);
    } catch (error) {
        console.log("Parallel error:", error.message);
    }
}

parallelWithError();

// Solution 6: Promise.allSettled
console.log("\n--- Promise.allSettled ---");

async function allSettledExample() {
    const results = await Promise.allSettled([
        delay(50).then(() => "success 1"),
        Promise.reject(new Error("fail")),
        delay(50).then(() => "success 2")
    ]);
    
    results.forEach((result, i) => {
        if (result.status === "fulfilled") {
            console.log(`Promise ${i}: ${result.value}`);
        } else {
            console.log(`Promise ${i}: ${result.reason.message}`);
        }
    });
}

allSettledExample();

// Solution 7: Error Recovery
console.log("\n--- Error Recovery ---");

async function fetchWithFallback() {
    try {
        await Promise.reject(new Error("Primary failed"));
    } catch (error) {
        console.log("Primary failed, using fallback");
        return "fallback data";
    }
}

fetchWithFallback().then(data => console.log("Got:", data));

// Solution 8: Retry Pattern
console.log("\n--- Retry Pattern ---");

async function retry(fn, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            return await fn();
        } catch (error) {
            console.log(`Attempt ${i + 1} failed: ${error.message}`);
            if (i === retries - 1) throw error;
            await delay(50);
        }
    }
}

let attempts = 0;
retry(async () => {
    attempts++;
    if (attempts < 3) throw new Error("Temporary failure");
    return "Success!";
}).then(result => console.log("Retry result:", result));

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
    const [error, data] = await safeAsync(async () => {
        throw new Error("Wrapped error");
    });
    
    if (error) {
        console.log("Safe wrapper caught:", error.message);
    }
})();

// Solution 10: Timeout with Error
console.log("\n--- Timeout Error ---");

async function withTimeout(promise, ms) {
    const timeout = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Timeout")), ms);
    });
    
    return Promise.race([promise, timeout]);
}

(async () => {
    try {
        await withTimeout(delay(200), 100);
    } catch (error) {
        console.log("Timeout caught:", error.message);
    }
})();

// Solution 11: Cleanup with Finally
console.log("\n--- Cleanup with Finally ---");

async function withCleanup() {
    let resource = "acquired";
    
    try {
        await delay(50);
        throw new Error("Operation failed");
    } catch (error) {
        console.log("Error:", error.message);
    } finally {
        resource = null;
        console.log("Resource released");
    }
}

withCleanup();

// Solution 12: Global Rejection Handler
console.log("\n--- Global Handler ---");

process.on("unhandledRejection", (reason, promise) => {
    console.log("Unhandled rejection:", reason);
});

// Intentionally unhandled for demonstration
// Promise.reject(new Error("Unhandled"));

