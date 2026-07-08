/**
 * Lab 129: Error Recovery Strategies
 *
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Recovering from errors gracefully:
 *
 * - Fallback values
 * - Retry mechanisms
 * - Circuit breakers
 * - Graceful degradation
 *
 * =====================
 * EXERCISE:
 * =====================
 * 1. Implement recovery strategies
 * 2. Use fallback mechanisms
 * 3. Build resilient code
 *
 * =====================
 * SOLUTION:
 * =====================
 */

// Helper
const delay = (ms) => new Promise(r => setTimeout(r, ms));

// Solution 1: Fallback Values
console.log("--- Fallback Values ---");

function getConfig(key) {
    const config = { theme: "dark" };

    try {
        const value = config[key];
        if (value === undefined) {
            throw new Error(`Config key "${key}" not found`);
        }
        return value;
    } catch (error) {
        console.log("Using fallback for:", key);
        const defaults = { theme: "light", language: "en" };
        return defaults[key] || null;
    }
}

console.log("Theme:", getConfig("theme"));
console.log("Language:", getConfig("language"));

// Solution 2: Retry with Backoff
console.log("\n--- Retry with Backoff ---");

async function retryWithBackoff(fn, options = {}) {
    const { maxRetries = 3, baseDelay = 100, maxDelay = 5000 } = options;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            if (attempt === maxRetries - 1) throw error;

            const delayMs = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
            console.log(`Retry ${attempt + 1} after ${delayMs}ms`);
            await delay(delayMs);
        }
    }
}

let attempts = 0;
retryWithBackoff(async () => {
    attempts++;
    if (attempts < 3) throw new Error("Temporary failure");
    return "Success!";
}).then(result => console.log("Result:", result));

// Solution 3: Circuit Breaker
console.log("\n--- Circuit Breaker ---");

class CircuitBreaker {
    constructor(options = {}) {
        this.failureThreshold = options.failureThreshold || 3;
        this.resetTimeout = options.resetTimeout || 10000;
        this.failures = 0;
        this.state = "CLOSED";
        this.lastFailure = null;
    }

    async execute(fn) {
        if (this.state === "OPEN") {
            if (Date.now() - this.lastFailure > this.resetTimeout) {
                this.state = "HALF-OPEN";
            } else {
                throw new Error("Circuit is OPEN");
            }
        }

        try {
            const result = await fn();
            this.onSuccess();
            return result;
        } catch (error) {
            this.onFailure();
            throw error;
        }
    }

    onSuccess() {
        this.failures = 0;
        this.state = "CLOSED";
    }

    onFailure() {
        this.failures++;
        this.lastFailure = Date.now();

        if (this.failures >= this.failureThreshold) {
            this.state = "OPEN";
            console.log("Circuit OPENED");
        }
    }
}

// Solution 4: Graceful Degradation
console.log("\n--- Graceful Degradation ---");

class FeatureService {
    async getFullFeature() {
        throw new Error("Service unavailable");
    }

    getBasicFeature() {
        return { basic: true, data: "Limited data" };
    }

    async getFeature() {
        try {
            return await this.getFullFeature();
        } catch (error) {
            console.log("Degrading to basic feature");
            return this.getBasicFeature();
        }
    }
}

const service = new FeatureService();
service.getFeature().then(feature => console.log("Feature:", feature));

// Solution 5: Fallback Chain
console.log("\n--- Fallback Chain ---");

async function fetchWithFallbacks(sources) {
    for (const source of sources) {
        try {
            console.log(`Trying: ${source.name}`);
            return await source.fetch();
        } catch (error) {
            console.log(`${source.name} failed: ${error.message}`);
        }
    }
    throw new Error("All sources failed");
}

fetchWithFallbacks([
    { name: "Primary", fetch: () => Promise.reject(new Error("Down")) },
    { name: "Secondary", fetch: () => Promise.reject(new Error("Down")) },
    { name: "Cache", fetch: () => Promise.resolve({ cached: true }) }
]).then(data => console.log("Got data:", data));

// Solution 6: Partial Success
console.log("\n--- Partial Success ---");

async function fetchMultiple(ids) {
    const results = await Promise.allSettled(
        ids.map(async id => {
            if (id === 2) throw new Error("Failed");
            return { id, data: `Data for ${id}` };
        })
    );

    const successful = results
        .filter(r => r.status === "fulfilled")
        .map(r => r.value);

    const failed = results
        .filter(r => r.status === "rejected")
        .map((r, i) => ({ id: ids[i], error: r.reason.message }));

    return { successful, failed };
}

fetchMultiple([1, 2, 3]).then(result => {
    console.log("Successful:", result.successful);
    console.log("Failed:", result.failed);
});

// Solution 7: Self-Healing
console.log("\n--- Self-Healing ---");

class SelfHealingConnection {
    constructor() {
        this.connected = false;
        this.reconnectAttempts = 0;
        this.maxReconnects = 5;
    }

    async connect() {
        this.connected = true;
        console.log("Connected");
    }

    async reconnect() {
        while (this.reconnectAttempts < this.maxReconnects) {
            try {
                await this.connect();
                this.reconnectAttempts = 0;
                return;
            } catch (error) {
                this.reconnectAttempts++;
                await delay(1000 * this.reconnectAttempts);
            }
        }
        throw new Error("Max reconnection attempts reached");
    }

    async execute(fn) {
        try {
            return await fn();
        } catch (error) {
            if (error.message.includes("connection")) {
                await this.reconnect();
                return await fn();
            }
            throw error;
        }
    }
}

// Solution 8: Error Compensation
console.log("\n--- Error Compensation ---");

class Transaction {
    constructor() {
        this.operations = [];
    }

    add(execute, compensate) {
        this.operations.push({ execute, compensate });
    }

    async run() {
        const completed = [];

        try {
            for (const op of this.operations) {
                await op.execute();
                completed.push(op);
            }
        } catch (error) {
            console.log("Rolling back...");
            for (const op of completed.reverse()) {
                try {
                    await op.compensate();
                } catch (compensateError) {
                    console.log("Compensate failed:", compensateError.message);
                }
            }
            throw error;
        }
    }
}

const tx = new Transaction();
tx.add(
    () => console.log("Step 1 executed"),
    () => console.log("Step 1 rolled back")
);
tx.run();
