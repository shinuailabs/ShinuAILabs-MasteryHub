/**
 * Lab 035: for...in Loop
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * The for...in loop iterates over enumerable properties of an object.
 * 
 * Syntax:
 * for (const key in object) {
 *     // code using key
 * }
 * 
 * - Gives you the KEYS (property names)
 * - Works with objects
 * - Can work with arrays (but not recommended)
 * - Includes inherited enumerable properties
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Iterate over object properties
 * 2. Understand difference from for...of
 * 3. Use hasOwnProperty for safety
 * 4. Know when NOT to use for...in
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Basic Object Iteration
console.log("--- Object Iteration ---");
const user = {
    name: "John",
    age: 30,
    email: "john@example.com"
};

for (const key in user) {
    console.log(`${key}: ${user[key]}`);
}

// Solution 2: With hasOwnProperty
console.log("\n--- hasOwnProperty ---");

// Parent object
const parent = { inherited: "I am inherited" };

// Child object
const child = Object.create(parent);
child.own = "I am own property";

console.log("Without hasOwnProperty:");
for (const key in child) {
    console.log(`${key}: ${child[key]}`);
}

console.log("\nWith hasOwnProperty:");
for (const key in child) {
    if (child.hasOwnProperty(key)) {
        console.log(`${key}: ${child[key]}`);
    }
}

// Modern: Object.hasOwn() (ES2022)
console.log("\nWith Object.hasOwn:");
for (const key in child) {
    if (Object.hasOwn(child, key)) {
        console.log(`${key}: ${child[key]}`);
    }
}

// Solution 3: for...in with Arrays (NOT recommended)
console.log("\n--- for...in with Array (Don't do this!) ---");
const arr = ["a", "b", "c"];

// for...in gives indices as strings
for (const index in arr) {
    console.log(`Index: ${index}, Type: ${typeof index}`); // "0", "1", "2"
}

// Use for...of instead
console.log("\nUse for...of for arrays:");
for (const value of arr) {
    console.log(`Value: ${value}`);
}

// Solution 4: Comparing for...in and for...of
console.log("\n--- for...in vs for...of ---");
const sampleArray = ["x", "y", "z"];

console.log("for...in (keys/indices):");
for (const x in sampleArray) {
    console.log(x); // 0, 1, 2 (indices)
}

console.log("\nfor...of (values):");
for (const x of sampleArray) {
    console.log(x); // x, y, z (values)
}

// Solution 5: Dynamic Property Access
console.log("\n--- Dynamic Property Access ---");
const config = {
    apiUrl: "https://api.example.com",
    timeout: 5000,
    retries: 3,
    debug: false
};

function printConfig(obj) {
    console.log("Configuration:");
    for (const setting in obj) {
        console.log(`  ${setting}: ${obj[setting]}`);
    }
}

printConfig(config);

// Solution 6: Counting Properties
console.log("\n--- Count and List Properties ---");
const product = {
    name: "Laptop",
    price: 999,
    brand: "TechCorp",
    inStock: true
};

let propertyCount = 0;
const propertyNames = [];

for (const prop in product) {
    propertyCount++;
    propertyNames.push(prop);
}

console.log("Property count:", propertyCount);
console.log("Property names:", propertyNames);

// Solution 7: Filtering Properties
console.log("\n--- Filter by Type ---");
const mixed = {
    name: "Test",
    count: 42,
    active: true,
    items: [1, 2, 3],
    handler: function() {}
};

console.log("String properties:");
for (const key in mixed) {
    if (typeof mixed[key] === "string") {
        console.log(`  ${key}: ${mixed[key]}`);
    }
}

console.log("\nNumber properties:");
for (const key in mixed) {
    if (typeof mixed[key] === "number") {
        console.log(`  ${key}: ${mixed[key]}`);
    }
}

// Solution 8: Object Cloning
console.log("\n--- Shallow Clone ---");
const original = { a: 1, b: 2, c: 3 };
const clone = {};

for (const key in original) {
    if (original.hasOwnProperty(key)) {
        clone[key] = original[key];
    }
}

console.log("Original:", original);
console.log("Clone:", clone);

// Solution 9: Best Practices
console.log("\n--- Best Practices ---");
console.log("1. Use for...in for objects");
console.log("2. Use for...of for arrays");
console.log("3. Use hasOwnProperty to skip inherited");
console.log("4. Consider Object.keys/values/entries instead");

// Modern alternatives
console.log("\nModern alternatives:");
console.log("Object.keys:", Object.keys(user));
console.log("Object.values:", Object.values(user));
console.log("Object.entries:", Object.entries(user));

