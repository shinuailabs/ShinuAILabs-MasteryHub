# Part 04: Loops

## 📚 Overview
Loops allow you to execute code repeatedly. JavaScript provides several loop types for different use cases.

---

## 🎯 Key Concepts

### 1. for Loop

```javascript
// Basic for loop
for (let i = 0; i < 5; i++) {
  console.log(i);  // 0, 1, 2, 3, 4
}

// Iterating arrays
const fruits = ["apple", "banana", "cherry"];
for (let i = 0; i < fruits.length; i++) {
  console.log(fruits[i]);
}

// Reverse iteration
for (let i = fruits.length - 1; i >= 0; i--) {
  console.log(fruits[i]);
}
```

### 2. while Loop

```javascript
// Basic while loop
let count = 0;
while (count < 5) {
  console.log(count);
  count++;
}

// With condition
let input = "";
while (input !== "quit") {
  input = getInput();
  processInput(input);
}
```

### 3. do...while Loop

```javascript
// Executes at least once
let num = 0;
do {
  console.log(num);
  num++;
} while (num < 5);

// Useful for menu systems
do {
  showMenu();
  choice = getChoice();
} while (choice !== "exit");
```

### 4. for...of Loop (Arrays, Strings)

```javascript
// Arrays
const colors = ["red", "green", "blue"];
for (const color of colors) {
  console.log(color);
}

// Strings
const str = "Hello";
for (const char of str) {
  console.log(char);  // H, e, l, l, o
}

// With index (using entries)
for (const [index, value] of colors.entries()) {
  console.log(`${index}: ${value}`);
}
```

### 5. for...in Loop (Objects)

```javascript
// Object properties
const user = { name: "John", age: 30, city: "NYC" };
for (const key in user) {
  console.log(`${key}: ${user[key]}`);
}

// Note: for...in also iterates inherited properties
// Use hasOwnProperty to filter
for (const key in user) {
  if (user.hasOwnProperty(key)) {
    console.log(key);
  }
}
```

### 6. break and continue

```javascript
// break - exit loop entirely
for (let i = 0; i < 10; i++) {
  if (i === 5) break;
  console.log(i);  // 0, 1, 2, 3, 4
}

// continue - skip current iteration
for (let i = 0; i < 5; i++) {
  if (i === 2) continue;
  console.log(i);  // 0, 1, 3, 4
}

// Labeled statements (for nested loops)
outer: for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 3; j++) {
    if (i === 1 && j === 1) break outer;
    console.log(i, j);
  }
}
```

### 7. Nested Loops

```javascript
// 2D array iteration
const matrix = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
];

for (let i = 0; i < matrix.length; i++) {
  for (let j = 0; j < matrix[i].length; j++) {
    console.log(matrix[i][j]);
  }
}

// Using for...of
for (const row of matrix) {
  for (const cell of row) {
    console.log(cell);
  }
}
```

### 8. Array Methods (Loop Alternatives)

```javascript
const numbers = [1, 2, 3, 4, 5];

// forEach - iterate
numbers.forEach((num, index) => {
  console.log(`${index}: ${num}`);
});

// map - transform
const doubled = numbers.map(n => n * 2);

// filter - select
const evens = numbers.filter(n => n % 2 === 0);

// reduce - accumulate
const sum = numbers.reduce((acc, n) => acc + n, 0);

// find - first match
const found = numbers.find(n => n > 3);

// some/every - test conditions
const hasEven = numbers.some(n => n % 2 === 0);
const allPositive = numbers.every(n => n > 0);
```

---

## 💻 Practice Exercises

1. Print numbers 1-100 using different loops
2. Find sum of array elements
3. Create multiplication table
4. Search for element in array
5. Flatten nested array

---

## ✅ Best Practices

- ✅ Use `for...of` for arrays
- ✅ Use `for...in` for objects
- ✅ Prefer array methods when appropriate
- ✅ Avoid infinite loops
- ❌ Don't modify array while iterating
- ❌ Avoid excessive nesting

---

## 📝 Quick Reference

```javascript
// for loop
for (let i = 0; i < n; i++) { }

// for...of (arrays)
for (const item of array) { }

// for...in (objects)
for (const key in object) { }

// while
while (condition) { }

// Array methods
array.forEach(item => { })
array.map(item => newItem)
array.filter(item => condition)
```

