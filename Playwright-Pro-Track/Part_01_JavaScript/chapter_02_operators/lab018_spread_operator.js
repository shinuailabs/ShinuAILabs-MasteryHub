/**
 * Lab 018: Spread Operator (...)
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * The spread operator (...) expands iterables into individual elements.
 * 
 * Use cases:
 * - Copy arrays: [...arr]
 * - Merge arrays: [...arr1, ...arr2]
 * - Copy objects: {...obj}
 * - Merge objects: {...obj1, ...obj2}
 * - Function arguments: func(...args)
 * - Convert iterables to arrays
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Copy and merge arrays
 * 2. Copy and merge objects
 * 3. Use spread in function calls
 * 4. Convert strings and Sets to arrays
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Copy Arrays
console.log("--- Copy Arrays ---");
const original = [1, 2, 3];
const copy = [...original];

copy.push(4);
console.log("Original:", original); // [1, 2, 3] (unchanged)
console.log("Copy:", copy);         // [1, 2, 3, 4]

// Solution 2: Merge Arrays
console.log("\n--- Merge Arrays ---");
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];

const merged = [...arr1, ...arr2];
console.log("Merged:", merged); // [1, 2, 3, 4, 5, 6]

// Insert in middle
const withMiddle = [...arr1, 99, ...arr2];
console.log("With middle:", withMiddle); // [1, 2, 3, 99, 4, 5, 6]

// Prepend and append
const prepended = [0, ...arr1];
const appended = [...arr1, 4];
console.log("Prepended:", prepended);
console.log("Appended:", appended);

// Solution 3: Copy Objects
console.log("\n--- Copy Objects ---");
const user = { name: "John", age: 30 };
const userCopy = { ...user };

userCopy.age = 31;
console.log("Original user:", user);     // age: 30
console.log("User copy:", userCopy);     // age: 31

// Solution 4: Merge Objects
console.log("\n--- Merge Objects ---");
const defaults = { theme: "light", fontSize: 14, language: "en" };
const userPrefs = { theme: "dark", fontSize: 16 };

// Later properties override earlier ones
const settings = { ...defaults, ...userPrefs };
console.log("Merged settings:", settings);
// { theme: "dark", fontSize: 16, language: "en" }

// Add/override specific properties
const updated = { ...user, age: 31, city: "NYC" };
console.log("Updated user:", updated);

// Solution 5: Function Arguments
console.log("\n--- Function Arguments ---");
const numbers = [5, 2, 8, 1, 9];

// Without spread (old way)
const max1 = Math.max.apply(null, numbers);

// With spread
const max2 = Math.max(...numbers);
const min = Math.min(...numbers);

console.log("Max:", max2);
console.log("Min:", min);

// Multiple arrays in one call
const moreNumbers = [10, 3, 7];
const totalMax = Math.max(...numbers, ...moreNumbers);
console.log("Total max:", totalMax);

// Solution 6: Convert Iterables
console.log("\n--- Convert Iterables ---");

// String to array
const str = "Hello";
const chars = [...str];
console.log("String to array:", chars); // ["H", "e", "l", "l", "o"]

// Set to array (removes duplicates)
const set = new Set([1, 2, 2, 3, 3, 3]);
const uniqueArr = [...set];
console.log("Set to array:", uniqueArr); // [1, 2, 3]

// Map to array
const map = new Map([["a", 1], ["b", 2]]);
const mapArr = [...map];
console.log("Map to array:", mapArr);

// Solution 7: Shallow Copy Warning
console.log("\n--- Shallow Copy Warning ---");
const nested = {
    name: "John",
    address: { city: "NYC" }
};

const shallowCopy = { ...nested };
shallowCopy.address.city = "LA"; // Modifies original!

console.log("Original address:", nested.address.city);     // "LA" (changed!)
console.log("Copy address:", shallowCopy.address.city);    // "LA"

// For deep copy, use structuredClone or JSON
const deepCopy = JSON.parse(JSON.stringify(nested));
deepCopy.address.city = "Chicago";
console.log("After deep copy change:", nested.address.city); // Still "LA"

// Solution 8: Practical Examples
console.log("\n--- Practical Examples ---");

// Immutable state update (React pattern)
const state = { count: 0, items: [] };
const newState = { ...state, count: state.count + 1 };
console.log("New state:", newState);

// Array deduplication
const withDupes = [1, 2, 2, 3, 3, 3];
const unique = [...new Set(withDupes)];
console.log("Unique:", unique);

// Combine with destructuring
const [first, ...rest] = [1, 2, 3, 4, 5];
console.log("First:", first);
console.log("Rest:", rest);

