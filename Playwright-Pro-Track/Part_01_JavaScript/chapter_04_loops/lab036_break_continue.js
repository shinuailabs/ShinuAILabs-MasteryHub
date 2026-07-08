/**
 * Lab 036: break and continue Statements
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Control statements that alter loop flow:
 * 
 * break: Exits the loop entirely
 * continue: Skips current iteration, continues to next
 * 
 * Both work with:
 * - for loops
 * - while loops
 * - do...while loops
 * - for...of loops
 * - for...in loops
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Use break to exit loops early
 * 2. Use continue to skip iterations
 * 3. Use labels for nested loops
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Basic break
console.log("--- Basic break ---");
for (let i = 1; i <= 10; i++) {
    if (i === 5) {
        console.log("Breaking at 5");
        break;
    }
    console.log("Count:", i);
}

// Solution 2: Search with break
console.log("\n--- Search with break ---");
const users = ["Alice", "Bob", "Charlie", "David"];
const searchName = "Charlie";
let foundIndex = -1;

for (let i = 0; i < users.length; i++) {
    if (users[i] === searchName) {
        foundIndex = i;
        break; // Stop searching once found
    }
}

console.log(`Found "${searchName}" at index: ${foundIndex}`);

// Solution 3: Basic continue
console.log("\n--- Basic continue ---");
for (let i = 1; i <= 10; i++) {
    if (i % 2 === 0) {
        continue; // Skip even numbers
    }
    console.log("Odd:", i);
}

// Solution 4: Skip Invalid Data
console.log("\n--- Skip Invalid Data ---");
const data = [10, null, 25, undefined, 30, NaN, 45];

let sum = 0;
for (const value of data) {
    if (value === null || value === undefined || Number.isNaN(value)) {
        console.log("Skipping invalid:", value);
        continue;
    }
    sum += value;
}
console.log("Sum of valid numbers:", sum);

// Solution 5: Combining break and continue
console.log("\n--- Combine break and continue ---");
const numbers = [1, 2, 3, -1, 4, 5, -1, 6];

console.log("Process until -1, skip even:");
for (const num of numbers) {
    if (num === -1) {
        console.log("Found -1, stopping");
        break;
    }
    if (num % 2 === 0) {
        continue;
    }
    console.log("Processing:", num);
}

// Solution 6: break in while loop
console.log("\n--- break in while ---");
let attempts = 0;
const maxAttempts = 10;

while (true) {
    attempts++;
    const success = attempts === 3; // Simulated success
    
    console.log(`Attempt ${attempts}: ${success ? "Success!" : "Failed"}`);
    
    if (success) {
        break;
    }
    
    if (attempts >= maxAttempts) {
        console.log("Max attempts reached");
        break;
    }
}

// Solution 7: Labeled Statements (Nested Loops)
console.log("\n--- Labeled break ---");
const matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
];
const target = 5;

outerLoop: for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
        console.log(`Checking [${i}][${j}] = ${matrix[i][j]}`);
        if (matrix[i][j] === target) {
            console.log(`Found ${target} at [${i}][${j}]`);
            break outerLoop; // Breaks outer loop
        }
    }
}

// Solution 8: Labeled continue
console.log("\n--- Labeled continue ---");
outerLoop2: for (let i = 1; i <= 3; i++) {
    for (let j = 1; j <= 3; j++) {
        if (j === 2) {
            continue outerLoop2; // Skip rest of inner loop, continue outer
        }
        console.log(`i=${i}, j=${j}`);
    }
}

// Solution 9: Practical - Process Valid Items
console.log("\n--- Process Valid Items ---");
const items = [
    { name: "Item 1", active: true },
    { name: "Item 2", active: false },
    { name: "Item 3", active: true },
    { name: "STOP", active: true },
    { name: "Item 4", active: true }
];

for (const item of items) {
    if (item.name === "STOP") {
        console.log("Stop marker found");
        break;
    }
    
    if (!item.active) {
        console.log(`Skipping inactive: ${item.name}`);
        continue;
    }
    
    console.log(`Processing: ${item.name}`);
}

// Solution 10: When to Use
console.log("\n--- Guidelines ---");
console.log("Use break when:");
console.log("  - Search found");
console.log("  - Error condition");
console.log("  - Maximum reached");
console.log("\nUse continue when:");
console.log("  - Skip invalid data");
console.log("  - Filter conditions");
console.log("  - Guard clauses in loops");

