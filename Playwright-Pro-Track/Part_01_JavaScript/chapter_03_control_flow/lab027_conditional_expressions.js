/**
 * Lab 027: Conditional Expressions
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Conditional expressions return values based on conditions.
 * More concise than if-else for simple cases.
 * 
 * Types:
 * - Ternary: condition ? value1 : value2
 * - Logical AND: condition && value
 * - Logical OR: value1 || value2
 * - Nullish: value1 ?? value2
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Use ternary for value assignment
 * 2. Use logical operators for conditionals
 * 3. Choose appropriate expression type
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Ternary for Value Assignment
console.log("--- Ternary Assignment ---");

const age = 20;
const status = age >= 18 ? "adult" : "minor";
console.log(`Age ${age}: ${status}`);

// With function calls
const score = 85;
const result = score >= 60 ? pass() : fail();

function pass() { return "PASSED"; }
function fail() { return "FAILED"; }
console.log(`Score ${score}: ${result}`);

// In template literals
const items = 3;
console.log(`You have ${items} item${items === 1 ? "" : "s"}`);

// Solution 2: Logical AND for Conditional Execution
console.log("\n--- Logical AND ---");

const isLoggedIn = true;
const username = "Alice";

// Execute only if condition is true
isLoggedIn && console.log(`Welcome, ${username}!`);

// Return value if condition is true
const greeting = isLoggedIn && `Hello, ${username}`;
console.log("Greeting:", greeting);

// Common in React JSX-like patterns
const showBanner = true;
const banner = showBanner && "<Banner />";
console.log("Banner:", banner);

// Warning: Returns left side if falsy
const count = 0;
const message = count && `Count: ${count}`; // Returns 0, not the string!
console.log("Count message:", message); // 0

// Solution 3: Logical OR for Defaults
console.log("\n--- Logical OR Defaults ---");

function greet(name) {
    const displayName = name || "Guest";
    return `Hello, ${displayName}!`;
}

console.log(greet("John"));
console.log(greet(""));      // Uses default (empty string is falsy)
console.log(greet(null));    // Uses default

// Chaining OR
const value = null || undefined || "" || "fallback";
console.log("Chained OR:", value);

// Solution 4: Nullish Coalescing for Null/Undefined
console.log("\n--- Nullish Coalescing ---");

function getConfig(config) {
    return {
        timeout: config.timeout ?? 5000,
        retries: config.retries ?? 3,
        debug: config.debug ?? false
    };
}

console.log(getConfig({ timeout: 0 }));  // timeout: 0 preserved!
console.log(getConfig({ debug: false })); // debug: false preserved!
console.log(getConfig({}));

// Solution 5: Combining Expressions
console.log("\n--- Combined Expressions ---");

const user = {
    name: "John",
    preferences: null
};

// Optional chaining + nullish coalescing
const theme = user?.preferences?.theme ?? "light";
console.log("Theme:", theme);

// Ternary + nullish
const displayName = user?.name 
    ? `User: ${user.name}` 
    : "Anonymous";
console.log("Display:", displayName);

// Solution 6: Expression in Different Contexts
console.log("\n--- Expression Contexts ---");

// In array elements
const showExtra = true;
const menuItems = [
    "Home",
    "About",
    showExtra && "Extra",
    "Contact"
].filter(Boolean); // Remove falsy values
console.log("Menu:", menuItems);

// In object properties
const includeTimestamp = true;
const logEntry = {
    message: "Event occurred",
    level: "info",
    ...(includeTimestamp && { timestamp: Date.now() })
};
console.log("Log:", logEntry);

// Solution 7: Avoiding Anti-Patterns
console.log("\n--- Best Practices ---");

// ❌ BAD: Ternary for side effects
// isValid ? doValid() : doInvalid();

// ✅ GOOD: Use if-else for side effects
function handleValidation(isValid) {
    if (isValid) {
        console.log("Valid!");
    } else {
        console.log("Invalid!");
    }
}

// ❌ BAD: Nested ternaries (hard to read)
// const x = a ? b ? c : d : e ? f : g;

// ✅ GOOD: Use function or if-else for complex logic
function getCategory(value) {
    if (value > 100) return "high";
    if (value > 50) return "medium";
    return "low";
}

// ❌ BAD: && for values that could be 0 or ""
// const display = count && `Count: ${count}`;

// ✅ GOOD: Use ternary or explicit check
const count2 = 0;
const display = count2 !== null && count2 !== undefined 
    ? `Count: ${count2}` 
    : "No count";
console.log("Display:", display);

// Solution 8: Quick Reference
console.log("\n--- Quick Reference ---");
console.log("Use TERNARY for: Two possible values based on condition");
console.log("Use && for: Conditional rendering/execution (truthy check)");
console.log("Use || for: Default values (any falsy triggers default)");
console.log("Use ?? for: Default values (only null/undefined trigger)");

