# Part 02: Type Annotations

## 📚 Overview
Type annotations explicitly specify the types of variables, parameters, and return values in TypeScript.

---

## 🎯 Key Concepts

### 1. Variable Annotations

```typescript
// Explicit type annotations
let name: string = "John";
let age: number = 30;
let isActive: boolean = true;

// Multiple variables
let firstName: string, lastName: string;
firstName = "John";
lastName = "Doe";

// Const inference (literal types)
const status = "active";  // Type: "active" (literal)
let status2: string = "active";  // Type: string
```

### 2. Function Parameter Annotations

```typescript
// Required parameters
function greet(name: string, age: number): string {
  return `Hello, ${name}! You are ${age} years old.`;
}

// Optional parameters
function greet2(name: string, greeting?: string): string {
  return `${greeting || "Hello"}, ${name}!`;
}

// Default parameters
function greet3(name: string, greeting: string = "Hello"): string {
  return `${greeting}, ${name}!`;
}

// Rest parameters
function sum(...numbers: number[]): number {
  return numbers.reduce((a, b) => a + b, 0);
}
```

### 3. Return Type Annotations

```typescript
// Explicit return type
function add(a: number, b: number): number {
  return a + b;
}

// Void return
function logMessage(message: string): void {
  console.log(message);
}

// Never return
function throwError(message: string): never {
  throw new Error(message);
}

// Promise return
async function fetchData(): Promise<string> {
  return "data";
}
```

### 4. Object Type Annotations

```typescript
// Inline object type
let user: { name: string; age: number } = {
  name: "John",
  age: 30
};

// Optional properties
let config: { host: string; port?: number } = {
  host: "localhost"
};

// Readonly properties
let point: { readonly x: number; readonly y: number } = {
  x: 10,
  y: 20
};
// point.x = 5;  // Error!

// Index signatures
let dictionary: { [key: string]: number } = {
  apple: 1,
  banana: 2
};
```

### 5. Array Annotations

```typescript
// Array syntax
let numbers: number[] = [1, 2, 3];
let names: string[] = ["John", "Jane"];

// Generic syntax
let items: Array<number> = [1, 2, 3];

// Mixed arrays
let mixed: (string | number)[] = [1, "two", 3];

// Readonly arrays
let readonly: readonly number[] = [1, 2, 3];
// readonly.push(4);  // Error!

// Tuple
let tuple: [string, number] = ["John", 30];
let tuple2: [string, number, boolean?] = ["John", 30];
```

### 6. Function Type Annotations

```typescript
// Function type
let greet: (name: string) => string;
greet = (name) => `Hello, ${name}!`;

// Function type with multiple parameters
let calculate: (a: number, b: number) => number;
calculate = (a, b) => a + b;

// Callback type
function processData(
  data: string,
  callback: (result: string) => void
): void {
  callback(data.toUpperCase());
}

// Function type alias
type GreetFunction = (name: string) => string;
const sayHello: GreetFunction = (name) => `Hello, ${name}!`;
```

### 7. Union Type Annotations

```typescript
// Union types
let id: string | number;
id = "abc123";
id = 123;

// Union with null
let name: string | null = null;
name = "John";

// Union in function parameters
function printId(id: string | number): void {
  console.log(`ID: ${id}`);
}

// Narrowing union types
function process(value: string | number): string {
  if (typeof value === "string") {
    return value.toUpperCase();
  }
  return value.toString();
}
```

### 8. Literal Type Annotations

```typescript
// String literals
let direction: "north" | "south" | "east" | "west";
direction = "north";  // OK
// direction = "up";  // Error!

// Number literals
let dice: 1 | 2 | 3 | 4 | 5 | 6;
dice = 3;  // OK

// Boolean literal
let success: true = true;

// Combined with other types
type Status = "pending" | "approved" | "rejected";
function setStatus(status: Status): void {
  console.log(`Status: ${status}`);
}
```

---

## 💻 Practice Exercises

1. Add type annotations to variables
2. Create typed function signatures
3. Define object types with optional properties
4. Use union types for flexibility
5. Implement literal types for constraints

---

## ✅ Best Practices

- ✅ Annotate function parameters
- ✅ Let TypeScript infer return types when obvious
- ✅ Use union types for flexibility
- ✅ Use literal types for constraints
- ❌ Don't over-annotate obvious types
- ❌ Avoid `any` type

---

## 📝 Quick Reference

```typescript
// Variables
let x: string = "hello";

// Functions
function fn(a: string): number { }

// Objects
let obj: { name: string; age?: number };

// Arrays
let arr: number[] = [1, 2, 3];

// Union
let id: string | number;

// Literal
let dir: "up" | "down";
```

