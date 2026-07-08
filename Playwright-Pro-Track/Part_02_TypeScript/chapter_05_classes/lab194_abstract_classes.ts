/**
 * Lab 194: Abstract Classes
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Abstract classes in TypeScript:
 * 
 * - abstract keyword
 * - Abstract methods
 * - Abstract properties
 * - Partial implementation
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create abstract classes
 * 2. Implement abstract members
 * 3. Use template method pattern
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Basic Abstract Class
console.log("--- Basic Abstract Class ---");

abstract class Animal {
    constructor(public name: string) {}
    
    // Abstract method - must be implemented
    abstract makeSound(): void;
    
    // Concrete method - shared implementation
    move(distance: number): void {
        console.log(`${this.name} moved ${distance} meters`);
    }
}

class Dog extends Animal {
    makeSound(): void {
        console.log(`${this.name} barks: Woof!`);
    }
}

class Cat extends Animal {
    makeSound(): void {
        console.log(`${this.name} meows: Meow!`);
    }
}

const dog = new Dog("Rex");
const cat = new Cat("Whiskers");
dog.makeSound();
cat.makeSound();

// Solution 2: Abstract Properties
console.log("\n--- Abstract Properties ---");

abstract class Vehicle {
    abstract readonly wheels: number;
    abstract maxSpeed: number;
    
    describe(): string {
        return `Vehicle with ${this.wheels} wheels, max speed: ${this.maxSpeed}`;
    }
}

class Car extends Vehicle {
    readonly wheels = 4;
    maxSpeed = 200;
}

class Motorcycle extends Vehicle {
    readonly wheels = 2;
    maxSpeed = 180;
}

const car = new Car();
const motorcycle = new Motorcycle();
console.log(car.describe());
console.log(motorcycle.describe());

// Solution 3: Template Method Pattern
console.log("\n--- Template Method Pattern ---");

abstract class DataProcessor {
    // Template method
    process(): void {
        this.readData();
        this.processData();
        this.saveData();
    }
    
    // Abstract methods to be implemented
    abstract readData(): void;
    abstract processData(): void;
    abstract saveData(): void;
}

class CSVProcessor extends DataProcessor {
    readData(): void {
        console.log("Reading CSV file...");
    }
    
    processData(): void {
        console.log("Processing CSV data...");
    }
    
    saveData(): void {
        console.log("Saving processed CSV...");
    }
}

class JSONProcessor extends DataProcessor {
    readData(): void {
        console.log("Reading JSON file...");
    }
    
    processData(): void {
        console.log("Processing JSON data...");
    }
    
    saveData(): void {
        console.log("Saving processed JSON...");
    }
}

const csvProcessor = new CSVProcessor();
csvProcessor.process();

// Solution 4: Abstract with Constructor
console.log("\n--- Abstract Constructor ---");

abstract class Entity {
    readonly id: number;
    readonly createdAt: Date;
    
    constructor() {
        this.id = Date.now();
        this.createdAt = new Date();
    }
    
    abstract validate(): boolean;
}

class User extends Entity {
    constructor(public name: string, public email: string) {
        super();
    }
    
    validate(): boolean {
        return this.name.length > 0 && this.email.includes("@");
    }
}

const user = new User("John", "john@example.com");
console.log("User valid:", user.validate());
console.log("User ID:", user.id);

// Solution 5: Multiple Abstract Methods
console.log("\n--- Multiple Abstract Methods ---");

abstract class Shape {
    abstract getArea(): number;
    abstract getPerimeter(): number;
    abstract draw(): void;
    
    describe(): void {
        console.log(`Area: ${this.getArea().toFixed(2)}`);
        console.log(`Perimeter: ${this.getPerimeter().toFixed(2)}`);
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
    
    draw(): void {
        console.log(`Drawing rectangle ${this.width}x${this.height}`);
    }
}

const rect = new Rectangle(10, 5);
rect.describe();
rect.draw();

// Solution 6: Abstract Class Hierarchy
console.log("\n--- Abstract Hierarchy ---");

abstract class Component {
    abstract render(): string;
}

abstract class Container extends Component {
    protected children: Component[] = [];
    
    add(child: Component): void {
        this.children.push(child);
    }
    
    abstract render(): string;
}

class Button extends Component {
    constructor(private label: string) {
        super();
    }
    
    render(): string {
        return `<button>${this.label}</button>`;
    }
}

class Panel extends Container {
    render(): string {
        const childrenHtml = this.children.map(c => c.render()).join("");
        return `<div class="panel">${childrenHtml}</div>`;
    }
}

const panel = new Panel();
panel.add(new Button("Click me"));
panel.add(new Button("Cancel"));
console.log(panel.render());

// Solution 7: Abstract with Generics
console.log("\n--- Abstract Generics ---");

abstract class Repository<T> {
    protected items: T[] = [];
    
    abstract getId(item: T): number;
    
    findById(id: number): T | undefined {
        return this.items.find(item => this.getId(item) === id);
    }
    
    save(item: T): void {
        this.items.push(item);
    }
    
    findAll(): T[] {
        return [...this.items];
    }
}

interface Product {
    id: number;
    name: string;
}

class ProductRepository extends Repository<Product> {
    getId(product: Product): number {
        return product.id;
    }
}

const repo = new ProductRepository();
repo.save({ id: 1, name: "Widget" });
console.log("Products:", repo.findAll());

// Solution 8: Abstract vs Interface
console.log("\n--- Abstract vs Interface ---");

// Interface - contract only
interface Printable {
    print(): void;
}

// Abstract class - contract + implementation
abstract class Document implements Printable {
    constructor(public title: string) {}
    
    abstract getContent(): string;
    
    print(): void {
        console.log(`Title: ${this.title}`);
        console.log(`Content: ${this.getContent()}`);
    }
}

class Report extends Document {
    constructor(title: string, private data: string) {
        super(title);
    }
    
    getContent(): string {
        return this.data;
    }
}

const report = new Report("Sales Report", "Q1 sales data...");
report.print();

// Solution 9: Practical Example
console.log("\n--- Practical Example ---");

abstract class HttpHandler {
    abstract handle(request: { method: string; path: string }): { status: number; body: string };
    
    protected notFound(): { status: number; body: string } {
        return { status: 404, body: "Not Found" };
    }
    
    protected ok(body: string): { status: number; body: string } {
        return { status: 200, body };
    }
}

class UserHandler extends HttpHandler {
    handle(request: { method: string; path: string }): { status: number; body: string } {
        if (request.method === "GET" && request.path === "/users") {
            return this.ok(JSON.stringify([{ id: 1, name: "John" }]));
        }
        return this.notFound();
    }
}

const handler = new UserHandler();
console.log(handler.handle({ method: "GET", path: "/users" }));

