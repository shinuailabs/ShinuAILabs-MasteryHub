/**
 * Lab 019: Rest Operator (...)
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * The rest operator (...) collects multiple elements into an array.
 * Same syntax as spread, but opposite purpose!
 * 
 * Use cases:
 * - Function parameters: function(...args)
 * - Destructuring: const [first, ...rest] = arr
 * - Object destructuring: const {a, ...rest} = obj
 * 
 * Rest vs Spread:
 * - Spread: Expands (unpacks) elements
 * - Rest: Collects (packs) elements
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create functions with rest parameters
 * 2. Use rest in array destructuring
 * 3. Use rest in object destructuring
 * 4. Combine rest with regular parameters
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Rest Parameters in Functions
console.log("--- Rest Parameters ---");

// Accept any number of arguments
function sum(...numbers) {
    return numbers.reduce((total, num) => total + num, 0);
}

console.log("sum(1, 2):", sum(1, 2));           // 3
console.log("sum(1, 2, 3, 4, 5):", sum(1, 2, 3, 4, 5)); // 15

// Rest with named parameters
function greet(greeting, ...names) {
    return names.map(name => `${greeting}, ${name}!`);
}

console.log(greet("Hello", "Alice", "Bob", "Charlie"));

// Solution 2: Rest Must Be Last Parameter
console.log("\n--- Rest Position ---");

// Correct: rest at the end
function correct(first, second, ...rest) {
    console.log("First:", first);
    console.log("Second:", second);
    console.log("Rest:", rest);
}
correct(1, 2, 3, 4, 5);

// Incorrect: would cause syntax error
// function wrong(...rest, last) {} // SyntaxError

// Solution 3: Array Destructuring with Rest
console.log("\n--- Array Destructuring ---");

const numbers = [1, 2, 3, 4, 5];

const [first, second, ...remaining] = numbers;
console.log("First:", first);       // 1
console.log("Second:", second);     // 2
console.log("Remaining:", remaining); // [3, 4, 5]

// Skip elements
const [a, , , ...others] = numbers;
console.log("First:", a);           // 1
console.log("Others (skip 2,3):", others); // [4, 5]

// Solution 4: Object Destructuring with Rest
console.log("\n--- Object Destructuring ---");

const user = {
    name: "John",
    age: 30,
    email: "john@example.com",
    city: "NYC"
};

const { name, ...otherInfo } = user;
console.log("Name:", name);
console.log("Other info:", otherInfo);
// { age: 30, email: "john@example.com", city: "NYC" }

// Exclude specific properties
const { email, ...userWithoutEmail } = user;
console.log("Without email:", userWithoutEmail);

// Solution 5: Combining Rest and Spread
console.log("\n--- Rest and Spread Together ---");

function logAndSum(...numbers) {
    console.log("Numbers received:", numbers);
    return Math.max(...numbers); // Spread to pass to Math.max
}

const result = logAndSum(5, 2, 8, 1, 9);
console.log("Max:", result);

// Solution 6: Arguments vs Rest
console.log("\n--- arguments vs rest ---");

// Old way with arguments object
function oldWay() {
    // arguments is array-like, not a real array
    const args = Array.from(arguments);
    return args.join(", ");
}

// New way with rest
function newWay(...args) {
    // args is a real array
    return args.join(", ");
}

console.log("Old way:", oldWay(1, 2, 3));
console.log("New way:", newWay(1, 2, 3));

// Solution 7: Practical Examples
console.log("\n--- Practical Examples ---");

// Flexible API function
function createUser(name, email, ...options) {
    const user = { name, email };
    
    // Process additional options
    options.forEach((opt, i) => {
        user[`option${i + 1}`] = opt;
    });
    
    return user;
}

console.log(createUser("John", "john@test.com", "admin", "active"));

// Immutable object update (exclude and add)
const config = {
    debug: true,
    timeout: 5000,
    retries: 3,
    deprecated: "old value"
};

const { deprecated, ...cleanConfig } = config;
const newConfig = { ...cleanConfig, version: "2.0" };
console.log("New config:", newConfig);

// Clone and modify
function updateUser(user, updates) {
    const { password, ...safeUser } = user; // Exclude password
    return { ...safeUser, ...updates };
}

const originalUser = { name: "John", password: "secret", age: 30 };
const updatedUser = updateUser(originalUser, { age: 31 });
console.log("Updated user:", updatedUser);

// Solution 8: Generic Wrapper Function
console.log("\n--- Generic Wrapper ---");

function logger(fn, ...args) {
    console.log(`Calling ${fn.name} with:`, args);
    const result = fn(...args);
    console.log(`Result:`, result);
    return result;
}

const add = (a, b) => a + b;
logger(add, 5, 3);

