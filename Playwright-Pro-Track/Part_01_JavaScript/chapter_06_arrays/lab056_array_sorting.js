/**
 * Lab 056: Array Sorting
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Sorting arrays with sort() and toSorted().
 * 
 * Key points:
 * - Default sort converts to strings
 * - Compare function: (a, b) => number
 *   - Negative: a before b
 *   - Positive: b before a
 *   - Zero: keep order
 * - sort() mutates, toSorted() doesn't
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Sort numbers correctly
 * 2. Sort strings with localeCompare
 * 3. Sort objects by properties
 * 4. Implement custom sort orders
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Default Sort (String)
console.log("--- Default Sort ---");

const strings = ["banana", "apple", "cherry", "date"];
strings.sort();
console.log("Sorted strings:", strings);

// Problem with numbers
const numbers = [10, 2, 30, 4, 100];
numbers.sort();
console.log("Default number sort:", numbers); // Wrong! [10, 100, 2, 30, 4]

// Solution 2: Numeric Sort
console.log("\n--- Numeric Sort ---");

const nums = [10, 2, 30, 4, 100];

// Ascending
nums.sort((a, b) => a - b);
console.log("Ascending:", nums);

// Descending
nums.sort((a, b) => b - a);
console.log("Descending:", nums);

// Solution 3: String Sort with localeCompare
console.log("\n--- localeCompare ---");

const names = ["Émile", "Alice", "Zoe", "Bob", "Ángel"];

// Basic sort (may not handle accents well)
const basicSort = [...names].sort();
console.log("Basic sort:", basicSort);

// localeCompare (handles accents)
const localeSort = [...names].sort((a, b) => a.localeCompare(b));
console.log("Locale sort:", localeSort);

// Case-insensitive
const mixed = ["Apple", "banana", "Cherry", "date"];
const caseInsensitive = [...mixed].sort((a, b) => 
    a.toLowerCase().localeCompare(b.toLowerCase())
);
console.log("Case insensitive:", caseInsensitive);

// Solution 4: Sort Objects
console.log("\n--- Sort Objects ---");

const users = [
    { name: "Charlie", age: 30, score: 85 },
    { name: "Alice", age: 25, score: 92 },
    { name: "Bob", age: 35, score: 78 },
    { name: "Diana", age: 28, score: 92 }
];

// Sort by age
const byAge = [...users].sort((a, b) => a.age - b.age);
console.log("By age:", byAge.map(u => `${u.name}(${u.age})`));

// Sort by name
const byName = [...users].sort((a, b) => a.name.localeCompare(b.name));
console.log("By name:", byName.map(u => u.name));

// Sort by score descending
const byScore = [...users].sort((a, b) => b.score - a.score);
console.log("By score (desc):", byScore.map(u => `${u.name}(${u.score})`));

// Solution 5: Multi-Level Sort
console.log("\n--- Multi-Level Sort ---");

// Sort by score, then by name
const multiSort = [...users].sort((a, b) => {
    // First by score (descending)
    if (b.score !== a.score) {
        return b.score - a.score;
    }
    // Then by name (ascending)
    return a.name.localeCompare(b.name);
});

console.log("By score then name:", multiSort.map(u => `${u.name}(${u.score})`));

// Solution 6: Custom Sort Order
console.log("\n--- Custom Order ---");

const priorities = ["high", "medium", "low"];
const tasks = [
    { task: "Task 1", priority: "low" },
    { task: "Task 2", priority: "high" },
    { task: "Task 3", priority: "medium" },
    { task: "Task 4", priority: "high" }
];

const byPriority = [...tasks].sort((a, b) => 
    priorities.indexOf(a.priority) - priorities.indexOf(b.priority)
);

console.log("By priority:", byPriority.map(t => `${t.task}(${t.priority})`));

// Solution 7: Stable Sort
console.log("\n--- Stable Sort ---");

// Modern JS sort is stable (maintains relative order of equal elements)
const items = [
    { name: "A", value: 1 },
    { name: "B", value: 2 },
    { name: "C", value: 1 },
    { name: "D", value: 2 }
];

const stableSort = [...items].sort((a, b) => a.value - b.value);
console.log("Stable sort:", stableSort.map(i => i.name)); // A, C, B, D

// Solution 8: toSorted (Non-Mutating)
console.log("\n--- toSorted ---");

const original = [3, 1, 4, 1, 5];
const sorted = original.toSorted((a, b) => a - b);

console.log("Original:", original);
console.log("Sorted:", sorted);

// Solution 9: Shuffle Array
console.log("\n--- Shuffle ---");

function shuffle(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

const ordered = [1, 2, 3, 4, 5];
console.log("Shuffled:", shuffle(ordered));

// Solution 10: Sort Performance
console.log("\n--- Performance ---");
console.log("sort() is typically O(n log n)");
console.log("Avoid expensive operations in compare function");
console.log("Pre-compute values if sorting by computed property");

