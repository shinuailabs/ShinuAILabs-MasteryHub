/**
 * Lab 038: Loops vs Array Methods
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Array methods can often replace explicit loops:
 * 
 * - forEach: Execute function for each element
 * - map: Transform each element
 * - filter: Keep elements matching condition
 * - reduce: Accumulate to single value
 * - find: Find first matching element
 * - some/every: Test conditions
 * 
 * When to use each:
 * - Loops: Need break/continue, async operations
 * - Methods: Cleaner, functional style
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Convert loops to array methods
 * 2. Know when loops are better
 * 3. Chain array methods
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: forEach vs for loop
console.log("--- forEach vs for ---");
const fruits = ["apple", "banana", "orange"];

// for loop
console.log("for loop:");
for (let i = 0; i < fruits.length; i++) {
    console.log(`  ${i}: ${fruits[i]}`);
}

// forEach
console.log("forEach:");
fruits.forEach((fruit, index) => {
    console.log(`  ${index}: ${fruit}`);
});

// Solution 2: map vs for loop
console.log("\n--- map vs for ---");
const numbers = [1, 2, 3, 4, 5];

// for loop
const doubled1 = [];
for (const num of numbers) {
    doubled1.push(num * 2);
}
console.log("for loop:", doubled1);

// map
const doubled2 = numbers.map(num => num * 2);
console.log("map:", doubled2);

// Solution 3: filter vs for loop
console.log("\n--- filter vs for ---");

// for loop
const evens1 = [];
for (const num of numbers) {
    if (num % 2 === 0) {
        evens1.push(num);
    }
}
console.log("for loop:", evens1);

// filter
const evens2 = numbers.filter(num => num % 2 === 0);
console.log("filter:", evens2);

// Solution 4: reduce vs for loop
console.log("\n--- reduce vs for ---");

// for loop
let sum1 = 0;
for (const num of numbers) {
    sum1 += num;
}
console.log("for loop sum:", sum1);

// reduce
const sum2 = numbers.reduce((acc, num) => acc + num, 0);
console.log("reduce sum:", sum2);

// Solution 5: find vs for loop
console.log("\n--- find vs for ---");
const users = [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
    { id: 3, name: "Charlie" }
];

// for loop
let found1 = null;
for (const user of users) {
    if (user.id === 2) {
        found1 = user;
        break;
    }
}
console.log("for loop:", found1);

// find
const found2 = users.find(user => user.id === 2);
console.log("find:", found2);

// Solution 6: some/every vs for loop
console.log("\n--- some/every vs for ---");
const scores = [75, 82, 90, 68, 95];

// for loop - any passing
let anyPassing1 = false;
for (const score of scores) {
    if (score >= 60) {
        anyPassing1 = true;
        break;
    }
}
console.log("for loop (any passing):", anyPassing1);

// some
const anyPassing2 = scores.some(score => score >= 60);
console.log("some (any passing):", anyPassing2);

// every
const allPassing = scores.every(score => score >= 60);
console.log("every (all passing):", allPassing);

// Solution 7: Chaining Array Methods
console.log("\n--- Chaining Methods ---");
const products = [
    { name: "Apple", price: 1.5, inStock: true },
    { name: "Banana", price: 0.75, inStock: true },
    { name: "Orange", price: 2.0, inStock: false },
    { name: "Grape", price: 3.0, inStock: true }
];

// Complex operation with chaining
const affordableInStock = products
    .filter(p => p.inStock)
    .filter(p => p.price < 2)
    .map(p => p.name);

console.log("Affordable & in stock:", affordableInStock);

// Solution 8: When Loops Are Better
console.log("\n--- When to Use Loops ---");

// 1. Need to break early
console.log("Break early - use loop or find:");
const largeArray = [1, 2, 3, 4, 5];
for (const item of largeArray) {
    if (item === 3) {
        console.log("  Found and breaking");
        break;
    }
}

// 2. Async operations
console.log("Async - use for...of with await");

// 3. Modifying external state (loops clearer)
console.log("External state - loops often clearer");

// Solution 9: Performance Comparison
console.log("\n--- Performance Notes ---");
console.log("Modern engines optimize both well");
console.log("For simple operations: similar performance");
console.log("Choose based on readability");

// Solution 10: Converting Complex Loop
console.log("\n--- Complex Transformation ---");
const orders = [
    { customer: "Alice", items: [{ price: 10 }, { price: 20 }] },
    { customer: "Bob", items: [{ price: 15 }] }
];

// Loop version
let total1 = 0;
for (const order of orders) {
    for (const item of order.items) {
        total1 += item.price;
    }
}
console.log("Loop total:", total1);

// Array methods version
const total2 = orders
    .flatMap(order => order.items)
    .reduce((sum, item) => sum + item.price, 0);
console.log("Methods total:", total2);

