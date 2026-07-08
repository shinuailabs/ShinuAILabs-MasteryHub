/**
 * Lab 015: Ternary (Conditional) Operator
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * The ternary operator is a shorthand for if-else:
 * 
 * Syntax: condition ? valueIfTrue : valueIfFalse
 * 
 * - Only operator that takes three operands
 * - Returns a value (can be assigned)
 * - Can be nested (but avoid for readability)
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Convert if-else to ternary
 * 2. Use ternary for assignments
 * 3. Nest ternary operators carefully
 * 4. Know when NOT to use ternary
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Basic Ternary
console.log("--- Basic Ternary ---");
const age = 20;

// if-else version
let status1;
if (age >= 18) {
    status1 = "Adult";
} else {
    status1 = "Minor";
}

// Ternary version
const status2 = age >= 18 ? "Adult" : "Minor";

console.log("if-else:", status1);
console.log("ternary:", status2);

// Solution 2: Ternary in Assignments
console.log("\n--- Ternary Assignments ---");
const score = 75;
const grade = score >= 60 ? "Pass" : "Fail";
const message = score >= 90 ? "Excellent!" : score >= 60 ? "Good job!" : "Keep trying!";

console.log("Score:", score);
console.log("Grade:", grade);
console.log("Message:", message);

// Solution 3: Ternary with Function Calls
console.log("\n--- Ternary with Functions ---");
const isLoggedIn = true;
const username = "John";

const greeting = isLoggedIn ? `Welcome, ${username}!` : "Please log in";
console.log(greeting);

// Execute different functions
function processLogin() { return "Logging in..."; }
function showLoginForm() { return "Showing form..."; }

const action = isLoggedIn ? processLogin() : showLoginForm();
console.log("Action:", action);

// Solution 4: Ternary in Template Literals
console.log("\n--- Ternary in Templates ---");
const items = 5;
const cartMessage = `You have ${items} item${items === 1 ? '' : 's'} in cart`;
console.log(cartMessage);

const user = { premium: true, name: "Alice" };
const badge = `${user.name} ${user.premium ? '⭐' : ''}`;
console.log("User badge:", badge);

// Solution 5: Nested Ternary (use sparingly!)
console.log("\n--- Nested Ternary ---");
const temperature = 25;

// Nested ternary
const weather = temperature >= 30 ? "Hot" 
              : temperature >= 20 ? "Warm"
              : temperature >= 10 ? "Cool"
              : "Cold";
console.log(`${temperature}°C is ${weather}`);

// Better alternative for multiple conditions:
function getWeather(temp) {
    if (temp >= 30) return "Hot";
    if (temp >= 20) return "Warm";
    if (temp >= 10) return "Cool";
    return "Cold";
}
console.log("Function version:", getWeather(25));

// Solution 6: Ternary vs && for Conditional Rendering
console.log("\n--- Ternary vs && ---");
const showDetails = true;

// Using && (when you only have one branch)
const details1 = showDetails && "Details are visible";
console.log("&&:", details1);

// Using ternary (when you need both branches)
const details2 = showDetails ? "Visible" : "Hidden";
console.log("Ternary:", details2);

// Solution 7: Practical Examples
console.log("\n--- Practical Examples ---");

// Form validation message
const email = "test@example.com";
const isValidEmail = email.includes("@");
const emailError = isValidEmail ? null : "Invalid email format";
console.log("Email error:", emailError);

// Pluralization
function pluralize(count, singular, plural) {
    return count === 1 ? singular : plural;
}
console.log(`5 ${pluralize(5, "item", "items")}`);
console.log(`1 ${pluralize(1, "item", "items")}`);

// Price formatting
const price = 0;
const priceDisplay = price > 0 ? `$${price.toFixed(2)}` : "Free";
console.log("Price:", priceDisplay);

// Null/undefined check
const data = null;
const value = data !== null && data !== undefined ? data : "No data";
console.log("Value:", value);

// Solution 8: When NOT to Use Ternary
console.log("\n--- When to Avoid Ternary ---");
// Don't use when logic is complex
// Don't use with multiple statements
// Don't nest more than 2 levels

// BAD: Hard to read
// const result = a ? b ? c ? d : e : f : g;

// GOOD: Use if-else for clarity
function complexLogic(a, b, c) {
    if (a) {
        if (b) return "A and B";
        return "A only";
    }
    return "Neither";
}

