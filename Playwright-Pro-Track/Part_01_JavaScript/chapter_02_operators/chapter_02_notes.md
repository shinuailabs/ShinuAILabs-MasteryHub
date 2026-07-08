# Part 02: Operators

## 📚 Overview
JavaScript operators perform operations on values and variables. This chapter covers all operator types.

---

## 🎯 Key Concepts

### 1. Arithmetic Operators

```javascript
let a = 10, b = 3;

a + b    // 13 - Addition
a - b    // 7  - Subtraction
a * b    // 30 - Multiplication
a / b    // 3.33... - Division
a % b    // 1  - Modulus (remainder)
a ** b   // 1000 - Exponentiation (ES6)

// Increment/Decrement
let x = 5;
x++      // Post-increment: returns 5, then x = 6
++x      // Pre-increment: x = 7, returns 7
x--      // Post-decrement: returns 7, then x = 6
--x      // Pre-decrement: x = 5, returns 5
```

### 2. Assignment Operators

```javascript
let x = 10;

x += 5;   // x = x + 5  → 15
x -= 3;   // x = x - 3  → 12
x *= 2;   // x = x * 2  → 24
x /= 4;   // x = x / 4  → 6
x %= 4;   // x = x % 4  → 2
x **= 3;  // x = x ** 3 → 8
```

### 3. Comparison Operators

```javascript
// Equality
5 == "5"    // true  - loose equality (type coercion)
5 === "5"   // false - strict equality (no coercion)
5 != "5"    // false - loose inequality
5 !== "5"   // true  - strict inequality

// Relational
5 > 3       // true
5 < 3       // false
5 >= 5      // true
5 <= 4      // false

// Always use === and !== for predictable results!
```

### 4. Logical Operators

```javascript
// AND (&&) - returns first falsy or last value
true && true     // true
true && false    // false
"hello" && "world" // "world"
0 && "hello"     // 0

// OR (||) - returns first truthy or last value
true || false    // true
false || false   // false
"" || "default"  // "default"
null || "fallback" // "fallback"

// NOT (!)
!true            // false
!false           // true
!0               // true
!"hello"         // false
!!value          // Convert to boolean
```

### 5. Ternary Operator

```javascript
// condition ? valueIfTrue : valueIfFalse
let age = 20;
let status = age >= 18 ? "Adult" : "Minor";

// Nested ternary (use sparingly)
let grade = score >= 90 ? "A" 
          : score >= 80 ? "B"
          : score >= 70 ? "C" : "F";
```

### 6. Nullish Coalescing (??)

```javascript
// Returns right side only if left is null or undefined
let value = null ?? "default";     // "default"
let value2 = undefined ?? "default"; // "default"
let value3 = 0 ?? "default";       // 0 (0 is not null/undefined)
let value4 = "" ?? "default";      // "" (empty string is not null/undefined)

// Compare with OR (||)
0 || "default"   // "default" (0 is falsy)
0 ?? "default"   // 0 (0 is not null/undefined)
```

### 7. Optional Chaining (?.)

```javascript
let user = { name: "John", address: { city: "NYC" } };

// Without optional chaining
let city = user && user.address && user.address.city;

// With optional chaining
let city = user?.address?.city;  // "NYC"
let zip = user?.address?.zip;    // undefined (no error)

// With methods
user?.getName?.();

// With arrays
let first = arr?.[0];
```

### 8. Spread Operator (...)

```javascript
// Arrays
let arr1 = [1, 2, 3];
let arr2 = [...arr1, 4, 5];  // [1, 2, 3, 4, 5]

// Objects
let obj1 = { a: 1, b: 2 };
let obj2 = { ...obj1, c: 3 }; // { a: 1, b: 2, c: 3 }

// Function arguments
Math.max(...arr1);  // 3
```

### 9. Rest Operator (...)

```javascript
// Function parameters
function sum(...numbers) {
  return numbers.reduce((a, b) => a + b, 0);
}
sum(1, 2, 3, 4);  // 10

// Destructuring
let [first, ...rest] = [1, 2, 3, 4];
// first = 1, rest = [2, 3, 4]

let { a, ...others } = { a: 1, b: 2, c: 3 };
// a = 1, others = { b: 2, c: 3 }
```

---

## 💻 Practice Exercises

1. Calculate using arithmetic operators
2. Use comparison operators with different types
3. Implement logic with && and ||
4. Use nullish coalescing for defaults
5. Navigate objects with optional chaining

---

## ✅ Best Practices

- ✅ Use `===` instead of `==`
- ✅ Use `??` for null/undefined defaults
- ✅ Use `?.` for safe property access
- ✅ Use spread for immutable operations
- ❌ Avoid deeply nested ternaries

---

## 🔗 Related Labs
- Lab 011-020: All operator labs

---

## 📝 Quick Reference

```javascript
// Comparison
a === b  // Strict equality
a !== b  // Strict inequality

// Logical
a && b   // AND
a || b   // OR
!a       // NOT

// Modern operators
a ?? b   // Nullish coalescing
a?.b     // Optional chaining
...arr   // Spread/Rest
```

