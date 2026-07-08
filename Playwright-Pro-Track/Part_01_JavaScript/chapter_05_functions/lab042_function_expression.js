/**
 * Lab 042: Function Expression
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Function expressions assign a function to a variable.
 * 
 * Syntax:
 * const functionName = function(parameters) {
 *     // function body
 * };
 * 
 * Key features:
 * - NOT hoisted (must be defined before use)
 * - Can be anonymous or named
 * - Can be passed as arguments
 * - Can be assigned to object properties
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create function expressions
 * 2. Understand difference from declarations
 * 3. Use as callbacks
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Basic Function Expression
console.log("--- Basic Function Expression ---");

const greet = function() {
    console.log("Hello from function expression!");
};

greet();

// Solution 2: With Parameters
console.log("\n--- With Parameters ---");

const add = function(a, b) {
    return a + b;
};

console.log("5 + 3 =", add(5, 3));

// Solution 3: NOT Hoisted
console.log("\n--- Not Hoisted ---");

// This would cause an error:
// sayHi(); // ReferenceError: Cannot access 'sayHi' before initialization

const sayHi = function() {
    console.log("Hi!");
};

sayHi(); // Works after definition

// Solution 4: Named Function Expression
console.log("\n--- Named Function Expression ---");

const factorial = function fact(n) {
    if (n <= 1) return 1;
    return n * fact(n - 1); // Can reference itself by name
};

console.log("5! =", factorial(5));
// console.log(fact(5)); // Error: fact is not defined outside

// Solution 5: Assigning to Object Properties
console.log("\n--- Object Methods ---");

const calculator = {
    add: function(a, b) {
        return a + b;
    },
    subtract: function(a, b) {
        return a - b;
    },
    multiply: function(a, b) {
        return a * b;
    }
};

console.log("10 + 5 =", calculator.add(10, 5));
console.log("10 - 5 =", calculator.subtract(10, 5));
console.log("10 * 5 =", calculator.multiply(10, 5));

// Solution 6: Passing as Callback
console.log("\n--- As Callback ---");

const numbers = [1, 2, 3, 4, 5];

const double = function(n) {
    return n * 2;
};

const doubled = numbers.map(double);
console.log("Doubled:", doubled);

// Solution 7: Inline Function Expression
console.log("\n--- Inline Expression ---");

const squared = numbers.map(function(n) {
    return n * n;
});
console.log("Squared:", squared);

// Solution 8: Conditional Function Assignment
console.log("\n--- Conditional Assignment ---");

const isProduction = false;

const log = isProduction
    ? function(msg) { /* Do nothing in production */ }
    : function(msg) { console.log("[DEBUG]", msg); };

log("This is a debug message");

// Solution 9: IIFE (Immediately Invoked Function Expression)
console.log("\n--- IIFE ---");

const result = (function(x, y) {
    return x + y;
})(10, 20);

console.log("IIFE result:", result);

// IIFE for encapsulation
(function() {
    const privateVar = "I am private";
    console.log("Inside IIFE:", privateVar);
})();
// console.log(privateVar); // Error: not defined

// Solution 10: Storing in Array
console.log("\n--- Functions in Array ---");

const operations = [
    function(a, b) { return a + b; },
    function(a, b) { return a - b; },
    function(a, b) { return a * b; },
    function(a, b) { return a / b; }
];

console.log("Add:", operations[0](10, 5));
console.log("Subtract:", operations[1](10, 5));
console.log("Multiply:", operations[2](10, 5));
console.log("Divide:", operations[3](10, 5));

// Solution 11: Declaration vs Expression
console.log("\n--- Declaration vs Expression ---");
console.log("Declaration: Hoisted, always named");
console.log("Expression: Not hoisted, can be anonymous");
console.log("Use declaration for main functions");
console.log("Use expression for callbacks, conditionals");

// Solution 12: Reassigning Function Variables
console.log("\n--- Reassigning ---");

let processor = function(data) {
    return data.toUpperCase();
};

console.log("First:", processor("hello"));

// Can reassign (if using let)
processor = function(data) {
    return data.toLowerCase();
};

console.log("After reassign:", processor("HELLO"));

