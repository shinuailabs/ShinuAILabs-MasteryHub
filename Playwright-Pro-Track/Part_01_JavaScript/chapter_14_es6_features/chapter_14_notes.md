# Part 14: ES6+ Features

## 📚 Overview
ES6 (ECMAScript 2015) and later versions introduced many powerful features to JavaScript.

---

## 🎯 Key Concepts

### 1. let and const

```javascript
// Block scoping
{
  let x = 1;
  const y = 2;
}
// x and y not accessible here

// const for constants
const PI = 3.14159;
// PI = 3.14;  // Error!

// const with objects (contents can change)
const user = { name: "John" };
user.name = "Jane";  // OK
// user = {};  // Error!
```

### 2. Arrow Functions

```javascript
// Basic syntax
const add = (a, b) => a + b;
const square = x => x * x;
const greet = () => "Hello";

// With body
const calculate = (a, b) => {
  const sum = a + b;
  return sum * 2;
};

// Returning objects
const createUser = (name) => ({ name, id: Date.now() });

// No own 'this'
const obj = {
  name: "John",
  greet: function() {
    setTimeout(() => {
      console.log(this.name);  // "John" - inherits this
    }, 100);
  }
};
```

### 3. Template Literals

```javascript
const name = "John";
const age = 30;

// String interpolation
const msg = `Hello, ${name}! You are ${age} years old.`;

// Multi-line strings
const html = `
  <div>
    <h1>${name}</h1>
  </div>
`;

// Expressions
const result = `Sum: ${5 + 3}, Double: ${age * 2}`;

// Tagged templates
function highlight(strings, ...values) {
  return strings.reduce((acc, str, i) => 
    acc + str + (values[i] ? `<b>${values[i]}</b>` : ""), "");
}
```

### 4. Destructuring

```javascript
// Array destructuring
const [a, b, c] = [1, 2, 3];
const [first, ...rest] = [1, 2, 3, 4];
const [x = 0, y = 0] = [1];

// Object destructuring
const { name, age } = { name: "John", age: 30 };
const { name: userName } = { name: "John" };
const { address: { city } } = { address: { city: "NYC" } };

// Function parameters
function greet({ name, age = 0 }) {
  console.log(`${name} is ${age}`);
}
```

### 5. Spread and Rest

```javascript
// Spread arrays
const arr1 = [1, 2, 3];
const arr2 = [...arr1, 4, 5];  // [1, 2, 3, 4, 5]

// Spread objects
const obj1 = { a: 1, b: 2 };
const obj2 = { ...obj1, c: 3 };  // { a: 1, b: 2, c: 3 }

// Rest parameters
function sum(...numbers) {
  return numbers.reduce((a, b) => a + b, 0);
}

// Rest in destructuring
const [head, ...tail] = [1, 2, 3, 4];
const { a, ...others } = { a: 1, b: 2, c: 3 };
```

### 6. Default Parameters

```javascript
function greet(name = "Guest", greeting = "Hello") {
  return `${greeting}, ${name}!`;
}

greet();              // "Hello, Guest!"
greet("John");        // "Hello, John!"
greet("John", "Hi");  // "Hi, John!"

// With destructuring
function createUser({ name = "Anonymous", age = 0 } = {}) {
  return { name, age };
}
```

### 7. Classes

```javascript
class Animal {
  constructor(name) {
    this.name = name;
  }
  
  speak() {
    console.log(`${this.name} makes a sound`);
  }
  
  static create(name) {
    return new Animal(name);
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name);
    this.breed = breed;
  }
  
  speak() {
    console.log(`${this.name} barks`);
  }
}

const dog = new Dog("Rex", "German Shepherd");
dog.speak();  // "Rex barks"
```

### 8. Modules

```javascript
// Named exports (math.js)
export const PI = 3.14159;
export function add(a, b) { return a + b; }
export class Calculator { }

// Default export (user.js)
export default class User { }

// Named imports
import { PI, add } from "./math.js";

// Default import
import User from "./user.js";

// Mixed
import User, { PI, add } from "./module.js";

// Rename
import { add as sum } from "./math.js";

// Import all
import * as math from "./math.js";
```

### 9. Promises and Async/Await

```javascript
// Promise
const promise = new Promise((resolve, reject) => {
  setTimeout(() => resolve("Done"), 1000);
});

promise.then(result => console.log(result));

// Async/await
async function fetchData() {
  const response = await fetch("/api/data");
  return await response.json();
}
```

### 10. New Data Structures

```javascript
// Map
const map = new Map();
map.set("key", "value");
map.get("key");
map.has("key");
map.delete("key");

// Set
const set = new Set([1, 2, 3, 3]);  // {1, 2, 3}
set.add(4);
set.has(2);
set.delete(1);

// WeakMap / WeakSet (garbage-collectible keys)
const weakMap = new WeakMap();
const weakSet = new WeakSet();

// Symbol
const sym = Symbol("description");
const obj = { [sym]: "value" };
```

---

## 💻 Practice Exercises

1. Refactor code using ES6 features
2. Use destructuring effectively
3. Create classes with inheritance
4. Work with Map and Set
5. Use modules for code organization

---

## ✅ Best Practices

- ✅ Use const by default, let when needed
- ✅ Use arrow functions for callbacks
- ✅ Use template literals for strings
- ✅ Use destructuring for cleaner code
- ❌ Avoid var
- ❌ Don't overuse classes

---

## 📝 Quick Reference

```javascript
// Arrow function
const fn = (a, b) => a + b;

// Destructuring
const { a, b } = obj;
const [x, y] = arr;

// Spread/Rest
const copy = [...arr];
const merged = { ...obj1, ...obj2 };

// Template literal
`Hello, ${name}!`

// Default params
function fn(a = 1) { }

// Class
class A extends B { }
```

