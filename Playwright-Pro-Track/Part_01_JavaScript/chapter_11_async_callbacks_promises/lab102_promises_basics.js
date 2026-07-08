/**
 * Lab 102: Promises Basics
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Promises represent eventual completion/failure of async operations.
 * 
 * States:
 * - Pending: Initial state
 * - Fulfilled: Operation completed successfully
 * - Rejected: Operation failed
 * 
 * Methods:
 * - then(): Handle fulfillment
 * - catch(): Handle rejection
 * - finally(): Always runs
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create promises
 * 2. Handle success and failure
 * 3. Chain promises
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Creating a Promise
console.log("--- Creating Promises ---");

const promise = new Promise((resolve, reject) => {
    // Async operation
    setTimeout(() => {
        const success = true;
        if (success) {
            resolve("Operation successful!");
        } else {
            reject(new Error("Operation failed!"));
        }
    }, 100);
});

// Solution 2: Consuming Promises
console.log("\n--- Consuming Promises ---");

promise
    .then((result) => {
        console.log("Success:", result);
    })
    .catch((error) => {
        console.error("Error:", error.message);
    })
    .finally(() => {
        console.log("Cleanup (always runs)");
    });

// Solution 3: Promise.resolve and Promise.reject
console.log("\n--- Static Methods ---");

// Immediately resolved
Promise.resolve("Immediate value")
    .then(value => console.log("Resolved:", value));

// Immediately rejected
Promise.reject(new Error("Immediate error"))
    .catch(error => console.log("Rejected:", error.message));

// Solution 4: Chaining Promises
console.log("\n--- Promise Chaining ---");

function fetchUser(id) {
    return new Promise((resolve) => {
        setTimeout(() => resolve({ id, name: "John" }), 50);
    });
}

function fetchPosts(userId) {
    return new Promise((resolve) => {
        setTimeout(() => resolve([
            { id: 1, title: "Post 1" },
            { id: 2, title: "Post 2" }
        ]), 50);
    });
}

fetchUser(1)
    .then(user => {
        console.log("User:", user);
        return fetchPosts(user.id);
    })
    .then(posts => {
        console.log("Posts:", posts);
    })
    .catch(error => {
        console.error("Error:", error);
    });

// Solution 5: Returning Values in Chain
console.log("\n--- Returning Values ---");

Promise.resolve(1)
    .then(x => x + 1)      // Returns 2
    .then(x => x * 2)      // Returns 4
    .then(x => {
        console.log("Final value:", x); // 4
        return x;
    });

// Solution 6: Error Propagation
console.log("\n--- Error Propagation ---");

Promise.resolve("start")
    .then(value => {
        throw new Error("Something went wrong");
    })
    .then(value => {
        console.log("This won't run");
    })
    .catch(error => {
        console.log("Caught:", error.message);
        return "recovered";
    })
    .then(value => {
        console.log("After recovery:", value);
    });

// Solution 7: Practical Example - Fetch Simulation
console.log("\n--- Fetch Simulation ---");

function simulateFetch(url) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (url.includes("error")) {
                reject(new Error("Network error"));
            } else {
                resolve({
                    ok: true,
                    json: () => Promise.resolve({ data: "Response from " + url })
                });
            }
        }, 100);
    });
}

simulateFetch("https://api.example.com/data")
    .then(response => response.json())
    .then(data => console.log("Fetched:", data))
    .catch(error => console.error("Fetch error:", error.message));

// Solution 8: Multiple then Handlers
console.log("\n--- Multiple Handlers ---");

const sharedPromise = Promise.resolve("shared value");

// Multiple handlers on same promise
sharedPromise.then(value => console.log("Handler 1:", value));
sharedPromise.then(value => console.log("Handler 2:", value));

// Solution 9: Conditional Promise
console.log("\n--- Conditional Promise ---");

function conditionalFetch(shouldFetch) {
    if (!shouldFetch) {
        return Promise.resolve(null);
    }
    
    return new Promise((resolve) => {
        setTimeout(() => resolve({ data: "fetched" }), 50);
    });
}

conditionalFetch(false).then(data => console.log("Conditional:", data));
conditionalFetch(true).then(data => console.log("Conditional:", data));

// Solution 10: Promise State Check
console.log("\n--- Promise States ---");

const pending = new Promise(() => {}); // Never resolves
const fulfilled = Promise.resolve("done");
const rejected = Promise.reject(new Error("failed")).catch(() => {});

console.log("Promises created (states are internal)");

