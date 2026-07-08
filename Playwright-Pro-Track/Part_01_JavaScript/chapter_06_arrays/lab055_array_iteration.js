/**
 * Lab 055: Array Iteration Methods
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Methods to iterate over arrays:
 * 
 * - forEach: Execute function for each element
 * - map: Transform each element
 * - filter: Select elements
 * - reduce: Accumulate to single value
 * - reduceRight: Reduce from right to left
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Use forEach for side effects
 * 2. Use map for transformations
 * 3. Use reduce for aggregations
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: forEach
console.log("--- forEach ---");

const fruits = ["apple", "banana", "orange"];

// Basic forEach
fruits.forEach(fruit => {
    console.log("Fruit:", fruit);
});

// With index and array
fruits.forEach((fruit, index, array) => {
    console.log(`${index + 1}/${array.length}: ${fruit}`);
});

// forEach doesn't return anything
const result = fruits.forEach(f => f.toUpperCase());
console.log("forEach returns:", result); // undefined

// Solution 2: map
console.log("\n--- map ---");

const numbers = [1, 2, 3, 4, 5];

// Transform values
const doubled = numbers.map(n => n * 2);
console.log("Doubled:", doubled);

// Extract properties
const users = [
    { name: "Alice", age: 25 },
    { name: "Bob", age: 30 },
    { name: "Charlie", age: 35 }
];

const names = users.map(u => u.name);
console.log("Names:", names);

// Transform objects
const userCards = users.map(u => ({
    displayName: u.name.toUpperCase(),
    isAdult: u.age >= 18
}));
console.log("User cards:", userCards);

// Solution 3: filter
console.log("\n--- filter ---");

const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const evens = nums.filter(n => n % 2 === 0);
console.log("Evens:", evens);

const greaterThan5 = nums.filter(n => n > 5);
console.log("Greater than 5:", greaterThan5);

// Filter objects
const activeUsers = users.filter(u => u.age < 35);
console.log("Under 35:", activeUsers.map(u => u.name));

// Solution 4: reduce
console.log("\n--- reduce ---");

// Sum
const sum = numbers.reduce((acc, n) => acc + n, 0);
console.log("Sum:", sum);

// Product
const product = numbers.reduce((acc, n) => acc * n, 1);
console.log("Product:", product);

// Max value
const max = numbers.reduce((acc, n) => n > acc ? n : acc, numbers[0]);
console.log("Max:", max);

// Count occurrences
const items = ["a", "b", "a", "c", "b", "a"];
const counts = items.reduce((acc, item) => {
    acc[item] = (acc[item] || 0) + 1;
    return acc;
}, {});
console.log("Counts:", counts);

// Group by property
const grouped = users.reduce((acc, user) => {
    const ageGroup = user.age < 30 ? "young" : "senior";
    if (!acc[ageGroup]) acc[ageGroup] = [];
    acc[ageGroup].push(user.name);
    return acc;
}, {});
console.log("Grouped:", grouped);

// Flatten array
const nested = [[1, 2], [3, 4], [5, 6]];
const flat = nested.reduce((acc, arr) => acc.concat(arr), []);
console.log("Flattened:", flat);

// Solution 5: reduceRight
console.log("\n--- reduceRight ---");

const letters = ["a", "b", "c", "d"];

const leftToRight = letters.reduce((acc, l) => acc + l, "");
console.log("Left to right:", leftToRight);

const rightToLeft = letters.reduceRight((acc, l) => acc + l, "");
console.log("Right to left:", rightToLeft);

// Solution 6: Chaining Methods
console.log("\n--- Chaining ---");

const products = [
    { name: "Laptop", price: 999, category: "electronics" },
    { name: "Shirt", price: 29, category: "clothing" },
    { name: "Phone", price: 699, category: "electronics" },
    { name: "Pants", price: 49, category: "clothing" }
];

// Get total price of electronics
const electronicsTotal = products
    .filter(p => p.category === "electronics")
    .map(p => p.price)
    .reduce((sum, price) => sum + price, 0);

console.log("Electronics total:", electronicsTotal);

// Get names of affordable items
const affordableNames = products
    .filter(p => p.price < 100)
    .map(p => p.name)
    .join(", ");

console.log("Affordable items:", affordableNames);

// Solution 7: forEach vs map
console.log("\n--- forEach vs map ---");
console.log("forEach: Side effects, no return value");
console.log("map: Transformations, returns new array");

// Use forEach for logging, DOM updates
// Use map for creating new arrays

