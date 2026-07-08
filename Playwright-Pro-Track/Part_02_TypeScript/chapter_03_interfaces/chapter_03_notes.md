# Part 03: Interfaces

## 📚 Overview
Interfaces define the structure of objects, providing a contract for what properties and methods an object must have.

---

## 🎯 Key Concepts

### 1. Basic Interface

```typescript
interface User {
  name: string;
  age: number;
  email: string;
}

const user: User = {
  name: "John",
  age: 30,
  email: "john@example.com"
};

// Missing property - Error!
// const user2: User = { name: "Jane" };
```

### 2. Optional Properties

```typescript
interface Config {
  host: string;
  port?: number;      // Optional
  timeout?: number;   // Optional
}

const config1: Config = { host: "localhost" };
const config2: Config = { host: "localhost", port: 3000 };
```

### 3. Readonly Properties

```typescript
interface Point {
  readonly x: number;
  readonly y: number;
}

const point: Point = { x: 10, y: 20 };
// point.x = 5;  // Error! Cannot modify readonly

// ReadonlyArray
interface Data {
  readonly items: readonly number[];
}
```

### 4. Method Signatures

```typescript
interface Calculator {
  add(a: number, b: number): number;
  subtract(a: number, b: number): number;
  multiply: (a: number, b: number) => number;  // Alternative syntax
}

const calc: Calculator = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
  multiply: (a, b) => a * b
};
```

### 5. Index Signatures

```typescript
// String index
interface StringDictionary {
  [key: string]: string;
}

const dict: StringDictionary = {
  hello: "world",
  foo: "bar"
};

// Number index
interface NumberArray {
  [index: number]: string;
}

const arr: NumberArray = ["a", "b", "c"];

// Mixed with known properties
interface User {
  name: string;
  [key: string]: string | number;  // Additional properties
}
```

### 6. Extending Interfaces

```typescript
interface Person {
  name: string;
  age: number;
}

interface Employee extends Person {
  employeeId: string;
  department: string;
}

const employee: Employee = {
  name: "John",
  age: 30,
  employeeId: "E123",
  department: "Engineering"
};

// Multiple inheritance
interface Manager extends Employee {
  teamSize: number;
}

// Extend multiple interfaces
interface Contractor extends Person, Employee {
  contractEnd: Date;
}
```

### 7. Interface vs Type Alias

```typescript
// Interface - can be extended and merged
interface User {
  name: string;
}

interface User {  // Declaration merging
  age: number;
}

// Type alias - more flexible
type UserType = {
  name: string;
  age: number;
};

// Type can use unions
type ID = string | number;

// Type can use mapped types
type Readonly<T> = { readonly [P in keyof T]: T[P] };

// Use interface for objects, type for unions/primitives
```

### 8. Function Interfaces

```typescript
// Function interface
interface GreetFunction {
  (name: string): string;
}

const greet: GreetFunction = (name) => `Hello, ${name}!`;

// Callable with properties
interface Counter {
  (): number;
  count: number;
  reset(): void;
}

function createCounter(): Counter {
  const counter = function() {
    return ++counter.count;
  } as Counter;
  counter.count = 0;
  counter.reset = () => { counter.count = 0; };
  return counter;
}
```

### 9. Class Interfaces

```typescript
interface Printable {
  print(): void;
}

interface Serializable {
  serialize(): string;
}

class Document implements Printable, Serializable {
  constructor(private content: string) {}
  
  print(): void {
    console.log(this.content);
  }
  
  serialize(): string {
    return JSON.stringify({ content: this.content });
  }
}

// Interface for constructor
interface Constructable<T> {
  new (...args: any[]): T;
}
```

---

## 💻 Practice Exercises

1. Define interfaces for user data
2. Create interfaces with optional properties
3. Extend interfaces for inheritance
4. Implement interfaces in classes
5. Use index signatures for dynamic objects

---

## ✅ Best Practices

- ✅ Use interfaces for object shapes
- ✅ Use optional properties for flexibility
- ✅ Use readonly for immutable data
- ✅ Extend interfaces for reuse
- ❌ Don't use interfaces for primitives
- ❌ Avoid overly complex interfaces

---

## 📝 Quick Reference

```typescript
// Basic interface
interface User {
  name: string;
  age?: number;        // Optional
  readonly id: string; // Readonly
}

// Method
interface Service {
  getData(): Promise<Data>;
}

// Extend
interface Admin extends User {
  role: string;
}

// Implement
class MyClass implements Interface { }

// Index signature
interface Dict {
  [key: string]: any;
}
```

