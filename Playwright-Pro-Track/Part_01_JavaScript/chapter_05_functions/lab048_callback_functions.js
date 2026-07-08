/**
 * Lab 048: Callback Functions
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * A callback is a function passed as an argument to another function,
 * to be executed later.
 * 
 * Uses:
 * - Asynchronous operations
 * - Event handling
 * - Array methods
 * - Custom hooks
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create and use callbacks
 * 2. Handle async operations
 * 3. Understand callback patterns
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Basic Callback
console.log("--- Basic Callback ---");

function processData(data, callback) {
    const result = data.toUpperCase();
    callback(result);
}

processData("hello", function(result) {
    console.log("Processed:", result);
});

// With arrow function
processData("world", (result) => {
    console.log("Arrow callback:", result);
});

// Solution 2: Callback with Return
console.log("\n--- Callback with Return ---");

function transform(value, transformer) {
    return transformer(value);
}

const doubled = transform(5, x => x * 2);
const squared = transform(5, x => x * x);

console.log("Doubled:", doubled);
console.log("Squared:", squared);

// Solution 3: Async Callback (setTimeout)
console.log("\n--- Async Callback ---");

function delayedGreeting(name, callback) {
    console.log("Starting...");
    setTimeout(() => {
        const greeting = `Hello, ${name}!`;
        callback(greeting);
    }, 100);
    console.log("Scheduled (async)");
}

delayedGreeting("Alice", (message) => {
    console.log("Received:", message);
});

// Solution 4: Error-First Callback Pattern
console.log("\n--- Error-First Pattern ---");

function fetchUser(id, callback) {
    setTimeout(() => {
        if (id <= 0) {
            callback(new Error("Invalid ID"), null);
        } else {
            callback(null, { id, name: "User " + id });
        }
    }, 100);
}

fetchUser(1, (error, user) => {
    if (error) {
        console.log("Error:", error.message);
    } else {
        console.log("User:", user);
    }
});

fetchUser(-1, (error, user) => {
    if (error) {
        console.log("Error:", error.message);
    } else {
        console.log("User:", user);
    }
});

// Solution 5: Multiple Callbacks
console.log("\n--- Multiple Callbacks ---");

function processWithCallbacks(data, onSuccess, onError) {
    try {
        if (!data) throw new Error("No data");
        const result = data.toUpperCase();
        onSuccess(result);
    } catch (err) {
        onError(err);
    }
}

processWithCallbacks(
    "test",
    (result) => console.log("Success:", result),
    (error) => console.log("Error:", error.message)
);

processWithCallbacks(
    null,
    (result) => console.log("Success:", result),
    (error) => console.log("Error:", error.message)
);

// Solution 6: Callback in Array Methods
console.log("\n--- Array Method Callbacks ---");

const numbers = [1, 2, 3, 4, 5];

// forEach callback
numbers.forEach((num, index) => {
    console.log(`Index ${index}: ${num}`);
});

// sort callback
const unsorted = [3, 1, 4, 1, 5, 9];
const sorted = unsorted.sort((a, b) => a - b);
console.log("Sorted:", sorted);

// Solution 7: Callback Hell (Problem)
console.log("\n--- Callback Hell ---");

function step1(callback) {
    setTimeout(() => callback("Step 1 done"), 50);
}

function step2(callback) {
    setTimeout(() => callback("Step 2 done"), 50);
}

function step3(callback) {
    setTimeout(() => callback("Step 3 done"), 50);
}

// Nested callbacks (callback hell)
step1((result1) => {
    console.log(result1);
    step2((result2) => {
        console.log(result2);
        step3((result3) => {
            console.log(result3);
            console.log("All steps complete");
        });
    });
});

// Solution 8: Named Callbacks (Better)
console.log("\n--- Named Callbacks ---");

function handleStep1(result) {
    console.log("Named:", result);
    step2(handleStep2);
}

function handleStep2(result) {
    console.log("Named:", result);
    step3(handleStep3);
}

function handleStep3(result) {
    console.log("Named:", result);
}

// Cleaner, but still sequential
// step1(handleStep1);

// Solution 9: Event-Style Callbacks
console.log("\n--- Event Callbacks ---");

function createEventEmitter() {
    const listeners = {};
    
    return {
        on(event, callback) {
            if (!listeners[event]) {
                listeners[event] = [];
            }
            listeners[event].push(callback);
        },
        emit(event, data) {
            if (listeners[event]) {
                listeners[event].forEach(cb => cb(data));
            }
        }
    };
}

const emitter = createEventEmitter();
emitter.on("message", (msg) => console.log("Listener 1:", msg));
emitter.on("message", (msg) => console.log("Listener 2:", msg));
emitter.emit("message", "Hello!");

// Solution 10: Callback Best Practices
console.log("\n--- Best Practices ---");
console.log("1. Always handle errors");
console.log("2. Use error-first pattern for async");
console.log("3. Avoid deep nesting (callback hell)");
console.log("4. Consider Promises for complex async");
console.log("5. Use named functions for readability");

