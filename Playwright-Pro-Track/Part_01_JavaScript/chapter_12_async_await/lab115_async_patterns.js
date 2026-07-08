/**
 * Lab 115: Async Patterns
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Common async/await patterns:
 * 
 * - Retry pattern
 * - Timeout pattern
 * - Debounce/throttle
 * - Queue pattern
 * - Semaphore pattern
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Implement retry logic
 * 2. Add timeouts to operations
 * 3. Control concurrency
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Helper
const delay = (ms, value) => new Promise(r => setTimeout(() => r(value), ms));

// Solution 1: Retry Pattern
console.log("--- Retry Pattern ---");

async function retry(fn, maxRetries = 3, delayMs = 100) {
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error;
            console.log(`Attempt ${attempt} failed: ${error.message}`);
            
            if (attempt < maxRetries) {
                await delay(delayMs);
            }
        }
    }
    
    throw lastError;
}

let attempts = 0;
retry(() => {
    attempts++;
    if (attempts < 3) throw new Error("Temporary failure");
    return Promise.resolve("Success!");
}).then(result => console.log("Retry result:", result));

// Solution 2: Exponential Backoff
console.log("\n--- Exponential Backoff ---");

async function retryWithBackoff(fn, maxRetries = 3, baseDelay = 100) {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            if (attempt === maxRetries - 1) throw error;
            
            const delayMs = baseDelay * Math.pow(2, attempt);
            console.log(`Backing off for ${delayMs}ms`);
            await delay(delayMs);
        }
    }
}

// Solution 3: Timeout Pattern
console.log("\n--- Timeout Pattern ---");

async function withTimeout(promise, ms, errorMessage = "Timeout") {
    let timeoutId;
    
    const timeout = new Promise((_, reject) => {
        timeoutId = setTimeout(() => reject(new Error(errorMessage)), ms);
    });
    
    try {
        return await Promise.race([promise, timeout]);
    } finally {
        clearTimeout(timeoutId);
    }
}

async function testTimeout() {
    try {
        await withTimeout(delay(200, "Slow"), 100);
    } catch (error) {
        console.log("Timeout caught:", error.message);
    }
    
    const result = await withTimeout(delay(50, "Fast"), 100);
    console.log("Completed:", result);
}

testTimeout();

// Solution 4: Debounce Async
console.log("\n--- Debounce Async ---");

function debounceAsync(fn, wait) {
    let timeoutId;
    let pendingPromise = null;
    let resolve, reject;
    
    return function(...args) {
        clearTimeout(timeoutId);
        
        if (!pendingPromise) {
            pendingPromise = new Promise((res, rej) => {
                resolve = res;
                reject = rej;
            });
        }
        
        timeoutId = setTimeout(async () => {
            try {
                const result = await fn.apply(this, args);
                resolve(result);
            } catch (error) {
                reject(error);
            }
            pendingPromise = null;
        }, wait);
        
        return pendingPromise;
    };
}

// Solution 5: Async Queue
console.log("\n--- Async Queue ---");

class AsyncQueue {
    constructor() {
        this.queue = [];
        this.processing = false;
    }
    
    async add(fn) {
        return new Promise((resolve, reject) => {
            this.queue.push({ fn, resolve, reject });
            this.process();
        });
    }
    
    async process() {
        if (this.processing) return;
        this.processing = true;
        
        while (this.queue.length > 0) {
            const { fn, resolve, reject } = this.queue.shift();
            try {
                const result = await fn();
                resolve(result);
            } catch (error) {
                reject(error);
            }
        }
        
        this.processing = false;
    }
}

const queue = new AsyncQueue();
queue.add(() => delay(50, "Task 1")).then(r => console.log(r));
queue.add(() => delay(50, "Task 2")).then(r => console.log(r));
queue.add(() => delay(50, "Task 3")).then(r => console.log(r));

// Solution 6: Semaphore
console.log("\n--- Semaphore ---");

class Semaphore {
    constructor(max) {
        this.max = max;
        this.count = 0;
        this.waiting = [];
    }
    
    async acquire() {
        if (this.count < this.max) {
            this.count++;
            return;
        }
        
        await new Promise(resolve => this.waiting.push(resolve));
    }
    
    release() {
        this.count--;
        if (this.waiting.length > 0) {
            this.count++;
            this.waiting.shift()();
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

async function testSemaphore() {
    const sem = new Semaphore(2);
    
    const tasks = [1, 2, 3, 4, 5].map(i => 
        sem.use(async () => {
            console.log(`Task ${i} started`);
            await delay(50);
            console.log(`Task ${i} finished`);
            return i;
        })
    );
    
    await Promise.all(tasks);
}

testSemaphore();

// Solution 7: Mutex
console.log("\n--- Mutex ---");

class Mutex {
    constructor() {
        this.locked = false;
        this.waiting = [];
    }
    
    async lock() {
        if (!this.locked) {
            this.locked = true;
            return;
        }
        
        await new Promise(resolve => this.waiting.push(resolve));
    }
    
    unlock() {
        if (this.waiting.length > 0) {
            this.waiting.shift()();
        } else {
            this.locked = false;
        }
    }
    
    async use(fn) {
        await this.lock();
        try {
            return await fn();
        } finally {
            this.unlock();
        }
    }
}

// Solution 8: Cancellable Async
console.log("\n--- Cancellable Async ---");

function cancellable(fn) {
    let cancelled = false;
    
    const promise = (async () => {
        const result = await fn();
        if (cancelled) throw new Error("Cancelled");
        return result;
    })();
    
    return {
        promise,
        cancel: () => { cancelled = true; }
    };
}

const { promise: cancellablePromise, cancel } = cancellable(
    () => delay(200, "Result")
);

setTimeout(cancel, 50);
cancellablePromise
    .then(r => console.log("Result:", r))
    .catch(e => console.log("Cancelled:", e.message));

