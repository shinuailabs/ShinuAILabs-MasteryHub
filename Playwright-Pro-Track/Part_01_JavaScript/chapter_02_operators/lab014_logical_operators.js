/**
 * Lab 014: Logical Operators
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Logical operators work with boolean values:
 * 
 * && (AND) - Returns true if BOTH operands are true
 * || (OR)  - Returns true if AT LEAST ONE operand is true
 * !  (NOT) - Returns opposite boolean value
 * 
 * Short-circuit evaluation:
 * - && stops at first falsy value
 * - || stops at first truthy value
 * 
 * Returns actual value, not just true/false!
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Use AND, OR, NOT operators
 * 2. Understand short-circuit evaluation
 * 3. Use logical operators for default values
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: AND Operator (&&)
console.log("--- AND Operator (&&) ---");
console.log("true && true:", true && true);     // true
console.log("true && false:", true && false);   // false
console.log("false && true:", false && true);   // false
console.log("false && false:", false && false); // false

// Practical AND usage
const age = 25;
const hasLicense = true;
const canDrive = age >= 18 && hasLicense;
console.log("Can drive:", canDrive);

// Solution 2: OR Operator (||)
console.log("\n--- OR Operator (||) ---");
console.log("true || true:", true || true);     // true
console.log("true || false:", true || false);   // true
console.log("false || true:", false || true);   // true
console.log("false || false:", false || false); // false

// Practical OR usage
const isWeekend = true;
const isHoliday = false;
const dayOff = isWeekend || isHoliday;
console.log("Day off:", dayOff);

// Solution 3: NOT Operator (!)
console.log("\n--- NOT Operator (!) ---");
console.log("!true:", !true);       // false
console.log("!false:", !false);     // true
console.log("!0:", !0);             // true
console.log('!"hello":', !"hello"); // false

// Double NOT (!!) - Convert to boolean
console.log("\n--- Double NOT (!!) ---");
console.log("!!1:", !!1);           // true
console.log("!!0:", !!0);           // false
console.log('!!"text":', !!"text"); // true
console.log('!!"":', !!"");         // false
console.log("!!null:", !!null);     // false

// Solution 4: Short-Circuit Evaluation
console.log("\n--- Short-Circuit Evaluation ---");

// && returns first falsy value or last value
console.log("1 && 2 && 3:", 1 && 2 && 3);       // 3
console.log("1 && 0 && 3:", 1 && 0 && 3);       // 0
console.log("null && 'hello':", null && "hello"); // null

// || returns first truthy value or last value
console.log('0 || "" || "hello":', 0 || "" || "hello"); // "hello"
console.log("1 || 2:", 1 || 2);                   // 1
console.log("0 || null || undefined:", 0 || null || undefined); // undefined

// Solution 5: Default Values with ||
console.log("\n--- Default Values with || ---");
function greet(name) {
    name = name || "Guest";
    return `Hello, ${name}!`;
}
console.log(greet("John"));     // "Hello, John!"
console.log(greet(""));         // "Hello, Guest!" (empty string is falsy)
console.log(greet(null));       // "Hello, Guest!"

// Solution 6: Conditional Execution with &&
console.log("\n--- Conditional Execution with && ---");
const isLoggedIn = true;
const username = "John";

// Execute only if condition is true
isLoggedIn && console.log(`Welcome, ${username}!`);

// Same as:
// if (isLoggedIn) console.log(`Welcome, ${username}!`);

// Solution 7: Complex Conditions
console.log("\n--- Complex Conditions ---");
const user = {
    age: 25,
    role: "admin",
    active: true
};

// Multiple conditions
const canAccessAdmin = user.age >= 18 && user.role === "admin" && user.active;
console.log("Can access admin:", canAccessAdmin);

// Using parentheses for clarity
const isVIP = user.role === "admin" || user.role === "moderator";
const hasFullAccess = user.active && (isVIP || user.age >= 21);
console.log("Has full access:", hasFullAccess);

// Solution 8: Operator Precedence
console.log("\n--- Operator Precedence ---");
// NOT (!) > AND (&&) > OR (||)
console.log("true || false && false:", true || false && false); // true
// Evaluated as: true || (false && false) = true || false = true

console.log("(true || false) && false:", (true || false) && false); // false
// Use parentheses to make intent clear!

// Practical example
const a = true, b = false, c = true;
const result = !b && (a || c);
console.log("!b && (a || c):", result); // true

