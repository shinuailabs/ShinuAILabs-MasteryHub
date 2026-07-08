# Part 06: Arrays

## 📚 Overview
Arrays are ordered collections of values. JavaScript arrays are dynamic and can hold mixed types.

---

## 🎯 Key Concepts

### 1. Array Basics

```javascript
// Creating arrays
const arr1 = [1, 2, 3];
const arr2 = new Array(1, 2, 3);
const arr3 = Array.from("hello");  // ['h','e','l','l','o']
const arr4 = Array.of(1, 2, 3);

// Accessing elements
const fruits = ["apple", "banana", "cherry"];
fruits[0];        // "apple"
fruits[2];        // "cherry"
fruits.at(-1);    // "cherry" (last element)

// Array length
fruits.length;    // 3
```

### 2. Mutating Methods (Change Original Array)

```javascript
const arr = [1, 2, 3];

// Add elements
arr.push(4);        // [1,2,3,4] - add to end
arr.unshift(0);     // [0,1,2,3,4] - add to start

// Remove elements
arr.pop();          // [0,1,2,3] - remove from end
arr.shift();        // [1,2,3] - remove from start

// Splice - add/remove at position
arr.splice(1, 1);           // [1,3] - remove 1 at index 1
arr.splice(1, 0, 2);        // [1,2,3] - insert 2 at index 1
arr.splice(1, 1, "two");    // [1,"two",3] - replace

// Sort and reverse
arr.sort();         // Sorts in place
arr.reverse();      // Reverses in place
arr.fill(0);        // Fill with value
```

### 3. Non-Mutating Methods (Return New Array)

```javascript
const arr = [1, 2, 3, 4, 5];

// Slice - extract portion
arr.slice(1, 3);    // [2, 3] - from index 1 to 3 (exclusive)
arr.slice(-2);      // [4, 5] - last 2 elements

// Concat - merge arrays
arr.concat([6, 7]); // [1,2,3,4,5,6,7]

// Spread operator
[...arr, 6, 7];     // [1,2,3,4,5,6,7]

// toSorted, toReversed (ES2023)
arr.toSorted();     // Returns sorted copy
arr.toReversed();   // Returns reversed copy
```

### 4. Searching Methods

```javascript
const arr = [1, 2, 3, 2, 1];

// Find index
arr.indexOf(2);       // 1 (first occurrence)
arr.lastIndexOf(2);   // 3 (last occurrence)

// Check existence
arr.includes(3);      // true

// Find element
arr.find(x => x > 2);      // 3 (first match)
arr.findIndex(x => x > 2); // 2 (index of first match)
arr.findLast(x => x > 1);  // 2 (last match)
```

### 5. Iteration Methods

```javascript
const numbers = [1, 2, 3, 4, 5];

// forEach - iterate (no return)
numbers.forEach((num, index) => {
  console.log(`${index}: ${num}`);
});

// map - transform
const doubled = numbers.map(n => n * 2);
// [2, 4, 6, 8, 10]

// filter - select
const evens = numbers.filter(n => n % 2 === 0);
// [2, 4]

// reduce - accumulate
const sum = numbers.reduce((acc, n) => acc + n, 0);
// 15

// some/every - test
numbers.some(n => n > 3);   // true
numbers.every(n => n > 0);  // true
```

### 6. Sorting

```javascript
// Default sort (converts to strings!)
[10, 2, 1].sort();  // [1, 10, 2] - Wrong!

// Numeric sort
[10, 2, 1].sort((a, b) => a - b);  // [1, 2, 10]

// Descending
[1, 2, 3].sort((a, b) => b - a);   // [3, 2, 1]

// Sort objects
const users = [
  { name: "John", age: 30 },
  { name: "Jane", age: 25 }
];
users.sort((a, b) => a.age - b.age);
```

### 7. Array Transformation

```javascript
// Flatten nested arrays
[[1, 2], [3, 4]].flat();        // [1, 2, 3, 4]
[[1, [2, [3]]]].flat(2);        // [1, 2, 3]
[[1, [2, [3]]]].flat(Infinity); // [1, 2, 3]

// flatMap - map + flatten
[1, 2].flatMap(x => [x, x * 2]);  // [1, 2, 2, 4]

// Join to string
[1, 2, 3].join("-");  // "1-2-3"

// String to array
"a-b-c".split("-");   // ["a", "b", "c"]
```

### 8. Destructuring

```javascript
const arr = [1, 2, 3, 4, 5];

// Basic destructuring
const [first, second] = arr;  // 1, 2

// Skip elements
const [a, , c] = arr;  // 1, 3

// Rest pattern
const [head, ...tail] = arr;  // 1, [2,3,4,5]

// Default values
const [x = 0, y = 0] = [1];  // 1, 0

// Swap variables
let a = 1, b = 2;
[a, b] = [b, a];  // a=2, b=1
```

---

## 💻 Practice Exercises

1. Implement array manipulation functions
2. Use map/filter/reduce for data transformation
3. Sort arrays of objects
4. Flatten nested arrays
5. Use destructuring effectively

---

## ✅ Best Practices

- ✅ Use `const` for arrays (contents can change)
- ✅ Prefer non-mutating methods
- ✅ Use spread for copying: `[...arr]`
- ✅ Use appropriate method for task
- ❌ Avoid `for...in` for arrays
- ❌ Don't use `new Array()` for single number

---

## 📝 Quick Reference

```javascript
// Add/Remove
arr.push(x)    // Add end
arr.pop()      // Remove end
arr.unshift(x) // Add start
arr.shift()    // Remove start

// Transform
arr.map(fn)    // Transform each
arr.filter(fn) // Select matching
arr.reduce(fn) // Accumulate

// Search
arr.find(fn)   // First match
arr.includes(x) // Contains?
arr.indexOf(x) // Index of
```

