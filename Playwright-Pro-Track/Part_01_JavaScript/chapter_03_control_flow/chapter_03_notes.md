# Part 03: Control Flow

## 📚 Overview
Control flow statements determine the order in which code executes based on conditions.

---

## 🎯 Key Concepts

### 1. if Statement

```javascript
let age = 18;

if (age >= 18) {
  console.log("You are an adult");
}
```

### 2. if...else Statement

```javascript
let score = 75;

if (score >= 60) {
  console.log("Pass");
} else {
  console.log("Fail");
}
```

### 3. else if Statement

```javascript
let grade = 85;

if (grade >= 90) {
  console.log("A");
} else if (grade >= 80) {
  console.log("B");
} else if (grade >= 70) {
  console.log("C");
} else if (grade >= 60) {
  console.log("D");
} else {
  console.log("F");
}
```

### 4. switch Statement

```javascript
let day = "Monday";

switch (day) {
  case "Monday":
  case "Tuesday":
  case "Wednesday":
  case "Thursday":
  case "Friday":
    console.log("Weekday");
    break;
  case "Saturday":
  case "Sunday":
    console.log("Weekend");
    break;
  default:
    console.log("Invalid day");
}
```

### 5. Truthy and Falsy Values

```javascript
// Falsy values (evaluate to false)
false
0
-0
""
null
undefined
NaN

// Truthy values (everything else)
true
1
"hello"
[]
{}
function() {}

// Checking truthy/falsy
if (value) {
  // value is truthy
}

if (!value) {
  // value is falsy
}
```

### 6. Guard Clauses (Early Return)

```javascript
// Without guard clause
function processUser(user) {
  if (user) {
    if (user.isActive) {
      if (user.hasPermission) {
        // do something
      }
    }
  }
}

// With guard clauses (better!)
function processUser(user) {
  if (!user) return;
  if (!user.isActive) return;
  if (!user.hasPermission) return;
  
  // do something
}
```

### 7. Short-Circuit Evaluation

```javascript
// AND (&&) - execute if truthy
isLoggedIn && showDashboard();

// OR (||) - execute if falsy
username || redirectToLogin();

// Practical examples
const name = user && user.name;
const displayName = name || "Guest";
```

### 8. Conditional (Ternary) Expressions

```javascript
// Simple ternary
let status = age >= 18 ? "adult" : "minor";

// In template literals
console.log(`User is ${isActive ? "active" : "inactive"}`);

// In JSX/React
return isLoading ? <Spinner /> : <Content />;
```

---

## 💻 Practice Exercises

1. Write if/else for grade calculation
2. Create a switch for day of week
3. Implement guard clauses
4. Use short-circuit evaluation
5. Refactor nested conditions

---

## ✅ Best Practices

- ✅ Use guard clauses for early returns
- ✅ Keep conditions simple and readable
- ✅ Use switch for multiple discrete values
- ✅ Prefer positive conditions
- ❌ Avoid deeply nested if statements
- ❌ Don't forget break in switch

---

## 🔗 Related Labs
- Lab 021: if Statement
- Lab 022: if...else Statement
- Lab 023: else if Statement
- Lab 024: switch Statement
- Lab 025: Truthy/Falsy
- Lab 026: Guard Clauses
- Lab 027: Conditional Expressions
- Lab 028: Short-Circuit Evaluation
- Lab 029: Nested Conditions
- Lab 030: Best Practices

---

## 📝 Quick Reference

```javascript
// if/else
if (condition) { } else { }

// switch
switch (value) {
  case x: break;
  default:
}

// Ternary
condition ? ifTrue : ifFalse

// Short-circuit
truthy && doSomething()
falsy || doFallback()

// Guard clause
if (!valid) return;
```

