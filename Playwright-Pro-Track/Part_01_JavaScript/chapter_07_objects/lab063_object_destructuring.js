/**
 * Lab 063: Object Destructuring
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Destructuring extracts properties from objects into variables.
 * 
 * Features:
 * - Basic extraction
 * - Renaming variables
 * - Default values
 * - Nested destructuring
 * - Rest pattern
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Extract properties
 * 2. Use defaults and renaming
 * 3. Destructure in function parameters
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Basic Destructuring
console.log("--- Basic Destructuring ---");

const person = { name: "Alice", age: 25, city: "NYC" };

const { name, age, city } = person;
console.log("Name:", name);
console.log("Age:", age);
console.log("City:", city);

// Solution 2: Renaming Variables
console.log("\n--- Renaming ---");

const user = { name: "Bob", email: "bob@test.com" };

const { name: userName, email: userEmail } = user;
console.log("User name:", userName);
console.log("User email:", userEmail);

// Solution 3: Default Values
console.log("\n--- Default Values ---");

const config = { host: "localhost" };

const { host, port = 3000, protocol = "http" } = config;
console.log("Host:", host);
console.log("Port:", port);
console.log("Protocol:", protocol);

// Default with rename
const { timeout: requestTimeout = 5000 } = config;
console.log("Timeout:", requestTimeout);

// Solution 4: Nested Destructuring
console.log("\n--- Nested Destructuring ---");

const data = {
    user: {
        profile: {
            firstName: "Charlie",
            lastName: "Brown"
        },
        settings: {
            theme: "dark"
        }
    }
};

const { 
    user: { 
        profile: { firstName, lastName },
        settings: { theme }
    } 
} = data;

console.log("Name:", firstName, lastName);
console.log("Theme:", theme);

// Solution 5: Rest Pattern
console.log("\n--- Rest Pattern ---");

const obj = { a: 1, b: 2, c: 3, d: 4 };

const { a, b, ...rest } = obj;
console.log("a:", a);
console.log("b:", b);
console.log("rest:", rest);

// Solution 6: Function Parameters
console.log("\n--- Function Parameters ---");

function greet({ name, greeting = "Hello" }) {
    console.log(`${greeting}, ${name}!`);
}

greet({ name: "Diana" });
greet({ name: "Eve", greeting: "Hi" });

// With defaults for entire parameter
function createUser({ name, age, role = "user" } = {}) {
    return { name, age, role };
}

console.log(createUser({ name: "Frank", age: 30 }));
console.log(createUser()); // Works with default {}

// Solution 7: Mixed Array and Object
console.log("\n--- Mixed Destructuring ---");

const response = {
    status: 200,
    data: ["item1", "item2", "item3"]
};

const { status, data: [first, second] } = response;
console.log("Status:", status);
console.log("First item:", first);

// Solution 8: Computed Property Names
console.log("\n--- Computed Properties ---");

const key = "dynamicKey";
const obj2 = { dynamicKey: "dynamic value" };

const { [key]: value } = obj2;
console.log("Dynamic value:", value);

// Solution 9: Swapping with Destructuring
console.log("\n--- Swapping ---");

let x = 1, y = 2;
console.log("Before:", x, y);

({ x, y } = { x: y, y: x });
console.log("After:", x, y);

// Solution 10: Practical Examples
console.log("\n--- Practical Examples ---");

// API Response
const apiResponse = {
    success: true,
    data: {
        users: [{ id: 1, name: "User1" }],
        total: 100,
        page: 1
    },
    error: null
};

const { 
    success, 
    data: { users, total, page },
    error 
} = apiResponse;

console.log("Success:", success);
console.log("Users:", users);
console.log("Total:", total);

// Event handler
function handleEvent({ target: { value, name }, type }) {
    console.log(`Event: ${type}, Field: ${name}, Value: ${value}`);
}

handleEvent({ 
    target: { value: "test", name: "input" }, 
    type: "change" 
});

// Import-like pattern
const module = {
    default: function() { return "default"; },
    helper1: function() { return "helper1"; },
    helper2: function() { return "helper2"; }
};

const { default: main, helper1 } = module;
console.log("Main:", main());
console.log("Helper:", helper1());

// Solution 11: Gotchas
console.log("\n--- Gotchas ---");

// Must use parentheses for assignment without declaration
let a2, b2;
({ a2, b2 } = { a2: 1, b2: 2 }); // Parentheses required!
console.log("Assigned:", a2, b2);

// Undefined vs missing
const { missing } = {};
console.log("Missing:", missing); // undefined

