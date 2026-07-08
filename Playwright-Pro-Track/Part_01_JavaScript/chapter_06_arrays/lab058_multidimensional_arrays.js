/**
 * Lab 058: Multidimensional Arrays
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Multidimensional arrays are arrays containing arrays.
 * 
 * Common uses:
 * - Matrices
 * - Grids (game boards, spreadsheets)
 * - Tables of data
 * - Coordinate systems
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create and access 2D arrays
 * 2. Iterate over matrices
 * 3. Perform matrix operations
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Creating 2D Arrays
console.log("--- Creating 2D Arrays ---");

// Direct creation
const matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
];
console.log("Matrix:", matrix);

// Dynamic creation
const rows = 3;
const cols = 4;
const grid = Array.from({ length: rows }, () => 
    Array.from({ length: cols }, () => 0)
);
console.log("Grid:", grid);

// Caution: Wrong way (creates shared references)
// const wrong = Array(3).fill(Array(3).fill(0));

// Solution 2: Accessing Elements
console.log("\n--- Accessing Elements ---");

console.log("matrix[0][0]:", matrix[0][0]); // 1
console.log("matrix[1][2]:", matrix[1][2]); // 6
console.log("matrix[2][1]:", matrix[2][1]); // 8

// Get row
console.log("Row 1:", matrix[1]);

// Get column
const column = matrix.map(row => row[1]);
console.log("Column 1:", column);

// Solution 3: Iterating
console.log("\n--- Iterating ---");

// Nested for loops
console.log("Nested for:");
for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
        process.stdout.write(matrix[i][j] + " ");
    }
    console.log();
}

// for...of
console.log("\nfor...of:");
for (const row of matrix) {
    console.log(row.join(" "));
}

// forEach
console.log("\nforEach:");
matrix.forEach((row, i) => {
    row.forEach((cell, j) => {
        console.log(`[${i}][${j}] = ${cell}`);
    });
});

// Solution 4: Matrix Operations
console.log("\n--- Matrix Operations ---");

// Sum all elements
const sum = matrix.flat().reduce((a, b) => a + b, 0);
console.log("Sum:", sum);

// Find max
const max = Math.max(...matrix.flat());
console.log("Max:", max);

// Transpose
const transpose = matrix[0].map((_, colIndex) =>
    matrix.map(row => row[colIndex])
);
console.log("Transpose:", transpose);

// Solution 5: Matrix Addition
console.log("\n--- Matrix Addition ---");

const matrixA = [[1, 2], [3, 4]];
const matrixB = [[5, 6], [7, 8]];

const added = matrixA.map((row, i) =>
    row.map((val, j) => val + matrixB[i][j])
);
console.log("A + B:", added);

// Solution 6: Game Board Example
console.log("\n--- Game Board ---");

const board = [
    ["X", "O", "X"],
    ["O", "X", "O"],
    ["O", "X", "X"]
];

function printBoard(b) {
    console.log(b.map(row => row.join(" | ")).join("\n---------\n"));
}

printBoard(board);

// Check winner
function checkWinner(b) {
    // Check rows
    for (const row of b) {
        if (row[0] && row.every(cell => cell === row[0])) {
            return row[0];
        }
    }
    
    // Check columns
    for (let j = 0; j < 3; j++) {
        if (b[0][j] && b[0][j] === b[1][j] && b[1][j] === b[2][j]) {
            return b[0][j];
        }
    }
    
    // Check diagonals
    if (b[0][0] && b[0][0] === b[1][1] && b[1][1] === b[2][2]) {
        return b[0][0];
    }
    if (b[0][2] && b[0][2] === b[1][1] && b[1][1] === b[2][0]) {
        return b[0][2];
    }
    
    return null;
}

console.log("Winner:", checkWinner(board));

// Solution 7: Spiral Traversal
console.log("\n--- Spiral Traversal ---");

function spiralOrder(matrix) {
    const result = [];
    if (!matrix.length) return result;
    
    let top = 0, bottom = matrix.length - 1;
    let left = 0, right = matrix[0].length - 1;
    
    while (top <= bottom && left <= right) {
        // Right
        for (let i = left; i <= right; i++) result.push(matrix[top][i]);
        top++;
        
        // Down
        for (let i = top; i <= bottom; i++) result.push(matrix[i][right]);
        right--;
        
        // Left
        if (top <= bottom) {
            for (let i = right; i >= left; i--) result.push(matrix[bottom][i]);
            bottom--;
        }
        
        // Up
        if (left <= right) {
            for (let i = bottom; i >= top; i--) result.push(matrix[i][left]);
            left++;
        }
    }
    
    return result;
}

console.log("Spiral:", spiralOrder(matrix));

