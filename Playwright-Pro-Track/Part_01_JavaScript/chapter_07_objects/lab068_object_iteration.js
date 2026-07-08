/**
 * Lab 068: Object Iteration
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Ways to iterate over object properties:
 * 
 * - for...in: All enumerable properties (including inherited)
 * - Object.keys(): Own enumerable keys
 * - Object.values(): Own enumerable values
 * - Object.entries(): Own enumerable [key, value] pairs
 * - Object.getOwnPropertyNames(): All own properties
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Iterate using different methods
 * 2. Understand enumerable vs non-enumerable
 * 3. Handle inherited properties
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: for...in Loop
console.log("--- for...in ---");

const person = { name: "Alice", age: 25, city: "NYC" };

for (const key in person) {
    console.log(`${key}: ${person[key]}`);
}

// Solution 2: for...in with Inherited Properties
console.log("\n--- Inherited Properties ---");

const parent = { inherited: "from parent" };
const child = Object.create(parent);
child.own = "own property";

console.log("for...in (includes inherited):");
for (const key in child) {
    console.log(`  ${key}: ${child[key]}`);
}

console.log("\nFiltering own properties:");
for (const key in child) {
    if (child.hasOwnProperty(key)) {
        console.log(`  ${key}: ${child[key]}`);
    }
}

// Solution 3: Object.keys()
console.log("\n--- Object.keys() ---");

const user = { name: "Bob", email: "bob@test.com", active: true };

const keys = Object.keys(user);
console.log("Keys:", keys);

// Iterate
Object.keys(user).forEach(key => {
    console.log(`${key}: ${user[key]}`);
});

// Solution 4: Object.values()
console.log("\n--- Object.values() ---");

const values = Object.values(user);
console.log("Values:", values);

// Sum numeric values
const scores = { math: 90, science: 85, english: 88 };
const total = Object.values(scores).reduce((sum, v) => sum + v, 0);
console.log("Total score:", total);

// Solution 5: Object.entries()
console.log("\n--- Object.entries() ---");

const entries = Object.entries(user);
console.log("Entries:", entries);

// Destructuring in loop
for (const [key, value] of Object.entries(user)) {
    console.log(`${key} = ${value}`);
}

// Transform to Map
const map = new Map(Object.entries(user));
console.log("As Map:", map);

// Solution 6: Object.fromEntries()
console.log("\n--- Object.fromEntries() ---");

// Transform values
const prices = { apple: 1.5, banana: 0.75, orange: 2.0 };
const discounted = Object.fromEntries(
    Object.entries(prices).map(([fruit, price]) => [fruit, price * 0.9])
);
console.log("Discounted:", discounted);

// Filter entries
const expensive = Object.fromEntries(
    Object.entries(prices).filter(([_, price]) => price > 1)
);
console.log("Expensive:", expensive);

// Solution 7: Object.getOwnPropertyNames()
console.log("\n--- getOwnPropertyNames() ---");

const obj = {};
Object.defineProperty(obj, "hidden", {
    value: "secret",
    enumerable: false
});
obj.visible = "public";

console.log("keys():", Object.keys(obj));
console.log("getOwnPropertyNames():", Object.getOwnPropertyNames(obj));

// Solution 8: Reflect.ownKeys()
console.log("\n--- Reflect.ownKeys() ---");

const sym = Symbol("mySymbol");
const objWithSymbol = {
    regular: "value",
    [sym]: "symbol value"
};

console.log("keys():", Object.keys(objWithSymbol));
console.log("Reflect.ownKeys():", Reflect.ownKeys(objWithSymbol));

// Solution 9: Iteration Order
console.log("\n--- Iteration Order ---");

const mixed = {
    b: 2,
    a: 1,
    2: "two",
    1: "one",
    c: 3
};

console.log("Keys:", Object.keys(mixed));
// Order: integer keys (sorted), then string keys (insertion order)

// Solution 10: Practical Examples
console.log("\n--- Practical Examples ---");

// Count property types
const data = { name: "Test", count: 42, active: true, items: [1, 2] };
const typeCounts = {};
for (const value of Object.values(data)) {
    const type = Array.isArray(value) ? "array" : typeof value;
    typeCounts[type] = (typeCounts[type] || 0) + 1;
}
console.log("Type counts:", typeCounts);

// Deep iteration
function iterateDeep(obj, callback, path = "") {
    for (const [key, value] of Object.entries(obj)) {
        const currentPath = path ? `${path}.${key}` : key;
        if (value && typeof value === "object" && !Array.isArray(value)) {
            iterateDeep(value, callback, currentPath);
        } else {
            callback(currentPath, value);
        }
    }
}

const nested = { a: 1, b: { c: 2, d: { e: 3 } } };
console.log("Deep iteration:");
iterateDeep(nested, (path, value) => {
    console.log(`  ${path}: ${value}`);
});

