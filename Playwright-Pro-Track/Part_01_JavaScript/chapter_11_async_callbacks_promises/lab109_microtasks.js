/**
 * Lab 109: Microtasks and Event Loop
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Understanding JavaScript's event loop:
 * 
 * - Call stack: Synchronous code execution
 * - Macrotask queue: setTimeout, setInterval, I/O
 * - Microtask queue: Promises, queueMicrotask
 * 
 * Execution order:
 * 1. Synchronous code
 * 2. All microtasks
 * 3. One macrotask
 * 4. Repeat
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Understand execution order
 * 2. Use queueMicrotask
 * 3. Avoid common pitfalls
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Basic Execution Order
console.log("--- Execution Order ---");

console.log("1. Synchronous");

setTimeout(() => {
    console.log("4. Macrotask (setTimeout)");
}, 0);

Promise.resolve().then(() => {
    console.log("3. Microtask (Promise)");
});

console.log("2. Synchronous");

// Output order: 1, 2, 3, 4

// Solution 2: Microtasks Before Macrotasks
console.log("\n--- Microtasks First ---");

setTimeout(() => console.log("Timeout 1"), 0);
setTimeout(() => console.log("Timeout 2"), 0);

Promise.resolve()
    .then(() => console.log("Promise 1"))
    .then(() => console.log("Promise 2"));

Promise.resolve()
    .then(() => console.log("Promise 3"));

// Output: Promise 1, Promise 3, Promise 2, Timeout 1, Timeout 2

// Solution 3: queueMicrotask
console.log("\n--- queueMicrotask ---");

queueMicrotask(() => {
    console.log("Microtask via queueMicrotask");
});

Promise.resolve().then(() => {
    console.log("Microtask via Promise");
});

// Both are microtasks, execute in order

// Solution 4: Nested Microtasks
console.log("\n--- Nested Microtasks ---");

Promise.resolve().then(() => {
    console.log("Outer microtask");
    
    Promise.resolve().then(() => {
        console.log("Inner microtask");
    });
});

setTimeout(() => {
    console.log("Macrotask");
}, 0);

// Output: Outer, Inner, Macrotask
// Inner microtask runs before macrotask!

// Solution 5: Starvation Example
console.log("\n--- Starvation Warning ---");

// DON'T DO THIS - can starve macrotasks
/*
function recursiveMicrotask() {
    Promise.resolve().then(() => {
        console.log("Microtask");
        recursiveMicrotask(); // Never lets macrotasks run!
    });
}
*/

// Better: Use setTimeout for long-running tasks
function processInChunks(items, chunkSize = 100) {
    let index = 0;
    
    function processChunk() {
        const chunk = items.slice(index, index + chunkSize);
        chunk.forEach(item => console.log("Processing:", item));
        index += chunkSize;
        
        if (index < items.length) {
            setTimeout(processChunk, 0); // Yield to event loop
        }
    }
    
    processChunk();
}

// Solution 6: Promise vs setTimeout Timing
console.log("\n--- Timing Comparison ---");

const start = Date.now();

setTimeout(() => {
    console.log(`setTimeout: ${Date.now() - start}ms`);
}, 0);

Promise.resolve().then(() => {
    console.log(`Promise: ${Date.now() - start}ms`);
});

// Promise resolves faster (microtask)

// Solution 7: Async/Await and Microtasks
console.log("\n--- Async/Await ---");

async function asyncExample() {
    console.log("Async start");
    
    await Promise.resolve();
    // Everything after await is a microtask
    
    console.log("After await");
}

console.log("Before async");
asyncExample();
console.log("After async call");

// Output: Before, Async start, After async call, After await

// Solution 8: MutationObserver (Browser)
console.log("\n--- MutationObserver ---");

/*
// MutationObserver callbacks are microtasks
const observer = new MutationObserver(() => {
    console.log("DOM mutation observed (microtask)");
});

observer.observe(document.body, { childList: true });
document.body.appendChild(document.createElement("div"));
*/

// Solution 9: Practical Example
console.log("\n--- Practical Example ---");

class AsyncQueue {
    constructor() {
        this.queue = [];
        this.processing = false;
    }
    
    add(task) {
        this.queue.push(task);
        this.process();
    }
    
    process() {
        if (this.processing) return;
        this.processing = true;
        
        queueMicrotask(() => {
            while (this.queue.length > 0) {
                const task = this.queue.shift();
                task();
            }
            this.processing = false;
        });
    }
}

const queue = new AsyncQueue();
queue.add(() => console.log("Task 1"));
queue.add(() => console.log("Task 2"));
console.log("Tasks added");
// Output: Tasks added, Task 1, Task 2

// Solution 10: Event Loop Visualization
console.log("\n--- Event Loop Summary ---");

console.log(`
Event Loop Order:
1. Execute all synchronous code (call stack)
2. Execute ALL microtasks (Promise.then, queueMicrotask)
3. Execute ONE macrotask (setTimeout, setInterval)
4. Repeat from step 2

Microtasks:
- Promise.then/catch/finally
- queueMicrotask()
- MutationObserver (browser)

Macrotasks:
- setTimeout/setInterval
- setImmediate (Node.js)
- I/O operations
- UI rendering (browser)
`);

