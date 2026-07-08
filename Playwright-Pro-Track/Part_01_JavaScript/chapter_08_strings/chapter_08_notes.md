# Part 08: Strings

## 📚 Overview
Strings are sequences of characters. JavaScript provides many methods for string manipulation.

---

## 🎯 Key Concepts

### 1. String Basics

```javascript
// Creating strings
const str1 = "Hello";
const str2 = 'World';
const str3 = `Template`;

// String length
"Hello".length;  // 5

// Accessing characters
"Hello"[0];      // "H"
"Hello".at(-1);  // "o" (last character)
"Hello".charAt(1); // "e"
```

### 2. Search Methods

```javascript
const str = "Hello, World!";

// Find position
str.indexOf("o");       // 4 (first occurrence)
str.lastIndexOf("o");   // 8 (last occurrence)
str.indexOf("x");       // -1 (not found)

// Check existence
str.includes("World");  // true
str.startsWith("Hello"); // true
str.endsWith("!");      // true

// Search with regex
str.search(/world/i);   // 7
str.match(/o/g);        // ["o", "o"]
```

### 3. Extract Methods

```javascript
const str = "Hello, World!";

// Slice (start, end)
str.slice(0, 5);    // "Hello"
str.slice(7);       // "World!"
str.slice(-6);      // "World!"
str.slice(-6, -1);  // "World"

// Substring (start, end) - no negative
str.substring(0, 5); // "Hello"

// Substr (start, length) - deprecated
str.substr(0, 5);    // "Hello"
```

### 4. Transform Methods

```javascript
const str = "  Hello, World!  ";

// Case
str.toUpperCase();  // "  HELLO, WORLD!  "
str.toLowerCase();  // "  hello, world!  "

// Trim
str.trim();         // "Hello, World!"
str.trimStart();    // "Hello, World!  "
str.trimEnd();      // "  Hello, World!"

// Pad
"5".padStart(3, "0");  // "005"
"5".padEnd(3, "0");    // "500"

// Repeat
"ab".repeat(3);     // "ababab"

// Replace
str.replace("World", "JS");     // First occurrence
str.replaceAll("o", "0");       // All occurrences
str.replace(/o/g, "0");         // Regex all
```

### 5. Template Literals

```javascript
const name = "John";
const age = 30;

// String interpolation
const msg = `Hello, ${name}! You are ${age} years old.`;

// Expressions
const result = `Sum: ${5 + 3}`;

// Multi-line
const html = `
  <div>
    <h1>${name}</h1>
    <p>Age: ${age}</p>
  </div>
`;

// Tagged templates
function highlight(strings, ...values) {
  return strings.reduce((acc, str, i) => 
    acc + str + (values[i] ? `<b>${values[i]}</b>` : ""), "");
}
highlight`Hello ${name}!`;  // "Hello <b>John</b>!"
```

### 6. Regular Expressions

```javascript
// Creating regex
const regex1 = /pattern/flags;
const regex2 = new RegExp("pattern", "flags");

// Common flags
// i - case insensitive
// g - global (all matches)
// m - multiline

// Test
/hello/i.test("Hello World");  // true

// Match
"Hello World".match(/o/g);     // ["o", "o"]

// Replace
"Hello".replace(/l/g, "L");    // "HeLLo"

// Common patterns
/^\d+$/        // Only digits
/^[a-zA-Z]+$/  // Only letters
/^\S+@\S+\.\S+$/ // Simple email
```

### 7. String Validation

```javascript
// Check if empty
const isEmpty = str => str.trim().length === 0;

// Check if numeric
const isNumeric = str => /^\d+$/.test(str);

// Check email (simple)
const isEmail = str => /^\S+@\S+\.\S+$/.test(str);

// Check URL
const isURL = str => {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
};
```

### 8. Split and Join

```javascript
// Split string to array
"a,b,c".split(",");     // ["a", "b", "c"]
"hello".split("");      // ["h", "e", "l", "l", "o"]
"a b c".split(" ");     // ["a", "b", "c"]

// Join array to string
["a", "b", "c"].join(",");  // "a,b,c"
["a", "b", "c"].join("");   // "abc"
["a", "b", "c"].join("-");  // "a-b-c"

// Practical: capitalize words
const capitalize = str => 
  str.split(" ")
     .map(word => word[0].toUpperCase() + word.slice(1))
     .join(" ");
```

---

## 💻 Practice Exercises

1. Validate email and phone formats
2. Extract data from strings
3. Transform text (capitalize, reverse)
4. Use regex for pattern matching
5. Build a string formatter

---

## ✅ Best Practices

- ✅ Use template literals for interpolation
- ✅ Use `includes()` instead of `indexOf() !== -1`
- ✅ Use `trim()` for user input
- ✅ Use regex for complex patterns
- ❌ Avoid string concatenation in loops
- ❌ Don't forget strings are immutable

---

## 📝 Quick Reference

```javascript
// Search
str.includes(x)
str.indexOf(x)
str.startsWith(x)

// Extract
str.slice(start, end)
str.substring(start, end)

// Transform
str.toUpperCase()
str.toLowerCase()
str.trim()
str.replace(old, new)

// Template
`Hello ${name}`

// Split/Join
str.split(",")
arr.join(",")
```

