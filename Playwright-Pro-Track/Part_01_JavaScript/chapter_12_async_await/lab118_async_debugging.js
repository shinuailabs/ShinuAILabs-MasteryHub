/**
 * Lab 118: Debugging Async Code
 *
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Debugging async/await code:
 *
 * - Console logging strategies
 * - Stack traces in async code
 * - Debugging tools
 * - Common pitfalls
 *
 * =====================
 * EXERCISE:
 * =====================
 * 1. Add effective logging
 * 2. Trace async execution
 * 3. Debug common issues
 *
 * =====================
 * SOLUTION:
 * =====================
 */

// Helper
const delay = (ms, value) => new Promise(r => setTimeout(() => r(value), ms));

// Solution 1: Logging Async Flow
console.log("--- Logging Async Flow ---");

async function fetchWithLogging(id) {
    console.log(`[${Date.now()}] Starting fetch for id: ${id}`);

    try {
        const result = await delay(50, { id, name: "John" });
        console.log(`[${Date.now()}] Fetch completed:`, result);
        return result;
    } catch (error) {
        console.error(`[${Date.now()}] Fetch failed:`, error);
        throw error;
    }
}

fetchWithLogging(1);

// Solution 2: Async Stack Traces
console.log("\n--- Stack Traces ---");

async function level1() {
    await delay(10);
    return level2();
}

async function level2() {
    await delay(10);
    return level3();
}

async function level3() {
    await delay(10);
    throw new Error("Deep error");
}

level1().catch(error => {
    console.log("Error caught:", error.message);
    // Stack trace shows async call chain
});

// Solution 3: Debug Wrapper
console.log("\n--- Debug Wrapper ---");

function debugAsync(fn, name) {
    return async function(...args) {
        const id = Math.random().toString(36).substr(2, 9);
        console.log(`[${name}:${id}] Called with:`, args);

        const start = Date.now();
        try {
            const result = await fn.apply(this, args);
            console.log(`[${name}:${id}] Returned in ${Date.now() - start}ms:`, result);
            return result;
        } catch (error) {
            console.log(`[${name}:${id}] Failed in ${Date.now() - start}ms:`, error.message);
            throw error;
        }
    };
}

const debuggedFetch = debugAsync(
    async (id) => delay(50, { id }),
    "fetchUser"
);

debuggedFetch(1);

// Solution 4: Timing Analysis
console.log("\n--- Timing Analysis ---");

async function measureAsync(name, fn) {
    console.time(name);
    try {
        const result = await fn();
        console.timeEnd(name);
        return result;
    } catch (error) {
        console.timeEnd(name);
        throw error;
    }
}

measureAsync("Sequential", async () => {
    await delay(30);
    await delay(30);
    await delay(30);
});

measureAsync("Parallel", async () => {
    await Promise.all([delay(30), delay(30), delay(30)]);
});

// Solution 5: Promise State Inspector
console.log("\n--- Promise Inspector ---");

function inspectPromise(promise, name) {
    let state = "pending";
    let value;

    promise
        .then(v => { state = "fulfilled"; value = v; })
        .catch(e => { state = "rejected"; value = e; });

    return {
        getState: () => ({ name, state, value }),
        promise
    };
}

const { getState, promise } = inspectPromise(delay(100, "done"), "myPromise");
console.log("Initial:", getState());
setTimeout(() => console.log("After 150ms:", getState()), 150);

// Solution 6: Async Event Logger
console.log("\n--- Event Logger ---");

class AsyncLogger {
    constructor() {
        this.events = [];
    }

    log(event, data) {
        this.events.push({
            timestamp: Date.now(),
            event,
            data
        });
    }

    wrap(fn, name) {
        const logger = this;
        return async function(...args) {
            logger.log(`${name}:start`, { args });
            try {
                const result = await fn.apply(this, args);
                logger.log(`${name}:success`, { result });
                return result;
            } catch (error) {
                logger.log(`${name}:error`, { error: error.message });
                throw error;
            }
        };
    }

    printTimeline() {
        const start = this.events[0]?.timestamp || 0;
        this.events.forEach(e => {
            console.log(`+${e.timestamp - start}ms: ${e.event}`, e.data);
        });
    }
}

const logger = new AsyncLogger();
const loggedFetch = logger.wrap(
    async (id) => delay(50, { id }),
    "fetch"
);

loggedFetch(1).then(() => {
    console.log("\nTimeline:");
    logger.printTimeline();
});

// Solution 7: Common Pitfalls
console.log("\n--- Common Pitfalls ---");

// Pitfall 1: Forgetting await
async function pitfall1() {
    const promise = delay(50, "data"); // Missing await!
    console.log("Pitfall 1 - No await:", promise); // Logs Promise, not "data"
}
pitfall1();

// Pitfall 2: forEach doesn't wait
async function pitfall2() {
    const items = [1, 2, 3];

    // BAD: forEach doesn't wait
    items.forEach(async (item) => {
        await delay(10);
        // These run in parallel, not sequence
    });

    // GOOD: Use for...of
    for (const item of items) {
        await delay(10);
    }
}

// Pitfall 3: Unhandled rejections
async function pitfall3() {
    // BAD: No catch
    // someAsyncFunction(); // Unhandled if it rejects

    // GOOD: Always handle
    try {
        await delay(10);
    } catch (error) {
        console.error(error);
    }
}

// Solution 8: Breakpoint-friendly Code
console.log("\n--- Breakpoint-friendly ---");

async function breakpointFriendly(id) {
    // Separate lines for easier debugging
    const userPromise = delay(30, { id, name: "John" });
    const user = await userPromise; // Set breakpoint here

    const postsPromise = delay(30, [{ title: "Post 1" }]);
    const posts = await postsPromise; // Set breakpoint here

    const result = { user, posts };
    return result; // Set breakpoint here
}

breakpointFriendly(1).then(r => console.log("Breakpoint result:", r));