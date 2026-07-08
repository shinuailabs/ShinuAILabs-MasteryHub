/**
 * Lab 110: Promise Best Practices
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Best practices for working with promises:
 * 
 * 1. Always handle errors
 * 2. Avoid promise constructor anti-pattern
 * 3. Don't nest promises unnecessarily
 * 4. Use Promise.all for parallel operations
 * 5. Return promises from functions
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

// Best Practice 1: Always Handle Errors
console.log("--- Always Handle Errors ---");

// BAD: Unhandled rejection
// Promise.reject(new Error("Oops"));

// GOOD: Always catch
Promise.reject(new Error("Oops"))
    .catch(error => console.log("Handled:", error.message));

// GOOD: Global handler as safety net
process.on("unhandledRejection", (reason) => {
    console.error("Unhandled rejection:", reason);
});

// Best Practice 2: Avoid Constructor Anti-Pattern
console.log("\n--- Avoid Constructor Anti-Pattern ---");

// BAD: Wrapping existing promise
function badExample(value) {
    return new Promise((resolve, reject) => {
        Promise.resolve(value)
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}

// GOOD: Just return the promise
function goodExample(value) {
    return Promise.resolve(value);
}

// Best Practice 3: Don't Nest Promises
console.log("\n--- Don't Nest Promises ---");

const fetchUser = (id) => Promise.resolve({ id, name: "John" });
const fetchPosts = (userId) => Promise.resolve([{ id: 1, title: "Post" }]);

// BAD: Nested promises
fetchUser(1).then(user => {
    fetchPosts(user.id).then(posts => {
        console.log("Nested:", posts);
    });
});

// GOOD: Chained promises
fetchUser(1)
    .then(user => fetchPosts(user.id))
    .then(posts => console.log("Chained:", posts));

// Best Practice 4: Use Promise.all for Parallel
console.log("\n--- Use Promise.all ---");

// BAD: Sequential when parallel is possible
async function badParallel() {
    const user = await fetchUser(1);
    const posts = await fetchPosts(1); // Waits for user unnecessarily
    return { user, posts };
}

// GOOD: Parallel execution
async function goodParallel() {
    const [user, posts] = await Promise.all([
        fetchUser(1),
        fetchPosts(1)
    ]);
    return { user, posts };
}

// Best Practice 5: Return Promises
console.log("\n--- Return Promises ---");

// BAD: Not returning
function badReturn() {
    fetchUser(1).then(user => {
        console.log(user);
    });
    // Returns undefined
}

// GOOD: Return the promise
function goodReturn() {
    return fetchUser(1).then(user => {
        console.log(user);
        return user;
    });
}

// Best Practice 6: Use async/await for Readability
console.log("\n--- Prefer async/await ---");

// Promise chains can get complex
function promiseChain() {
    return fetchUser(1)
        .then(user => fetchPosts(user.id))
        .then(posts => posts.filter(p => p.published))
        .then(posts => posts.map(p => p.title));
}

// async/await is clearer
async function asyncVersion() {
    const user = await fetchUser(1);
    const posts = await fetchPosts(user.id);
    const published = posts.filter(p => p.published);
    return published.map(p => p.title);
}

// Best Practice 7: Handle Cleanup with finally
console.log("\n--- Use finally for Cleanup ---");

async function fetchWithLoading() {
    let loading = true;
    
    try {
        const data = await fetchUser(1);
        return data;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    } finally {
        loading = false;
        console.log("Loading complete");
    }
}

fetchWithLoading();

// Best Practice 8: Avoid Mixing Callbacks and Promises
console.log("\n--- Don't Mix Callbacks and Promises ---");

// BAD: Mixing styles
function badMix(callback) {
    fetchUser(1)
        .then(user => callback(null, user))
        .catch(error => callback(error));
}

// GOOD: Stick to promises
function goodStyle() {
    return fetchUser(1);
}

// Best Practice 9: Use Promise.allSettled for Fault Tolerance
console.log("\n--- Use allSettled for Fault Tolerance ---");

async function fetchAllUsers(ids) {
    const results = await Promise.allSettled(
        ids.map(id => fetchUser(id))
    );
    
    const users = results
        .filter(r => r.status === "fulfilled")
        .map(r => r.value);
    
    const errors = results
        .filter(r => r.status === "rejected")
        .map(r => r.reason);
    
    return { users, errors };
}

// Best Practice 10: Document Async Functions
console.log("\n--- Document Async Functions ---");

/**
 * Fetches user data with retry logic
 * @param {number} id - User ID
 * @param {number} retries - Number of retry attempts
 * @returns {Promise<User>} User object
 * @throws {Error} If all retries fail
 */
async function fetchUserWithRetry(id, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            return await fetchUser(id);
        } catch (error) {
            if (i === retries - 1) throw error;
        }
    }
}

// Summary
console.log("\n--- Summary ---");
console.log(`
Promise Best Practices:
1. Always handle errors with .catch() or try/catch
2. Avoid wrapping promises in new Promise()
3. Chain promises instead of nesting
4. Use Promise.all for parallel operations
5. Always return promises from functions
6. Prefer async/await for readability
7. Use finally for cleanup
8. Don't mix callbacks and promises
9. Use Promise.allSettled for fault tolerance
10. Document async functions properly
`);

