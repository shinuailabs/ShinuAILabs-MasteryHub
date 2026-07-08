/**
 * Lab 017: Optional Chaining Operator (?.)
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Optional chaining (?.) safely accesses nested properties.
 * Returns undefined if a reference is null or undefined.
 * 
 * Syntax variations:
 * - obj?.property      - Property access
 * - obj?.[expression]  - Dynamic property access
 * - obj?.method()      - Method call
 * - arr?.[index]       - Array access
 * 
 * Prevents "Cannot read property of undefined" errors!
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Access nested object properties safely
 * 2. Call methods conditionally
 * 3. Access array elements safely
 * 4. Combine with nullish coalescing
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Basic Property Access
console.log("--- Basic Optional Chaining ---");

const user = {
    name: "John",
    address: {
        city: "New York",
        zip: "10001"
    }
};

// Without optional chaining (old way)
const city1 = user && user.address && user.address.city;
console.log("Old way:", city1);

// With optional chaining
const city2 = user?.address?.city;
console.log("Optional chaining:", city2);

// Accessing non-existent property
const country = user?.address?.country;
console.log("Non-existent:", country); // undefined (no error!)

// Solution 2: When Property Might Not Exist
console.log("\n--- Handling Missing Properties ---");

const users = [
    { name: "Alice", profile: { bio: "Developer" } },
    { name: "Bob" },  // No profile
    null              // Null user
];

users.forEach((u, i) => {
    const bio = u?.profile?.bio ?? "No bio";
    console.log(`User ${i}: ${u?.name ?? "Unknown"} - ${bio}`);
});

// Solution 3: Optional Method Calls
console.log("\n--- Optional Method Calls ---");

const api = {
    getData: () => "Data loaded",
    // processData doesn't exist
};

// Safe method call
const result1 = api.getData?.();
const result2 = api.processData?.();  // undefined (no error)

console.log("getData:", result1);
console.log("processData:", result2);

// With callback functions
function executeCallback(obj) {
    obj?.onSuccess?.("Done!");
    obj?.onError?.("Failed!");
}

executeCallback({
    onSuccess: (msg) => console.log("Success:", msg)
    // onError not defined - won't cause error
});

// Solution 4: Dynamic Property Access
console.log("\n--- Dynamic Property Access ---");

const config = {
    database: {
        host: "localhost",
        port: 5432
    }
};

const propName = "host";
const host = config?.database?.[propName];
console.log("Dynamic access:", host);

// With missing section
const cacheProp = config?.cache?.[propName];
console.log("Missing section:", cacheProp); // undefined

// Solution 5: Array Access
console.log("\n--- Array Access ---");

const data = {
    items: ["first", "second", "third"]
};

console.log("First item:", data?.items?.[0]);
console.log("Fourth item:", data?.items?.[3]); // undefined

// Missing array
const emptyData = {};
console.log("Missing array:", emptyData?.items?.[0]); // undefined

// Solution 6: Combining with ??
console.log("\n--- Combining with ?? ---");

const response = {
    data: {
        user: {
            preferences: {
                theme: "dark"
            }
        }
    }
};

// Deep access with default
const theme = response?.data?.user?.preferences?.theme ?? "light";
const fontSize = response?.data?.user?.preferences?.fontSize ?? 14;

console.log("Theme:", theme);     // "dark"
console.log("Font size:", fontSize); // 14 (default)

// Solution 7: Short-Circuit Evaluation
console.log("\n--- Short-Circuit Behavior ---");

let callCount = 0;
function getObject() {
    callCount++;
    return null;
}

// Function is called, but chaining stops at null
const value = getObject()?.property?.nested;
console.log("Value:", value);
console.log("Function called:", callCount, "time(s)");

// Solution 8: Real-World API Response Handling
console.log("\n--- API Response Handling ---");

function processApiResponse(response) {
    const status = response?.status ?? "unknown";
    const errorMessage = response?.error?.message ?? "No error";
    const firstItem = response?.data?.items?.[0]?.name ?? "No items";
    
    return { status, errorMessage, firstItem };
}

const goodResponse = {
    status: "success",
    data: { items: [{ name: "Item 1" }] }
};

const badResponse = {
    status: "error",
    error: { message: "Not found" }
};

console.log("Good:", processApiResponse(goodResponse));
console.log("Bad:", processApiResponse(badResponse));
console.log("Null:", processApiResponse(null));

