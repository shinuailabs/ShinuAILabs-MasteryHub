/**
 * Lab 047: Higher-Order Functions
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Higher-order functions either:
 * 1. Take functions as arguments, OR
 * 2. Return functions
 * 
 * Common examples:
 * - map, filter, reduce
 * - setTimeout, setInterval
 * - Event handlers
 * - Custom utilities
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Use built-in higher-order functions
 * 2. Create custom higher-order functions
 * 3. Compose functions
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Functions as Arguments
console.log("--- Functions as Arguments ---");

function executeOperation(a, b, operation) {
    return operation(a, b);
}

const add = (x, y) => x + y;
const multiply = (x, y) => x * y;

console.log("Add:", executeOperation(5, 3, add));
console.log("Multiply:", executeOperation(5, 3, multiply));
console.log("Inline:", executeOperation(5, 3, (x, y) => x - y));

// Solution 2: Returning Functions
console.log("\n--- Returning Functions ---");

function createGreeter(greeting) {
    return function(name) {
        return `${greeting}, ${name}!`;
    };
}

const sayHello = createGreeter("Hello");
const sayHi = createGreeter("Hi");

console.log(sayHello("Alice"));
console.log(sayHi("Bob"));

// Solution 3: Array Higher-Order Methods
console.log("\n--- Array Methods ---");

const numbers = [1, 2, 3, 4, 5];

// map: transform each element
const doubled = numbers.map(n => n * 2);
console.log("Doubled:", doubled);

// filter: keep elements matching condition
const evens = numbers.filter(n => n % 2 === 0);
console.log("Evens:", evens);

// reduce: accumulate to single value
const sum = numbers.reduce((acc, n) => acc + n, 0);
console.log("Sum:", sum);

// find: first matching element
const firstEven = numbers.find(n => n % 2 === 0);
console.log("First even:", firstEven);

// Solution 4: Custom forEach
console.log("\n--- Custom forEach ---");

function myForEach(array, callback) {
    for (let i = 0; i < array.length; i++) {
        callback(array[i], i, array);
    }
}

myForEach(["a", "b", "c"], (item, index) => {
    console.log(`${index}: ${item}`);
});

// Solution 5: Custom map
console.log("\n--- Custom map ---");

function myMap(array, transform) {
    const result = [];
    for (const item of array) {
        result.push(transform(item));
    }
    return result;
}

const squared = myMap([1, 2, 3], n => n * n);
console.log("Squared:", squared);

// Solution 6: Custom filter
console.log("\n--- Custom filter ---");

function myFilter(array, predicate) {
    const result = [];
    for (const item of array) {
        if (predicate(item)) {
            result.push(item);
        }
    }
    return result;
}

const positives = myFilter([-2, -1, 0, 1, 2], n => n > 0);
console.log("Positives:", positives);

// Solution 7: Function Composition
console.log("\n--- Function Composition ---");

const compose = (...fns) => (x) => 
    fns.reduceRight((acc, fn) => fn(acc), x);

const addOne = x => x + 1;
const double = x => x * 2;
const square = x => x * x;

const composed = compose(square, double, addOne);
// Executes: addOne(5) -> double(6) -> square(12)
console.log("Composed(5):", composed(5)); // 144

// Solution 8: Pipe (left to right)
console.log("\n--- Pipe ---");

const pipe = (...fns) => (x) =>
    fns.reduce((acc, fn) => fn(acc), x);

const piped = pipe(addOne, double, square);
// Executes: addOne(5) -> double(6) -> square(12)
console.log("Piped(5):", piped(5)); // 144

// Solution 9: Partial Application
console.log("\n--- Partial Application ---");

function partial(fn, ...presetArgs) {
    return function(...laterArgs) {
        return fn(...presetArgs, ...laterArgs);
    };
}

function greet(greeting, punctuation, name) {
    return `${greeting}, ${name}${punctuation}`;
}

const greetHello = partial(greet, "Hello", "!");
console.log(greetHello("Alice"));
console.log(greetHello("Bob"));

// Solution 10: Debounce
console.log("\n--- Debounce ---");

function debounce(fn, delay) {
    let timeoutId;
    
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
    };
}

const debouncedLog = debounce((msg) => console.log("Debounced:", msg), 100);
debouncedLog("First");
debouncedLog("Second");
debouncedLog("Third"); // Only this one executes

// Solution 11: Throttle
console.log("\n--- Throttle ---");

function throttle(fn, limit) {
    let inThrottle = false;
    
    return function(...args) {
        if (!inThrottle) {
            fn(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

const throttledLog = throttle((msg) => console.log("Throttled:", msg), 100);
throttledLog("A");
throttledLog("B"); // Ignored
throttledLog("C"); // Ignored

