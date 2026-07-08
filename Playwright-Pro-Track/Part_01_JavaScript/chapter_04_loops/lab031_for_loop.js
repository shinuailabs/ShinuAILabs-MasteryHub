/**
 * Lab 031: for Loop
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * The for loop repeats code a specific number of times.
 * 
 * Syntax:
 * for (initialization; condition; increment) {
 *     // code to repeat
 * }
 * 
 * - initialization: runs once before loop starts
 * - condition: checked before each iteration
 * - increment: runs after each iteration
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create basic counting loops
 * 2. Loop through arrays by index
 * 3. Use different increment patterns
 * 4. Understand loop execution order
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Basic Counting Loop
console.log("--- Basic Counting ---");
for (let i = 1; i <= 5; i++) {
    console.log("Count:", i);
}

// Solution 2: Counting Backwards
console.log("\n--- Counting Backwards ---");
for (let i = 5; i >= 1; i--) {
    console.log("Countdown:", i);
}

// Solution 3: Loop Through Array
console.log("\n--- Array Loop ---");
const fruits = ["apple", "banana", "orange", "grape"];

for (let i = 0; i < fruits.length; i++) {
    console.log(`Index ${i}: ${fruits[i]}`);
}

// Solution 4: Different Increments
console.log("\n--- Even Numbers (increment by 2) ---");
for (let i = 0; i <= 10; i += 2) {
    console.log(i);
}

console.log("\n--- Multiply Pattern ---");
for (let i = 1; i <= 100; i *= 2) {
    console.log(i);
}

// Solution 5: Loop Execution Order
console.log("\n--- Execution Order ---");
for (let i = 0; i < 3; i++) {
    console.log(`Before increment: i = ${i}`);
}
// Order: init → condition → body → increment → condition → body → increment...

// Solution 6: Multiple Variables
console.log("\n--- Multiple Variables ---");
for (let i = 0, j = 10; i < j; i++, j--) {
    console.log(`i: ${i}, j: ${j}`);
}

// Solution 7: Nested Loops
console.log("\n--- Nested Loops (Multiplication Table) ---");
for (let i = 1; i <= 3; i++) {
    let row = "";
    for (let j = 1; j <= 3; j++) {
        row += `${i}×${j}=${i*j}\t`;
    }
    console.log(row);
}

// Solution 8: Building a String
console.log("\n--- Building String ---");
let stars = "";
for (let i = 1; i <= 5; i++) {
    stars += "*";
    console.log(stars);
}

// Solution 9: Summing Numbers
console.log("\n--- Sum of 1 to 10 ---");
let sum = 0;
for (let i = 1; i <= 10; i++) {
    sum += i;
}
console.log("Sum:", sum);

// Solution 10: Finding in Array
console.log("\n--- Finding Element ---");
const numbers = [10, 25, 33, 47, 50];
const target = 33;
let foundIndex = -1;

for (let i = 0; i < numbers.length; i++) {
    if (numbers[i] === target) {
        foundIndex = i;
        break; // Exit early when found
    }
}
console.log(`Found ${target} at index: ${foundIndex}`);

// Solution 11: Reverse Array Iteration
console.log("\n--- Reverse Iteration ---");
const letters = ["a", "b", "c", "d"];
for (let i = letters.length - 1; i >= 0; i--) {
    console.log(letters[i]);
}

// Solution 12: Skip Iterations
console.log("\n--- Skip Odd Numbers ---");
for (let i = 0; i < 10; i++) {
    if (i % 2 !== 0) continue;
    console.log("Even:", i);
}

// Solution 13: Practical - Create Array
console.log("\n--- Generate Array ---");
const squares = [];
for (let i = 1; i <= 5; i++) {
    squares.push(i * i);
}
console.log("Squares:", squares);

// Solution 14: Caution - Modifying Array Length
console.log("\n--- Careful with Length ---");
const items = [1, 2, 3];
const len = items.length; // Cache length for safety

for (let i = 0; i < len; i++) {
    console.log("Item:", items[i]);
}

