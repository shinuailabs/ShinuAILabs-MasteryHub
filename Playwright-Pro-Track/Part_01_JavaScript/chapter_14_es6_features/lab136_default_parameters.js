/**
 * Lab 136: Default Parameters
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Default parameter values in functions:
 * 
 * - Set defaults in function signature
 * - Defaults only apply to undefined
 * - Can use expressions as defaults
 * - Can reference earlier parameters
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Use default parameters
 * 2. Create dynamic defaults
 * 3. Handle edge cases
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Basic Defaults
console.log("--- Basic Defaults ---");

function greet(name = "World") {
    return `Hello, ${name}!`;
}

console.log(greet("John"));
console.log(greet());
console.log(greet(undefined)); // Uses default

// Solution 2: Multiple Defaults
console.log("\n--- Multiple Defaults ---");

function createUser(name = "Anonymous", role = "user", active = true) {
    return { name, role, active };
}

console.log(createUser());
console.log(createUser("John"));
console.log(createUser("Jane", "admin"));
console.log(createUser("Bob", "editor", false));

// Solution 3: Undefined vs Null
console.log("\n--- Undefined vs Null ---");

function test(value = "default") {
    return value;
}

console.log("undefined:", test(undefined)); // "default"
console.log("null:", test(null));           // null (not default!)
console.log("empty string:", test(""));     // "" (not default!)
console.log("0:", test(0));                 // 0 (not default!)

// Solution 4: Expression Defaults
console.log("\n--- Expression Defaults ---");

function getTimestamp(date = new Date()) {
    return date.toISOString();
}

console.log("Now:", getTimestamp());
console.log("Custom:", getTimestamp(new Date("2024-01-01")));

function randomId(prefix = "id", num = Math.random().toString(36).substr(2, 9)) {
    return `${prefix}_${num}`;
}

console.log("Random ID:", randomId());
console.log("Custom prefix:", randomId("user"));

// Solution 5: Reference Earlier Parameters
console.log("\n--- Reference Earlier Parameters ---");

function createRange(start, end = start + 10) {
    const range = [];
    for (let i = start; i <= end; i++) {
        range.push(i);
    }
    return range;
}

console.log("Range:", createRange(5));
console.log("Custom range:", createRange(5, 8));

function greetUser(name, greeting = `Hello, ${name}`) {
    return greeting;
}

console.log(greetUser("John"));

// Solution 6: Function as Default
console.log("\n--- Function as Default ---");

function getDefaultConfig() {
    console.log("Getting default config...");
    return { debug: false, timeout: 5000 };
}

function initialize(config = getDefaultConfig()) {
    return config;
}

console.log("With config:", initialize({ debug: true }));
console.log("Without config:", initialize()); // Calls getDefaultConfig

// Solution 7: Destructuring with Defaults
console.log("\n--- Destructuring with Defaults ---");

function processUser({ name = "Anonymous", age = 0, role = "user" } = {}) {
    return `${name} (${age}) - ${role}`;
}

console.log(processUser({ name: "John", age: 30 }));
console.log(processUser({ name: "Jane" }));
console.log(processUser());

// Solution 8: Required Parameters Pattern
console.log("\n--- Required Parameters ---");

function required(paramName) {
    throw new Error(`Parameter "${paramName}" is required`);
}

function createProduct(name = required("name"), price = required("price")) {
    return { name, price };
}

try {
    console.log(createProduct("Widget", 9.99));
    createProduct("Widget"); // Missing price
} catch (error) {
    console.log("Error:", error.message);
}

// Solution 9: Conditional Defaults
console.log("\n--- Conditional Defaults ---");

function fetchData(url, options = {}) {
    const {
        method = "GET",
        headers = {},
        body = method === "GET" ? undefined : {}
    } = options;
    
    return { url, method, headers, body };
}

console.log("GET:", fetchData("/api/users"));
console.log("POST:", fetchData("/api/users", { method: "POST" }));

// Solution 10: Practical Examples
console.log("\n--- Practical Examples ---");

// Pagination
function paginate(items, page = 1, perPage = 10) {
    const start = (page - 1) * perPage;
    return items.slice(start, start + perPage);
}

const items = Array.from({ length: 50 }, (_, i) => i + 1);
console.log("Page 1:", paginate(items));
console.log("Page 2:", paginate(items, 2));
console.log("Page 1, 5 per page:", paginate(items, 1, 5));

// Logger
function log(message, level = "info", timestamp = new Date().toISOString()) {
    console.log(`[${timestamp}] [${level.toUpperCase()}] ${message}`);
}

log("Application started");
log("Something went wrong", "error");

