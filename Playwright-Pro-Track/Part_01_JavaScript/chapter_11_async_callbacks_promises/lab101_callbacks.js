/**
 * Lab 101: Callbacks
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Callbacks are functions passed as arguments to other functions,
 * executed after an operation completes.
 * 
 * Common patterns:
 * - Synchronous callbacks (array methods)
 * - Asynchronous callbacks (timers, events)
 * - Error-first callbacks (Node.js style)
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Use synchronous callbacks
 * 2. Handle async operations
 * 3. Implement error-first pattern
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Synchronous Callbacks
console.log("--- Synchronous Callbacks ---");

// Array methods use callbacks
const numbers = [1, 2, 3, 4, 5];

// forEach callback
numbers.forEach((num, index) => {
    console.log(`Index ${index}: ${num}`);
});

// map callback
const doubled = numbers.map(num => num * 2);
console.log("Doubled:", doubled);

// filter callback
const evens = numbers.filter(num => num % 2 === 0);
console.log("Evens:", evens);

// Solution 2: Custom Callback Function
console.log("\n--- Custom Callback ---");

function processData(data, callback) {
    // Process the data
    const result = data.toUpperCase();
    // Call the callback with result
    callback(result);
}

processData("hello", (result) => {
    console.log("Processed:", result);
});

// Solution 3: Asynchronous Callbacks
console.log("\n--- Async Callbacks ---");

// setTimeout
console.log("Before timeout");
setTimeout(() => {
    console.log("Inside timeout (after 100ms)");
}, 100);
console.log("After timeout (runs first!)");

// setInterval
let count = 0;
const intervalId = setInterval(() => {
    count++;
    console.log("Interval count:", count);
    if (count >= 3) {
        clearInterval(intervalId);
    }
}, 50);

// Solution 4: Error-First Callbacks
console.log("\n--- Error-First Pattern ---");

function fetchData(id, callback) {
    // Simulate async operation
    setTimeout(() => {
        if (id < 0) {
            callback(new Error("Invalid ID"), null);
        } else {
            callback(null, { id, name: "Item " + id });
        }
    }, 100);
}

// Usage
fetchData(1, (error, data) => {
    if (error) {
        console.error("Error:", error.message);
        return;
    }
    console.log("Data:", data);
});

fetchData(-1, (error, data) => {
    if (error) {
        console.error("Error:", error.message);
        return;
    }
    console.log("Data:", data);
});

// Solution 5: Callback Hell (Problem)
console.log("\n--- Callback Hell ---");

function step1(callback) {
    setTimeout(() => callback("Step 1 done"), 50);
}

function step2(prev, callback) {
    setTimeout(() => callback(prev + " -> Step 2 done"), 50);
}

function step3(prev, callback) {
    setTimeout(() => callback(prev + " -> Step 3 done"), 50);
}

// Nested callbacks (callback hell)
step1((result1) => {
    console.log(result1);
    step2(result1, (result2) => {
        console.log(result2);
        step3(result2, (result3) => {
            console.log(result3);
        });
    });
});

// Solution 6: Handling Multiple Callbacks
console.log("\n--- Multiple Callbacks ---");

function fetchMultiple(ids, callback) {
    const results = [];
    let completed = 0;
    
    ids.forEach((id, index) => {
        setTimeout(() => {
            results[index] = { id, data: `Data for ${id}` };
            completed++;
            
            if (completed === ids.length) {
                callback(null, results);
            }
        }, Math.random() * 100);
    });
}

fetchMultiple([1, 2, 3], (error, results) => {
    console.log("All results:", results);
});

// Solution 7: Callback with Options
console.log("\n--- Callback with Options ---");

function request(url, options, callback) {
    // If options is a function, it's the callback
    if (typeof options === "function") {
        callback = options;
        options = {};
    }
    
    setTimeout(() => {
        callback(null, { url, options, data: "Response" });
    }, 50);
}

// Both work
request("http://api.com", (err, res) => console.log("Simple:", res.url));
request("http://api.com", { method: "POST" }, (err, res) => console.log("With options:", res.options));

// Solution 8: Converting Callbacks to Promises
console.log("\n--- Promisify ---");

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

const fetchDataPromise = promisify(fetchData);
fetchDataPromise(5)
    .then(data => console.log("Promisified result:", data))
    .catch(err => console.error("Promisified error:", err));

