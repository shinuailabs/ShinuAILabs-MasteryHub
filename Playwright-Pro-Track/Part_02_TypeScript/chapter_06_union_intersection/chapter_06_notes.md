# Part 06: Union & Intersection Types

## 📚 Overview
Union and intersection types allow combining types in flexible ways for more expressive type definitions.

---

## 🎯 Key Concepts

### 1. Union Types

```typescript
// Basic union
let id: string | number;
id = "abc123";  // OK
id = 123;       // OK
// id = true;   // Error!

// Union with null/undefined
let name: string | null = null;
name = "John";

// Function with union parameter
function printId(id: string | number): void {
  console.log(`ID: ${id}`);
}

printId("abc");
printId(123);
```

### 2. Type Narrowing

```typescript
function process(value: string | number): string {
  // Type guard with typeof
  if (typeof value === "string") {
    return value.toUpperCase();  // TypeScript knows it's string
  }
  return value.toFixed(2);  // TypeScript knows it's number
}

// Narrowing with instanceof
function handleError(error: Error | string): string {
  if (error instanceof Error) {
    return error.message;
  }
  return error;
}

// Narrowing with 'in' operator
interface Bird { fly(): void; }
interface Fish { swim(): void; }

function move(animal: Bird | Fish): void {
  if ("fly" in animal) {
    animal.fly();
  } else {
    animal.swim();
  }
}
```

### 3. Discriminated Unions

```typescript
// Use a common property to discriminate
interface Circle {
  kind: "circle";
  radius: number;
}

interface Rectangle {
  kind: "rectangle";
  width: number;
  height: number;
}

interface Triangle {
  kind: "triangle";
  base: number;
  height: number;
}

type Shape = Circle | Rectangle | Triangle;

function getArea(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "rectangle":
      return shape.width * shape.height;
    case "triangle":
      return (shape.base * shape.height) / 2;
  }
}
```

### 4. Intersection Types

```typescript
// Combine multiple types
interface Person {
  name: string;
  age: number;
}

interface Employee {
  employeeId: string;
  department: string;
}

type EmployeePerson = Person & Employee;

const employee: EmployeePerson = {
  name: "John",
  age: 30,
  employeeId: "E123",
  department: "Engineering"
};

// Intersection with type aliases
type Timestamped = { createdAt: Date; updatedAt: Date };
type TimestampedPerson = Person & Timestamped;
```

### 5. Union vs Intersection

```typescript
// Union: A OR B (either type)
type StringOrNumber = string | number;
let value: StringOrNumber = "hello";  // OK
value = 42;  // OK

// Intersection: A AND B (both types combined)
type Named = { name: string };
type Aged = { age: number };
type Person = Named & Aged;

const person: Person = {
  name: "John",  // Required from Named
  age: 30        // Required from Aged
};

// Intersection of primitives = never
type Impossible = string & number;  // never
```

### 6. Literal Union Types

```typescript
// String literals
type Direction = "north" | "south" | "east" | "west";
let dir: Direction = "north";

// Number literals
type DiceRoll = 1 | 2 | 3 | 4 | 5 | 6;
let roll: DiceRoll = 4;

// Boolean literal
type True = true;

// Mixed literals
type Status = "pending" | "approved" | 0 | 1;

// Exhaustive checking
function handleDirection(dir: Direction): string {
  switch (dir) {
    case "north": return "Going up";
    case "south": return "Going down";
    case "east": return "Going right";
    case "west": return "Going left";
    default:
      const _exhaustive: never = dir;
      return _exhaustive;
  }
}
```

### 7. Type Guards

```typescript
// Custom type guard
interface Cat { meow(): void; }
interface Dog { bark(): void; }

function isCat(animal: Cat | Dog): animal is Cat {
  return (animal as Cat).meow !== undefined;
}

function makeSound(animal: Cat | Dog): void {
  if (isCat(animal)) {
    animal.meow();  // TypeScript knows it's Cat
  } else {
    animal.bark();  // TypeScript knows it's Dog
  }
}

// Type guard with classes
class ApiError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
  }
}

function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}
```

### 8. Practical Patterns

```typescript
// API Response pattern
type ApiResponse<T> = 
  | { status: "success"; data: T }
  | { status: "error"; error: string };

function handleResponse<T>(response: ApiResponse<T>): T | null {
  if (response.status === "success") {
    return response.data;
  }
  console.error(response.error);
  return null;
}

// Optional properties with union
type Config = {
  mode: "development" | "production";
  debug?: boolean;
  apiUrl: string;
};

// Nullable pattern
type Nullable<T> = T | null;
type MaybeUser = Nullable<User>;
```

---

## 💻 Practice Exercises

1. Create union types for API responses
2. Implement discriminated unions
3. Use type guards for narrowing
4. Combine types with intersections
5. Build exhaustive switch statements

---

## ✅ Best Practices

- ✅ Use discriminated unions for variants
- ✅ Use type guards for narrowing
- ✅ Use literal types for constraints
- ✅ Check exhaustiveness with never
- ❌ Avoid overly complex unions
- ❌ Don't use `any` instead of unions

---

## 📝 Quick Reference

```typescript
// Union (OR)
type A = string | number;

// Intersection (AND)
type B = TypeA & TypeB;

// Discriminated union
type Shape = 
  | { kind: "circle"; radius: number }
  | { kind: "square"; side: number };

// Type guard
function isString(x: unknown): x is string {
  return typeof x === "string";
}

// Literal union
type Dir = "up" | "down";
```

