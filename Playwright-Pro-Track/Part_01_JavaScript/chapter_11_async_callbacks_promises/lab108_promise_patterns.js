/**
 * Lab 108: Promise Patterns
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Common patterns for working with promises:
 * 
 * - Sequential execution
 * - Parallel execution
 * - Batching
 * - Caching
 * - Retry logic
 * - Circuit breaker
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Implement common patterns
 * 2. Handle complex async flows
 * 3. Optimize promise usage
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Helper
const delay = (ms, value) => new Promise(r => setTimeout(() => r(value), ms));

// Solution 1: Sequential Execution
console.log("--- Sequential Execution ---");

async function sequential(tasks) {
    const results = [];
    for (const task of tasks) {
        results.push(await task());
    }
    return results;
}

const tasks = [
    () => delay(50, "Task 1"),
    () => delay(50, "Task 2"),
    () => delay(50, "Task 3")
];

sequential(tasks).then(results => console.log("Sequential:", results));

// Solution 2: Parallel with Limit
console.log("\n--- Parallel with Limit ---");

async function parallelLimit(tasks, limit) {
    const results = [];
    const executing = [];
    
    for (const [index, task] of tasks.entries()) {
        const promise = task().then(result => {
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

const manyTasks = Array.from({ length: 6 }, (_, i) => 
    () => delay(50, `Task ${i + 1}`)
);

parallelLimit(manyTasks, 2).then(results => 
    console.log("Parallel limited:", results)
);

// Solution 3: Promise Memoization
console.log("\n--- Memoization ---");

function memoizeAsync(fn) {
    const cache = new Map();
    
    return function(...args) {
        const key = JSON.stringify(args);
        
        if (cache.has(key)) {
            console.log("Cache hit for:", key);
            return cache.get(key);
        }
        
        console.log("Cache miss for:", key);
        const promise = fn(...args);
        cache.set(key, promise);
        return promise;
    };
}

const fetchUser = memoizeAsync((id) => delay(50, { id, name: `User ${id}` }));

fetchUser(1).then(user => console.log("First call:", user));
fetchUser(1).then(user => console.log("Second call (cached):", user));
fetchUser(2).then(user => console.log("Different id:", user));

// Solution 4: Retry with Exponential Backoff
console.log("\n--- Exponential Backoff ---");

async function retryWithBackoff(fn, maxRetries = 3, baseDelay = 100) {
    let lastError;
    
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error;
            const delayMs = baseDelay * Math.pow(2, i);
            console.log(`Retry ${i + 1} after ${delayMs}ms`);
            await delay(delayMs);
        }
    }
    
    throw lastError;
}

let attempts = 0;
retryWithBackoff(() => {
    attempts++;
    if (attempts < 3) throw new Error("Temporary failure");
    return Promise.resolve("Success");
}).then(result => console.log("Backoff result:", result));

// Solution 5: Circuit Breaker
console.log("\n--- Circuit Breaker ---");

class CircuitBreaker {
    constructor(fn, options = {}) {
        this.fn = fn;
        this.failures = 0;
        this.threshold = options.threshold || 3;
        this.resetTimeout = options.resetTimeout || 5000;
        this.state = "CLOSED";
    }
    
    async call(...args) {
        if (this.state === "OPEN") {
            throw new Error("Circuit is OPEN");
        }
        
        try {
            const result = await this.fn(...args);
            this.failures = 0;
            return result;
        } catch (error) {
            this.failures++;
            if (this.failures >= this.threshold) {
                this.state = "OPEN";
                console.log("Circuit OPENED");
                setTimeout(() => {
                    this.state = "CLOSED";
                    this.failures = 0;
                    console.log("Circuit CLOSED");
                }, this.resetTimeout);
            }
            throw error;
        }
    }
}

// Solution 6: Promise Pool
console.log("\n--- Promise Pool ---");

class PromisePool {
    constructor(concurrency) {
        this.concurrency = concurrency;
        this.running = 0;
        this.queue = [];
    }
    
    add(fn) {
        return new Promise((resolve, reject) => {
            this.queue.push({ fn, resolve, reject });
            this.process();
        });
    }
    
    process() {
        while (this.running < this.concurrency && this.queue.length > 0) {
            const { fn, resolve, reject } = this.queue.shift();
            this.running++;
            
            fn()
                .then(resolve)
                .catch(reject)
                .finally(() => {
                    this.running--;
                    this.process();
                });
        }
    }
}

const pool = new PromisePool(2);
for (let i = 1; i <= 4; i++) {
    pool.add(() => delay(50, `Pool task ${i}`))
        .then(result => console.log(result));
}

// Solution 7: Debounced Promise
console.log("\n--- Debounced Promise ---");

function debouncePromise(fn, wait) {
    let timeout;
    let pendingPromise = null;
    
    return function(...args) {
        clearTimeout(timeout);
        
        if (!pendingPromise) {
            pendingPromise = new Promise((resolve, reject) => {
                timeout = setTimeout(() => {
                    fn(...args).then(resolve).catch(reject);
                    pendingPromise = null;
                }, wait);
            });
        }
        
        return pendingPromise;
    };
}

// Solution 8: Promise Semaphore
console.log("\n--- Semaphore ---");

class Semaphore {
    constructor(max) {
        this.max = max;
        this.count = 0;
        this.queue = [];
    }
    
    async acquire() {
        if (this.count < this.max) {
            this.count++;
            return;
        }
        
        await new Promise(resolve => this.queue.push(resolve));
    }
    
    release() {
        this.count--;
        if (this.queue.length > 0) {
            this.count++;
            this.queue.shift()();
        }
    }
    
    async use(fn) {
        await this.acquire();
        try {
            return await fn();
        } finally {
            this.release();
        }
    }
}

const semaphore = new Semaphore(2);
for (let i = 1; i <= 4; i++) {
    semaphore.use(() => delay(50, `Semaphore task ${i}`))
        .then(result => console.log(result));
}

