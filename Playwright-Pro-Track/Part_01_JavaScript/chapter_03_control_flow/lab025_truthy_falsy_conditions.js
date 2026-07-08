/**
 * Lab 025: Truthy and Falsy in Conditions
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * JavaScript converts values to boolean in conditions.
 * 
 * Falsy values (convert to false):
 * - false
 * - 0, -0, 0n (BigInt zero)
 * - "" (empty string)
 * - null
 * - undefined
 * - NaN
 * 
 * Truthy values (convert to true):
 * - Everything else!
 * - Including: "0", "false", [], {}, functions
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Identify truthy and falsy values
 * 2. Use truthy/falsy in practical conditions
 * 3. Avoid common pitfalls
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Demonstrating Falsy Values
console.log("--- Falsy Values ---");

const falsyValues = [false, 0, -0, 0n, "", '', ``, null, undefined, NaN];

falsyValues.forEach((value, index) => {
    if (value) {
        console.log(`${index}: truthy`);
    } else {
        console.log(`${index}: falsy (${value === "" ? '""' : value})`);
    }
});

// Solution 2: Demonstrating Truthy Values
console.log("\n--- Truthy Values ---");

const truthyValues = [
    true, 1, -1, "0", "false", " ", 
    [], {}, function(){}, new Date(), Infinity, -Infinity
];

truthyValues.forEach((value, index) => {
    if (value) {
        console.log(`${index}: truthy - ${typeof value}`);
    }
});

// Solution 3: Practical - Checking for Value Existence
console.log("\n--- Value Existence ---");

function greet(name) {
    if (name) {
        console.log(`Hello, ${name}!`);
    } else {
        console.log("Hello, stranger!");
    }
}

greet("Alice");
greet("");
greet(null);
greet(undefined);

// Solution 4: Array Length Check
console.log("\n--- Array Length ---");

function processItems(items) {
    if (items && items.length) {
        console.log(`Processing ${items.length} items`);
        return items.map(item => item.toUpperCase());
    } else {
        console.log("No items to process");
        return [];
    }
}

console.log(processItems(["a", "b", "c"]));
console.log(processItems([]));
console.log(processItems(null));

// Solution 5: Common Pitfall - Zero is Falsy!
console.log("\n--- Zero Pitfall ---");

// Problem: 0 is a valid value but falsy
function displayCount(count) {
    // BAD: 0 is falsy, so this fails
    if (count) {
        console.log(`Count: ${count}`);
    } else {
        console.log("No count provided");
    }
}

displayCount(5);   // "Count: 5"
displayCount(0);   // "No count provided" - WRONG!

// GOOD: Explicit check
function displayCountFixed(count) {
    if (count !== undefined && count !== null) {
        console.log(`Count: ${count}`);
    } else {
        console.log("No count provided");
    }
}

displayCountFixed(0);  // "Count: 0" - CORRECT!

// Solution 6: Empty String Pitfall
console.log("\n--- Empty String Pitfall ---");

const userInput = "";  // User cleared the input

// BAD: Empty string is falsy
if (userInput) {
    console.log("User provided input");
} else {
    console.log("No input - but maybe user wanted to clear it?");
}

// GOOD: Check specifically for undefined
if (userInput !== undefined) {
    console.log(`Input value: "${userInput}"`);
}

// Solution 7: Using Nullish Check Instead
console.log("\n--- Nullish vs Truthy ---");

function getConfig(value) {
    // Using || - fails for 0 and ""
    const withOr = value || "default";
    
    // Using ?? - only null/undefined
    const withNullish = value ?? "default";
    
    return { withOr, withNullish };
}

console.log("With 0:", getConfig(0));
console.log('With "":', getConfig(""));
console.log("With null:", getConfig(null));
console.log("With 'value':", getConfig("value"));

// Solution 8: Best Practices
console.log("\n--- Best Practices ---");

// 1. Be explicit when 0 or "" are valid
const score = 0;
if (typeof score === "number") {
    console.log("Score is a number");
}

// 2. Use optional chaining for nested checks
const user = { profile: { name: "" } };
if (user?.profile?.name !== undefined) {
    console.log("Name field exists");
}

// 3. Double negation for explicit boolean
const hasItems = !![1, 2, 3].length;
console.log("Has items:", hasItems);

// 4. Check array properly
const arr = [];
const hasElements = Array.isArray(arr) && arr.length > 0;
console.log("Has elements:", hasElements);

