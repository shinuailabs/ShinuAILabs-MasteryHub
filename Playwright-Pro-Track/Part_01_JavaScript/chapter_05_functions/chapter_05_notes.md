# Part 05: Functions

## 📚 Overview
Functions are reusable blocks of code that perform specific tasks. They are fundamental to JavaScript programming.

---

## 🎯 Key Concepts

### 1. Function Declaration

```javascript
// Basic function
function greet() {
  console.log("Hello!");
}
greet();

// With parameters
function greetPerson(name) {
  console.log(`Hello, ${name}!`);
}
greetPerson("John");

// With return value
function add(a, b) {
  return a + b;
}
const sum = add(5, 3);  // 8
```

### 2. Function Expression

```javascript
// Anonymous function expression
const multiply = function(a, b) {
  return a * b;
};

// Named function expression
const factorial = function fact(n) {
  return n <= 1 ? 1 : n * fact(n - 1);
};

// Key difference: Not hoisted!
// greet();  // Error!
// const greet = function() { };
```

### 3. Arrow Functions (ES6)

```javascript
// Basic arrow function
const greet = () => console.log("Hello!");

// With parameter
const square = x => x * x;

// Multiple parameters
const add = (a, b) => a + b;

// With function body
const calculate = (a, b) => {
  const sum = a + b;
  return sum * 2;
};

// Returning objects (wrap in parentheses)
const createUser = (name, age) => ({ name, age });
```

### 4. Parameters and Arguments

```javascript
// Default parameters
function greet(name = "Guest") {
  console.log(`Hello, ${name}!`);
}
greet();        // "Hello, Guest!"
greet("John");  // "Hello, John!"

// Rest parameters
function sum(...numbers) {
  return numbers.reduce((a, b) => a + b, 0);
}
sum(1, 2, 3, 4);  // 10

// Destructuring parameters
function printUser({ name, age }) {
  console.log(`${name} is ${age}`);
}
printUser({ name: "John", age: 30 });
```

### 5. Scope and Closures

```javascript
// Lexical scope
function outer() {
  const message = "Hello";
  
  function inner() {
    console.log(message);  // Can access outer variable
  }
  
  inner();
}

// Closure - function remembers its scope
function createCounter() {
  let count = 0;
  return function() {
    count++;
    return count;
  };
}

const counter = createCounter();
counter();  // 1
counter();  // 2
counter();  // 3
```

### 6. Higher-Order Functions

```javascript
// Function that takes function as argument
function doOperation(a, b, operation) {
  return operation(a, b);
}

doOperation(5, 3, (a, b) => a + b);  // 8
doOperation(5, 3, (a, b) => a * b);  // 15

// Function that returns function
function multiplier(factor) {
  return function(number) {
    return number * factor;
  };
}

const double = multiplier(2);
const triple = multiplier(3);
double(5);  // 10
triple(5);  // 15
```

### 7. Callback Functions

```javascript
// Callback pattern
function fetchData(callback) {
  setTimeout(() => {
    const data = { id: 1, name: "John" };
    callback(data);
  }, 1000);
}

fetchData(function(data) {
  console.log("Received:", data);
});

// Array methods with callbacks
const numbers = [1, 2, 3, 4, 5];
numbers.forEach(n => console.log(n));
numbers.map(n => n * 2);
numbers.filter(n => n > 2);
```

### 8. Recursion

```javascript
// Factorial
function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

// Fibonacci
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Tree traversal
function traverse(node) {
  console.log(node.value);
  node.children?.forEach(child => traverse(child));
}
```

### 9. IIFE (Immediately Invoked Function Expression)

```javascript
// Basic IIFE
(function() {
  console.log("Runs immediately!");
})();

// With parameters
(function(name) {
  console.log(`Hello, ${name}!`);
})("John");

// Arrow function IIFE
(() => {
  console.log("Arrow IIFE");
})();
```

---

## 💻 Practice Exercises

1. Create functions with different syntaxes
2. Implement a closure-based counter
3. Write higher-order functions
4. Use callbacks with array methods
5. Implement recursive algorithms

---

## ✅ Best Practices

- ✅ Use arrow functions for callbacks
- ✅ Use descriptive function names (verbs)
- ✅ Keep functions small and focused
- ✅ Use default parameters
- ❌ Avoid too many parameters (max 3)
- ❌ Avoid side effects when possible

---

## 📝 Quick Reference

```javascript
// Declaration
function name() { }

// Expression
const name = function() { };

// Arrow
const name = () => { };

// Default params
function fn(a = 1) { }

// Rest params
function fn(...args) { }

// Closure
function outer() {
  let x = 1;
  return () => x;
}
```

