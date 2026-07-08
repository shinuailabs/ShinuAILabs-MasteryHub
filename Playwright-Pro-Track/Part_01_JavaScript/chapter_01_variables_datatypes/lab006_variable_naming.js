/**
 * Lab 006: Variable Naming Conventions
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Variable naming rules in JavaScript:
 * - Must start with letter, underscore (_), or dollar sign ($)
 * - Can contain letters, digits, underscores, dollar signs
 * - Case-sensitive (myVar ≠ myvar)
 * - Cannot use reserved keywords
 * 
 * Naming conventions:
 * - camelCase: for variables and functions (firstName, getUserData)
 * - PascalCase: for classes and constructors (UserAccount, DataProcessor)
 * - UPPER_SNAKE_CASE: for constants (MAX_SIZE, API_KEY)
 * - _prefix: for private variables (convention only)
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Practice valid and invalid variable names
 * 2. Use different naming conventions appropriately
 * 3. Create meaningful, self-documenting names
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Valid Variable Names
console.log("--- Valid Variable Names ---");

let firstName = "John";           // camelCase - preferred for variables
let last_name = "Doe";            // snake_case - less common in JS
let $price = 99.99;               // Starting with $
let _privateVar = "secret";       // Convention for private
let user2 = "Second user";        // Numbers allowed (not at start)
let café = "coffee";              // Unicode characters allowed

console.log(firstName, last_name, $price, _privateVar, user2, café);

// Solution 2: Invalid Variable Names (uncomment to see errors)
// let 2ndUser = "Invalid";       // Cannot start with number
// let first-name = "Invalid";    // Hyphens not allowed
// let let = "Invalid";           // Reserved keyword
// let class = "Invalid";         // Reserved keyword

// Solution 3: camelCase for Variables and Functions
console.log("\n--- camelCase Convention ---");
let userAge = 25;
let isLoggedIn = true;
let totalItemCount = 42;
let apiResponseData = { status: "ok" };

function getUserById(id) {
    return { id: id, name: "User" };
}

function calculateTotalPrice(items) {
    return items.reduce((sum, item) => sum + item.price, 0);
}

console.log("userAge:", userAge);
console.log("isLoggedIn:", isLoggedIn);

// Solution 4: PascalCase for Classes
console.log("\n--- PascalCase Convention ---");
class UserAccount {
    constructor(name) {
        this.name = name;
    }
}

class ShoppingCart {
    constructor() {
        this.items = [];
    }
}

const myAccount = new UserAccount("John");
console.log("Class instance:", myAccount);

// Solution 5: UPPER_SNAKE_CASE for Constants
console.log("\n--- Constants Convention ---");
const MAX_RETRIES = 3;
const API_BASE_URL = "https://api.example.com";
const DEFAULT_TIMEOUT_MS = 5000;
const DAYS_IN_WEEK = 7;

console.log("MAX_RETRIES:", MAX_RETRIES);
console.log("API_BASE_URL:", API_BASE_URL);

// Solution 6: Meaningful Names (Self-documenting Code)
console.log("\n--- Meaningful Names ---");

// Bad names
let x = 5;
let temp = "John";
let flag = true;

// Good names
let retryCount = 5;
let customerName = "John";
let isPaymentProcessed = true;

// Bad function names
function doStuff(a, b) { return a + b; }

// Good function names
function calculateSum(firstNumber, secondNumber) {
    return firstNumber + secondNumber;
}

// Boolean naming (use is, has, can, should)
let isVisible = true;
let hasPermission = false;
let canEdit = true;
let shouldRefresh = false;

console.log("isVisible:", isVisible);
console.log("hasPermission:", hasPermission);

// Solution 7: Reserved Keywords (cannot use as variable names)
console.log("\n--- Reserved Keywords ---");
const reservedKeywords = [
    'break', 'case', 'catch', 'class', 'const', 'continue',
    'debugger', 'default', 'delete', 'do', 'else', 'export',
    'extends', 'finally', 'for', 'function', 'if', 'import',
    'in', 'instanceof', 'let', 'new', 'return', 'super',
    'switch', 'this', 'throw', 'try', 'typeof', 'var',
    'void', 'while', 'with', 'yield'
];
console.log("Some reserved keywords:", reservedKeywords.slice(0, 10).join(", "));

