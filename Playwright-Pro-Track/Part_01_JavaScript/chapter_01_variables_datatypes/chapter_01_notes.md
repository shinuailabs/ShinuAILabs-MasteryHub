# Part 01: Variables and Data Types

## 📚 Overview
This chapter covers the fundamentals of JavaScript variables and data types - the building blocks of any JavaScript program.

---

## 🎯 Key Concepts

### 1. Variable Declaration (var, let, const)

| Keyword | Scope | Redeclare | Reassign | Hoisting |
|---------|-------|-----------|----------|----------|
| `var` | Function | ✅ Yes | ✅ Yes | ✅ Yes (undefined) |
| `let` | Block | ❌ No | ✅ Yes | ❌ No (TDZ) |
| `const` | Block | ❌ No | ❌ No | ❌ No (TDZ) |

```javascript
// var - function scoped, can be redeclared
var name = "John";
var name = "Jane"; // OK

// let - block scoped, cannot be redeclared
let age = 25;
age = 26; // OK - reassignment allowed
// let age = 27; // Error - cannot redeclare

// const - block scoped, cannot be reassigned
const PI = 3.14159;
// PI = 3.14; // Error - cannot reassign
```

### 2. Primitive Data Types

| Type | Example | typeof |
|------|---------|--------|
| String | `"Hello"` | `"string"` |
| Number | `42`, `3.14` | `"number"` |
| Boolean | `true`, `false` | `"boolean"` |
| Undefined | `undefined` | `"undefined"` |
| Null | `null` | `"object"` |
| Symbol | `Symbol("id")` | `"symbol"` |
| BigInt | `9007199254740991n` | `"bigint"` |

```javascript
let str = "Hello";           // String
let num = 42;                // Number
let bool = true;             // Boolean
let undef = undefined;       // Undefined
let empty = null;            // Null
let sym = Symbol("id");      // Symbol
let big = 9007199254740991n; // BigInt
```

### 3. Type Conversion

```javascript
// String to Number
let str = "42";
let num1 = Number(str);      // 42
let num2 = parseInt(str);    // 42
let num3 = +str;             // 42

// Number to String
let num = 42;
let str1 = String(num);      // "42"
let str2 = num.toString();   // "42"
let str3 = num + "";         // "42"

// To Boolean
Boolean(1);        // true
Boolean(0);        // false
Boolean("");       // false
Boolean("hello");  // true
```

### 4. Template Literals

```javascript
let name = "John";
let age = 30;

// Old way
let msg1 = "Hello, " + name + "! You are " + age + " years old.";

// Template literals (ES6+)
let msg2 = `Hello, ${name}! You are ${age} years old.`;

// Multi-line strings
let multiLine = `
  Line 1
  Line 2
  Line 3
`;
```

### 5. typeof Operator

```javascript
typeof "Hello"     // "string"
typeof 42          // "number"
typeof true        // "boolean"
typeof undefined   // "undefined"
typeof null        // "object" (JavaScript quirk!)
typeof {}          // "object"
typeof []          // "object"
typeof function(){} // "function"
```

### 6. Special Values

```javascript
// NaN - Not a Number
let result = "hello" / 2;  // NaN
isNaN(result);             // true

// Infinity
let inf = 1 / 0;           // Infinity
let negInf = -1 / 0;       // -Infinity

// Checking for special values
Number.isNaN(NaN);         // true
Number.isFinite(100);      // true
Number.isFinite(Infinity); // false
```

---

## 💻 Practice Exercises

1. Declare variables using `let`, `const`, and `var`
2. Convert between different data types
3. Use template literals for string formatting
4. Check types using `typeof`
5. Handle special values like `NaN` and `Infinity`

---

## ✅ Best Practices

- ✅ Use `const` by default
- ✅ Use `let` when reassignment is needed
- ❌ Avoid `var` in modern JavaScript
- ✅ Use meaningful variable names
- ✅ Use camelCase for variables
- ✅ Use UPPER_SNAKE_CASE for constants

---

## 🔗 Related Labs
- Lab 001: Declaring Variables
- Lab 002: Primitive Data Types
- Lab 003: Type Conversion
- Lab 004: Template Literals
- Lab 005: typeof Operator
- Lab 006: Variable Naming
- Lab 007: Scope Basics
- Lab 008: const with Objects
- Lab 009: Number Methods
- Lab 010: Special Values

---

## 📝 Quick Reference

```javascript
// Variable Declaration
const CONSTANT = "immutable";
let variable = "can change";

// Type Checking
typeof value === "string"

// Type Conversion
Number("42")  // String to Number
String(42)    // Number to String
Boolean(1)    // To Boolean

// Template Literals
`Hello, ${name}!`
```

