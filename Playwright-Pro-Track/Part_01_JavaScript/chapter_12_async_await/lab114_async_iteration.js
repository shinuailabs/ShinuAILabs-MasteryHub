/**
 * Lab 114: Async Iteration
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Iterating over async data:
 * 
 * - for...of with await
 * - for await...of
 * - Async generators
 * - Symbol.asyncIterator
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Iterate over async data
 * 2. Create async generators
 * 3. Implement async iterables
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Helper
function delay(ms, value) {
    return new Promise(resolve => setTimeout(() => resolve(value), ms));
}

// Solution 1: Sequential Iteration
console.log("--- Sequential Iteration ---");

async function sequentialIteration() {
    const items = [1, 2, 3, 4, 5];
    
    for (const item of items) {
        const result = await delay(30, item * 2);
        console.log("Sequential:", result);
    }
}

sequentialIteration();

// Solution 2: for await...of
console.log("\n--- for await...of ---");

async function* asyncGenerator() {
    yield await delay(30, 1);
    yield await delay(30, 2);
    yield await delay(30, 3);
}

async function consumeAsyncGenerator() {
    for await (const value of asyncGenerator()) {
        console.log("Async generator:", value);
    }
}

consumeAsyncGenerator();

// Solution 3: Async Generator with Data
console.log("\n--- Async Generator with Data ---");

async function* fetchPages(totalPages) {
    for (let page = 1; page <= totalPages; page++) {
        const data = await delay(30, { page, items: [`Item ${page}a`, `Item ${page}b`] });
        yield data;
    }
}

async function processPages() {
    for await (const page of fetchPages(3)) {
        console.log("Page:", page);
    }
}

processPages();

// Solution 4: Custom Async Iterable
console.log("\n--- Custom Async Iterable ---");

const asyncIterable = {
    data: [10, 20, 30],
    
    [Symbol.asyncIterator]() {
        let index = 0;
        const data = this.data;
        
        return {
            async next() {
                if (index < data.length) {
                    const value = await delay(30, data[index++]);
                    return { value, done: false };
                }
                return { done: true };
            }
        };
    }
};

async function consumeAsyncIterable() {
    for await (const value of asyncIterable) {
        console.log("Custom iterable:", value);
    }
}

consumeAsyncIterable();

// Solution 5: Async Iterator Class
console.log("\n--- Async Iterator Class ---");

class AsyncRange {
    constructor(start, end, delayMs = 30) {
        this.start = start;
        this.end = end;
        this.delayMs = delayMs;
    }
    
    [Symbol.asyncIterator]() {
        let current = this.start;
        const end = this.end;
        const delayMs = this.delayMs;
        
        return {
            async next() {
                if (current <= end) {
                    await delay(delayMs);
                    return { value: current++, done: false };
                }
                return { done: true };
            }
        };
    }
}

async function useAsyncRange() {
    const range = new AsyncRange(1, 5);
    
    for await (const num of range) {
        console.log("Range:", num);
    }
}

useAsyncRange();

// Solution 6: Async Generator with Error Handling
console.log("\n--- Generator Error Handling ---");

async function* generatorWithErrors() {
    try {
        yield await delay(30, "First");
        yield await delay(30, "Second");
        throw new Error("Generator error");
        yield await delay(30, "Third"); // Never reached
    } finally {
        console.log("Generator cleanup");
    }
}

async function handleGeneratorErrors() {
    try {
        for await (const value of generatorWithErrors()) {
            console.log("Value:", value);
        }
    } catch (error) {
        console.log("Caught:", error.message);
    }
}

handleGeneratorErrors();

// Solution 7: Parallel Processing with Iteration
console.log("\n--- Parallel Processing ---");

async function parallelProcess(items, fn, concurrency = 2) {
    const results = [];
    
    async function* chunks() {
        for (let i = 0; i < items.length; i += concurrency) {
            yield items.slice(i, i + concurrency);
        }
    }
    
    for await (const chunk of chunks()) {
        const chunkResults = await Promise.all(chunk.map(fn));
        results.push(...chunkResults);
    }
    
    return results;
}

async function runParallel() {
    const items = [1, 2, 3, 4, 5, 6];
    const results = await parallelProcess(
        items,
        async (item) => {
            await delay(30);
            return item * 2;
        },
        2
    );
    console.log("Parallel results:", results);
}

runParallel();

// Solution 8: Stream-like Processing
console.log("\n--- Stream Processing ---");

async function* streamData() {
    const chunks = ["Hello", " ", "World", "!"];
    for (const chunk of chunks) {
        yield await delay(30, chunk);
    }
}

async function processStream() {
    let result = "";
    for await (const chunk of streamData()) {
        result += chunk;
        console.log("Chunk received:", chunk);
    }
    console.log("Final result:", result);
}

processStream();

// Solution 9: Async Generator Pipeline
console.log("\n--- Generator Pipeline ---");

async function* source() {
    for (let i = 1; i <= 5; i++) {
        yield await delay(20, i);
    }
}

async function* transform(gen, fn) {
    for await (const value of gen) {
        yield fn(value);
    }
}

async function* filter(gen, predicate) {
    for await (const value of gen) {
        if (predicate(value)) yield value;
    }
}

async function pipeline() {
    const doubled = transform(source(), x => x * 2);
    const filtered = filter(doubled, x => x > 4);
    
    for await (const value of filtered) {
        console.log("Pipeline:", value);
    }
}

pipeline();

