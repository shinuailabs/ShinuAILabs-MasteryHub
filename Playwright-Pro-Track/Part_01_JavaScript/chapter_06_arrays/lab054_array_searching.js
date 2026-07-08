/**
 * Lab 054: Array Searching Methods
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Methods to find elements in arrays:
 * 
 * - indexOf/lastIndexOf: Find index by value
 * - includes: Check if value exists
 * - find: Find first matching element
 * - findIndex: Find index of first match
 * - findLast/findLastIndex (ES2023)
 * - some/every: Test conditions
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Search for values and indices
 * 2. Use predicates for complex searches
 * 3. Test array conditions
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: indexOf
console.log("--- indexOf ---");

const fruits = ["apple", "banana", "orange", "banana", "grape"];

console.log("indexOf('banana'):", fruits.indexOf("banana")); // 1
console.log("indexOf('mango'):", fruits.indexOf("mango"));   // -1

// Start from index
console.log("indexOf('banana', 2):", fruits.indexOf("banana", 2)); // 3

// Solution 2: lastIndexOf
console.log("\n--- lastIndexOf ---");

console.log("lastIndexOf('banana'):", fruits.lastIndexOf("banana")); // 3

// Search backwards from index
console.log("lastIndexOf('banana', 2):", fruits.lastIndexOf("banana", 2)); // 1

// Solution 3: includes
console.log("\n--- includes ---");

console.log("includes('apple'):", fruits.includes("apple"));   // true
console.log("includes('mango'):", fruits.includes("mango"));   // false

// With start index
console.log("includes('apple', 1):", fruits.includes("apple", 1)); // false

// NaN handling (indexOf fails, includes works)
const withNaN = [1, 2, NaN, 4];
console.log("indexOf(NaN):", withNaN.indexOf(NaN));     // -1
console.log("includes(NaN):", withNaN.includes(NaN));   // true

// Solution 4: find
console.log("\n--- find ---");

const numbers = [5, 12, 8, 130, 44];

const found = numbers.find(n => n > 10);
console.log("First > 10:", found); // 12

const notFound = numbers.find(n => n > 200);
console.log("First > 200:", notFound); // undefined

// Find in objects
const users = [
    { id: 1, name: "Alice", active: false },
    { id: 2, name: "Bob", active: true },
    { id: 3, name: "Charlie", active: true }
];

const activeUser = users.find(u => u.active);
console.log("First active:", activeUser);

const userById = users.find(u => u.id === 2);
console.log("User id 2:", userById);

// Solution 5: findIndex
console.log("\n--- findIndex ---");

const index = numbers.findIndex(n => n > 10);
console.log("Index of first > 10:", index); // 1

const notFoundIndex = numbers.findIndex(n => n > 200);
console.log("Index of first > 200:", notFoundIndex); // -1

// Solution 6: findLast and findLastIndex (ES2023)
console.log("\n--- findLast/findLastIndex ---");

const nums = [5, 12, 8, 130, 44];

const lastOver10 = nums.findLast(n => n > 10);
console.log("Last > 10:", lastOver10); // 44

const lastIndex = nums.findLastIndex(n => n > 10);
console.log("Index of last > 10:", lastIndex); // 4

// Solution 7: some
console.log("\n--- some ---");

const scores = [45, 72, 88, 65, 91];

const hasPassingScore = scores.some(s => s >= 60);
console.log("Has passing score:", hasPassingScore); // true

const hasFailingScore = scores.some(s => s < 60);
console.log("Has failing score:", hasFailingScore); // true

const hasPerfectScore = scores.some(s => s === 100);
console.log("Has perfect score:", hasPerfectScore); // false

// Solution 8: every
console.log("\n--- every ---");

const allPassing = scores.every(s => s >= 60);
console.log("All passing:", allPassing); // false

const allPositive = scores.every(s => s > 0);
console.log("All positive:", allPositive); // true

// Empty array returns true for every
console.log("Empty every:", [].every(x => x > 0)); // true

// Solution 9: Combining Search Methods
console.log("\n--- Combining Methods ---");

const products = [
    { name: "Laptop", price: 999, inStock: true },
    { name: "Phone", price: 699, inStock: false },
    { name: "Tablet", price: 499, inStock: true },
    { name: "Watch", price: 299, inStock: true }
];

// Check if any product is out of stock
const hasOutOfStock = products.some(p => !p.inStock);
console.log("Has out of stock:", hasOutOfStock);

// Check if all products are affordable (< 1000)
const allAffordable = products.every(p => p.price < 1000);
console.log("All affordable:", allAffordable);

// Find cheapest in-stock product
const cheapestInStock = products
    .filter(p => p.inStock)
    .sort((a, b) => a.price - b.price)
    .find(p => true);
console.log("Cheapest in stock:", cheapestInStock?.name);

// Solution 10: Search Performance
console.log("\n--- Performance Tips ---");
console.log("indexOf/includes: O(n) - linear search");
console.log("For frequent lookups, consider Set or Map");

const arr = [1, 2, 3, 4, 5];
const set = new Set(arr);

console.log("Array includes:", arr.includes(3));
console.log("Set has:", set.has(3)); // O(1) average

