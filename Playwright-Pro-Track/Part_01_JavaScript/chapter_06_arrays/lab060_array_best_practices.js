/**
 * Lab 060: Array Best Practices
 *
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Best practices for working with arrays:
 *
 * 1. Prefer immutable operations
 * 2. Use appropriate methods
 * 3. Avoid sparse arrays
 * 4. Consider performance
 * 5. Use TypeScript for type safety
 *
 * =====================
 * EXERCISE:
 * =====================
 * 1. Apply best practices
 * 2. Choose correct methods
 * 3. Write clean array code
 *
 * =====================
 * SOLUTION:
 * =====================
 */

// Best Practice 1: Prefer Immutable Operations
console.log("--- Immutable Operations ---");

const original = [1, 2, 3];

// BAD: Mutates original
// original.push(4);

// GOOD: Create new array
const withFour = [...original, 4];
console.log("Original:", original);
console.log("New array:", withFour);

// BAD: Mutates with splice
// original.splice(1, 1);

// GOOD: Use filter or toSpliced
const withoutSecond = original.filter((_, i) => i !== 1);
console.log("Without second:", withoutSecond);

// Best Practice 2: Use Appropriate Methods
console.log("\n--- Appropriate Methods ---");

const numbers = [1, 2, 3, 4, 5];

// BAD: forEach for transformation
const doubled1 = [];
numbers.forEach(n => doubled1.push(n * 2));

// GOOD: map for transformation
const doubled2 = numbers.map(n => n * 2);
console.log("Doubled:", doubled2);

// BAD: filter + length for checking existence
const hasEven1 = numbers.filter(n => n % 2 === 0).length > 0;

// GOOD: some for existence check
const hasEven2 = numbers.some(n => n % 2 === 0);
console.log("Has even:", hasEven2);

// BAD: filter + [0] for finding one
const firstEven1 = numbers.filter(n => n % 2 === 0)[0];

// GOOD: find for single element
const firstEven2 = numbers.find(n => n % 2 === 0);
console.log("First even:", firstEven2);

// Best Practice 3: Avoid Sparse Arrays
console.log("\n--- Avoid Sparse Arrays ---");

// BAD: Sparse array
const sparse = [];
sparse[100] = "value";
console.log("Sparse length:", sparse.length); // 101!

// GOOD: Use object or Map for sparse data
const sparseData = new Map();
sparseData.set(100, "value");
console.log("Map size:", sparseData.size); // 1

// Best Practice 4: Check Before Access
console.log("\n--- Safe Access ---");

const items = ["a", "b", "c"];

// BAD: Direct access without check
// const item = items[10].toUpperCase(); // Error!

// GOOD: Check first
const item = items[10]?.toUpperCase() ?? "default";
console.log("Safe access:", item);

// GOOD: Use at() for negative indices
const last = items.at(-1);
console.log("Last item:", last);

// Best Practice 5: Efficient Searching
console.log("\n--- Efficient Searching ---");

const largeArray = Array.from({ length: 1000 }, (_, i) => i);

// For frequent lookups, use Set
const lookupSet = new Set(largeArray);

// Array: O(n)
console.log("Array includes:", largeArray.includes(500));

// Set: O(1) average
console.log("Set has:", lookupSet.has(500));

// Best Practice 6: Avoid Modifying During Iteration
console.log("\n--- Safe Iteration ---");

// BAD: Modifying while iterating
// for (let i = 0; i < arr.length; i++) {
//     if (condition) arr.splice(i, 1); // Dangerous!
// }

// GOOD: Filter to new array
const data = [1, 2, 3, 4, 5];
const filtered = data.filter(n => n % 2 !== 0);
console.log("Filtered:", filtered);

// GOOD: Iterate backwards if must modify
const toModify = [1, 2, 3, 4, 5];
for (let i = toModify.length - 1; i >= 0; i--) {
    if (toModify[i] % 2 === 0) {
        toModify.splice(i, 1);
    }
}
console.log("Modified:", toModify);

// Best Practice 7: Use Destructuring
console.log("\n--- Destructuring ---");

const coords = [10, 20, 30];

// BAD
const x1 = coords[0];
const y1 = coords[1];

// GOOD
const [x2, y2, z2] = coords;
console.log("Coords:", x2, y2, z2);

// Best Practice 8: Chain Methods Wisely
console.log("\n--- Method Chaining ---");

const users = [
    { name: "Alice", age: 25, active: true },
    { name: "Bob", age: 30, active: false },
    { name: "Charlie", age: 35, active: true }
];

// GOOD: Chain for readability
const activeNames = users
    .filter(u => u.active)
    .map(u => u.name)
    .sort();
console.log("Active names:", activeNames);

// Consider reduce for single pass
const result = users.reduce((acc, u) => {
    if (u.active) acc.push(u.name);
    return acc;
}, []).sort();
console.log("Single pass:", result);

// Best Practice 9: Use Array.isArray
console.log("\n--- Type Checking ---");

function processItems(items) {
    if (!Array.isArray(items)) {
        console.log("Not an array!");
        return [];
    }
    return items.map(i => i.toString());
}

console.log(processItems([1, 2, 3]));
console.log(processItems("not array"));

// Summary
console.log("\n--- Summary ---");
console.log("1. Prefer immutable: map, filter, slice, spread");
console.log("2. Use find/some/every instead of filter+check");
console.log("3. Avoid sparse arrays");
console.log("4. Use Set for frequent lookups");
console.log("5. Don't modify during iteration");
console.log("6. Use destructuring");
console.log("7. Chain methods for readability");