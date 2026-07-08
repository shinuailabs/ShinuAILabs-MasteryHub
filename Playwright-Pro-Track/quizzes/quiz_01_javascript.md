# 📝 Quiz 01: JavaScript Fundamentals

**Section:** 01_JavaScript | **Labs:** 001-150 | **Time:** 20 minutes

---

## Instructions
- Answer all 20 questions
- Each question is worth 5 points (100 total)
- 80+ = Pass | 90+ = Excellent
- Check answers at the bottom

---

## Questions

### Variables & Data Types (Q1-4)

**Q1.** What is the output?
```javascript
let x = 10;
let y = "10";
console.log(x == y);
console.log(x === y);
```
- A) true, true
- B) false, false
- C) true, false
- D) false, true

**Q2.** Which declaration cannot be reassigned?
- A) var
- B) let
- C) const
- D) All can be reassigned

**Q3.** What is `typeof null`?
- A) "null"
- B) "undefined"
- C) "object"
- D) "boolean"

**Q4.** Which is NOT a primitive type?
- A) string
- B) number
- C) array
- D) boolean

### Functions & Scope (Q5-8)

**Q5.** What is the output?
```javascript
function test() {
  var a = 1;
  let b = 2;
}
test();
console.log(typeof a, typeof b);
```
- A) number, number
- B) undefined, undefined
- C) 1, 2
- D) Error

**Q6.** Arrow functions...
- A) Have their own `this`
- B) Inherit `this` from parent scope
- C) Cannot return values
- D) Must have curly braces

**Q7.** What is a closure?
- A) A function that closes the browser
- B) A function with access to its outer scope
- C) A function that cannot be called
- D) A function without parameters

**Q8.** What is hoisting?
- A) Moving variables to the top of their scope
- B) Deleting variables
- C) Creating new variables
- D) Copying variables

### Arrays & Objects (Q9-12)

**Q9.** What does `[1,2,3].map(x => x * 2)` return?
- A) [1, 2, 3]
- B) [2, 4, 6]
- C) 6
- D) undefined

**Q10.** Which method modifies the original array?
- A) map()
- B) filter()
- C) push()
- D) slice()

**Q11.** How to copy an object without reference?
- A) `let copy = obj`
- B) `let copy = {...obj}`
- C) `let copy = obj.copy()`
- D) `let copy = Object(obj)`

**Q12.** What is destructuring?
- A) Deleting object properties
- B) Extracting values into variables
- C) Creating new objects
- D) Merging objects

### Async Programming (Q13-16)

**Q13.** What does a Promise represent?
- A) A guaranteed value
- B) An eventual completion or failure
- C) A synchronous operation
- D) A loop

**Q14.** What is the output?
```javascript
console.log('1');
setTimeout(() => console.log('2'), 0);
console.log('3');
```
- A) 1, 2, 3
- B) 1, 3, 2
- C) 2, 1, 3
- D) 3, 2, 1

**Q15.** `async` functions always return...
- A) undefined
- B) A Promise
- C) The exact value
- D) An error

**Q16.** What does `await` do?
- A) Stops the entire program
- B) Pauses until Promise resolves
- C) Creates a new Promise
- D) Throws an error

### ES6+ Features (Q17-20)

**Q17.** Template literals use...
- A) Single quotes
- B) Double quotes
- C) Backticks
- D) Parentheses

**Q18.** What is the spread operator?
- A) `...`
- B) `***`
- C) `:::`
- D) `<<<`

**Q19.** Which creates a class in ES6?
- A) `function Class() {}`
- B) `class MyClass {}`
- C) `new Class()`
- D) `create class {}`

**Q20.** What is optional chaining?
- A) `obj.prop`
- B) `obj?.prop`
- C) `obj!.prop`
- D) `obj&.prop`

---

## Answer Key

| Q | Answer | Q | Answer |
|---|--------|---|--------|
| 1 | C | 11 | B |
| 2 | C | 12 | B |
| 3 | C | 13 | B |
| 4 | C | 14 | B |
| 5 | B | 15 | B |
| 6 | B | 16 | B |
| 7 | B | 17 | C |
| 8 | A | 18 | A |
| 9 | B | 19 | B |
| 10 | C | 20 | B |

---

## Score Interpretation

| Score | Level | Recommendation |
|-------|-------|----------------|
| 90-100 | Expert | Move to Section 02 |
| 80-89 | Proficient | Review weak areas, then proceed |
| 70-79 | Developing | Review chapters 11-15 |
| Below 70 | Needs Practice | Redo Section 01 labs |

