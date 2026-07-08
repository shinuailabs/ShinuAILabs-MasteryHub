/**
 * Lab 142: Class Inheritance
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Extending classes with inheritance:
 * 
 * - extends keyword
 * - super() constructor call
 * - Method overriding
 * - Calling parent methods
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create parent and child classes
 * 2. Override methods
 * 3. Use super keyword
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Basic Inheritance
console.log("--- Basic Inheritance ---");

class Animal {
    constructor(name) {
        this.name = name;
    }
    
    speak() {
        return `${this.name} makes a sound`;
    }
    
    move() {
        return `${this.name} moves`;
    }
}

class Dog extends Animal {
    constructor(name, breed) {
        super(name); // Call parent constructor
        this.breed = breed;
    }
    
    speak() {
        return `${this.name} barks`;
    }
}

const dog = new Dog("Rex", "German Shepherd");
console.log("Dog:", dog.name, dog.breed);
console.log("Speak:", dog.speak());
console.log("Move:", dog.move()); // Inherited

// Solution 2: super Keyword
console.log("\n--- super Keyword ---");

class Cat extends Animal {
    constructor(name, color) {
        super(name);
        this.color = color;
    }
    
    speak() {
        const parentSpeak = super.speak();
        return `${parentSpeak}... actually, ${this.name} meows`;
    }
}

const cat = new Cat("Whiskers", "orange");
console.log("Cat speak:", cat.speak());

// Solution 3: Multi-level Inheritance
console.log("\n--- Multi-level Inheritance ---");

class Vehicle {
    constructor(brand) {
        this.brand = brand;
    }
    
    start() {
        return `${this.brand} starting...`;
    }
}

class Car extends Vehicle {
    constructor(brand, model) {
        super(brand);
        this.model = model;
    }
    
    drive() {
        return `${this.brand} ${this.model} is driving`;
    }
}

class ElectricCar extends Car {
    constructor(brand, model, batteryCapacity) {
        super(brand, model);
        this.batteryCapacity = batteryCapacity;
    }
    
    charge() {
        return `Charging ${this.batteryCapacity}kWh battery`;
    }
    
    start() {
        return `${super.start()} silently`;
    }
}

const tesla = new ElectricCar("Tesla", "Model 3", 75);
console.log("Start:", tesla.start());
console.log("Drive:", tesla.drive());
console.log("Charge:", tesla.charge());

// Solution 4: instanceof with Inheritance
console.log("\n--- instanceof ---");

console.log("tesla instanceof ElectricCar:", tesla instanceof ElectricCar);
console.log("tesla instanceof Car:", tesla instanceof Car);
console.log("tesla instanceof Vehicle:", tesla instanceof Vehicle);
console.log("tesla instanceof Object:", tesla instanceof Object);

// Solution 5: Method Overriding
console.log("\n--- Method Overriding ---");

class Shape {
    constructor(color) {
        this.color = color;
    }
    
    getArea() {
        return 0;
    }
    
    describe() {
        return `A ${this.color} shape with area ${this.getArea()}`;
    }
}

class Rectangle extends Shape {
    constructor(color, width, height) {
        super(color);
        this.width = width;
        this.height = height;
    }
    
    getArea() {
        return this.width * this.height;
    }
}

class Circle extends Shape {
    constructor(color, radius) {
        super(color);
        this.radius = radius;
    }
    
    getArea() {
        return Math.PI * this.radius ** 2;
    }
}

const rect = new Rectangle("blue", 10, 5);
const circle = new Circle("red", 7);

console.log("Rectangle:", rect.describe());
console.log("Circle:", circle.describe());

// Solution 6: Protected Convention
console.log("\n--- Protected Convention ---");

class BankAccount {
    constructor(owner, balance) {
        this.owner = owner;
        this._balance = balance; // Convention: protected
    }
    
    _validateAmount(amount) {
        if (amount <= 0) {
            throw new Error("Amount must be positive");
        }
    }
    
    getBalance() {
        return this._balance;
    }
}

class SavingsAccount extends BankAccount {
    constructor(owner, balance, interestRate) {
        super(owner, balance);
        this.interestRate = interestRate;
    }
    
    addInterest() {
        const interest = this._balance * this.interestRate;
        this._balance += interest;
        return interest;
    }
    
    deposit(amount) {
        this._validateAmount(amount);
        this._balance += amount;
    }
}

const savings = new SavingsAccount("John", 1000, 0.05);
savings.deposit(500);
console.log("Balance:", savings.getBalance());
console.log("Interest added:", savings.addInterest());
console.log("New balance:", savings.getBalance());

// Solution 7: Abstract Class Pattern
console.log("\n--- Abstract Class Pattern ---");

class AbstractLogger {
    constructor() {
        if (new.target === AbstractLogger) {
            throw new Error("Cannot instantiate abstract class");
        }
    }
    
    log(message) {
        throw new Error("Method 'log' must be implemented");
    }
    
    info(message) {
        this.log(`[INFO] ${message}`);
    }
    
    error(message) {
        this.log(`[ERROR] ${message}`);
    }
}

class ConsoleLogger extends AbstractLogger {
    log(message) {
        console.log(message);
    }
}

const logger = new ConsoleLogger();
logger.info("Application started");
logger.error("Something went wrong");

// Solution 8: Composition over Inheritance
console.log("\n--- Composition ---");

// Instead of deep inheritance, use composition
const canFly = {
    fly() {
        return `${this.name} is flying`;
    }
};

const canSwim = {
    swim() {
        return `${this.name} is swimming`;
    }
};

class Duck extends Animal {
    constructor(name) {
        super(name);
        Object.assign(this, canFly, canSwim);
    }
}

const duck = new Duck("Donald");
console.log(duck.fly());
console.log(duck.swim());
console.log(duck.speak());

