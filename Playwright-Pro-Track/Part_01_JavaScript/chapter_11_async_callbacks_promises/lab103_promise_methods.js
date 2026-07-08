/**
 * Lab 103: Promise Static Methods
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Promise static methods for handling multiple promises:
 * 
 * - Promise.all(): All must succeed
 * - Promise.allSettled(): Wait for all (success or fail)
 * - Promise.race(): First to settle wins
 * - Promise.any(): First to succeed wins
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Use Promise.all for parallel operations
 * 2. Handle mixed results with allSettled
 * 3. Implement timeouts with race
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Helper function
function delay(ms, value, shouldFail = false) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (shouldFail) {
                reject(new Error(`Failed: ${value}`));
            } else {
                resolve(value);
            }
        }, ms);
    });
}

// Solution 1: Promise.all
console.log("--- Promise.all ---");

const promises1 = [
    delay(100, "First"),
    delay(50, "Second"),
    delay(150, "Third")
];

Promise.all(promises1)
    .then(results => {
        console.log("All results:", results);
        // ["First", "Second", "Third"] - in order!
    })
    .catch(error => {
        console.error("One failed:", error.message);
    });

// Solution 2: Promise.all Fails Fast
console.log("\n--- Promise.all Fails Fast ---");

const promises2 = [
    delay(100, "Success 1"),
    delay(50, "Failure", true), // This fails
    delay(150, "Success 2")
];

Promise.all(promises2)
    .then(results => console.log("Results:", results))
    .catch(error => console.log("Failed fast:", error.message));

// Solution 3: Promise.allSettled
console.log("\n--- Promise.allSettled ---");

const promises3 = [
    delay(100, "Success 1"),
    delay(50, "Failure", true),
    delay(150, "Success 2")
];

Promise.allSettled(promises3)
    .then(results => {
        results.forEach((result, index) => {
            if (result.status === "fulfilled") {
                console.log(`Promise ${index}: ${result.value}`);
            } else {
                console.log(`Promise ${index}: ${result.reason.message}`);
            }
        });
    });

// Solution 4: Promise.race
console.log("\n--- Promise.race ---");

const promises4 = [
    delay(100, "Slow"),
    delay(50, "Fast"),
    delay(150, "Slower")
];

Promise.race(promises4)
    .then(winner => console.log("Race winner:", winner))
    .catch(error => console.log("Race error:", error.message));

// Solution 5: Timeout with Promise.race
console.log("\n--- Timeout Pattern ---");

function withTimeout(promise, ms) {
    const timeout = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Timeout")), ms);
    });
    return Promise.race([promise, timeout]);
}

withTimeout(delay(100, "Quick operation"), 200)
    .then(result => console.log("Completed:", result))
    .catch(error => console.log("Timed out:", error.message));

withTimeout(delay(300, "Slow operation"), 200)
    .then(result => console.log("Completed:", result))
    .catch(error => console.log("Timed out:", error.message));

// Solution 6: Promise.any
console.log("\n--- Promise.any ---");

const promises5 = [
    delay(100, "First failure", true),
    delay(50, "Second failure", true),
    delay(150, "First success")
];

Promise.any(promises5)
    .then(winner => console.log("Any winner:", winner))
    .catch(error => console.log("All failed:", error.errors));

// Solution 7: Practical Example - Parallel API Calls
console.log("\n--- Parallel API Calls ---");

function fetchUser(id) {
    return delay(50, { id, name: `User ${id}` });
}

function fetchUserPosts(userId) {
    return delay(50, [{ id: 1, title: "Post 1" }]);
}

function fetchUserComments(userId) {
    return delay(50, [{ id: 1, text: "Comment 1" }]);
}

// Fetch all data in parallel
const userId = 1;
Promise.all([
    fetchUser(userId),
    fetchUserPosts(userId),
    fetchUserComments(userId)
])
.then(([user, posts, comments]) => {
    console.log("User:", user);
    console.log("Posts:", posts);
    console.log("Comments:", comments);
});

// Solution 8: Retry Pattern
console.log("\n--- Retry Pattern ---");

function retry(fn, retries = 3, delayMs = 100) {
    return fn().catch(error => {
        if (retries > 0) {
            console.log(`Retrying... (${retries} left)`);
            return delay(delayMs).then(() => retry(fn, retries - 1, delayMs));
        }
        throw error;
    });
}

let attempts = 0;
retry(() => {
    attempts++;
    if (attempts < 3) {
        return Promise.reject(new Error("Temporary failure"));
    }
    return Promise.resolve("Success on attempt " + attempts);
})
.then(result => console.log("Retry result:", result))
.catch(error => console.log("Retry failed:", error.message));

// Solution 9: Sequential vs Parallel
console.log("\n--- Sequential vs Parallel ---");

// Sequential (slower)
async function sequential() {
    const start = Date.now();
    const a = await delay(50, "A");
    const b = await delay(50, "B");
    const c = await delay(50, "C");
    console.log(`Sequential: ${Date.now() - start}ms`);
}

// Parallel (faster)
async function parallel() {
    const start = Date.now();
    const [a, b, c] = await Promise.all([
        delay(50, "A"),
        delay(50, "B"),
        delay(50, "C")
    ]);
    console.log(`Parallel: ${Date.now() - start}ms`);
}

sequential();
parallel();

