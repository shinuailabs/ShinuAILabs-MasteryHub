/**
 * Lab 021: if Statement
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * The if statement executes code conditionally.
 * 
 * Syntax:
 * if (condition) {
 *     // code to execute if condition is true
 * }
 * 
 * The condition is converted to boolean (truthy/falsy).
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Write basic if statements
 * 2. Use comparison operators in conditions
 * 3. Use logical operators in conditions
 * 4. Understand truthy/falsy in conditions
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Basic if Statement
console.log("--- Basic if Statement ---");
const age = 20;

if (age >= 18) {
    console.log("You are an adult");
}

if (age >= 21) {
    console.log("You can drink alcohol (US)");
}

// Solution 2: With Comparison Operators
console.log("\n--- Comparison Operators ---");
const score = 85;

if (score >= 90) {
    console.log("Grade: A");
}

if (score === 100) {
    console.log("Perfect score!");
}

if (score !== 0) {
    console.log("You attempted the test");
}

// Solution 3: With Logical Operators
console.log("\n--- Logical Operators ---");
const hasLicense = true;
const hasInsurance = true;

if (age >= 18 && hasLicense) {
    console.log("You can drive");
}

if (hasLicense && hasInsurance) {
    console.log("You are legally covered to drive");
}

const isWeekend = true;
const isHoliday = false;

if (isWeekend || isHoliday) {
    console.log("No work today!");
}

// Solution 4: Truthy/Falsy Conditions
console.log("\n--- Truthy/Falsy ---");
const username = "John";
const items = [];
const count = 0;

// Truthy: non-empty string
if (username) {
    console.log(`Welcome, ${username}!`);
}

// Falsy: empty array has length 0
if (items.length) {
    console.log("You have items");
} else {
    // This won't print (using if only for now)
}

// Check for existence
if (!items.length) {
    console.log("Your cart is empty");
}

// Solution 5: Multiple Conditions
console.log("\n--- Multiple Conditions ---");
const user = {
    name: "Alice",
    age: 25,
    role: "admin",
    isActive: true
};

if (user.role === "admin" && user.isActive && user.age >= 18) {
    console.log("Full admin access granted");
}

// Negation
if (!user.isBanned) {
    console.log("User is not banned");
}

// Solution 6: Nested if (avoid when possible)
console.log("\n--- Nested if ---");
const product = {
    inStock: true,
    price: 50
};
const userBalance = 100;

if (product.inStock) {
    if (userBalance >= product.price) {
        console.log("You can purchase this product");
    }
}

// Better: combine conditions
if (product.inStock && userBalance >= product.price) {
    console.log("Purchase available (combined condition)");
}

// Solution 7: Single Statement (no braces)
console.log("\n--- Single Statement ---");
// Valid but not recommended
if (age >= 18) console.log("Adult (single line)");

// Always use braces for clarity
if (age >= 18) {
    console.log("Adult (with braces)");
}

// Solution 8: Practical Examples
console.log("\n--- Practical Examples ---");

// Form validation
const email = "test@example.com";
const password = "secure123";

if (email.includes("@") && password.length >= 8) {
    console.log("Form validation passed");
}

// Feature flag
const features = {
    darkMode: true,
    betaFeatures: false
};

if (features.darkMode) {
    console.log("Dark mode enabled");
}

if (features.betaFeatures) {
    console.log("Beta features available");
}

// Null check before access
const response = { data: { users: [] } };

if (response && response.data && response.data.users) {
    console.log("Users array exists");
}

// Modern: optional chaining
if (response?.data?.users) {
    console.log("Users array exists (optional chaining)");
}

