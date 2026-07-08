/**
 * Lab 041: Function Declaration
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Function declarations define named functions using the function keyword.
 * 
 * Syntax:
 * function functionName(parameters) {
 *     // function body
 *     return value;
 * }
 * 
 * Key features:
 * - Hoisted (can be called before declaration)
 * - Named (useful for debugging)
 * - Creates its own scope
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create basic function declarations
 * 2. Understand hoisting
 * 3. Use parameters and return values
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Basic Function Declaration
console.log("--- Basic Function ---");

function greet() {
    console.log("Hello, World!");
}

greet();

// Solution 2: Function with Parameters
console.log("\n--- With Parameters ---");

function greetPerson(name) {
    console.log(`Hello, ${name}!`);
}

greetPerson("Alice");
greetPerson("Bob");

// Solution 3: Function with Return Value
console.log("\n--- Return Value ---");

function add(a, b) {
    return a + b;
}

const sum = add(5, 3);
console.log("5 + 3 =", sum);

// Can use return value directly
console.log("10 + 20 =", add(10, 20));

// Solution 4: Multiple Parameters
console.log("\n--- Multiple Parameters ---");

function createUser(name, age, email) {
    return {
        name: name,
        age: age,
        email: email,
        createdAt: new Date().toISOString()
    };
}

const user = createUser("John", 30, "john@example.com");
console.log("User:", user);

// Solution 5: Hoisting
console.log("\n--- Hoisting ---");

// Can call before declaration!
sayHello();

function sayHello() {
    console.log("Hello from hoisted function!");
}

// Solution 6: Early Return
console.log("\n--- Early Return ---");

function divide(a, b) {
    if (b === 0) {
        return "Cannot divide by zero";
    }
    return a / b;
}

console.log("10 / 2 =", divide(10, 2));
console.log("10 / 0 =", divide(10, 0));

// Solution 7: No Return (undefined)
console.log("\n--- No Return ---");

function logMessage(message) {
    console.log("LOG:", message);
    // No return statement
}

const result = logMessage("Test message");
console.log("Return value:", result); // undefined

// Solution 8: Multiple Return Statements
console.log("\n--- Multiple Returns ---");

function getGrade(score) {
    if (score >= 90) return "A";
    if (score >= 80) return "B";
    if (score >= 70) return "C";
    if (score >= 60) return "D";
    return "F";
}

console.log("Score 95:", getGrade(95));
console.log("Score 72:", getGrade(72));
console.log("Score 55:", getGrade(55));

// Solution 9: Function Calling Function
console.log("\n--- Functions Calling Functions ---");

function square(n) {
    return n * n;
}

function sumOfSquares(a, b) {
    return square(a) + square(b);
}

console.log("3² + 4² =", sumOfSquares(3, 4));

// Solution 10: Practical Example
console.log("\n--- Practical: Calculate Total ---");

function calculateTotal(price, quantity, taxRate) {
    const subtotal = price * quantity;
    const tax = subtotal * taxRate;
    const total = subtotal + tax;
    
    return {
        subtotal: subtotal,
        tax: tax,
        total: total
    };
}

const order = calculateTotal(29.99, 3, 0.08);
console.log("Order breakdown:", order);

// Solution 11: Function Naming Conventions
console.log("\n--- Naming Conventions ---");
console.log("Use verbs: get, set, calculate, validate, is, has");
console.log("Examples: getUserById, setConfig, calculateTax, isValid, hasPermission");

// Good function names
function getUserById(id) { return { id }; }
function isValidEmail(email) { return email.includes("@"); }
function hasPermission(user, action) { return true; }

console.log("isValidEmail('test@test.com'):", isValidEmail("test@test.com"));

