/**
 * Lab 011: Arithmetic Operators
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Arithmetic operators perform mathematical operations:
 * 
 * + Addition
 * - Subtraction
 * * Multiplication
 * / Division
 * % Modulus (remainder)
 * ** Exponentiation (ES6)
 * ++ Increment
 * -- Decrement
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Perform basic arithmetic operations
 * 2. Understand modulus operator uses
 * 3. Use exponentiation
 * 4. Master increment/decrement operators
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Basic Arithmetic
console.log("--- Basic Arithmetic ---");
let a = 10;
let b = 3;

console.log(`${a} + ${b} =`, a + b);   // 13
console.log(`${a} - ${b} =`, a - b);   // 7
console.log(`${a} * ${b} =`, a * b);   // 30
console.log(`${a} / ${b} =`, a / b);   // 3.333...
console.log(`${a} % ${b} =`, a % b);   // 1 (remainder)
console.log(`${a} ** ${b} =`, a ** b); // 1000 (10^3)

// Solution 2: Modulus Operator Uses
console.log("\n--- Modulus Operator ---");

// Check if even or odd
function isEven(num) {
    return num % 2 === 0;
}
console.log("Is 10 even?", isEven(10)); // true
console.log("Is 7 even?", isEven(7));   // false

// Get last digit
let number = 12345;
console.log("Last digit of 12345:", number % 10); // 5

// Wrap around (cycling)
for (let i = 0; i < 10; i++) {
    console.log(`i=${i}, i % 3 =`, i % 3); // 0,1,2,0,1,2,0,1,2,0
}

// Solution 3: Exponentiation
console.log("\n--- Exponentiation ---");
console.log("2 ** 3 =", 2 ** 3);        // 8
console.log("2 ** 10 =", 2 ** 10);      // 1024
console.log("9 ** 0.5 =", 9 ** 0.5);    // 3 (square root)
console.log("Math.pow(2, 3):", Math.pow(2, 3)); // Same as **

// Solution 4: Increment/Decrement
console.log("\n--- Increment/Decrement ---");
let count = 5;

// Post-increment: returns value, then increments
console.log("count:", count);           // 5
console.log("count++:", count++);       // 5 (returns old value)
console.log("count after ++:", count);  // 6

// Pre-increment: increments, then returns value
count = 5;
console.log("count:", count);           // 5
console.log("++count:", ++count);       // 6 (returns new value)
console.log("count after ++:", count);  // 6

// Post-decrement
count = 5;
console.log("count--:", count--);       // 5
console.log("count after --:", count);  // 4

// Pre-decrement
count = 5;
console.log("--count:", --count);       // 4

// Solution 5: Operator Precedence
console.log("\n--- Operator Precedence ---");
console.log("2 + 3 * 4 =", 2 + 3 * 4);         // 14 (not 20)
console.log("(2 + 3) * 4 =", (2 + 3) * 4);     // 20
console.log("10 / 2 + 3 =", 10 / 2 + 3);       // 8
console.log("10 / (2 + 3) =", 10 / (2 + 3));   // 2
console.log("2 ** 3 ** 2 =", 2 ** 3 ** 2);     // 512 (right-to-left)

// Solution 6: Practical Examples
console.log("\n--- Practical Examples ---");

// Calculate total price
const price = 29.99;
const quantity = 3;
const tax = 0.08;
const total = price * quantity * (1 + tax);
console.log("Total:", total.toFixed(2));

// Convert seconds to hours, minutes, seconds
const totalSeconds = 3665;
const hours = Math.floor(totalSeconds / 3600);
const minutes = Math.floor((totalSeconds % 3600) / 60);
const seconds = totalSeconds % 60;
console.log(`${totalSeconds} seconds = ${hours}h ${minutes}m ${seconds}s`);

// Circle calculations
const radius = 5;
const circumference = 2 * Math.PI * radius;
const area = Math.PI * radius ** 2;
console.log("Circumference:", circumference.toFixed(2));
console.log("Area:", area.toFixed(2));

