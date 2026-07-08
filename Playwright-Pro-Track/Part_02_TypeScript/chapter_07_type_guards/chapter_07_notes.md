# Part 07: Type Guards

## 📚 Overview
Type guards are techniques to narrow down types within conditional blocks, enabling TypeScript to understand the specific type.

---

## 🎯 Key Concepts

### 1. typeof Type Guard

```typescript
function process(value: string | number | boolean): string {
  if (typeof value === "string") {
    return value.toUpperCase();
  }
  if (typeof value === "number") {
    return value.toFixed(2);
  }
  return value ? "Yes" : "No";
}

// typeof works for: string, number, boolean, symbol, undefined, function, bigint
// Note: typeof null === "object" (JavaScript quirk)
```

### 2. instanceof Type Guard

```typescript
class Dog {
  bark() { console.log("Woof!"); }
}

class Cat {
  meow() { console.log("Meow!"); }
}

function makeSound(animal: Dog | Cat): void {
  if (animal instanceof Dog) {
    animal.bark();
  } else {
    animal.meow();
  }
}

// Works with Error types
function handleError(error: Error | string): string {
  if (error instanceof TypeError) {
    return `Type Error: ${error.message}`;
  }
  if (error instanceof Error) {
    return `Error: ${error.message}`;
  }
  return error;
}
```

### 3. in Operator Type Guard

```typescript
interface Bird {
  fly(): void;
  layEggs(): void;
}

interface Fish {
  swim(): void;
  layEggs(): void;
}

function move(animal: Bird | Fish): void {
  if ("fly" in animal) {
    animal.fly();  // TypeScript knows it's Bird
  } else {
    animal.swim();  // TypeScript knows it's Fish
  }
}

// Check for optional properties
interface Config {
  debug?: boolean;
  verbose?: boolean;
}

function configure(config: Config): void {
  if ("debug" in config && config.debug) {
    console.log("Debug mode enabled");
  }
}
```

### 4. Custom Type Guards

```typescript
// Type predicate syntax: paramName is Type
interface Cat { meow(): void; type: "cat"; }
interface Dog { bark(): void; type: "dog"; }

function isCat(animal: Cat | Dog): animal is Cat {
  return animal.type === "cat";
}

function isDog(animal: Cat | Dog): animal is Dog {
  return animal.type === "dog";
}

function handleAnimal(animal: Cat | Dog): void {
  if (isCat(animal)) {
    animal.meow();  // TypeScript knows it's Cat
  } else {
    animal.bark();  // TypeScript knows it's Dog
  }
}
```

### 5. Assertion Functions

```typescript
// Assert function throws if condition is false
function assertIsString(value: unknown): asserts value is string {
  if (typeof value !== "string") {
    throw new Error("Value must be a string");
  }
}

function processValue(value: unknown): string {
  assertIsString(value);
  // After assertion, TypeScript knows value is string
  return value.toUpperCase();
}

// Assert non-null
function assertDefined<T>(value: T | null | undefined): asserts value is T {
  if (value === null || value === undefined) {
    throw new Error("Value must be defined");
  }
}
```

### 6. Discriminated Union Guards

```typescript
type Result<T> = 
  | { success: true; data: T }
  | { success: false; error: string };

function handleResult<T>(result: Result<T>): T | null {
  if (result.success) {
    // TypeScript knows: { success: true; data: T }
    return result.data;
  } else {
    // TypeScript knows: { success: false; error: string }
    console.error(result.error);
    return null;
  }
}

// Multiple discriminants
type Action = 
  | { type: "ADD"; payload: number }
  | { type: "REMOVE"; id: string }
  | { type: "RESET" };

function reducer(state: number[], action: Action): number[] {
  switch (action.type) {
    case "ADD":
      return [...state, action.payload];
    case "REMOVE":
      return state.filter((_, i) => i.toString() !== action.id);
    case "RESET":
      return [];
  }
}
```

### 7. Array Type Guards

```typescript
// Check if array
function isArray<T>(value: T | T[]): value is T[] {
  return Array.isArray(value);
}

// Filter with type guard
interface User { name: string; age: number; }
type MaybeUser = User | null | undefined;

const users: MaybeUser[] = [
  { name: "John", age: 30 },
  null,
  { name: "Jane", age: 25 },
  undefined
];

// Filter out null/undefined
const validUsers = users.filter((user): user is User => user !== null && user !== undefined);
// Type: User[]

// Using Boolean as type guard (limited)
const truthy = users.filter(Boolean);
// Type: (User | null | undefined)[] - doesn't narrow properly
```

### 8. Exhaustiveness Checking

```typescript
type Shape = 
  | { kind: "circle"; radius: number }
  | { kind: "square"; side: number }
  | { kind: "triangle"; base: number; height: number };

function getArea(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.side ** 2;
    case "triangle":
      return (shape.base * shape.height) / 2;
    default:
      // Exhaustiveness check - will error if case is missing
      const _exhaustive: never = shape;
      throw new Error(`Unhandled shape: ${_exhaustive}`);
  }
}

// Helper function for exhaustiveness
function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${value}`);
}
```

---

## 💻 Practice Exercises

1. Use typeof for primitive narrowing
2. Use instanceof for class narrowing
3. Create custom type guards
4. Implement assertion functions
5. Build exhaustive switch statements

---

## ✅ Best Practices

- ✅ Use discriminated unions when possible
- ✅ Create reusable type guard functions
- ✅ Use assertion functions for validation
- ✅ Always check exhaustiveness
- ❌ Don't use type assertions instead of guards
- ❌ Avoid complex nested type guards

---

## 📝 Quick Reference

```typescript
// typeof
if (typeof x === "string") { }

// instanceof
if (x instanceof MyClass) { }

// in operator
if ("prop" in obj) { }

// Custom type guard
function isType(x: A | B): x is A { }

// Assertion function
function assert(x: unknown): asserts x is Type { }

// Exhaustiveness
const _: never = value;
```

