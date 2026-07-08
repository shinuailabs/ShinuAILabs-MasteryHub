/**
 * Lab 064: Spread and Rest with Objects
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Spread (...) expands object properties.
 * Rest (...) collects remaining properties.
 * 
 * Uses:
 * - Clone objects
 * - Merge objects
 * - Override properties
 * - Omit properties
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Clone and merge objects
 * 2. Override properties
 * 3. Use rest for omitting
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Clone Object
console.log("--- Clone Object ---");

const original = { a: 1, b: 2, c: 3 };
const clone = { ...original };

console.log("Original:", original);
console.log("Clone:", clone);
console.log("Same object:", original === clone); // false

// Modify clone doesn't affect original
clone.a = 100;
console.log("After modify - Original:", original);
console.log("After modify - Clone:", clone);

// Solution 2: Merge Objects
console.log("\n--- Merge Objects ---");

const defaults = { theme: "light", lang: "en", debug: false };
const userPrefs = { theme: "dark", fontSize: 14 };

const merged = { ...defaults, ...userPrefs };
console.log("Merged:", merged);

// Later properties override earlier
const obj1 = { a: 1, b: 2 };
const obj2 = { b: 3, c: 4 };
const obj3 = { c: 5, d: 6 };

const combined = { ...obj1, ...obj2, ...obj3 };
console.log("Combined:", combined);

// Solution 3: Add/Override Properties
console.log("\n--- Add/Override ---");

const user = { name: "Alice", age: 25 };

// Add property
const withEmail = { ...user, email: "alice@test.com" };
console.log("With email:", withEmail);

// Override property
const olderUser = { ...user, age: 26 };
console.log("Older:", olderUser);

// Add at beginning
const withId = { id: 1, ...user };
console.log("With id:", withId);

// Solution 4: Conditional Spread
console.log("\n--- Conditional Spread ---");

const includeDebug = true;
const config = {
    host: "localhost",
    port: 3000,
    ...(includeDebug && { debug: true, verbose: true })
};
console.log("Config:", config);

// With ternary
const isAdmin = false;
const userConfig = {
    name: "Bob",
    ...(isAdmin ? { role: "admin", permissions: ["all"] } : { role: "user" })
};
console.log("User config:", userConfig);

// Solution 5: Rest for Omitting
console.log("\n--- Rest for Omitting ---");

const fullUser = { id: 1, name: "Charlie", password: "secret", email: "c@test.com" };

// Omit password
const { password, ...safeUser } = fullUser;
console.log("Safe user:", safeUser);

// Omit multiple
const { id, password: pwd, ...publicData } = fullUser;
console.log("Public data:", publicData);

// Solution 6: Pick Properties
console.log("\n--- Pick Properties ---");

function pick(obj, keys) {
    return keys.reduce((acc, key) => {
        if (key in obj) acc[key] = obj[key];
        return acc;
    }, {});
}

const data = { a: 1, b: 2, c: 3, d: 4 };
const picked = pick(data, ["a", "c"]);
console.log("Picked:", picked);

// Solution 7: Omit Properties
console.log("\n--- Omit Properties ---");

function omit(obj, keys) {
    const keysSet = new Set(keys);
    return Object.fromEntries(
        Object.entries(obj).filter(([key]) => !keysSet.has(key))
    );
}

const omitted = omit(data, ["b", "d"]);
console.log("Omitted:", omitted);

// Solution 8: Shallow Copy Warning
console.log("\n--- Shallow Copy Warning ---");

const nested = {
    name: "Test",
    inner: { value: 1 }
};

const shallowCopy = { ...nested };
shallowCopy.inner.value = 100;

console.log("Original inner:", nested.inner.value); // 100! Changed!
console.log("Copy inner:", shallowCopy.inner.value);

// Deep copy solution
const deepCopy = JSON.parse(JSON.stringify(nested));
// Or use structuredClone (modern browsers/Node)
// const deepCopy = structuredClone(nested);

// Solution 9: Function Parameters
console.log("\n--- Function Parameters ---");

function createUser(overrides) {
    const defaults = {
        role: "user",
        active: true,
        createdAt: new Date().toISOString()
    };
    return { ...defaults, ...overrides };
}

console.log(createUser({ name: "Diana", role: "admin" }));

// Solution 10: Immutable Updates
console.log("\n--- Immutable Updates ---");

const state = {
    user: { name: "Eve", age: 25 },
    settings: { theme: "dark" }
};

// Update nested property immutably
const newState = {
    ...state,
    user: {
        ...state.user,
        age: 26
    }
};

console.log("Old state:", state.user.age);
console.log("New state:", newState.user.age);
console.log("Settings same:", state.settings === newState.settings);

