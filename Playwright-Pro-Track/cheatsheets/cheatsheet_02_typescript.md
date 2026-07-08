# 🎯 TypeScript Cheat Sheet

## Quick Reference Card

---

## 📦 Basic Types

```typescript
// Primitives
let name: string = "John";
let age: number = 30;
let active: boolean = true;

// Arrays
let nums: number[] = [1, 2, 3];
let nums: Array<number> = [1, 2, 3];

// Tuple
let pair: [string, number] = ["age", 30];

// Any (avoid)
let data: any = "anything";

// Unknown (safer than any)
let data: unknown = "anything";
```

---

## 🔧 Type Annotations

```typescript
// Variables
let name: string;

// Functions
function greet(name: string): string {
  return `Hello ${name}`;
}

// Arrow functions
const greet = (name: string): string => `Hello ${name}`;

// Optional parameters
function greet(name?: string): string {}

// Default parameters
function greet(name: string = "World"): string {}
```

---

## 📋 Interfaces

```typescript
interface User {
  id: number;
  name: string;
  email?: string;        // Optional
  readonly createdAt: Date;  // Cannot modify
}

// Extending
interface Admin extends User {
  role: string;
}

// Function interface
interface Greeter {
  (name: string): string;
}
```

---

## 🏗️ Classes

```typescript
class Person {
  // Properties
  public name: string;
  private age: number;
  protected id: number;
  readonly created: Date;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }

  // Method
  greet(): string {
    return `Hi, ${this.name}`;
  }
}

// Inheritance
class Employee extends Person {
  constructor(name: string, age: number, public role: string) {
    super(name, age);
  }
}

// Implements interface
class User implements IUser {
  // Must implement all interface members
}
```

---

## 🔄 Generics

```typescript
// Generic function
function identity<T>(arg: T): T {
  return arg;
}

// Generic interface
interface Box<T> {
  value: T;
}

// Generic class
class Container<T> {
  constructor(public value: T) {}
}

// Constraints
function getLength<T extends { length: number }>(arg: T): number {
  return arg.length;
}
```

---

## 🔀 Union & Intersection

```typescript
// Union (OR)
type StringOrNumber = string | number;
let value: string | number = "hello";

// Intersection (AND)
type Combined = TypeA & TypeB;

// Literal types
type Direction = "up" | "down" | "left" | "right";

// Discriminated unions
type Shape = 
  | { kind: "circle"; radius: number }
  | { kind: "square"; size: number };
```

---

## 🛡️ Type Guards

```typescript
// typeof
if (typeof value === "string") {
  // value is string here
}

// instanceof
if (value instanceof Date) {
  // value is Date here
}

// in
if ("name" in obj) {
  // obj has name property
}

// Custom type guard
function isString(value: unknown): value is string {
  return typeof value === "string";
}
```

---

## 📝 Type Aliases

```typescript
// Simple alias
type ID = string | number;

// Object type
type User = {
  id: ID;
  name: string;
};

// Function type
type Callback = (data: string) => void;

// Mapped types
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};
```

---

## 🔢 Enums

```typescript
// Numeric enum
enum Direction {
  Up,      // 0
  Down,    // 1
  Left,    // 2
  Right    // 3
}

// String enum
enum Status {
  Active = "ACTIVE",
  Inactive = "INACTIVE"
}

// Const enum (inlined)
const enum Color {
  Red,
  Green,
  Blue
}
```

---

## 🛠️ Utility Types

```typescript
// Partial - all optional
Partial<User>

// Required - all required
Required<User>

// Readonly - all readonly
Readonly<User>

// Pick - select properties
Pick<User, "id" | "name">

// Omit - exclude properties
Omit<User, "password">

// Record - key-value map
Record<string, number>

// ReturnType - function return type
ReturnType<typeof myFunction>
```

---

*Keep this handy while coding!* 🚀
