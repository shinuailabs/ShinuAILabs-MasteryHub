# Part 01: TypeScript Introduction & Setup

## 📚 Overview
TypeScript is a typed superset of JavaScript that compiles to plain JavaScript. It adds static typing and other features.

---

## 🎯 Key Concepts

### 1. What is TypeScript?

```typescript
// TypeScript = JavaScript + Types
// Benefits:
// - Catch errors at compile time
// - Better IDE support (autocomplete, refactoring)
// - Self-documenting code
// - Easier maintenance of large codebases

// JavaScript
function add(a, b) {
  return a + b;
}

// TypeScript
function add(a: number, b: number): number {
  return a + b;
}
```

### 2. Installation & Setup

```bash
# Install TypeScript globally
npm install -g typescript

# Check version
tsc --version

# Initialize TypeScript project
tsc --init

# Compile TypeScript file
tsc file.ts

# Watch mode
tsc --watch
```

### 3. tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "declaration": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

### 4. Basic Types

```typescript
// Primitive types
let name: string = "John";
let age: number = 30;
let isActive: boolean = true;
let nothing: null = null;
let notDefined: undefined = undefined;

// Arrays
let numbers: number[] = [1, 2, 3];
let names: Array<string> = ["John", "Jane"];

// Tuple
let tuple: [string, number] = ["John", 30];

// Any (avoid when possible)
let anything: any = "hello";
anything = 42;  // OK

// Unknown (safer than any)
let unknown: unknown = "hello";
// unknown.toUpperCase();  // Error! Must check type first
if (typeof unknown === "string") {
  unknown.toUpperCase();  // OK
}
```

### 5. Type Inference

```typescript
// TypeScript infers types automatically
let message = "Hello";  // Inferred as string
let count = 42;         // Inferred as number
let items = [1, 2, 3];  // Inferred as number[]

// Function return type inference
function add(a: number, b: number) {
  return a + b;  // Return type inferred as number
}

// Best practice: Let TypeScript infer when obvious
// Add explicit types for function parameters and complex cases
```

### 6. Type Annotations

```typescript
// Variable annotations
let username: string;
let userId: number;

// Function annotations
function greet(name: string): string {
  return `Hello, ${name}!`;
}

// Arrow function annotations
const multiply = (a: number, b: number): number => a * b;

// Object annotations
let user: { name: string; age: number } = {
  name: "John",
  age: 30
};
```

### 7. Void and Never

```typescript
// void - function returns nothing
function logMessage(message: string): void {
  console.log(message);
}

// never - function never returns (throws or infinite loop)
function throwError(message: string): never {
  throw new Error(message);
}

function infiniteLoop(): never {
  while (true) {}
}
```

### 8. Type Assertions

```typescript
// Type assertion (you know better than TypeScript)
let value: unknown = "Hello, World!";

// as syntax (preferred)
let length1 = (value as string).length;

// Angle bracket syntax (not in JSX)
let length2 = (<string>value).length;

// Non-null assertion
let element = document.getElementById("app")!;
// ! tells TypeScript this won't be null

// Use sparingly - prefer type guards
```

---

## 💻 Practice Exercises

1. Set up a TypeScript project
2. Configure tsconfig.json
3. Add type annotations to variables
4. Create typed functions
5. Use type inference effectively

---

## ✅ Best Practices

- ✅ Enable strict mode in tsconfig
- ✅ Let TypeScript infer when obvious
- ✅ Use explicit types for function parameters
- ✅ Avoid `any` - use `unknown` instead
- ❌ Don't over-annotate obvious types
- ❌ Don't ignore TypeScript errors

---

## 🔗 Related Labs
- Lab 151: TypeScript Introduction
- Lab 152: Installation & Setup
- Lab 153: tsconfig.json
- Lab 154: Basic Types
- Lab 155: Type Inference
- Lab 156: Type Annotations
- Lab 157: Void and Never
- Lab 158: Type Assertions
- Lab 159: Strict Mode
- Lab 160: Best Practices

---

## 📝 Quick Reference

```typescript
// Basic types
let str: string = "hello";
let num: number = 42;
let bool: boolean = true;
let arr: number[] = [1, 2, 3];

// Function
function fn(a: string): number { }

// Type assertion
value as Type

// Compile
tsc file.ts
```

