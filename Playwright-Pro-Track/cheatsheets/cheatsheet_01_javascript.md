# 🎯 JavaScript Cheat Sheet

## Quick Reference Card

---

## 📦 Variables

```javascript
// Declaration
let name = "John";      // Can reassign
const PI = 3.14;        // Cannot reassign
var old = "avoid";      // Function-scoped (avoid)

// Scope
// let/const = block-scoped
// var = function-scoped
```

---

## 📊 Data Types

```javascript
// Primitives
string    "hello"
number    42, 3.14
boolean   true, false
null      null
undefined undefined
symbol    Symbol('id')
bigint    9007199254740991n

// Reference
object    { key: 'value' }
array     [1, 2, 3]
function  () => {}
```

---

## 🔧 Operators

```javascript
// Comparison
==   // Equal (type coercion)
===  // Strict equal (no coercion) ✅
!=   // Not equal
!==  // Strict not equal ✅

// Logical
&&   // AND
||   // OR
!    // NOT
??   // Nullish coalescing

// Spread/Rest
...arr  // Spread
...args // Rest parameters
```

---

## 🔄 Control Flow

```javascript
// If/Else
if (condition) {
} else if (other) {
} else {
}

// Ternary
const result = condition ? 'yes' : 'no';

// Switch
switch (value) {
  case 1: break;
  default: break;
}
```

---

## 🔁 Loops

```javascript
// For
for (let i = 0; i < 10; i++) {}

// For...of (values)
for (const item of array) {}

// For...in (keys)
for (const key in object) {}

// While
while (condition) {}

// Array methods (preferred)
array.forEach(item => {})
array.map(item => item * 2)
array.filter(item => item > 5)
```

---

## 📝 Functions

```javascript
// Declaration
function greet(name) {
  return `Hello ${name}`;
}

// Expression
const greet = function(name) {};

// Arrow (preferred)
const greet = (name) => `Hello ${name}`;
const greet = name => `Hello ${name}`;

// Default parameters
const greet = (name = 'World') => {};
```

---

## 📚 Arrays

```javascript
const arr = [1, 2, 3];

// Add/Remove
arr.push(4)      // Add end
arr.pop()        // Remove end
arr.unshift(0)   // Add start
arr.shift()      // Remove start

// Transform
arr.map(x => x * 2)      // [2, 4, 6]
arr.filter(x => x > 1)   // [2, 3]
arr.reduce((a, b) => a + b, 0)  // 6
arr.find(x => x > 1)     // 2
arr.some(x => x > 2)     // true
arr.every(x => x > 0)    // true

// Spread
const copy = [...arr];
const merged = [...arr1, ...arr2];
```

---

## 🗃️ Objects

```javascript
const obj = { name: 'John', age: 30 };

// Access
obj.name        // Dot notation
obj['name']     // Bracket notation

// Destructuring
const { name, age } = obj;
const { name: n } = obj;  // Rename

// Spread
const copy = { ...obj };
const merged = { ...obj1, ...obj2 };

// Methods
Object.keys(obj)    // ['name', 'age']
Object.values(obj)  // ['John', 30]
Object.entries(obj) // [['name','John'],['age',30]]
```

---

## ⏳ Async/Await

```javascript
// Promise
const promise = new Promise((resolve, reject) => {
  resolve('success');
  // reject('error');
});

promise.then(data => {}).catch(err => {});

// Async/Await (preferred)
async function fetchData() {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}
```

---

## 🎯 ES6+ Features

```javascript
// Template literals
`Hello ${name}!`

// Destructuring
const [a, b] = [1, 2];
const { x, y } = { x: 1, y: 2 };

// Optional chaining
obj?.prop?.nested

// Nullish coalescing
value ?? 'default'

// Classes
class Person {
  constructor(name) {
    this.name = name;
  }
  greet() {
    return `Hi, ${this.name}`;
  }
}
```

---

*Keep this handy while coding!* 🚀
