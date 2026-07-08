/**
 * Lab 135: Spread and Rest Operators
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * The ... operator has two uses:
 * 
 * Spread: Expands iterables into elements
 * Rest: Collects elements into an array
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Use spread with arrays and objects
 * 2. Use rest in function parameters
 * 3. Combine spread and rest
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Array Spread
console.log("--- Array Spread ---");

const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];

// Combine arrays
const combined = [...arr1, ...arr2];
console.log("Combined:", combined);

// Copy array
const copy = [...arr1];
console.log("Copy:", copy);

// Add elements
const withMore = [0, ...arr1, 4];
console.log("With more:", withMore);

// Solution 2: Object Spread
console.log("\n--- Object Spread ---");

const obj1 = { a: 1, b: 2 };
const obj2 = { c: 3, d: 4 };

// Merge objects
const merged = { ...obj1, ...obj2 };
console.log("Merged:", merged);

// Copy object
const objCopy = { ...obj1 };
console.log("Object copy:", objCopy);

// Override properties
const updated = { ...obj1, b: 20, e: 5 };
console.log("Updated:", updated);

// Solution 3: Rest Parameters
console.log("\n--- Rest Parameters ---");

function sum(...numbers) {
    return numbers.reduce((total, n) => total + n, 0);
}

console.log("Sum:", sum(1, 2, 3, 4, 5));

function greet(greeting, ...names) {
    return names.map(name => `${greeting}, ${name}!`);
}

console.log("Greetings:", greet("Hello", "John", "Jane", "Bob"));

// Solution 4: Rest in Destructuring
console.log("\n--- Rest in Destructuring ---");

// Array
const [first, second, ...rest] = [1, 2, 3, 4, 5];
console.log("First:", first, "Rest:", rest);

// Object
const { a, ...others } = { a: 1, b: 2, c: 3 };
console.log("a:", a, "Others:", others);

// Solution 5: Function Arguments
console.log("\n--- Function Arguments ---");

function multiply(multiplier, ...numbers) {
    return numbers.map(n => n * multiplier);
}

console.log("Multiplied:", multiply(2, 1, 2, 3, 4));

// Spread in function calls
const nums = [1, 2, 3];
console.log("Max:", Math.max(...nums));
console.log("Min:", Math.min(...nums));

// Solution 6: Shallow Copy Warning
console.log("\n--- Shallow Copy ---");

const original = {
    name: "John",
    address: { city: "NYC" }
};

const shallowCopy = { ...original };
shallowCopy.name = "Jane";
shallowCopy.address.city = "LA"; // Modifies original!

console.log("Original:", original);
console.log("Copy:", shallowCopy);

// Deep copy (simple)
const deepCopy = JSON.parse(JSON.stringify(original));

// Solution 7: Conditional Spread
console.log("\n--- Conditional Spread ---");

const includeExtra = true;
const extra = { extra: "data" };

const config = {
    base: "value",
    ...(includeExtra ? extra : {})
};

console.log("Config:", config);

// Conditional array spread
const items = [
    "always",
    ...(includeExtra ? ["sometimes"] : [])
];

console.log("Items:", items);

// Solution 8: Converting Iterables
console.log("\n--- Converting Iterables ---");

// String to array
const chars = [..."hello"];
console.log("Chars:", chars);

// Set to array
const set = new Set([1, 2, 2, 3, 3, 3]);
const unique = [...set];
console.log("Unique:", unique);

// Map to array
const map = new Map([["a", 1], ["b", 2]]);
const entries = [...map];
console.log("Entries:", entries);

// Solution 9: Practical Examples
console.log("\n--- Practical Examples ---");

// Immutable update
const user = { name: "John", age: 30 };
const updatedUser = { ...user, age: 31 };
console.log("Updated user:", updatedUser);

// Array manipulation
const todos = [
    { id: 1, text: "Learn JS" },
    { id: 2, text: "Learn TS" }
];

const newTodos = [
    ...todos,
    { id: 3, text: "Learn React" }
];

console.log("New todos:", newTodos);

// Remove item immutably
const withoutFirst = todos.slice(1);
console.log("Without first:", withoutFirst);

// Solution 10: Combining Patterns
console.log("\n--- Combining Patterns ---");

function createUser({ name, ...options }) {
    return {
        name,
        createdAt: new Date(),
        ...options
    };
}

const newUser = createUser({
    name: "John",
    email: "john@example.com",
    role: "admin"
});

console.log("New user:", newUser);

