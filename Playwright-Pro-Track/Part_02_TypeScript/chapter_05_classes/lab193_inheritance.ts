/**
 * Lab 193: Class Inheritance
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * TypeScript inheritance:
 * 
 * - extends keyword
 * - super calls
 * - Method overriding
 * - Constructor inheritance
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create class hierarchies
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
    constructor(public name: string) {}
    
    speak(): void {
        console.log(`${this.name} makes a sound`);
    }
    
    move(distance: number): void {
        console.log(`${this.name} moved ${distance} meters`);
    }
}

class Dog extends Animal {
    constructor(name: string, public breed: string) {
        super(name);
    }
    
    speak(): void {
        console.log(`${this.name} barks`);
    }
}

const dog = new Dog("Rex", "German Shepherd");
dog.speak();
dog.move(10);

// Solution 2: Calling Super Methods
console.log("\n--- Super Methods ---");

class Vehicle {
    constructor(public brand: string) {}
    
    start(): void {
        console.log(`${this.brand} is starting...`);
    }
    
    describe(): string {
        return `Vehicle: ${this.brand}`;
    }
}

class Car extends Vehicle {
    constructor(brand: string, public model: string) {
        super(brand);
    }
    
    start(): void {
        super.start();  // Call parent method
        console.log("Engine running!");
    }
    
    describe(): string {
        return `${super.describe()}, Model: ${this.model}`;
    }
}

const car = new Car("Toyota", "Camry");
car.start();
console.log(car.describe());

// Solution 3: Multi-level Inheritance
console.log("\n--- Multi-level Inheritance ---");

class LivingThing {
    isAlive: boolean = true;
    
    breathe(): void {
        console.log("Breathing...");
    }
}

class Mammal extends LivingThing {
    warmBlooded: boolean = true;
    
    nurse(): void {
        console.log("Nursing young...");
    }
}

class Human extends Mammal {
    constructor(public name: string) {
        super();
    }
    
    speak(): void {
        console.log(`${this.name} is speaking`);
    }
}

const human = new Human("John");
human.breathe();
human.nurse();
human.speak();

// Solution 4: Protected Members in Inheritance
console.log("\n--- Protected Members ---");

class Person {
    protected ssn: string;
    
    constructor(public name: string, ssn: string) {
        this.ssn = ssn;
    }
    
    protected getSSN(): string {
        return this.ssn;
    }
}

class Employee extends Person {
    constructor(name: string, ssn: string, public employeeId: string) {
        super(name, ssn);
    }
    
    getEmployeeInfo(): string {
        // Can access protected members
        return `${this.name} (${this.employeeId}) - SSN: ${this.getSSN()}`;
    }
}

const employee = new Employee("John", "123-45-6789", "EMP001");
console.log(employee.getEmployeeInfo());

// Solution 5: Abstract Classes
console.log("\n--- Abstract Classes ---");

abstract class Shape {
    abstract getArea(): number;
    abstract getPerimeter(): number;
    
    describe(): string {
        return `Area: ${this.getArea()}, Perimeter: ${this.getPerimeter()}`;
    }
}

class Rectangle extends Shape {
    constructor(public width: number, public height: number) {
        super();
    }
    
    getArea(): number {
        return this.width * this.height;
    }
    
    getPerimeter(): number {
        return 2 * (this.width + this.height);
    }
}

class Circle extends Shape {
    constructor(public radius: number) {
        super();
    }
    
    getArea(): number {
        return Math.PI * this.radius ** 2;
    }
    
    getPerimeter(): number {
        return 2 * Math.PI * this.radius;
    }
}

const rect = new Rectangle(10, 5);
const circle = new Circle(7);
console.log("Rectangle:", rect.describe());
console.log("Circle:", circle.describe());

// Solution 6: Method Overriding with Types
console.log("\n--- Method Overriding ---");

class BaseLogger {
    log(message: string): void {
        console.log(`[LOG] ${message}`);
    }
}

class TimestampLogger extends BaseLogger {
    log(message: string): void {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] ${message}`);
    }
}

class PrefixLogger extends BaseLogger {
    constructor(private prefix: string) {
        super();
    }
    
    log(message: string): void {
        console.log(`[${this.prefix}] ${message}`);
    }
}

const logger1 = new TimestampLogger();
const logger2 = new PrefixLogger("APP");
logger1.log("Hello");
logger2.log("World");

// Solution 7: Constructor Overloading Pattern
console.log("\n--- Constructor Pattern ---");

class Point {
    x: number;
    y: number;
    
    constructor(x: number, y: number);
    constructor(coords: { x: number; y: number });
    constructor(xOrCoords: number | { x: number; y: number }, y?: number) {
        if (typeof xOrCoords === "number") {
            this.x = xOrCoords;
            this.y = y!;
        } else {
            this.x = xOrCoords.x;
            this.y = xOrCoords.y;
        }
    }
}

const p1 = new Point(10, 20);
const p2 = new Point({ x: 30, y: 40 });
console.log("P1:", p1.x, p1.y);
console.log("P2:", p2.x, p2.y);

// Solution 8: Polymorphism
console.log("\n--- Polymorphism ---");

class Notification {
    send(message: string): void {
        console.log(`Sending: ${message}`);
    }
}

class EmailNotification extends Notification {
    send(message: string): void {
        console.log(`Email: ${message}`);
    }
}

class SMSNotification extends Notification {
    send(message: string): void {
        console.log(`SMS: ${message}`);
    }
}

function notify(notifier: Notification, message: string): void {
    notifier.send(message);
}

notify(new EmailNotification(), "Hello via email");
notify(new SMSNotification(), "Hello via SMS");

// Solution 9: Practical Example
console.log("\n--- Practical Example ---");

abstract class Repository<T> {
    protected items: T[] = [];
    
    abstract getId(item: T): number;
    
    findAll(): T[] {
        return [...this.items];
    }
    
    findById(id: number): T | undefined {
        return this.items.find(item => this.getId(item) === id);
    }
    
    save(item: T): void {
        this.items.push(item);
    }
}

interface User {
    id: number;
    name: string;
}

class UserRepository extends Repository<User> {
    getId(user: User): number {
        return user.id;
    }
}

const userRepo = new UserRepository();
userRepo.save({ id: 1, name: "John" });
userRepo.save({ id: 2, name: "Jane" });
console.log("Users:", userRepo.findAll());
console.log("User 1:", userRepo.findById(1));

