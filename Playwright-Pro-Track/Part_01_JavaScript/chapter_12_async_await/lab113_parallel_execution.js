/**
 * Lab 113: Parallel Execution with Async/Await
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Running async operations in parallel:
 * 
 * - Promise.all with await
 * - Promise.allSettled with await
 * - Promise.race with await
 * - Avoiding sequential await trap
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Execute operations in parallel
 * 2. Handle parallel results
 * 3. Optimize async code
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Helper
function delay(ms, value) {
    return new Promise(resolve => setTimeout(() => resolve(value), ms));
}

// Solution 1: Sequential vs Parallel
console.log("--- Sequential vs Parallel ---");

async function sequential() {
    const start = Date.now();
    
    const a = await delay(50, "A");
    const b = await delay(50, "B");
    const c = await delay(50, "C");
    
    console.log(`Sequential: ${Date.now() - start}ms`, [a, b, c]);
}

async function parallel() {
    const start = Date.now();
    
    const [a, b, c] = await Promise.all([
        delay(50, "A"),
        delay(50, "B"),
        delay(50, "C")
    ]);
    
    console.log(`Parallel: ${Date.now() - start}ms`, [a, b, c]);
}

sequential();
parallel();

// Solution 2: Start Parallel, Await Later
console.log("\n--- Start Parallel, Await Later ---");

async function startParallel() {
    const start = Date.now();
    
    // Start all promises immediately
    const promiseA = delay(50, "A");
    const promiseB = delay(50, "B");
    const promiseC = delay(50, "C");
    
    // Await them (they're already running)
    const a = await promiseA;
    const b = await promiseB;
    const c = await promiseC;
    
    console.log(`Start parallel: ${Date.now() - start}ms`, [a, b, c]);
}

startParallel();

// Solution 3: Parallel with Destructuring
console.log("\n--- Destructuring Results ---");

async function fetchUserData(userId) {
    const [user, posts, comments] = await Promise.all([
        delay(50, { id: userId, name: "John" }),
        delay(50, [{ id: 1, title: "Post 1" }]),
        delay(50, [{ id: 1, text: "Comment 1" }])
    ]);
    
    return { user, posts, comments };
}

fetchUserData(1).then(data => console.log("User data:", data));

// Solution 4: Parallel with Error Handling
console.log("\n--- Parallel Error Handling ---");

async function parallelWithErrors() {
    try {
        const results = await Promise.all([
            delay(50, "Success 1"),
            Promise.reject(new Error("Failed")),
            delay(50, "Success 2")
        ]);
        console.log("Results:", results);
    } catch (error) {
        console.log("Parallel error:", error.message);
    }
}

parallelWithErrors();

// Solution 5: allSettled for Fault Tolerance
console.log("\n--- Fault Tolerant Parallel ---");

async function faultTolerant() {
    const results = await Promise.allSettled([
        delay(50, "Success 1"),
        Promise.reject(new Error("Failed")),
        delay(50, "Success 2")
    ]);
    
    const successes = results
        .filter(r => r.status === "fulfilled")
        .map(r => r.value);
    
    const failures = results
        .filter(r => r.status === "rejected")
        .map(r => r.reason.message);
    
    console.log("Successes:", successes);
    console.log("Failures:", failures);
}

faultTolerant();

// Solution 6: Race Condition
console.log("\n--- Race Condition ---");

async function raceExample() {
    const winner = await Promise.race([
        delay(100, "Slow"),
        delay(50, "Fast"),
        delay(150, "Slower")
    ]);
    
    console.log("Race winner:", winner);
}

raceExample();

// Solution 7: Timeout with Race
console.log("\n--- Timeout Pattern ---");

async function withTimeout(promise, ms) {
    const timeout = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Timeout")), ms);
    });
    
    return Promise.race([promise, timeout]);
}

async function fetchWithTimeout() {
    try {
        const result = await withTimeout(delay(100, "Data"), 50);
        console.log("Result:", result);
    } catch (error) {
        console.log("Timed out:", error.message);
    }
}

fetchWithTimeout();

// Solution 8: Parallel Map
console.log("\n--- Parallel Map ---");

async function parallelMap(items, fn) {
    return Promise.all(items.map(fn));
}

async function processItems() {
    const items = [1, 2, 3, 4, 5];
    
    const results = await parallelMap(items, async (item) => {
        await delay(50);
        return item * 2;
    });
    
    console.log("Parallel map:", results);
}

processItems();

// Solution 9: Parallel with Limit
console.log("\n--- Parallel with Limit ---");

async function parallelLimit(items, fn, limit) {
    const results = [];
    const executing = [];
    
    for (const [index, item] of items.entries()) {
        const promise = fn(item).then(result => {
            results[index] = result;
            executing.splice(executing.indexOf(promise), 1);
        });
        
        executing.push(promise);
        
        if (executing.length >= limit) {
            await Promise.race(executing);
        }
    }
    
    await Promise.all(executing);
    return results;
}

async function limitedParallel() {
    const items = [1, 2, 3, 4, 5, 6];
    
    const results = await parallelLimit(
        items,
        async (item) => {
            await delay(50);
            console.log(`Processing ${item}`);
            return item * 2;
        },
        2 // Max 2 concurrent
    );
    
    console.log("Limited parallel:", results);
}

limitedParallel();

// Solution 10: Parallel Object Properties
console.log("\n--- Parallel Object ---");

async function parallelObject() {
    const promises = {
        user: delay(50, { name: "John" }),
        posts: delay(50, [{ title: "Post" }]),
        settings: delay(50, { theme: "dark" })
    };
    
    const entries = await Promise.all(
        Object.entries(promises).map(async ([key, promise]) => {
            return [key, await promise];
        })
    );
    
    const result = Object.fromEntries(entries);
    console.log("Parallel object:", result);
}

parallelObject();

