/**
 * Lab 131: let and const
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Block-scoped variable declarations:
 * 
 * - let: Block-scoped, reassignable
 * - const: Block-scoped, not reassignable
 * - Temporal Dead Zone (TDZ)
 * - No hoisting like var
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Use let for variables that change
 * 2. Use const for constants
 * 3. Understand block scope
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: let vs var
console.log("--- let vs var ---");

// var is function-scoped
function varExample() {
    var x = 1;
    if (true) {
        var x = 2; // Same variable
        console.log("var inside if:", x);
    }
    console.log("var outside if:", x);
}
varExample();

// let is block-scoped
function letExample() {
    let x = 1;
    if (true) {
        let x = 2; // Different variable
        console.log("let inside if:", x);
    }
    console.log("let outside if:", x);
}
letExample();

// Solution 2: const Basics
console.log("\n--- const Basics ---");

const PI = 3.14159;
console.log("PI:", PI);

// PI = 3.14; // Error: Assignment to constant variable

// const with objects - reference is constant, not content
const user = { name: "John" };
user.name = "Jane"; // This works!
console.log("Modified user:", user);

// user = { name: "Bob" }; // Error: Can't reassign

// Solution 3: Block Scope
console.log("\n--- Block Scope ---");

{
    let blockLet = "I'm block scoped";
    const blockConst = "Me too";
    console.log(blockLet, blockConst);
}
// console.log(blockLet); // Error: not defined

// Solution 4: Temporal Dead Zone
console.log("\n--- Temporal Dead Zone ---");

// console.log(tdz); // Error: Cannot access before initialization
let tdz = "Now I'm defined";
console.log("After TDZ:", tdz);

// Solution 5: Loop Scope
console.log("\n--- Loop Scope ---");

// var in loop - shared variable
for (var i = 0; i < 3; i++) {
    setTimeout(() => console.log("var i:", i), 100);
}
// Prints: 3, 3, 3

// let in loop - new variable each iteration
for (let j = 0; j < 3; j++) {
    setTimeout(() => console.log("let j:", j), 150);
}
// Prints: 0, 1, 2

// Solution 6: const with Arrays
console.log("\n--- const with Arrays ---");

const numbers = [1, 2, 3];
numbers.push(4); // Works - modifying content
numbers[0] = 10; // Works - modifying content
console.log("Modified array:", numbers);

// numbers = [5, 6, 7]; // Error: Can't reassign

// Solution 7: Freezing Objects
console.log("\n--- Freezing Objects ---");

const frozen = Object.freeze({ name: "John", age: 30 });
frozen.name = "Jane"; // Silently fails (or throws in strict mode)
frozen.email = "john@example.com"; // Silently fails
console.log("Frozen object:", frozen);

// Solution 8: When to Use Each
console.log("\n--- When to Use Each ---");

// Use const by default
const API_URL = "https://api.example.com";
const MAX_RETRIES = 3;

// Use let when value changes
let count = 0;
count++;
console.log("Count:", count);

let result = null;
result = "computed value";
console.log("Result:", result);

// Solution 9: Destructuring with const
console.log("\n--- Destructuring ---");

const person = { firstName: "John", lastName: "Doe" };
const { firstName, lastName } = person;
console.log("Destructured:", firstName, lastName);

const colors = ["red", "green", "blue"];
const [first, second] = colors;
console.log("Array destructured:", first, second);

// Solution 10: Best Practices
console.log("\n--- Best Practices ---");

// 1. Prefer const over let
const config = { debug: true };

// 2. Use let only when reassignment is needed
let counter = 0;
for (let i = 0; i < 5; i++) {
    counter += i;
}

// 3. Never use var in modern code
// var oldStyle = "avoid this";

// 4. Declare at the top of scope
function example() {
    const MAX = 100;
    let total = 0;
    
    // ... rest of function
    console.log("Max:", MAX, "Total:", total);
}

example();

console.log("\nSummary:");
console.log("- Use const by default");
console.log("- Use let when value changes");
console.log("- Avoid var in modern code");
console.log("- Both let and const are block-scoped");

