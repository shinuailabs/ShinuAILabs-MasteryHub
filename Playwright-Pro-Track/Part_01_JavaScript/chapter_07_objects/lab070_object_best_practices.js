/**
 * Lab 070: Object Best Practices
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Best practices for working with objects:
 * 
 * 1. Prefer immutability
 * 2. Use shorthand syntax
 * 3. Destructure for clarity
 * 4. Use optional chaining
 * 5. Validate object shapes
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Apply best practices
 * 2. Write clean object code
 * 3. Handle edge cases
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Best Practice 1: Prefer Immutability
console.log("--- Immutability ---");

const original = { a: 1, b: 2 };

// BAD: Mutate directly
// original.c = 3;

// GOOD: Create new object
const updated = { ...original, c: 3 };
console.log("Original:", original);
console.log("Updated:", updated);

// Update nested immutably
const nested = { user: { name: "Alice", age: 25 } };
const updatedNested = {
    ...nested,
    user: { ...nested.user, age: 26 }
};
console.log("Nested update:", updatedNested);

// Best Practice 2: Use Shorthand Syntax
console.log("\n--- Shorthand Syntax ---");

const name = "Bob";
const age = 30;

// BAD
const user1 = { name: name, age: age };

// GOOD: Property shorthand
const user2 = { name, age };

// GOOD: Method shorthand
const obj = {
    // BAD: greet: function() {}
    greet() {
        return "Hello";
    }
};

console.log("User:", user2);

// Best Practice 3: Destructure for Clarity
console.log("\n--- Destructuring ---");

const response = {
    data: { users: [{ id: 1, name: "Charlie" }] },
    status: 200,
    headers: {}
};

// BAD
const users1 = response.data.users;

// GOOD
const { data: { users }, status } = response;
console.log("Users:", users);
console.log("Status:", status);

// In function parameters
function processUser({ name, age, role = "user" }) {
    console.log(`${name} (${age}) - ${role}`);
}
processUser({ name: "Diana", age: 28 });

// Best Practice 4: Optional Chaining
console.log("\n--- Optional Chaining ---");

const config = {
    database: {
        host: "localhost"
        // port is missing
    }
};

// BAD
// const port1 = config.database && config.database.port;

// GOOD
const port = config.database?.port ?? 3306;
console.log("Port:", port);

// With methods
const obj2 = {
    getData: () => "data"
};
console.log("Method:", obj2.getData?.());
console.log("Missing method:", obj2.missing?.());

// Best Practice 5: Nullish Coalescing
console.log("\n--- Nullish Coalescing ---");

const settings = { theme: "", count: 0, debug: null };

// BAD: || treats 0 and "" as falsy
const count1 = settings.count || 10; // 10 (wrong!)

// GOOD: ?? only for null/undefined
const count2 = settings.count ?? 10; // 0 (correct!)
const theme = settings.theme ?? "default"; // "" (correct!)
const debug = settings.debug ?? false; // false

console.log("Count:", count2);
console.log("Theme:", theme);

// Best Practice 6: Object Validation
console.log("\n--- Validation ---");

function validateUser(user) {
    const required = ["name", "email"];
    const missing = required.filter(key => !(key in user));
    
    if (missing.length > 0) {
        throw new Error(`Missing required fields: ${missing.join(", ")}`);
    }
    
    return true;
}

try {
    validateUser({ name: "Eve" });
} catch (e) {
    console.log("Validation error:", e.message);
}

// Best Practice 7: Computed Property Names
console.log("\n--- Computed Properties ---");

const field = "dynamicField";
const value = "dynamicValue";

const dynamic = {
    [field]: value,
    [`${field}Count`]: 1
};
console.log("Dynamic:", dynamic);

// Best Practice 8: Object.freeze for Constants
console.log("\n--- Constants ---");

const CONFIG = Object.freeze({
    API_URL: "https://api.example.com",
    TIMEOUT: 5000,
    RETRIES: 3
});

// CONFIG.API_URL = "changed"; // Fails silently (or throws in strict)
console.log("Config:", CONFIG);

// Best Practice 9: Factory Functions
console.log("\n--- Factory Functions ---");

function createUser(name, email, options = {}) {
    return {
        id: Date.now(),
        name,
        email,
        role: options.role ?? "user",
        active: options.active ?? true,
        createdAt: new Date().toISOString()
    };
}

const newUser = createUser("Frank", "frank@test.com", { role: "admin" });
console.log("New user:", newUser);

// Best Practice 10: Avoid Prototype Pollution
console.log("\n--- Safe Object Creation ---");

// BAD: Can be affected by prototype pollution
// const obj = {};

// GOOD: No prototype
const safeObj = Object.create(null);
safeObj.key = "value";
console.log("Safe object:", safeObj);
console.log("Has toString:", "toString" in safeObj); // false

// Summary
console.log("\n--- Summary ---");
console.log("1. Use spread for immutable updates");
console.log("2. Use shorthand syntax");
console.log("3. Destructure in params and assignments");
console.log("4. Use ?. and ?? for safe access");
console.log("5. Validate object shapes");
console.log("6. Use Object.freeze for constants");
console.log("7. Use factory functions for creation");

