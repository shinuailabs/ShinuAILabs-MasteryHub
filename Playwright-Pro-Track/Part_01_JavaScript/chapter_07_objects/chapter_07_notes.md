# Part 07: Objects

## 📚 Overview
Objects are collections of key-value pairs. They are fundamental to JavaScript and used everywhere.

---

## 🎯 Key Concepts

### 1. Object Basics

```javascript
// Object literal
const user = {
  name: "John",
  age: 30,
  email: "john@example.com"
};

// Accessing properties
user.name;        // "John" - dot notation
user["age"];      // 30 - bracket notation

// Dynamic property access
const key = "email";
user[key];        // "john@example.com"

// Adding/modifying properties
user.city = "NYC";
user.age = 31;

// Deleting properties
delete user.email;
```

### 2. Object Methods

```javascript
const calculator = {
  value: 0,
  
  add(n) {
    this.value += n;
    return this;
  },
  
  subtract(n) {
    this.value -= n;
    return this;
  },
  
  getResult() {
    return this.value;
  }
};

// Method chaining
calculator.add(5).subtract(2).getResult();  // 3
```

### 3. Object Destructuring

```javascript
const user = { name: "John", age: 30, city: "NYC" };

// Basic destructuring
const { name, age } = user;

// Rename variables
const { name: userName, age: userAge } = user;

// Default values
const { country = "USA" } = user;

// Nested destructuring
const data = { user: { name: "John", address: { city: "NYC" } } };
const { user: { address: { city } } } = data;

// Rest pattern
const { name, ...rest } = user;  // rest = { age: 30, city: "NYC" }
```

### 4. Spread and Rest with Objects

```javascript
// Spread - copy/merge objects
const obj1 = { a: 1, b: 2 };
const obj2 = { c: 3, d: 4 };

const copy = { ...obj1 };           // { a: 1, b: 2 }
const merged = { ...obj1, ...obj2 }; // { a: 1, b: 2, c: 3, d: 4 }

// Override properties
const updated = { ...obj1, b: 10 }; // { a: 1, b: 10 }

// Rest in function parameters
function printUser({ name, ...rest }) {
  console.log(name);
  console.log(rest);
}
```

### 5. this Keyword

```javascript
const user = {
  name: "John",
  greet() {
    console.log(`Hello, ${this.name}`);
  },
  
  // Arrow function - no own 'this'
  greetArrow: () => {
    console.log(this.name);  // undefined!
  }
};

user.greet();       // "Hello, John"
user.greetArrow();  // undefined

// Binding this
const greet = user.greet.bind(user);
greet();  // "Hello, John"
```

### 6. Getters and Setters

```javascript
const user = {
  firstName: "John",
  lastName: "Doe",
  
  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  },
  
  set fullName(value) {
    [this.firstName, this.lastName] = value.split(" ");
  }
};

user.fullName;           // "John Doe"
user.fullName = "Jane Smith";
user.firstName;          // "Jane"
```

### 7. Object Static Methods

```javascript
const obj = { a: 1, b: 2, c: 3 };

// Keys, values, entries
Object.keys(obj);     // ["a", "b", "c"]
Object.values(obj);   // [1, 2, 3]
Object.entries(obj);  // [["a",1], ["b",2], ["c",3]]

// From entries
Object.fromEntries([["a", 1], ["b", 2]]);  // { a: 1, b: 2 }

// Assign (merge)
Object.assign({}, obj, { d: 4 });  // { a:1, b:2, c:3, d:4 }

// Freeze/Seal
Object.freeze(obj);   // Cannot modify
Object.seal(obj);     // Cannot add/delete, can modify
Object.isFrozen(obj); // true
```

### 8. Object Iteration

```javascript
const user = { name: "John", age: 30 };

// for...in
for (const key in user) {
  console.log(`${key}: ${user[key]}`);
}

// Object.keys/values/entries
Object.keys(user).forEach(key => {
  console.log(key);
});

Object.entries(user).forEach(([key, value]) => {
  console.log(`${key}: ${value}`);
});
```

### 9. JSON

```javascript
const user = { name: "John", age: 30 };

// Object to JSON string
const json = JSON.stringify(user);
// '{"name":"John","age":30}'

// JSON string to object
const parsed = JSON.parse(json);
// { name: "John", age: 30 }

// Pretty print
JSON.stringify(user, null, 2);

// With replacer
JSON.stringify(user, ["name"]);  // Only include name
```

---

## 💻 Practice Exercises

1. Create objects with methods
2. Use destructuring in functions
3. Implement getters and setters
4. Merge and copy objects
5. Convert between objects and JSON

---

## ✅ Best Practices

- ✅ Use shorthand property names
- ✅ Use destructuring for cleaner code
- ✅ Use spread for immutable updates
- ✅ Use Object.freeze for constants
- ❌ Avoid modifying objects directly
- ❌ Don't use `for...in` without hasOwnProperty check

---

## 📝 Quick Reference

```javascript
// Destructuring
const { a, b } = obj;

// Spread
const copy = { ...obj };

// Methods
Object.keys(obj)
Object.values(obj)
Object.entries(obj)

// JSON
JSON.stringify(obj)
JSON.parse(str)

// Getters/Setters
get prop() { }
set prop(v) { }
```

