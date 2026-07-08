/**
 * Lab 053: Non-Mutating Array Methods
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Non-mutating methods return new arrays without modifying the original.
 * 
 * Common non-mutating methods:
 * - concat: Combine arrays
 * - slice: Extract portion
 * - map: Transform elements
 * - filter: Select elements
 * - toSorted, toReversed (ES2023)
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Use concat and slice
 * 2. Understand immutability benefits
 * 3. Chain non-mutating methods
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: concat
console.log("--- concat ---");

const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const arr3 = [7, 8, 9];

const combined = arr1.concat(arr2);
console.log("Combined:", combined);
console.log("Original arr1:", arr1); // Unchanged

// Multiple arrays
const all = arr1.concat(arr2, arr3);
console.log("All:", all);

// With values
const withValues = arr1.concat(4, 5, [6, 7]);
console.log("With values:", withValues);

// Solution 2: slice
console.log("\n--- slice ---");

const letters = ["a", "b", "c", "d", "e"];
console.log("Original:", letters);

// slice(start, end) - end not included
const sliced = letters.slice(1, 4);
console.log("slice(1, 4):", sliced);
console.log("Original unchanged:", letters);

// From start
console.log("slice(2):", letters.slice(2));

// Negative indices
console.log("slice(-2):", letters.slice(-2));
console.log("slice(-3, -1):", letters.slice(-3, -1));

// Copy entire array
const copy = letters.slice();
console.log("Copy:", copy);

// Solution 3: map
console.log("\n--- map ---");

const numbers = [1, 2, 3, 4, 5];

const doubled = numbers.map(n => n * 2);
console.log("Doubled:", doubled);
console.log("Original:", numbers);

// With index
const indexed = numbers.map((n, i) => `${i}: ${n}`);
console.log("Indexed:", indexed);

// Transform objects
const users = [
    { name: "Alice", age: 25 },
    { name: "Bob", age: 30 }
];

const names = users.map(user => user.name);
console.log("Names:", names);

// Solution 4: filter
console.log("\n--- filter ---");

const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const evens = nums.filter(n => n % 2 === 0);
console.log("Evens:", evens);
console.log("Original:", nums);

// Filter objects
const products = [
    { name: "Apple", price: 1.5, inStock: true },
    { name: "Banana", price: 0.75, inStock: true },
    { name: "Orange", price: 2.0, inStock: false }
];

const available = products.filter(p => p.inStock);
console.log("Available:", available.map(p => p.name));

const affordable = products.filter(p => p.price < 1.5);
console.log("Affordable:", affordable.map(p => p.name));

// Solution 5: flat
console.log("\n--- flat ---");

const nested = [1, [2, 3], [4, [5, 6]]];
console.log("Original:", nested);

console.log("flat():", nested.flat());
console.log("flat(2):", nested.flat(2));
console.log("flat(Infinity):", nested.flat(Infinity));

// Solution 6: flatMap
console.log("\n--- flatMap ---");

const sentences = ["Hello World", "How are you"];

// map then flat
const words = sentences.flatMap(s => s.split(" "));
console.log("Words:", words);

// Solution 7: toSorted and toReversed (ES2023)
console.log("\n--- toSorted/toReversed ---");

const original = [3, 1, 4, 1, 5];
console.log("Original:", original);

// toSorted - returns new sorted array
const sorted = original.toSorted((a, b) => a - b);
console.log("toSorted:", sorted);
console.log("Original unchanged:", original);

// toReversed - returns new reversed array
const reversed = original.toReversed();
console.log("toReversed:", reversed);
console.log("Original unchanged:", original);

// Solution 8: toSpliced (ES2023)
console.log("\n--- toSpliced ---");

const items = ["a", "b", "c", "d"];
console.log("Original:", items);

const spliced = items.toSpliced(1, 2, "X", "Y");
console.log("toSpliced:", spliced);
console.log("Original unchanged:", items);

// Solution 9: with (ES2023)
console.log("\n--- with ---");

const arr = [1, 2, 3, 4, 5];
console.log("Original:", arr);

const modified = arr.with(2, 100);
console.log("with(2, 100):", modified);
console.log("Original unchanged:", arr);

// Solution 10: Chaining Non-Mutating Methods
console.log("\n--- Chaining ---");

const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const result = data
    .filter(n => n % 2 === 0)  // [2, 4, 6, 8, 10]
    .map(n => n * 10)          // [20, 40, 60, 80, 100]
    .slice(0, 3);              // [20, 40, 60]

console.log("Chained result:", result);
console.log("Original data:", data);

