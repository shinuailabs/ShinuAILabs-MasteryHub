/**
 * Lab 141: Class Basics
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * ES6 class syntax:
 * 
 * - Class declaration
 * - Constructor method
 * - Instance methods
 * - Creating instances
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create a class
 * 2. Add constructor and methods
 * 3. Create instances
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Basic Class
console.log("--- Basic Class ---");

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

const john = new Person("John", 30);
console.log("Person:", john);
console.log("Greet:", john.greet());
console.log("Age:", john.getAge());

// Solution 2: Class Expression
console.log("\n--- Class Expression ---");

const Animal = class {
    constructor(name) {
        this.name = name;
    }
    
    speak() {
        return `${this.name} makes a sound`;
    }
};

const dog = new Animal("Dog");
console.log(dog.speak());

// Solution 3: Multiple Methods
console.log("\n--- Multiple Methods ---");

class Calculator {
    constructor(initialValue = 0) {
        this.value = initialValue;
    }
    
    add(n) {
        this.value += n;
        return this;
    }
    
    subtract(n) {
        this.value -= n;
        return this;
    }
    
    multiply(n) {
        this.value *= n;
        return this;
    }
    
    divide(n) {
        if (n !== 0) {
            this.value /= n;
        }
        return this;
    }
    
    getResult() {
        return this.value;
    }
    
    reset() {
        this.value = 0;
        return this;
    }
}

const calc = new Calculator(10);
const result = calc.add(5).multiply(2).subtract(10).getResult();
console.log("Calculator result:", result);

// Solution 4: Class vs Function Constructor
console.log("\n--- Class vs Function ---");

// Function constructor (old way)
function PersonFunc(name) {
    this.name = name;
}
PersonFunc.prototype.greet = function() {
    return `Hello, I'm ${this.name}`;
};

// Class (modern way)
class PersonClass {
    constructor(name) {
        this.name = name;
    }
    greet() {
        return `Hello, I'm ${this.name}`;
    }
}

const p1 = new PersonFunc("John");
const p2 = new PersonClass("Jane");
console.log("Function:", p1.greet());
console.log("Class:", p2.greet());

// Solution 5: Instance Properties
console.log("\n--- Instance Properties ---");

class User {
    // Class field (modern syntax)
    role = "user";
    
    constructor(name, email) {
        this.name = name;
        this.email = email;
        this.createdAt = new Date();
    }
    
    getInfo() {
        return `${this.name} (${this.email}) - ${this.role}`;
    }
}

const user = new User("John", "john@example.com");
console.log("User info:", user.getInfo());
console.log("Created at:", user.createdAt);

// Solution 6: Method Chaining
console.log("\n--- Method Chaining ---");

class StringBuilder {
    constructor() {
        this.parts = [];
    }
    
    append(str) {
        this.parts.push(str);
        return this;
    }
    
    prepend(str) {
        this.parts.unshift(str);
        return this;
    }
    
    toString() {
        return this.parts.join("");
    }
}

const builder = new StringBuilder();
const str = builder
    .append("Hello")
    .append(" ")
    .append("World")
    .prepend(">>> ")
    .toString();

console.log("Built string:", str);

// Solution 7: Checking Instance Type
console.log("\n--- Instance Type ---");

console.log("john instanceof Person:", john instanceof Person);
console.log("john instanceof Object:", john instanceof Object);
console.log("john.constructor.name:", john.constructor.name);

// Solution 8: Class Properties
console.log("\n--- Class Properties ---");

class Counter {
    count = 0;
    
    increment() {
        this.count++;
        return this;
    }
    
    decrement() {
        this.count--;
        return this;
    }
    
    getCount() {
        return this.count;
    }
}

const counter = new Counter();
counter.increment().increment().increment();
console.log("Count:", counter.getCount());

// Solution 9: toString Method
console.log("\n--- toString Method ---");

class Product {
    constructor(name, price) {
        this.name = name;
        this.price = price;
    }
    
    toString() {
        return `${this.name}: $${this.price.toFixed(2)}`;
    }
}

const product = new Product("Widget", 9.99);
console.log("Product:", product.toString());
console.log("Implicit:", `${product}`);

// Solution 10: Practical Example
console.log("\n--- Practical Example ---");

class Task {
    constructor(title, description = "") {
        this.id = Date.now();
        this.title = title;
        this.description = description;
        this.completed = false;
        this.createdAt = new Date();
    }
    
    complete() {
        this.completed = true;
        this.completedAt = new Date();
        return this;
    }
    
    isOverdue(dueDate) {
        return !this.completed && new Date() > dueDate;
    }
    
    toString() {
        const status = this.completed ? "✓" : "○";
        return `[${status}] ${this.title}`;
    }
}

const task = new Task("Learn JavaScript", "Complete all labs");
console.log("Task:", task.toString());
task.complete();
console.log("Completed:", task.toString());

