# Part 04: Classes

## 📚 Overview
TypeScript enhances JavaScript classes with type annotations, access modifiers, and other features.

---

## 🎯 Key Concepts

### 1. Basic Class

```typescript
class Person {
  name: string;
  age: number;
  
  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
  
  greet(): string {
    return `Hello, I'm ${this.name}`;
  }
}

const person = new Person("John", 30);
person.greet();  // "Hello, I'm John"
```

### 2. Access Modifiers

```typescript
class User {
  public name: string;       // Accessible anywhere (default)
  private password: string;  // Only within class
  protected email: string;   // Within class and subclasses
  
  constructor(name: string, password: string, email: string) {
    this.name = name;
    this.password = password;
    this.email = email;
  }
  
  private hashPassword(): string {
    return btoa(this.password);
  }
}

const user = new User("John", "secret", "john@example.com");
user.name;       // OK
// user.password;  // Error! Private
// user.email;     // Error! Protected
```

### 3. Parameter Properties

```typescript
// Shorthand for declaring and initializing properties
class User {
  constructor(
    public name: string,
    private age: number,
    readonly id: string
  ) {}
}

// Equivalent to:
class User2 {
  public name: string;
  private age: number;
  readonly id: string;
  
  constructor(name: string, age: number, id: string) {
    this.name = name;
    this.age = age;
    this.id = id;
  }
}
```

### 4. Getters and Setters

```typescript
class Circle {
  private _radius: number;
  
  constructor(radius: number) {
    this._radius = radius;
  }
  
  get radius(): number {
    return this._radius;
  }
  
  set radius(value: number) {
    if (value < 0) {
      throw new Error("Radius must be positive");
    }
    this._radius = value;
  }
  
  get area(): number {
    return Math.PI * this._radius ** 2;
  }
}

const circle = new Circle(5);
circle.radius;      // 5 (getter)
circle.radius = 10; // (setter)
circle.area;        // 314.159... (computed)
```

### 5. Static Members

```typescript
class MathUtils {
  static PI = 3.14159;
  
  static add(a: number, b: number): number {
    return a + b;
  }
  
  static multiply(a: number, b: number): number {
    return a * b;
  }
}

MathUtils.PI;           // 3.14159
MathUtils.add(2, 3);    // 5

// Static blocks (ES2022)
class Config {
  static settings: Map<string, string>;
  
  static {
    this.settings = new Map();
    this.settings.set("env", "production");
  }
}
```

### 6. Inheritance

```typescript
class Animal {
  constructor(public name: string) {}
  
  speak(): void {
    console.log(`${this.name} makes a sound`);
  }
}

class Dog extends Animal {
  constructor(name: string, public breed: string) {
    super(name);  // Call parent constructor
  }
  
  speak(): void {
    console.log(`${this.name} barks`);
  }
  
  fetch(): void {
    console.log(`${this.name} fetches`);
  }
}

const dog = new Dog("Rex", "German Shepherd");
dog.speak();  // "Rex barks"
```

### 7. Abstract Classes

```typescript
abstract class Shape {
  abstract area(): number;
  abstract perimeter(): number;
  
  describe(): string {
    return `Area: ${this.area()}, Perimeter: ${this.perimeter()}`;
  }
}

class Rectangle extends Shape {
  constructor(private width: number, private height: number) {
    super();
  }
  
  area(): number {
    return this.width * this.height;
  }
  
  perimeter(): number {
    return 2 * (this.width + this.height);
  }
}

// const shape = new Shape();  // Error! Cannot instantiate abstract
const rect = new Rectangle(4, 5);
rect.describe();  // "Area: 20, Perimeter: 18"
```

### 8. Implementing Interfaces

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
```

### 9. Generic Classes

```typescript
class Container<T> {
  private items: T[] = [];
  
  add(item: T): void {
    this.items.push(item);
  }
  
  get(index: number): T {
    return this.items[index];
  }
  
  getAll(): T[] {
    return [...this.items];
  }
}

const numbers = new Container<number>();
numbers.add(1);
numbers.add(2);

const strings = new Container<string>();
strings.add("hello");
```

---

## 💻 Practice Exercises

1. Create classes with access modifiers
2. Use parameter properties
3. Implement getters and setters
4. Create class hierarchies
5. Build generic classes

---

## ✅ Best Practices

- ✅ Use access modifiers appropriately
- ✅ Use parameter properties for brevity
- ✅ Use abstract classes for base types
- ✅ Implement interfaces for contracts
- ❌ Avoid public fields for mutable state
- ❌ Don't overuse inheritance

---

## 📝 Quick Reference

```typescript
// Class with modifiers
class MyClass {
  constructor(
    public name: string,
    private secret: string,
    readonly id: string
  ) {}
}

// Inheritance
class Child extends Parent {
  constructor() { super(); }
}

// Abstract
abstract class Base {
  abstract method(): void;
}

// Implements
class Impl implements Interface { }
```

