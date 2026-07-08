/**
 * Lab 105: Promise Error Handling
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Proper error handling in promises:
 * 
 * - catch() for handling rejections
 * - Error propagation through chain
 * - Recovery from errors
 * - finally() for cleanup
 * - Unhandled rejection detection
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Handle promise rejections
 * 2. Recover from errors
 * 3. Implement cleanup logic
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Basic Error Handling
console.log("--- Basic Error Handling ---");

const failingPromise = new Promise((resolve, reject) => {
    setTimeout(() => reject(new Error("Something went wrong")), 50);
});

failingPromise
    .then(result => console.log("Success:", result))
    .catch(error => console.log("Error caught:", error.message));

// Solution 2: Throwing in then()
console.log("\n--- Throwing in then ---");

Promise.resolve("data")
    .then(data => {
        if (!data) {
            throw new Error("No data provided");
        }
        // This also works:
        // return Promise.reject(new Error("No data"));
        return data.toUpperCase();
    })
    .then(result => console.log("Result:", result))
    .catch(error => console.log("Caught:", error.message));

// Solution 3: Error Recovery
console.log("\n--- Error Recovery ---");

function fetchWithFallback(primary, fallback) {
    return fetch(primary)
        .catch(error => {
            console.log("Primary failed, trying fallback");
            return fetch(fallback);
        });
}

// Simulated version
function simulatedFetch(url, shouldFail = false) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (shouldFail) reject(new Error("Network error"));
            else resolve({ data: `Response from ${url}` });
        }, 50);
    });
}

simulatedFetch("primary-api", true)
    .catch(error => {
        console.log("Primary failed:", error.message);
        return simulatedFetch("fallback-api", false);
    })
    .then(response => console.log("Got response:", response));

// Solution 4: finally() for Cleanup
console.log("\n--- finally() Cleanup ---");

let isLoading = true;

Promise.resolve("data")
    .then(data => {
        console.log("Processing:", data);
        return data;
    })
    .catch(error => {
        console.log("Error:", error.message);
    })
    .finally(() => {
        isLoading = false;
        console.log("Loading complete, isLoading:", isLoading);
    });

// Solution 5: Rethrowing Errors
console.log("\n--- Rethrowing Errors ---");

function processData(data) {
    return Promise.resolve(data)
        .then(data => {
            if (!data.valid) {
                throw new Error("Invalid data");
            }
            return data;
        })
        .catch(error => {
            console.log("Logging error:", error.message);
            throw error; // Rethrow for caller to handle
        });
}

processData({ valid: false })
    .catch(error => console.log("Caller caught:", error.message));

// Solution 6: Error Types
console.log("\n--- Error Types ---");

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

function handleRequest(data) {
    return Promise.resolve(data)
        .then(data => {
            if (!data.email) {
                throw new ValidationError("Email required");
            }
            return data;
        })
        .catch(error => {
            if (error instanceof ValidationError) {
                console.log("Validation failed:", error.message);
                return { error: error.message, code: 400 };
            }
            if (error instanceof NetworkError) {
                console.log("Network failed:", error.message);
                return { error: error.message, code: 503 };
            }
            throw error; // Unknown error, rethrow
        });
}

handleRequest({}).then(result => console.log("Result:", result));

// Solution 7: Aggregate Error Handling
console.log("\n--- Aggregate Errors ---");

const promises = [
    Promise.resolve("success 1"),
    Promise.reject(new Error("error 1")),
    Promise.resolve("success 2"),
    Promise.reject(new Error("error 2"))
];

Promise.allSettled(promises)
    .then(results => {
        const errors = results
            .filter(r => r.status === "rejected")
            .map(r => r.reason);
        
        const successes = results
            .filter(r => r.status === "fulfilled")
            .map(r => r.value);
        
        console.log("Successes:", successes);
        console.log("Errors:", errors.map(e => e.message));
    });

// Solution 8: Timeout Error
console.log("\n--- Timeout Error ---");

function withTimeout(promise, ms, errorMessage = "Timeout") {
    const timeout = new Promise((_, reject) => {
        setTimeout(() => reject(new Error(errorMessage)), ms);
    });
    
    return Promise.race([promise, timeout]);
}

const slowOperation = new Promise(resolve => {
    setTimeout(() => resolve("Done"), 200);
});

withTimeout(slowOperation, 100, "Operation timed out")
    .then(result => console.log("Result:", result))
    .catch(error => console.log("Timeout:", error.message));

// Solution 9: Global Unhandled Rejection
console.log("\n--- Unhandled Rejection ---");

// In browser/Node.js:
// process.on('unhandledRejection', (reason, promise) => {
//     console.log('Unhandled Rejection:', reason);
// });

// window.addEventListener('unhandledrejection', (event) => {
//     console.log('Unhandled Rejection:', event.reason);
//     event.preventDefault();
// });

console.log("Unhandled rejection handlers should be set globally");

