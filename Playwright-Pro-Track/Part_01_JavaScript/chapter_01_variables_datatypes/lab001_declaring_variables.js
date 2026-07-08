/**
 * Lab 001: Declaring Variables with var, let, and const
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * JavaScript has three ways to declare variables:
 * - var: Function-scoped, can be redeclared, hoisted (older way)
 * - let: Block-scoped, cannot be redeclared, not hoisted (ES6+)
 * - const: Block-scoped, cannot be reassigned, not hoisted (ES6+)
 * 
 * Best Practice: Use 'const' by default, 'let' when you need to reassign,
 * avoid 'var' in modern JavaScript.
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Declare a variable 'studentName' using let and assign your name
 * 2. Declare a constant 'COURSE_NAME' and assign "Playwright Automation"
 * 3. Declare a variable 'score' using var and assign 85
 * 4. Try to reassign COURSE_NAME and observe what happens
 * 5. Demonstrate block scope difference between let and var
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Using let - can be reassigned
let studentName = "John Doe";
console.log("Student Name:", studentName);
studentName = "Jane Doe"; // Reassignment is allowed
console.log("Updated Student Name:", studentName);

// Solution 2: Using const - cannot be reassigned
const COURSE_NAME = "Playwright Automation";
console.log("Course:", COURSE_NAME);

// Solution 3: Using var - function scoped
var score = 85;
console.log("Score:", score);

// Solution 4: Trying to reassign const (uncomment to see error)
// COURSE_NAME = "New Course"; // TypeError: Assignment to constant variable

// Solution 5: Block scope demonstration
console.log("\n--- Block Scope Demo ---");

if (true) {
    let blockLet = "I am let - block scoped";
    var blockVar = "I am var - function scoped";
    const blockConst = "I am const - block scoped";
    console.log("Inside block - let:", blockLet);
    console.log("Inside block - var:", blockVar);
    console.log("Inside block - const:", blockConst);
}

// Outside the block
// console.log(blockLet);   // ReferenceError: blockLet is not defined
// console.log(blockConst); // ReferenceError: blockConst is not defined
console.log("Outside block - var:", blockVar); // Works! var is function-scoped

// Hoisting demonstration
console.log("\n--- Hoisting Demo ---");
console.log("hoistedVar before declaration:", hoistedVar); // undefined (hoisted)
var hoistedVar = "I am hoisted";
console.log("hoistedVar after declaration:", hoistedVar);

// console.log(hoistedLet); // ReferenceError: Cannot access before initialization
// let hoistedLet = "I am not hoisted";

