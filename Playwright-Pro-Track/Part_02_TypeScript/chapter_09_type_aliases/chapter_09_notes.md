# Part 09: Type Aliases

## 📚 Overview
Type aliases create custom names for types, making complex types reusable and code more readable.

---

## 🎯 Key Concepts

### 1. Basic Type Aliases

```typescript
// Simple alias
type ID = string;
type Age = number;

let userId: ID = "user123";
let userAge: Age = 30;

// Object type alias
type User = {
  id: ID;
  name: string;
  age: Age;
};

const user: User = {
  id: "user123",
  name: "John",
  age: 30
};
```

### 2. Union Type Aliases

```typescript
// Union alias
type StringOrNumber = string | number;
type Nullable<T> = T | null;
type Optional<T> = T | undefined;

let id: StringOrNumber = "abc";
id = 123;

let name: Nullable<string> = null;
name = "John";

// Literal union alias
type Status = "pending" | "approved" | "rejected";
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

function request(method: HttpMethod, url: string): void {
  // ...
}
```

### 3. Function Type Aliases

```typescript
// Function type
type GreetFunction = (name: string) => string;
type Calculator = (a: number, b: number) => number;

const greet: GreetFunction = (name) => `Hello, ${name}!`;
const add: Calculator = (a, b) => a + b;

// Callback type
type Callback<T> = (error: Error | null, result: T | null) => void;

function fetchData(callback: Callback<string>): void {
  callback(null, "data");
}

// Async function type
type AsyncFunction<T> = () => Promise<T>;
```

### 4. Generic Type Aliases

```typescript
// Generic alias
type Container<T> = {
  value: T;
  timestamp: Date;
};

const stringContainer: Container<string> = {
  value: "hello",
  timestamp: new Date()
};

// Multiple type parameters
type Pair<K, V> = {
  key: K;
  value: V;
};

type Dictionary<T> = {
  [key: string]: T;
};

// With constraints
type Lengthwise<T extends { length: number }> = {
  value: T;
  length: number;
};
```

### 5. Intersection Type Aliases

```typescript
type Person = {
  name: string;
  age: number;
};

type Employee = {
  employeeId: string;
  department: string;
};

// Intersection
type EmployeePerson = Person & Employee;

const employee: EmployeePerson = {
  name: "John",
  age: 30,
  employeeId: "E123",
  department: "Engineering"
};

// Extend with intersection
type Timestamped<T> = T & {
  createdAt: Date;
  updatedAt: Date;
};

type TimestampedUser = Timestamped<User>;
```

### 6. Conditional Type Aliases

```typescript
// Basic conditional
type IsString<T> = T extends string ? true : false;

type A = IsString<string>;  // true
type B = IsString<number>;  // false

// Extract/Exclude patterns
type NonNullable<T> = T extends null | undefined ? never : T;
type ExtractString<T> = T extends string ? T : never;

// Infer keyword
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;
type Parameters<T> = T extends (...args: infer P) => any ? P : never;

// Practical example
type Awaited<T> = T extends Promise<infer U> ? U : T;
type Result = Awaited<Promise<string>>;  // string
```

### 7. Mapped Type Aliases

```typescript
// Make all properties optional
type Partial<T> = {
  [P in keyof T]?: T[P];
};

// Make all properties required
type Required<T> = {
  [P in keyof T]-?: T[P];
};

// Make all properties readonly
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

// Pick specific properties
type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};

// Omit specific properties
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;

// Custom mapped type
type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};
```

### 8. Template Literal Types

```typescript
// Basic template literal
type Greeting = `Hello, ${string}!`;
let greeting: Greeting = "Hello, World!";

// With union
type Color = "red" | "green" | "blue";
type ColorClass = `text-${Color}`;
// "text-red" | "text-green" | "text-blue"

// Event handlers
type EventName = "click" | "focus" | "blur";
type EventHandler = `on${Capitalize<EventName>}`;
// "onClick" | "onFocus" | "onBlur"

// CSS properties
type Size = "sm" | "md" | "lg";
type Spacing = `p-${Size}` | `m-${Size}`;
```

### 9. Type Alias vs Interface

```typescript
// Interface - can be extended and merged
interface User {
  name: string;
}
interface User {  // Declaration merging
  age: number;
}

// Type alias - more flexible
type User = {
  name: string;
  age: number;
};

// Type can do unions
type ID = string | number;

// Type can do mapped types
type Keys = keyof User;

// Use interface for:
// - Object shapes that might be extended
// - Class implementations

// Use type for:
// - Unions, intersections
// - Mapped types, conditional types
// - Function types
```

---

## 💻 Practice Exercises

1. Create type aliases for common patterns
2. Build generic type aliases
3. Use conditional types
4. Create mapped types
5. Use template literal types

---

## ✅ Best Practices

- ✅ Use descriptive names
- ✅ Use generics for reusability
- ✅ Prefer type for unions/intersections
- ✅ Use built-in utility types
- ❌ Don't create overly complex types
- ❌ Avoid deeply nested conditionals

---

## 📝 Quick Reference

```typescript
// Basic alias
type ID = string;

// Object alias
type User = { name: string };

// Union alias
type Status = "a" | "b";

// Function alias
type Fn = (x: number) => string;

// Generic alias
type Box<T> = { value: T };

// Conditional
type Check<T> = T extends X ? A : B;

// Mapped
type Partial<T> = { [P in keyof T]?: T[P] };
```

