/**
 * Lab 059: Array Destructuring
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Destructuring extracts values from arrays into variables.
 * 
 * Features:
 * - Basic extraction
 * - Skipping elements
 * - Default values
 * - Rest pattern
 * - Swapping variables
 * - Nested destructuring
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Extract values from arrays
 * 2. Use default values
 * 3. Use rest pattern
 * 4. Destructure in function parameters
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Basic Destructuring
console.log("--- Basic Destructuring ---");

const colors = ["red", "green", "blue"];

const [first, second, third] = colors;
console.log("First:", first);
console.log("Second:", second);
console.log("Third:", third);

// Solution 2: Skipping Elements
console.log("\n--- Skipping Elements ---");

const numbers = [1, 2, 3, 4, 5];

const [a, , c, , e] = numbers;
console.log("a:", a); // 1
console.log("c:", c); // 3
console.log("e:", e); // 5

// Solution 3: Default Values
console.log("\n--- Default Values ---");

const partial = [1, 2];

const [x, y, z = 10] = partial;
console.log("x:", x); // 1
console.log("y:", y); // 2
console.log("z:", z); // 10 (default)

// Default with existing value
const [p, q = 5, r = 10] = [1, 2];
console.log("p:", p, "q:", q, "r:", r); // 1, 2, 10

// Solution 4: Rest Pattern
console.log("\n--- Rest Pattern ---");

const letters = ["a", "b", "c", "d", "e"];

const [head, ...tail] = letters;
console.log("Head:", head);
console.log("Tail:", tail);

// Get first and last
const [firstLetter, ...middle] = letters;
const lastLetter = middle.pop();
console.log("First:", firstLetter);
console.log("Middle:", middle);
console.log("Last:", lastLetter);

// Solution 5: Swapping Variables
console.log("\n--- Swapping ---");

let m = 1;
let n = 2;
console.log("Before:", m, n);

[m, n] = [n, m];
console.log("After:", m, n);

// Rotate three variables
let i = 1, j = 2, k = 3;
[i, j, k] = [j, k, i];
console.log("Rotated:", i, j, k);

// Solution 6: Nested Destructuring
console.log("\n--- Nested Destructuring ---");

const nested = [1, [2, 3], [4, [5, 6]]];

const [one, [two, three], [four, [five, six]]] = nested;
console.log("Values:", one, two, three, four, five, six);

// Partial nested
const matrix = [[1, 2], [3, 4], [5, 6]];
const [[a1, a2], [b1, b2]] = matrix;
console.log("First row:", a1, a2);
console.log("Second row:", b1, b2);

// Solution 7: Function Parameters
console.log("\n--- Function Parameters ---");

function processCoordinates([x, y, z = 0]) {
    console.log(`X: ${x}, Y: ${y}, Z: ${z}`);
}

processCoordinates([10, 20]);
processCoordinates([10, 20, 30]);

// Return multiple values
function getMinMax(arr) {
    return [Math.min(...arr), Math.max(...arr)];
}

const [min, max] = getMinMax([5, 2, 8, 1, 9]);
console.log("Min:", min, "Max:", max);

// Solution 8: With Iteration
console.log("\n--- With Iteration ---");

const entries = [["name", "Alice"], ["age", 25], ["city", "NYC"]];

for (const [key, value] of entries) {
    console.log(`${key}: ${value}`);
}

// With Object.entries
const obj = { a: 1, b: 2, c: 3 };
for (const [key, value] of Object.entries(obj)) {
    console.log(`${key} = ${value}`);
}

// Solution 9: Regex Match Results
console.log("\n--- Regex Results ---");

const url = "https://example.com:8080/path";
const regex = /^(https?):\/\/([^:\/]+):?(\d+)?(.*)$/;
const [, protocol, host, port = "80", path] = url.match(regex) || [];

console.log("Protocol:", protocol);
console.log("Host:", host);
console.log("Port:", port);
console.log("Path:", path);

// Solution 10: Practical Examples
console.log("\n--- Practical Examples ---");

// Parse CSV line
const csvLine = "John,Doe,30,NYC";
const [firstName, lastName, age, city] = csvLine.split(",");
console.log("Parsed:", { firstName, lastName, age, city });

// Get date parts
const date = new Date();
const [year, month, day] = [
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate()
];
console.log("Date parts:", year, month, day);

// Promise.all results
async function example() {
    const [user, posts] = await Promise.all([
        Promise.resolve({ name: "Alice" }),
        Promise.resolve([{ title: "Post 1" }])
    ]);
    console.log("User:", user);
    console.log("Posts:", posts);
}
example();

