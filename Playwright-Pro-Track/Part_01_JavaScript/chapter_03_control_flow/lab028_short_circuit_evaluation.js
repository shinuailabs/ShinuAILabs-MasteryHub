/**
 * Lab 028: Short-Circuit Evaluation
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Short-circuit evaluation stops evaluating as soon as the result is determined.
 * 
 * AND (&&):
 * - Stops at first FALSY value (returns it)
 * - If all truthy, returns LAST value
 * 
 * OR (||):
 * - Stops at first TRUTHY value (returns it)
 * - If all falsy, returns LAST value
 * 
 * Nullish (??):
 * - Stops at first non-nullish value
 * - Only null/undefined are nullish
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Understand short-circuit mechanics
 * 2. Use for conditional execution
 * 3. Use for default values
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: AND (&&) Short-Circuit
console.log("--- AND Short-Circuit ---");

// Returns first falsy or last value
console.log("1 && 2 && 3:", 1 && 2 && 3);       // 3 (all truthy, returns last)
console.log("1 && 0 && 3:", 1 && 0 && 3);       // 0 (stops at falsy)
console.log("1 && null && 3:", 1 && null && 3); // null
console.log("1 && '' && 3:", 1 && '' && 3);     // ''

// Conditional execution
const isReady = true;
isReady && console.log("System is ready!");

// Safe property access (before optional chaining)
const user = { name: "John", address: { city: "NYC" } };
const city = user && user.address && user.address.city;
console.log("City:", city);

// Solution 2: OR (||) Short-Circuit
console.log("\n--- OR Short-Circuit ---");

// Returns first truthy or last value
console.log("0 || '' || 'hello':", 0 || '' || 'hello');     // 'hello'
console.log("'first' || 'second':", 'first' || 'second');   // 'first'
console.log("0 || null || undefined:", 0 || null || undefined); // undefined (last)

// Default values
function greet(name) {
    name = name || "Guest";
    console.log(`Hello, ${name}!`);
}
greet("Alice");
greet("");  // Uses default

// Solution 3: Nullish (??) vs OR (||)
console.log("\n--- Nullish vs OR ---");

// OR treats all falsy as trigger for default
console.log("0 || 'default':", 0 || 'default');           // 'default'
console.log("'' || 'default':", '' || 'default');         // 'default'
console.log("false || 'default':", false || 'default');   // 'default'

// Nullish only treats null/undefined as trigger
console.log("0 ?? 'default':", 0 ?? 'default');           // 0
console.log("'' ?? 'default':", '' ?? 'default');         // ''
console.log("false ?? 'default':", false ?? 'default');   // false
console.log("null ?? 'default':", null ?? 'default');     // 'default'
console.log("undefined ?? 'default':", undefined ?? 'default'); // 'default'

// Solution 4: Avoiding Side Effects in Conditions
console.log("\n--- Side Effects ---");

let counter = 0;

function increment() {
    counter++;
    return true;
}

// AND: increment() only called if first is truthy
false && increment();  // increment NOT called
console.log("After false &&:", counter); // 0

true && increment();   // increment IS called
console.log("After true &&:", counter);  // 1

// OR: increment() only called if first is falsy
true || increment();   // increment NOT called
console.log("After true ||:", counter);  // 1

false || increment();  // increment IS called
console.log("After false ||:", counter); // 2

// Solution 5: Practical Patterns
console.log("\n--- Practical Patterns ---");

// Pattern 1: Safe function call
const callback = null;
callback && callback();  // Won't error

// Pattern 2: Provide defaults
const config = {};
const timeout = config.timeout || 5000;
console.log("Timeout:", timeout);

// Pattern 3: First available value
const primaryColor = null;
const secondaryColor = undefined;
const fallbackColor = "blue";
const color = primaryColor || secondaryColor || fallbackColor;
console.log("Color:", color);

// Pattern 4: Conditional property
const debug = true;
const logMessage = debug && "Debug mode enabled";
console.log("Log:", logMessage);

// Solution 6: Common Mistakes
console.log("\n--- Common Mistakes ---");

// Mistake 1: Expecting boolean
const result = "hello" && "world";
console.log("result:", result);     // "world", not true!
console.log("Boolean:", !!result);  // Convert to boolean if needed

// Mistake 2: OR with valid falsy values
const count = 0;  // Valid count
const displayCount = count || "No count";  // Wrong! Shows "No count"
console.log("Wrong:", displayCount);

const correctCount = count ?? "No count";  // Correct! Shows 0
console.log("Correct:", correctCount);

// Mistake 3: Side effects in short-circuit
let value = 10;
false && (value = 20);  // Assignment doesn't happen
console.log("Value after false &&:", value); // Still 10

// Solution 7: Chaining Patterns
console.log("\n--- Chaining ---");

// Find first valid configuration
const configs = {
    user: null,
    local: { theme: "dark" },
    default: { theme: "light" }
};

const theme = configs.user?.theme 
    || configs.local?.theme 
    || configs.default?.theme 
    || "system";

console.log("Theme:", theme);

// Conditional object creation
const includeMetadata = true;
const data = {
    name: "Test",
    ...(includeMetadata && { createdAt: new Date(), version: 1 })
};
console.log("Data:", data);

