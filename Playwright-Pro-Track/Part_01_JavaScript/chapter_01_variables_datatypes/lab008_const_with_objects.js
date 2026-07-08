/**
 * Lab 008: const with Objects and Arrays
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * When using const with objects and arrays:
 * - The REFERENCE cannot be changed (can't reassign to new object/array)
 * - The CONTENTS can be modified (properties/elements can change)
 * 
 * This is because const protects the binding, not the value itself.
 * 
 * To make truly immutable objects:
 * - Object.freeze() - shallow freeze
 * - Deep freeze requires custom implementation
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Modify properties of const objects
 * 2. Modify elements of const arrays
 * 3. Understand what you cannot do with const
 * 4. Use Object.freeze() for immutability
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: const Object - Can Modify Properties
console.log("--- const Object Modification ---");
const user = {
    name: "John",
    age: 25,
    email: "john@example.com"
};

console.log("Original user:", user);

// Can modify properties
user.name = "Jane";
user.age = 30;
user.city = "New York"; // Can add new properties
delete user.email;       // Can delete properties

console.log("Modified user:", user);

// Cannot reassign
// user = { name: "Bob" }; // TypeError: Assignment to constant variable

// Solution 2: const Array - Can Modify Elements
console.log("\n--- const Array Modification ---");
const fruits = ["apple", "banana"];

console.log("Original array:", fruits);

// Can modify elements
fruits[0] = "orange";
fruits.push("grape");
fruits.pop();
fruits.unshift("mango");

console.log("Modified array:", fruits);

// Cannot reassign
// fruits = ["new", "array"]; // TypeError

// Solution 3: Object.freeze() - Shallow Immutability
console.log("\n--- Object.freeze() ---");
const frozenUser = Object.freeze({
    name: "Alice",
    age: 28
});

frozenUser.name = "Bob";    // Silently fails (or throws in strict mode)
frozenUser.city = "LA";     // Silently fails
delete frozenUser.age;      // Silently fails

console.log("Frozen user (unchanged):", frozenUser);

// Check if frozen
console.log("Is frozen?", Object.isFrozen(frozenUser));

// Solution 4: Shallow vs Deep Freeze
console.log("\n--- Shallow Freeze Limitation ---");
const shallowFrozen = Object.freeze({
    name: "John",
    address: {
        city: "NYC",
        zip: "10001"
    }
});

// Nested object can still be modified!
shallowFrozen.address.city = "Los Angeles";
console.log("Nested object modified:", shallowFrozen.address);

// Solution 5: Deep Freeze Function
function deepFreeze(obj) {
    Object.keys(obj).forEach(key => {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
            deepFreeze(obj[key]);
        }
    });
    return Object.freeze(obj);
}

const deepFrozen = deepFreeze({
    name: "John",
    address: {
        city: "NYC",
        zip: "10001"
    }
});

deepFrozen.address.city = "Boston"; // Won't work now
console.log("Deep frozen address:", deepFrozen.address);

// Solution 6: Object.seal() - Prevent Add/Delete
console.log("\n--- Object.seal() ---");
const sealedObj = Object.seal({
    name: "Test",
    value: 100
});

sealedObj.name = "Changed";   // Works - can modify existing
sealedObj.newProp = "New";    // Fails - cannot add
delete sealedObj.value;       // Fails - cannot delete

console.log("Sealed object:", sealedObj);
console.log("Is sealed?", Object.isSealed(sealedObj));

// Solution 7: Best Practice - Spread for Immutability
console.log("\n--- Spread for Immutability ---");
const original = { a: 1, b: 2 };
const updated = { ...original, b: 3, c: 4 }; // Create new object

console.log("Original:", original);
console.log("Updated (new object):", updated);

