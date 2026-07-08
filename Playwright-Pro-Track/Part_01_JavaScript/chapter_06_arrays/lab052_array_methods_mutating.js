/**
 * Lab 052: Mutating Array Methods
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Mutating methods modify the original array.
 * 
 * Common mutating methods:
 * - push/pop: Add/remove from end
 * - unshift/shift: Add/remove from start
 * - splice: Add/remove anywhere
 * - sort: Sort in place
 * - reverse: Reverse in place
 * - fill: Fill with value
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Use push, pop, shift, unshift
 * 2. Use splice for complex modifications
 * 3. Sort and reverse arrays
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: push - Add to End
console.log("--- push ---");

const fruits = ["apple", "banana"];
console.log("Original:", fruits);

fruits.push("orange");
console.log("After push:", fruits);

// Push multiple
fruits.push("grape", "mango");
console.log("After push multiple:", fruits);

// Returns new length
const newLength = fruits.push("kiwi");
console.log("New length:", newLength);

// Solution 2: pop - Remove from End
console.log("\n--- pop ---");

const numbers = [1, 2, 3, 4, 5];
console.log("Original:", numbers);

const removed = numbers.pop();
console.log("Removed:", removed);
console.log("After pop:", numbers);

// Solution 3: unshift - Add to Start
console.log("\n--- unshift ---");

const letters = ["b", "c", "d"];
console.log("Original:", letters);

letters.unshift("a");
console.log("After unshift:", letters);

letters.unshift("x", "y");
console.log("After unshift multiple:", letters);

// Solution 4: shift - Remove from Start
console.log("\n--- shift ---");

const items = ["first", "second", "third"];
console.log("Original:", items);

const firstItem = items.shift();
console.log("Removed:", firstItem);
console.log("After shift:", items);

// Solution 5: splice - Add/Remove Anywhere
console.log("\n--- splice ---");

// splice(startIndex, deleteCount, ...itemsToAdd)

const arr = ["a", "b", "c", "d", "e"];
console.log("Original:", arr);

// Remove 2 elements starting at index 1
const removed2 = arr.splice(1, 2);
console.log("Removed:", removed2);
console.log("After remove:", arr);

// Insert without removing
arr.splice(1, 0, "x", "y");
console.log("After insert:", arr);

// Replace elements
arr.splice(2, 1, "NEW");
console.log("After replace:", arr);

// Remove from end (negative index)
const arr2 = [1, 2, 3, 4, 5];
arr2.splice(-2, 2);
console.log("Remove last 2:", arr2);

// Solution 6: sort
console.log("\n--- sort ---");

const unsorted = [3, 1, 4, 1, 5, 9, 2, 6];
console.log("Original:", unsorted);

// Default sort (converts to strings!)
const strings = ["banana", "apple", "cherry"];
strings.sort();
console.log("Sorted strings:", strings);

// Numeric sort needs compare function
const nums = [3, 1, 4, 1, 5, 9, 2, 6];
nums.sort((a, b) => a - b);
console.log("Sorted ascending:", nums);

nums.sort((a, b) => b - a);
console.log("Sorted descending:", nums);

// Sort objects
const users = [
    { name: "Charlie", age: 30 },
    { name: "Alice", age: 25 },
    { name: "Bob", age: 35 }
];

users.sort((a, b) => a.age - b.age);
console.log("Sorted by age:", users.map(u => u.name));

users.sort((a, b) => a.name.localeCompare(b.name));
console.log("Sorted by name:", users.map(u => u.name));

// Solution 7: reverse
console.log("\n--- reverse ---");

const forward = [1, 2, 3, 4, 5];
console.log("Original:", forward);

forward.reverse();
console.log("Reversed:", forward);

// Solution 8: fill
console.log("\n--- fill ---");

const toFill = [1, 2, 3, 4, 5];
console.log("Original:", toFill);

// fill(value, start, end)
toFill.fill(0);
console.log("Fill all with 0:", toFill);

const partial = [1, 2, 3, 4, 5];
partial.fill(0, 2, 4);
console.log("Fill index 2-3:", partial);

// Create array of zeros
const zeros = new Array(5).fill(0);
console.log("Array of zeros:", zeros);

// Solution 9: copyWithin
console.log("\n--- copyWithin ---");

const source = [1, 2, 3, 4, 5];
console.log("Original:", source);

// copyWithin(target, start, end)
source.copyWithin(0, 3);
console.log("Copy from index 3 to 0:", source);

// Solution 10: Chaining Mutating Methods
console.log("\n--- Chaining ---");

const chain = [3, 1, 4, 1, 5];
chain.sort((a, b) => a - b).reverse();
console.log("Sorted then reversed:", chain);

