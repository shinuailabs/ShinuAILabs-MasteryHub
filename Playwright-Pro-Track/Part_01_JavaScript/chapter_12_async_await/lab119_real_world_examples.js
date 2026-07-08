/**
 * Lab 119: Real World Async Examples
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Practical async/await applications:
 * 
 * - API calls
 * - File operations
 * - Database queries
 * - Batch processing
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Build real-world async functions
 * 2. Handle complex workflows
 * 3. Implement production patterns
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Helper
const delay = (ms, value) => new Promise(r => setTimeout(() => r(value), ms));

// Solution 1: API Client
console.log("--- API Client ---");

class ApiClient {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }
    
    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        
        // Simulated fetch
        await delay(50);
        
        return {
            ok: true,
            status: 200,
            json: async () => ({ endpoint, ...options.body })
        };
    }
    
    async get(endpoint) {
        const response = await this.request(endpoint);
        return response.json();
    }
    
    async post(endpoint, data) {
        const response = await this.request(endpoint, {
            method: "POST",
            body: data
        });
        return response.json();
    }
}

const api = new ApiClient("https://api.example.com");
api.get("/users").then(data => console.log("GET:", data));

// Solution 2: Data Fetcher with Cache
console.log("\n--- Cached Fetcher ---");

class CachedFetcher {
    constructor() {
        this.cache = new Map();
        this.ttl = 60000; // 1 minute
    }
    
    async fetch(key, fetchFn) {
        const cached = this.cache.get(key);
        
        if (cached && Date.now() - cached.timestamp < this.ttl) {
            console.log(`Cache hit: ${key}`);
            return cached.data;
        }
        
        console.log(`Cache miss: ${key}`);
        const data = await fetchFn();
        this.cache.set(key, { data, timestamp: Date.now() });
        return data;
    }
}

const fetcher = new CachedFetcher();
fetcher.fetch("user:1", () => delay(50, { id: 1, name: "John" }))
    .then(data => console.log("First fetch:", data));

// Solution 3: Batch Processor
console.log("\n--- Batch Processor ---");

class BatchProcessor {
    constructor(batchSize = 10, delayMs = 100) {
        this.batchSize = batchSize;
        this.delayMs = delayMs;
    }
    
    async process(items, processFn) {
        const results = [];
        
        for (let i = 0; i < items.length; i += this.batchSize) {
            const batch = items.slice(i, i + this.batchSize);
            console.log(`Processing batch ${i / this.batchSize + 1}`);
            
            const batchResults = await Promise.all(
                batch.map(item => processFn(item))
            );
            
            results.push(...batchResults);
            
            if (i + this.batchSize < items.length) {
                await delay(this.delayMs);
            }
        }
        
        return results;
    }
}

const processor = new BatchProcessor(3, 50);
processor.process([1, 2, 3, 4, 5, 6, 7], async (item) => {
    await delay(20);
    return item * 2;
}).then(results => console.log("Batch results:", results));

// Solution 4: Polling Service
console.log("\n--- Polling Service ---");

class PollingService {
    constructor(pollFn, interval = 1000) {
        this.pollFn = pollFn;
        this.interval = interval;
        this.running = false;
    }
    
    async start(callback) {
        this.running = true;
        
        while (this.running) {
            try {
                const data = await this.pollFn();
                callback(null, data);
            } catch (error) {
                callback(error, null);
            }
            
            await delay(this.interval);
        }
    }
    
    stop() {
        this.running = false;
    }
}

// Solution 5: Queue Worker
console.log("\n--- Queue Worker ---");

class QueueWorker {
    constructor(concurrency = 3) {
        this.concurrency = concurrency;
        this.queue = [];
        this.running = 0;
    }
    
    async add(task) {
        return new Promise((resolve, reject) => {
            this.queue.push({ task, resolve, reject });
            this.process();
        });
    }
    
    async process() {
        while (this.running < this.concurrency && this.queue.length > 0) {
            const { task, resolve, reject } = this.queue.shift();
            this.running++;
            
            task()
                .then(resolve)
                .catch(reject)
                .finally(() => {
                    this.running--;
                    this.process();
                });
        }
    }
}

const worker = new QueueWorker(2);
for (let i = 1; i <= 5; i++) {
    worker.add(async () => {
        await delay(50);
        console.log(`Worker task ${i} done`);
        return i;
    });
}

// Solution 6: Retry with Circuit Breaker
console.log("\n--- Circuit Breaker ---");

class CircuitBreaker {
    constructor(fn, options = {}) {
        this.fn = fn;
        this.failures = 0;
        this.threshold = options.threshold || 3;
        this.resetTime = options.resetTime || 10000;
        this.state = "CLOSED";
        this.lastFailure = null;
    }
    
    async call(...args) {
        if (this.state === "OPEN") {
            if (Date.now() - this.lastFailure > this.resetTime) {
                this.state = "HALF-OPEN";
            } else {
                throw new Error("Circuit is OPEN");
            }
        }
        
        try {
            const result = await this.fn(...args);
            this.reset();
            return result;
        } catch (error) {
            this.recordFailure();
            throw error;
        }
    }
    
    recordFailure() {
        this.failures++;
        this.lastFailure = Date.now();
        if (this.failures >= this.threshold) {
            this.state = "OPEN";
            console.log("Circuit OPENED");
        }
    }
    
    reset() {
        this.failures = 0;
        this.state = "CLOSED";
    }
}

console.log("Circuit breaker created");

