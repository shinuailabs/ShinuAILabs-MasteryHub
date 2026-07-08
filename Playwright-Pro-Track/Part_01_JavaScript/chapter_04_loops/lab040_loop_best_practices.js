/**
 * Lab 040: Loop Best Practices
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Best practices for writing efficient, readable loops:
 * 
 * 1. Choose the right loop type
 * 2. Cache array length when needed
 * 3. Minimize work inside loops
 * 4. Use meaningful variable names
 * 5. Consider array methods
 * 6. Avoid modifying collection while iterating
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Apply best practices
 * 2. Optimize loop performance
 * 3. Write clean, readable loops
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Best Practice 1: Choose Right Loop Type
console.log("--- Choose Right Loop ---");

const array = [1, 2, 3, 4, 5];
const object = { a: 1, b: 2, c: 3 };

// for...of for arrays
console.log("for...of for arrays:");
for (const item of array) {
    console.log("  ", item);
}

// for...in for objects
console.log("for...in for objects:");
for (const key in object) {
    console.log(`  ${key}: ${object[key]}`);
}

// for loop when you need index
console.log("for loop when index needed:");
for (let i = 0; i < array.length; i++) {
    console.log(`  Index ${i}: ${array[i]}`);
}

// while for unknown iterations
console.log("while for unknown iterations");

// Best Practice 2: Cache Array Length
console.log("\n--- Cache Length ---");

// In performance-critical code
const largeArray = Array(100).fill(0);

// Good: Cache length
const len = largeArray.length;
for (let i = 0; i < len; i++) {
    // Process
}
console.log("Cached length - better for large arrays");

// Best Practice 3: Minimize Work Inside Loop
console.log("\n--- Minimize Loop Work ---");

// BAD: Calculate inside loop
function badLoop(items) {
    for (const item of items) {
        const tax = 0.08; // Recalculated every iteration
        const price = item * (1 + tax);
    }
}

// GOOD: Calculate outside loop
function goodLoop(items) {
    const tax = 0.08;
    const taxMultiplier = 1 + tax; // Calculate once
    
    for (const item of items) {
        const price = item * taxMultiplier;
    }
}
console.log("Move calculations outside loop when possible");

// Best Practice 4: Meaningful Variable Names
console.log("\n--- Meaningful Names ---");

// BAD: Generic names
// for (let i = 0; i < users.length; i++) {
//     const x = users[i];
// }

// GOOD: Descriptive names
const users = [{ name: "Alice" }, { name: "Bob" }];
for (const user of users) {
    console.log("User:", user.name);
}

// For nested loops, use meaningful names
const rows = [[1, 2], [3, 4]];
for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
    for (let colIndex = 0; colIndex < rows[rowIndex].length; colIndex++) {
        // rowIndex and colIndex are clearer than i and j
    }
}
console.log("Use descriptive variable names");

// Best Practice 5: Don't Modify Collection While Iterating
console.log("\n--- Don't Modify While Iterating ---");

// BAD: Modifying array while iterating
// const items = [1, 2, 3, 4, 5];
// for (let i = 0; i < items.length; i++) {
//     if (items[i] % 2 === 0) {
//         items.splice(i, 1); // Dangerous!
//     }
// }

// GOOD: Filter to new array
const items = [1, 2, 3, 4, 5];
const oddItems = items.filter(item => item % 2 !== 0);
console.log("Use filter instead of splice:", oddItems);

// Or iterate backwards if you must modify
const items2 = [1, 2, 3, 4, 5];
for (let i = items2.length - 1; i >= 0; i--) {
    if (items2[i] % 2 === 0) {
        items2.splice(i, 1);
    }
}
console.log("Backwards iteration if must modify:", items2);

// Best Practice 6: Early Exit
console.log("\n--- Early Exit ---");

function findUser(users, id) {
    for (const user of users) {
        if (user.id === id) {
            return user; // Exit as soon as found
        }
    }
    return null;
}
console.log("Return early when found");

// Best Practice 7: Consider Array Methods
console.log("\n--- Array Methods ---");

const numbers = [1, 2, 3, 4, 5];

// Instead of loop for transformation
const doubled = numbers.map(n => n * 2);
console.log("map for transformation:", doubled);

// Instead of loop for filtering
const evens = numbers.filter(n => n % 2 === 0);
console.log("filter for filtering:", evens);

// Instead of loop for aggregation
const sum = numbers.reduce((acc, n) => acc + n, 0);
console.log("reduce for aggregation:", sum);

// Best Practice 8: Summary Table
console.log("\n--- Quick Reference ---");
console.log("┌────────────────────┬──────────────────────┐");
console.log("│ Scenario           │ Best Choice          │");
console.log("├────────────────────┼──────────────────────┤");
console.log("│ Array iteration    │ for...of             │");
console.log("│ Object properties  │ for...in             │");
console.log("│ Need index         │ for loop             │");
console.log("│ Transform array    │ map()                │");
console.log("│ Filter array       │ filter()             │");
console.log("│ Find one element   │ find()               │");
console.log("│ Sum/aggregate      │ reduce()             │");
console.log("│ Unknown iterations │ while                │");
console.log("│ At least once      │ do...while           │");
console.log("└────────────────────┴──────────────────────┘");

