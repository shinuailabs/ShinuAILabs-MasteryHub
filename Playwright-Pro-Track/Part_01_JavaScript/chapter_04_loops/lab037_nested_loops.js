/**
 * Lab 037: Nested Loops
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Nested loops are loops inside loops.
 * 
 * Common uses:
 * - 2D arrays/matrices
 * - Generating patterns
 * - Comparing all pairs
 * - Cartesian products
 * 
 * Complexity: O(n * m) for two nested loops
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create multiplication tables
 * 2. Work with 2D arrays
 * 3. Generate patterns
 * 4. Compare pairs
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Multiplication Table
console.log("--- Multiplication Table ---");
for (let i = 1; i <= 5; i++) {
    let row = "";
    for (let j = 1; j <= 5; j++) {
        row += `${i * j}\t`;
    }
    console.log(row);
}

// Solution 2: 2D Array Access
console.log("\n--- 2D Array ---");
const matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
];

for (let row = 0; row < matrix.length; row++) {
    for (let col = 0; col < matrix[row].length; col++) {
        console.log(`matrix[${row}][${col}] = ${matrix[row][col]}`);
    }
}

// Solution 3: Star Pattern - Triangle
console.log("\n--- Triangle Pattern ---");
const rows = 5;
for (let i = 1; i <= rows; i++) {
    let stars = "";
    for (let j = 1; j <= i; j++) {
        stars += "* ";
    }
    console.log(stars);
}

// Solution 4: Inverted Triangle
console.log("\n--- Inverted Triangle ---");
for (let i = rows; i >= 1; i--) {
    let stars = "";
    for (let j = 1; j <= i; j++) {
        stars += "* ";
    }
    console.log(stars);
}

// Solution 5: Rectangle Pattern
console.log("\n--- Rectangle Pattern ---");
const height = 4;
const width = 6;
for (let i = 0; i < height; i++) {
    let line = "";
    for (let j = 0; j < width; j++) {
        line += "# ";
    }
    console.log(line);
}

// Solution 6: Find Pairs
console.log("\n--- Find Pairs with Sum ---");
const numbers = [1, 2, 3, 4, 5, 6];
const targetSum = 7;

console.log(`Pairs that sum to ${targetSum}:`);
for (let i = 0; i < numbers.length; i++) {
    for (let j = i + 1; j < numbers.length; j++) {
        if (numbers[i] + numbers[j] === targetSum) {
            console.log(`  (${numbers[i]}, ${numbers[j]})`);
        }
    }
}

// Solution 7: Cartesian Product
console.log("\n--- Cartesian Product ---");
const colors = ["red", "blue"];
const sizes = ["S", "M", "L"];

console.log("Product variations:");
for (const color of colors) {
    for (const size of sizes) {
        console.log(`  ${color} - ${size}`);
    }
}

// Solution 8: Matrix Sum
console.log("\n--- Matrix Sum ---");
let sum = 0;
for (const row of matrix) {
    for (const cell of row) {
        sum += cell;
    }
}
console.log("Sum of all elements:", sum);

// Solution 9: Find Element in 2D Array
console.log("\n--- Find in 2D Array ---");
const grid = [
    ["A", "B", "C"],
    ["D", "E", "F"],
    ["G", "H", "I"]
];
const target = "E";
let location = null;

outerLoop: for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
        if (grid[i][j] === target) {
            location = { row: i, col: j };
            break outerLoop;
        }
    }
}

console.log(`Found "${target}" at:`, location);

// Solution 10: Nested Object Iteration
console.log("\n--- Nested Objects ---");
const departments = {
    engineering: ["Alice", "Bob"],
    design: ["Charlie"],
    marketing: ["David", "Eve", "Frank"]
};

for (const dept in departments) {
    console.log(`${dept}:`);
    for (const employee of departments[dept]) {
        console.log(`  - ${employee}`);
    }
}

// Solution 11: Performance Consideration
console.log("\n--- Performance Note ---");
console.log("Nested loops have O(n*m) complexity");
console.log("For 100x100: 10,000 iterations");
console.log("For 1000x1000: 1,000,000 iterations");
console.log("Consider alternatives for large datasets");

// Solution 12: Diamond Pattern
console.log("\n--- Diamond Pattern ---");
const n = 5;
// Upper half
for (let i = 1; i <= n; i++) {
    let spaces = " ".repeat(n - i);
    let stars = "* ".repeat(i);
    console.log(spaces + stars);
}
// Lower half
for (let i = n - 1; i >= 1; i--) {
    let spaces = " ".repeat(n - i);
    let stars = "* ".repeat(i);
    console.log(spaces + stars);
}

