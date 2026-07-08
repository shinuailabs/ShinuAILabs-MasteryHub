/**
 * Lab 134: Destructuring
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Extracting values from arrays and objects:
 * 
 * - Array destructuring
 * - Object destructuring
 * - Default values
 * - Nested destructuring
 * - Rest pattern
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Destructure arrays and objects
 * 2. Use default values
 * 3. Apply nested destructuring
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Array Destructuring
console.log("--- Array Destructuring ---");

const colors = ["red", "green", "blue"];

// Basic destructuring
const [first, second, third] = colors;
console.log("Colors:", first, second, third);

// Skip elements
const [primary, , tertiary] = colors;
console.log("Skipped:", primary, tertiary);

// Rest pattern
const [head, ...tail] = colors;
console.log("Head:", head, "Tail:", tail);

// Solution 2: Object Destructuring
console.log("\n--- Object Destructuring ---");

const user = {
    name: "John",
    age: 30,
    email: "john@example.com"
};

// Basic destructuring
const { name, age, email } = user;
console.log("User:", name, age, email);

// Rename variables
const { name: userName, age: userAge } = user;
console.log("Renamed:", userName, userAge);

// Solution 3: Default Values
console.log("\n--- Default Values ---");

// Array defaults
const [a = 1, b = 2, c = 3] = [10, 20];
console.log("Array defaults:", a, b, c);

// Object defaults
const { name: n, role = "user" } = { name: "Jane" };
console.log("Object defaults:", n, role);

// Solution 4: Nested Destructuring
console.log("\n--- Nested Destructuring ---");

const person = {
    fullName: "John Doe",
    address: {
        city: "New York",
        country: "USA"
    },
    hobbies: ["reading", "coding"]
};

const {
    fullName,
    address: { city, country },
    hobbies: [hobby1, hobby2]
} = person;

console.log("Nested:", fullName, city, country, hobby1, hobby2);

// Solution 5: Function Parameters
console.log("\n--- Function Parameters ---");

// Object parameter destructuring
function greet({ name, greeting = "Hello" }) {
    console.log(`${greeting}, ${name}!`);
}

greet({ name: "John" });
greet({ name: "Jane", greeting: "Hi" });

// Array parameter destructuring
function sum([a, b, c = 0]) {
    return a + b + c;
}

console.log("Sum:", sum([1, 2, 3]));

// Solution 6: Swapping Variables
console.log("\n--- Swapping Variables ---");

let x = 1;
let y = 2;

[x, y] = [y, x];
console.log("Swapped:", x, y);

// Solution 7: Function Return Values
console.log("\n--- Return Values ---");

function getMinMax(arr) {
    return [Math.min(...arr), Math.max(...arr)];
}

const [min, max] = getMinMax([3, 1, 4, 1, 5, 9]);
console.log("Min:", min, "Max:", max);

function getUser() {
    return { id: 1, name: "John", role: "admin" };
}

const { id, role } = getUser();
console.log("User:", id, role);

// Solution 8: Rest in Destructuring
console.log("\n--- Rest Pattern ---");

// Array rest
const [first2, ...rest] = [1, 2, 3, 4, 5];
console.log("First:", first2, "Rest:", rest);

// Object rest
const { name: userName2, ...otherProps } = {
    name: "John",
    age: 30,
    email: "john@example.com"
};
console.log("Name:", userName2, "Other:", otherProps);

// Solution 9: Complex Destructuring
console.log("\n--- Complex Example ---");

const response = {
    status: 200,
    data: {
        users: [
            { id: 1, name: "John" },
            { id: 2, name: "Jane" }
        ],
        pagination: {
            page: 1,
            total: 10
        }
    }
};

const {
    status,
    data: {
        users: [firstUser, secondUser],
        pagination: { page, total }
    }
} = response;

console.log("Status:", status);
console.log("First user:", firstUser);
console.log("Page:", page, "of", total);

// Solution 10: Practical Examples
console.log("\n--- Practical Examples ---");

// API response handling
function handleResponse({ data, error, loading = false }) {
    if (loading) return console.log("Loading...");
    if (error) return console.log("Error:", error);
    console.log("Data:", data);
}

handleResponse({ data: { id: 1 }, error: null });

// Config with defaults
function createConfig({ host = "localhost", port = 3000, ssl = false } = {}) {
    return { host, port, ssl };
}

console.log("Config:", createConfig({ port: 8080 }));
console.log("Default config:", createConfig());

