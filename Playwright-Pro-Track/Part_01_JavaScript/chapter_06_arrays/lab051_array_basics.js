/**
 * Lab 051: Array Basics
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Arrays are ordered collections of values.
 * 
 * Key features:
 * - Zero-indexed (first element at index 0)
 * - Can hold mixed types
 * - Dynamic size
 * - Reference type (passed by reference)
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create arrays
 * 2. Access elements
 * 3. Modify arrays
 * 4. Check array properties
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Creating Arrays
console.log("--- Creating Arrays ---");

// Array literal (preferred)
const fruits = ["apple", "banana", "orange"];
console.log("Fruits:", fruits);

// Array constructor
const numbers = new Array(1, 2, 3, 4, 5);
console.log("Numbers:", numbers);

// Empty array
const empty = [];
console.log("Empty:", empty);

// Array with size (creates sparse array)
const sized = new Array(3);
console.log("Sized:", sized, "Length:", sized.length);

// Array.of()
const arrayOf = Array.of(1, 2, 3);
console.log("Array.of:", arrayOf);

// Solution 2: Accessing Elements
console.log("\n--- Accessing Elements ---");

const colors = ["red", "green", "blue", "yellow"];

console.log("First:", colors[0]);
console.log("Second:", colors[1]);
console.log("Last:", colors[colors.length - 1]);
console.log("Out of bounds:", colors[10]); // undefined

// Using at() (supports negative indices)
console.log("at(0):", colors.at(0));
console.log("at(-1):", colors.at(-1)); // Last element
console.log("at(-2):", colors.at(-2)); // Second to last

// Solution 3: Modifying Elements
console.log("\n--- Modifying Elements ---");

const items = ["a", "b", "c"];
console.log("Original:", items);

items[1] = "B";
console.log("After modify:", items);

items[5] = "F"; // Creates sparse array
console.log("After sparse:", items);
console.log("Length:", items.length);

// Solution 4: Array Length
console.log("\n--- Array Length ---");

const arr = [1, 2, 3, 4, 5];
console.log("Length:", arr.length);

// Truncate array
arr.length = 3;
console.log("After truncate:", arr);

// Extend array
arr.length = 5;
console.log("After extend:", arr);

// Solution 5: Mixed Types
console.log("\n--- Mixed Types ---");

const mixed = [
    42,
    "hello",
    true,
    null,
    { name: "object" },
    [1, 2, 3],
    function() { return "function"; }
];

console.log("Number:", mixed[0]);
console.log("String:", mixed[1]);
console.log("Boolean:", mixed[2]);
console.log("Object:", mixed[4]);
console.log("Nested array:", mixed[5]);
console.log("Function:", mixed[6]());

// Solution 6: Checking if Array
console.log("\n--- Checking Array ---");

console.log("Array.isArray([]):", Array.isArray([]));
console.log("Array.isArray({}):", Array.isArray({}));
console.log("Array.isArray('string'):", Array.isArray("string"));

// Solution 7: Array Destructuring
console.log("\n--- Destructuring ---");

const [first, second, third] = ["a", "b", "c"];
console.log("First:", first);
console.log("Second:", second);

// Skip elements
const [, , thirdOnly] = ["x", "y", "z"];
console.log("Third only:", thirdOnly);

// Rest pattern
const [head, ...tail] = [1, 2, 3, 4, 5];
console.log("Head:", head);
console.log("Tail:", tail);

// Default values
const [a, b, c = "default"] = [1, 2];
console.log("With default:", a, b, c);

// Solution 8: Spread Operator
console.log("\n--- Spread Operator ---");

const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];

// Combine arrays
const combined = [...arr1, ...arr2];
console.log("Combined:", combined);

// Copy array
const copy = [...arr1];
console.log("Copy:", copy);

// Insert in middle
const inserted = [...arr1.slice(0, 2), "new", ...arr1.slice(2)];
console.log("Inserted:", inserted);

// Solution 9: Reference vs Value
console.log("\n--- Reference Behavior ---");

const original = [1, 2, 3];
const reference = original;
const copied = [...original];

reference[0] = 100;
console.log("Original:", original); // Changed!
console.log("Reference:", reference);
console.log("Copied:", copied); // Unchanged

