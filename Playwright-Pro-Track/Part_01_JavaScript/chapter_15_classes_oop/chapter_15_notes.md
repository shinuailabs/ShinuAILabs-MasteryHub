# Part 15: Classes and OOP

## 📚 Overview
Object-Oriented Programming (OOP) in JavaScript uses classes and prototypes to create reusable code structures.

---

## 🎯 Key Concepts

### 1. Class Basics

```javascript
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
  
  greet() {
    return `Hello, I'm ${this.name}`;
  }
  
  getAge() {
    return this.age;
  }
}

const person = new Person("John", 30);
person.greet();  // "Hello, I'm John"
```

### 2. Inheritance

```javascript
class Animal {
  constructor(name) {
    this.name = name;
  }
  
  speak() {
    console.log(`${this.name} makes a sound`);
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name);  // Call parent constructor
    this.breed = breed;
  }
  
  speak() {
    console.log(`${this.name} barks`);
  }
  
  fetch() {
    console.log(`${this.name} fetches the ball`);
  }
}

const dog = new Dog("Rex", "German Shepherd");
dog.speak();  // "Rex barks"
dog.fetch();  // "Rex fetches the ball"
```

### 3. Static Members

```javascript
class MathUtils {
  static PI = 3.14159;
  
  static add(a, b) {
    return a + b;
  }
  
  static multiply(a, b) {
    return a * b;
  }
}

// Access without instantiation
MathUtils.PI;           // 3.14159
MathUtils.add(2, 3);    // 5
```

### 4. Getters and Setters

```javascript
class Circle {
  constructor(radius) {
    this._radius = radius;
  }
  
  get radius() {
    return this._radius;
  }
  
  set radius(value) {
    if (value < 0) throw new Error("Radius must be positive");
    this._radius = value;
  }
  
  get area() {
    return Math.PI * this._radius ** 2;
  }
  
  get circumference() {
    return 2 * Math.PI * this._radius;
  }
}

const circle = new Circle(5);
circle.radius;        // 5
circle.area;          // 78.54...
circle.radius = 10;   // Sets new radius
```

### 5. Private Fields (ES2022)

```javascript
class BankAccount {
  #balance = 0;  // Private field
  
  constructor(initialBalance) {
    this.#balance = initialBalance;
  }
  
  deposit(amount) {
    if (amount > 0) {
      this.#balance += amount;
    }
  }
  
  withdraw(amount) {
    if (amount > 0 && amount <= this.#balance) {
      this.#balance -= amount;
      return amount;
    }
    throw new Error("Insufficient funds");
  }
  
  get balance() {
    return this.#balance;
  }
}

const account = new BankAccount(100);
account.deposit(50);
account.balance;      // 150
// account.#balance;  // SyntaxError - private!
```

### 6. Encapsulation

```javascript
class User {
  #password;
  
  constructor(username, password) {
    this.username = username;
    this.#password = this.#hashPassword(password);
  }
  
  #hashPassword(password) {
    // Simple hash (use proper hashing in production)
    return btoa(password);
  }
  
  validatePassword(password) {
    return this.#password === this.#hashPassword(password);
  }
  
  changePassword(oldPassword, newPassword) {
    if (this.validatePassword(oldPassword)) {
      this.#password = this.#hashPassword(newPassword);
      return true;
    }
    return false;
  }
}
```

### 7. Polymorphism

```javascript
class Shape {
  area() {
    throw new Error("Method must be implemented");
  }
}

class Rectangle extends Shape {
  constructor(width, height) {
    super();
    this.width = width;
    this.height = height;
  }
  
  area() {
    return this.width * this.height;
  }
}

class Circle extends Shape {
  constructor(radius) {
    super();
    this.radius = radius;
  }
  
  area() {
    return Math.PI * this.radius ** 2;
  }
}

// Polymorphic behavior
const shapes = [new Rectangle(4, 5), new Circle(3)];
shapes.forEach(shape => console.log(shape.area()));
```

### 8. Composition over Inheritance

```javascript
// Mixins
const canFly = {
  fly() {
    console.log(`${this.name} is flying`);
  }
};

const canSwim = {
  swim() {
    console.log(`${this.name} is swimming`);
  }
};

class Duck {
  constructor(name) {
    this.name = name;
  }
}

// Apply mixins
Object.assign(Duck.prototype, canFly, canSwim);

const duck = new Duck("Donald");
duck.fly();   // "Donald is flying"
duck.swim();  // "Donald is swimming"

// Factory function approach
function createDuck(name) {
  return {
    name,
    ...canFly,
    ...canSwim,
    quack() {
      console.log(`${this.name} quacks`);
    }
  };
}
```

### 9. instanceof and typeof

```javascript
class Animal {}
class Dog extends Animal {}

const dog = new Dog();

dog instanceof Dog;     // true
dog instanceof Animal;  // true
dog instanceof Object;  // true

typeof dog;             // "object"
dog.constructor.name;   // "Dog"

// Check class
Object.getPrototypeOf(dog) === Dog.prototype;  // true
```

---

## 💻 Practice Exercises

1. Create class hierarchy for vehicles
2. Implement encapsulation with private fields
3. Use getters/setters for validation
4. Apply composition with mixins
5. Build a simple game with OOP

---

## ✅ Best Practices

- ✅ Use private fields for encapsulation
- ✅ Prefer composition over inheritance
- ✅ Keep classes focused (single responsibility)
- ✅ Use getters/setters for computed properties
- ❌ Avoid deep inheritance hierarchies
- ❌ Don't expose internal state

---

## 📝 Quick Reference

```javascript
// Class
class MyClass {
  #privateField;
  static staticMethod() {}
  constructor() {}
  method() {}
  get prop() {}
  set prop(v) {}
}

// Inheritance
class Child extends Parent {
  constructor() {
    super();
  }
}

// Static
MyClass.staticMethod()

// Private
this.#privateField

// instanceof
obj instanceof MyClass
```

