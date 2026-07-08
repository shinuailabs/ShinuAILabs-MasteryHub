/**
 * Lab 044: Parameters and Arguments
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Parameters: Variables listed in function definition
 * Arguments: Values passed when calling the function
 * 
 * Features:
 * - Default parameters
 * - Rest parameters (...args)
 * - The arguments object (regular functions only)
 * - Destructuring parameters
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Use default parameters
 * 2. Use rest parameters
 * 3. Destructure parameters
 * 4. Handle variable arguments
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Basic Parameters
console.log("--- Basic Parameters ---");

function greet(name, greeting) {
    console.log(`${greeting}, ${name}!`);
}

greet("Alice", "Hello");
greet("Bob", "Hi");

// Solution 2: Missing Arguments
console.log("\n--- Missing Arguments ---");

function showArgs(a, b, c) {
    console.log(`a: ${a}, b: ${b}, c: ${c}`);
}

showArgs(1, 2, 3);    // All provided
showArgs(1, 2);       // c is undefined
showArgs(1);          // b and c are undefined

// Solution 3: Default Parameters
console.log("\n--- Default Parameters ---");

function greetWithDefault(name = "Guest", greeting = "Hello") {
    console.log(`${greeting}, ${name}!`);
}

greetWithDefault();                    // Uses both defaults
greetWithDefault("Alice");             // Uses default greeting
greetWithDefault("Bob", "Hi");         // No defaults used
greetWithDefault(undefined, "Hey");    // Uses default name

// Solution 4: Default with Expressions
console.log("\n--- Default Expressions ---");

function createId(prefix = "ID", timestamp = Date.now()) {
    return `${prefix}_${timestamp}`;
}

console.log(createId());
console.log(createId("USER"));

// Default using previous parameter
function createRange(start, end = start + 10) {
    return { start, end };
}

console.log(createRange(5));
console.log(createRange(5, 20));

// Solution 5: Rest Parameters
console.log("\n--- Rest Parameters ---");

function sum(...numbers) {
    return numbers.reduce((acc, n) => acc + n, 0);
}

console.log("Sum(1,2,3):", sum(1, 2, 3));
console.log("Sum(1,2,3,4,5):", sum(1, 2, 3, 4, 5));

// Rest with other parameters
function introduce(greeting, ...names) {
    console.log(`${greeting}: ${names.join(", ")}`);
}

introduce("Hello", "Alice", "Bob", "Charlie");

// Solution 6: Arguments Object (Regular Functions)
console.log("\n--- Arguments Object ---");

function showAllArgs() {
    console.log("Arguments:", arguments);
    console.log("Length:", arguments.length);
    
    // Convert to array
    const argsArray = Array.from(arguments);
    console.log("As array:", argsArray);
}

showAllArgs("a", "b", "c", 1, 2, 3);

// Note: Arrow functions don't have arguments
// const arrowFunc = () => console.log(arguments); // Error!

// Solution 7: Destructuring Parameters
console.log("\n--- Destructuring Parameters ---");

// Object destructuring
function printUser({ name, age, email = "N/A" }) {
    console.log(`Name: ${name}, Age: ${age}, Email: ${email}`);
}

printUser({ name: "Alice", age: 25, email: "alice@test.com" });
printUser({ name: "Bob", age: 30 });

// Array destructuring
function printCoordinates([x, y, z = 0]) {
    console.log(`X: ${x}, Y: ${y}, Z: ${z}`);
}

printCoordinates([10, 20]);
printCoordinates([10, 20, 30]);

// Solution 8: Nested Destructuring
console.log("\n--- Nested Destructuring ---");

function processOrder({ 
    id, 
    customer: { name, address: { city } },
    items = []
}) {
    console.log(`Order ${id} for ${name} in ${city}`);
    console.log(`Items: ${items.length}`);
}

processOrder({
    id: 123,
    customer: {
        name: "John",
        address: { city: "NYC", zip: "10001" }
    },
    items: ["item1", "item2"]
});

// Solution 9: Combining Techniques
console.log("\n--- Combined Techniques ---");

function createRequest(
    url,
    { method = "GET", headers = {}, body = null } = {},
    ...middleware
) {
    console.log(`${method} ${url}`);
    console.log("Headers:", headers);
    console.log("Body:", body);
    console.log("Middleware:", middleware);
}

createRequest("/api/users");
createRequest("/api/users", { method: "POST", body: { name: "Test" } });
createRequest("/api/users", {}, "auth", "logging");

// Solution 10: Parameter Validation
console.log("\n--- Parameter Validation ---");

function required(paramName) {
    throw new Error(`Parameter '${paramName}' is required`);
}

function createUser2(name = required("name"), email = required("email")) {
    return { name, email };
}

try {
    createUser2("Alice"); // Missing email
} catch (e) {
    console.log("Error:", e.message);
}

console.log(createUser2("Alice", "alice@test.com"));

