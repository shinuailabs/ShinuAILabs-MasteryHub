/**
 * Lab 057: Array Transformation
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Transforming arrays into different structures:
 * 
 * - Array to string: join, toString
 * - String to array: split, Array.from
 * - Array to object: reduce, Object.fromEntries
 * - Flatten: flat, flatMap
 * - Unique values: Set
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Convert between arrays and strings
 * 2. Transform arrays to objects
 * 3. Flatten nested arrays
 * 4. Remove duplicates
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Array to String
console.log("--- Array to String ---");

const fruits = ["apple", "banana", "orange"];

// join
console.log("join():", fruits.join());        // apple,banana,orange
console.log("join('-'):", fruits.join("-"));  // apple-banana-orange
console.log("join(' '):", fruits.join(" "));  // apple banana orange
console.log("join(''):", fruits.join(""));    // applebananaorange

// toString
console.log("toString():", fruits.toString()); // apple,banana,orange

// Solution 2: String to Array
console.log("\n--- String to Array ---");

const str = "hello world";

// split
console.log("split(' '):", str.split(" "));   // ["hello", "world"]
console.log("split(''):", str.split(""));     // ["h","e","l","l","o"," ","w","o","r","l","d"]

// Array.from
console.log("Array.from:", Array.from(str));  // Same as split('')

// Spread
console.log("Spread:", [...str]);

// Solution 3: Array to Object
console.log("\n--- Array to Object ---");

// Using reduce
const pairs = [["name", "Alice"], ["age", 25], ["city", "NYC"]];
const obj1 = pairs.reduce((acc, [key, value]) => {
    acc[key] = value;
    return acc;
}, {});
console.log("reduce:", obj1);

// Using Object.fromEntries
const obj2 = Object.fromEntries(pairs);
console.log("fromEntries:", obj2);

// Array of objects to lookup
const users = [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
    { id: 3, name: "Charlie" }
];

const userLookup = users.reduce((acc, user) => {
    acc[user.id] = user;
    return acc;
}, {});
console.log("User lookup:", userLookup);

// Solution 4: Object to Array
console.log("\n--- Object to Array ---");

const person = { name: "Alice", age: 25, city: "NYC" };

console.log("Object.keys:", Object.keys(person));
console.log("Object.values:", Object.values(person));
console.log("Object.entries:", Object.entries(person));

// Solution 5: Flatten Arrays
console.log("\n--- Flatten ---");

const nested = [1, [2, 3], [4, [5, 6]]];

console.log("flat():", nested.flat());
console.log("flat(2):", nested.flat(2));
console.log("flat(Infinity):", nested.flat(Infinity));

// flatMap
const sentences = ["Hello World", "How are you"];
const words = sentences.flatMap(s => s.split(" "));
console.log("flatMap:", words);

// Solution 6: Remove Duplicates
console.log("\n--- Remove Duplicates ---");

const withDupes = [1, 2, 2, 3, 3, 3, 4, 4, 4, 4];

// Using Set
const unique1 = [...new Set(withDupes)];
console.log("Set:", unique1);

// Using filter
const unique2 = withDupes.filter((item, index) => 
    withDupes.indexOf(item) === index
);
console.log("filter:", unique2);

// Unique objects by property
const items = [
    { id: 1, name: "A" },
    { id: 2, name: "B" },
    { id: 1, name: "A" },
    { id: 3, name: "C" }
];

const uniqueById = items.filter((item, index, self) =>
    index === self.findIndex(t => t.id === item.id)
);
console.log("Unique by id:", uniqueById);

// Solution 7: Chunk Array
console.log("\n--- Chunk Array ---");

function chunk(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
    }
    return chunks;
}

const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
console.log("Chunks of 3:", chunk(numbers, 3));

// Solution 8: Zip Arrays
console.log("\n--- Zip Arrays ---");

function zip(...arrays) {
    const maxLength = Math.max(...arrays.map(a => a.length));
    return Array.from({ length: maxLength }, (_, i) =>
        arrays.map(arr => arr[i])
    );
}

const names = ["Alice", "Bob", "Charlie"];
const ages = [25, 30, 35];
const cities = ["NYC", "LA", "Chicago"];

console.log("Zipped:", zip(names, ages, cities));

// Solution 9: Partition Array
console.log("\n--- Partition ---");

function partition(array, predicate) {
    return array.reduce(
        ([pass, fail], item) => {
            return predicate(item)
                ? [[...pass, item], fail]
                : [pass, [...fail, item]];
        },
        [[], []]
    );
}

const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const [evens, odds] = partition(nums, n => n % 2 === 0);
console.log("Evens:", evens);
console.log("Odds:", odds);

// Solution 10: Range
console.log("\n--- Range ---");

const range = (start, end) => 
    Array.from({ length: end - start + 1 }, (_, i) => start + i);

console.log("Range 1-5:", range(1, 5));
console.log("Range 5-10:", range(5, 10));

