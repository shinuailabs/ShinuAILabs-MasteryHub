/**
 * Lab 106: Creating Promises
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Create promises for various scenarios:
 * 
 * - Wrapping callbacks
 * - Wrapping synchronous code
 * - Creating utility promises
 * - Promise factories
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create promises from callbacks
 * 2. Build promise utilities
 * 3. Implement promise patterns
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Basic Promise Creation
console.log("--- Basic Creation ---");

function asyncOperation(value) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (value > 0) {
                resolve(value * 2);
            } else {
                reject(new Error("Value must be positive"));
            }
        }, 50);
    });
}

asyncOperation(5).then(result => console.log("Result:", result));
asyncOperation(-1).catch(error => console.log("Error:", error.message));

// Solution 2: Wrapping setTimeout
console.log("\n--- Delay Promise ---");

function delay(ms, value) {
    return new Promise(resolve => {
        setTimeout(() => resolve(value), ms);
    });
}

delay(100, "Hello after 100ms").then(console.log);

// Solution 3: Wrapping Callbacks
console.log("\n--- Wrapping Callbacks ---");

// Original callback-based function
function readFileCallback(path, callback) {
    setTimeout(() => {
        if (path.includes("error")) {
            callback(new Error("File not found"), null);
        } else {
            callback(null, `Contents of ${path}`);
        }
    }, 50);
}

// Promisified version
function readFile(path) {
    return new Promise((resolve, reject) => {
        readFileCallback(path, (error, data) => {
            if (error) reject(error);
            else resolve(data);
        });
    });
}

readFile("test.txt").then(data => console.log("File:", data));
readFile("error.txt").catch(error => console.log("Error:", error.message));

// Solution 4: Generic Promisify
console.log("\n--- Generic Promisify ---");

function promisify(fn) {
    return function(...args) {
        return new Promise((resolve, reject) => {
            fn(...args, (error, result) => {
                if (error) reject(error);
                else resolve(result);
            });
        });
    };
}

const readFilePromise = promisify(readFileCallback);
readFilePromise("data.txt").then(data => console.log("Promisified:", data));

// Solution 5: Promise from Event
console.log("\n--- Promise from Event ---");

function waitForEvent(emitter, eventName, timeout = 5000) {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
            reject(new Error(`Timeout waiting for ${eventName}`));
        }, timeout);
        
        // Simulated event listener
        setTimeout(() => {
            clearTimeout(timer);
            resolve({ event: eventName, data: "Event data" });
        }, 50);
    });
}

waitForEvent({}, "load", 1000).then(data => console.log("Event:", data));

// Solution 6: Deferred Pattern
console.log("\n--- Deferred Pattern ---");

function createDeferred() {
    let resolve, reject;
    const promise = new Promise((res, rej) => {
        resolve = res;
        reject = rej;
    });
    return { promise, resolve, reject };
}

const deferred = createDeferred();
deferred.promise.then(value => console.log("Deferred resolved:", value));
setTimeout(() => deferred.resolve("Resolved externally"), 100);

// Solution 7: Lazy Promise
console.log("\n--- Lazy Promise ---");

function lazyPromise(fn) {
    let promise = null;
    return function() {
        if (!promise) {
            console.log("Creating promise (first call)");
            promise = fn();
        } else {
            console.log("Returning cached promise");
        }
        return promise;
    };
}

const getLazyData = lazyPromise(() => {
    return new Promise(resolve => {
        setTimeout(() => resolve("Lazy data"), 50);
    });
});

getLazyData().then(data => console.log("First call:", data));
getLazyData().then(data => console.log("Second call:", data));

// Solution 8: Promise Queue
console.log("\n--- Promise Queue ---");

class PromiseQueue {
    constructor() {
        this.queue = Promise.resolve();
    }
    
    add(fn) {
        this.queue = this.queue.then(fn).catch(() => {});
        return this.queue;
    }
}

const queue = new PromiseQueue();
queue.add(() => delay(50).then(() => console.log("Task 1")));
queue.add(() => delay(50).then(() => console.log("Task 2")));
queue.add(() => delay(50).then(() => console.log("Task 3")));

// Solution 9: Cancellable Promise
console.log("\n--- Cancellable Promise ---");

function cancellablePromise(promise) {
    let isCancelled = false;
    
    const wrappedPromise = new Promise((resolve, reject) => {
        promise
            .then(value => {
                if (!isCancelled) resolve(value);
            })
            .catch(error => {
                if (!isCancelled) reject(error);
            });
    });
    
    return {
        promise: wrappedPromise,
        cancel: () => { isCancelled = true; }
    };
}

const { promise: cancellable, cancel } = cancellablePromise(
    delay(200, "Should be cancelled")
);

cancellable.then(value => console.log("Value:", value));
setTimeout(() => {
    cancel();
    console.log("Promise cancelled");
}, 50);

// Solution 10: Promise with Progress
console.log("\n--- Promise with Progress ---");

function promiseWithProgress(total, onProgress) {
    return new Promise(resolve => {
        let current = 0;
        const interval = setInterval(() => {
            current++;
            onProgress(current / total * 100);
            if (current >= total) {
                clearInterval(interval);
                resolve("Complete");
            }
        }, 20);
    });
}

promiseWithProgress(5, (progress) => {
    console.log(`Progress: ${progress}%`);
}).then(result => console.log(result));

