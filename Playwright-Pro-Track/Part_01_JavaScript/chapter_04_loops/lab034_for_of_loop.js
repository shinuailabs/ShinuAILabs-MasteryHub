/**
 * Lab 034: for...of Loop
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * The for...of loop iterates over iterable objects (arrays, strings, Maps, Sets).
 * 
 * Syntax:
 * for (const element of iterable) {
 *     // code using element
 * }
 * 
 * - Gives you the VALUES directly
 * - Works with any iterable
 * - Cleaner than traditional for loop for arrays
 * - Cannot access index directly (use entries() if needed)
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Iterate over arrays
 * 2. Iterate over strings
 * 3. Use with Maps and Sets
 * 4. Get index with entries()
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Array Iteration
console.log("--- Array Iteration ---");
const fruits = ["apple", "banana", "orange", "grape"];

for (const fruit of fruits) {
    console.log("Fruit:", fruit);
}

// Solution 2: String Iteration
console.log("\n--- String Iteration ---");
const word = "Hello";

for (const char of word) {
    console.log("Character:", char);
}

// Solution 3: Getting Index with entries()
console.log("\n--- With Index ---");
const colors = ["red", "green", "blue"];

for (const [index, color] of colors.entries()) {
    console.log(`Index ${index}: ${color}`);
}

// Solution 4: Iterating Over Set
console.log("\n--- Set Iteration ---");
const uniqueNumbers = new Set([1, 2, 3, 2, 1, 4]);

for (const num of uniqueNumbers) {
    console.log("Number:", num);
}

// Solution 5: Iterating Over Map
console.log("\n--- Map Iteration ---");
const userMap = new Map([
    ["name", "John"],
    ["age", 30],
    ["city", "NYC"]
]);

// Iterate entries
for (const [key, value] of userMap) {
    console.log(`${key}: ${value}`);
}

// Iterate keys only
console.log("\nKeys only:");
for (const key of userMap.keys()) {
    console.log("Key:", key);
}

// Iterate values only
console.log("\nValues only:");
for (const value of userMap.values()) {
    console.log("Value:", value);
}

// Solution 6: Array of Objects
console.log("\n--- Array of Objects ---");
const users = [
    { name: "Alice", age: 25 },
    { name: "Bob", age: 30 },
    { name: "Charlie", age: 35 }
];

for (const user of users) {
    console.log(`${user.name} is ${user.age} years old`);
}

// With destructuring
console.log("\nWith destructuring:");
for (const { name, age } of users) {
    console.log(`${name} is ${age}`);
}

// Solution 7: NodeList / HTMLCollection (Browser)
console.log("\n--- DOM-like Iteration ---");
// In browser: for (const element of document.querySelectorAll('div'))
// Simulated:
const elements = [
    { tagName: "DIV", id: "header" },
    { tagName: "DIV", id: "content" },
    { tagName: "DIV", id: "footer" }
];

for (const el of elements) {
    console.log(`Element: ${el.tagName}#${el.id}`);
}

// Solution 8: Break and Continue
console.log("\n--- Break and Continue ---");
const numbers = [1, 2, 3, 4, 5, 6, 7, 8];

// Skip even numbers
console.log("Odd numbers:");
for (const num of numbers) {
    if (num % 2 === 0) continue;
    console.log(num);
}

// Break on condition
console.log("\nUntil 5:");
for (const num of numbers) {
    if (num > 5) break;
    console.log(num);
}

// Solution 9: Nested for...of
console.log("\n--- Nested Iteration ---");
const matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
];

for (const row of matrix) {
    let rowStr = "";
    for (const cell of row) {
        rowStr += cell + " ";
    }
    console.log(rowStr);
}

// Solution 10: Generator Functions
console.log("\n--- Generator Iteration ---");
function* numberGenerator() {
    yield 1;
    yield 2;
    yield 3;
}

for (const num of numberGenerator()) {
    console.log("Generated:", num);
}

// Solution 11: Practical - Sum Array
console.log("\n--- Sum Array ---");
const scores = [85, 90, 78, 92, 88];
let total = 0;

for (const score of scores) {
    total += score;
}

console.log("Total:", total);
console.log("Average:", total / scores.length);

